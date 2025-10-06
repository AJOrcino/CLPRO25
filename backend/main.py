from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, validator
from typing import Optional
import enum
from datetime import datetime, timedelta

from database import engine, SessionLocal, get_db
from models import Base, User, Class, UserRole, ClassCreate, ClassResponse, Assignment, AssignmentCreate, AssignmentResponse
from schemas import ClassExport, SubmissionCreate, Submission
from security import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, verify_password, get_password_hash, create_access_token, verify_token
from crud import create_class, get_class, get_classes, update_class, delete_class, count_total_users, count_total_classes, get_all_users, get_all_classes, create_assignment, create_submission


# Security scheme
security = HTTPBearer()

# Pydantic models for request/response
class UserRoleEnum(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

class UserCreate(BaseModel):
    username: str
    password: str
    role: UserRoleEnum
    
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[UserRoleEnum] = None
    
    @validator('username')
    def validate_username(cls, v):
        if v is not None and len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if v is not None and len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    
    class Config:
        from_attributes = True



class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Database lifespan function
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Create test users after tables are created
    db = SessionLocal()
    try:
        # Check if test admin user already exists
        admin_user = get_user_by_username(db, "admin@classtrack.edu")
        if not admin_user:
            # Create test admin user with properly hashed password
            plain_password = "password123"
            admin_hashed_password = get_password_hash(plain_password)
            
            admin_user = User(
                username="admin@classtrack.edu",
                hashed_password=admin_hashed_password,
                role=UserRole.ADMIN
            )
            db.add(admin_user)
            print(f"✅ Test Admin user created: admin@classtrack.edu / {plain_password}")
            print(f"   Hashed password length: {len(admin_hashed_password)} characters")
        
        # Check if test student user already exists
        student_user = get_user_by_username(db, "student@classtrack.edu")
        if not student_user:
            # Create test student user with properly hashed password
            plain_password = "password123"
            student_hashed_password = get_password_hash(plain_password)
            
            student_user = User(
                username="student@classtrack.edu",
                hashed_password=student_hashed_password,
                role=UserRole.STUDENT
            )
            db.add(student_user)
            print(f"✅ Test Student user created: student@classtrack.edu / {plain_password}")
            print(f"   Hashed password length: {len(student_hashed_password)} characters")
        
        # Commit all changes
        db.commit()
        print("✅ All test users committed to database successfully")
        
    except Exception as e:
        print(f"❌ Error creating test users: {e}")
        print(f"   Error type: {type(e).__name__}")
        db.rollback()
    finally:
        db.close()
    
    yield
    # Shutdown: Clean up if needed
    pass

# Initialize FastAPI app
app = FastAPI(
    title="ClassTrack API",
    description="A FastAPI backend for class management system",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,  # Allows credentials
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Helper functions

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username"""
    return db.query(User).filter(User.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """
    Authenticate a user by checking username and password.
    
    Args:
        db: Database session
        username: Username to authenticate
        password: Plain text password to verify
        
    Returns:
        User object if authentication successful, None otherwise
    """
    # Get user by username
    user = get_user_by_username(db, username)
    if not user:
        return None
    
    # Verify password using the stored hash
    if not verify_password(password, user.hashed_password):
        return None
    
    return user


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> User:
    """Get the current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    username = verify_token(credentials.credentials)
    if username is None:
        raise credentials_exception
    
    user = get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to ClassTrack API"}

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate user and return access token.
    
    This endpoint handles user authentication and returns a JWT access token
    if the provided credentials are valid.
    
    Args:
        form_data: OAuth2PasswordRequestForm containing username and password
        db: Database session
        
    Returns:
        Token object containing access_token and token_type
        
    Raises:
        HTTPException: 400 status with "Incorrect username or password" if authentication fails
    """
    # Authenticate the user
    user = authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user
    
    - **username**: Unique username (min 3 characters)
    - **password**: Password (min 6 characters)
    - **role**: User role ('admin', 'teacher', or 'student')
    """
    # Check if user already exists
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Create new user
    db_user = User(
        username=user.username,
        hashed_password=hashed_password,
        role=UserRole(user.role.value)
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )

@app.patch("/users/{user_id}", response_model=UserResponse)
async def update_user_by_admin(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing user (Admin only)
    
    - **user_id**: ID of the user to update
    - **username**: New username (optional)
    - **password**: New password (optional)
    - **role**: New role (optional)
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update users"
        )
    
    # Find the existing user
    db_user = get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if username is being updated and if it already exists
    if user_in.username and user_in.username != db_user.username:
        existing_user = get_user_by_username(db, username=user_in.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
    
    # Update user fields
    update_data = user_in.dict(exclude_unset=True)
    
    if "username" in update_data:
        db_user.username = update_data["username"]
    
    if "role" in update_data:
        db_user.role = UserRole(update_data["role"].value)
    
    if "password" in update_data:
        # Hash the new password
        db_user.hashed_password = get_password_hash(update_data["password"])
    
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )

@app.delete("/users/{user_id}")
async def delete_user_by_admin(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete an existing user (Admin only)
    
    - **user_id**: ID of the user to delete
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete users"
        )
    
    # Find the existing user
    db_user = get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    try:
        # Delete the user
        db.delete(db_user)
        db.commit()
        
        return {"message": "User deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete user: {str(e)}"
        )

# Classes CRUD endpoints (Admin only)

@app.get("/classes/", response_model=list[ClassResponse])
async def get_classes_endpoint(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Get all classes (Admin only)
    
    - **skip**: Number of classes to skip (for pagination)
    - **limit**: Maximum number of classes to return
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view classes"
        )
    
    try:
        classes = get_classes(db, skip=skip, limit=limit)
        return classes
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch classes: {str(e)}"
        )

@app.post("/classes/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
async def create_new_class(
    class_data: ClassCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new class (Admin only)
    
    - **name**: Class name
    - **code**: Unique class code
    - **teacher_id**: Optional teacher ID to assign to the class
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create classes"
        )
    
    try:
        new_class = create_class(db, class_in=class_data)
        return new_class
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create class: {str(e)}"
        )

@app.patch("/classes/{class_id}", response_model=ClassResponse)
async def update_existing_class(
    class_id: int,
    class_data: ClassCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing class (Admin only)
    
    - **class_id**: ID of the class to update
    - **name**: Updated class name
    - **code**: Updated class code
    - **teacher_id**: Updated teacher ID assignment
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update classes"
        )
    
    try:
        updated_class = update_class(db, class_id=class_id, class_in=class_data)
        if not updated_class:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Class not found"
            )
        return updated_class
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update class: {str(e)}"
        )

@app.delete("/classes/{class_id}")
async def delete_existing_class(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a class (Admin only)
    
    - **class_id**: ID of the class to delete
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete classes"
        )
    
    try:
        success = delete_class(db, class_id=class_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Class not found"
            )
        return {"message": "Class deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete class: {str(e)}"
        )

# Assignment endpoints (Teacher and Admin only)

@app.post("/assignments/", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
async def create_new_assignment(
    assignment_data: AssignmentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new assignment (Teacher and Admin only)
    
    - **name**: Assignment name
    - **description**: Assignment description (optional)
    - **class_id**: ID of the class this assignment belongs to
    
    Requires authentication and TEACHER or ADMIN role.
    """
    # Check if current user is a teacher or admin
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create assignments"
        )
    
    try:
        new_assignment = create_assignment(db, assignment_in=assignment_data, creator_id=current_user.id)
        return new_assignment
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create assignment: {str(e)}"
        )

# Submission endpoints (Student only)

@app.post("/submissions/", response_model=Submission, status_code=status.HTTP_201_CREATED)
async def create_new_submission(
    submission_data: SubmissionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new submission (Student only)
    
    - **assignment_id**: ID of the assignment being submitted
    - **student_id**: ID of the student submitting (must match current user)
    - **time_spent_minutes**: Time spent on the assignment (core AI data input)
    
    Requires authentication and STUDENT role.
    The student_id must match the authenticated user's ID.
    """
    # Check if current user is a student
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create submissions"
        )
    
    # Ensure the student_id matches the current user's ID
    if submission_data.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student ID must match the authenticated user's ID"
        )
    
    try:
        new_submission = create_submission(db, submission_in=submission_data)
        return new_submission
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create submission: {str(e)}"
        )

@app.get("/users/", response_model=list[UserResponse])
async def get_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get all users (Admin only)
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view users"
        )
    
    users = db.query(User).all()
    return users


@app.post("/users/create", response_model=UserResponse)
async def create_user_by_admin(
    user_in: UserCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Create a new user (Admin only)
    
    - **username**: Unique username (min 3 characters)
    - **password**: Password (min 6 characters)
    - **role**: User role ('teacher' or 'student')
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create users"
        )
    
    # Check if user already exists
    db_user = get_user_by_username(db, username=user_in.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Hash the password
    hashed_password = get_password_hash(user_in.password)
    
    # Create new user
    db_user = User(
        username=user_in.username,
        hashed_password=hashed_password,
        role=UserRole(user_in.role.value)
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information (protected endpoint)"""
    return current_user

# Metrics endpoints (Admin only)

@app.get("/metrics/users/count")
async def get_users_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get total count of users (Admin only)
    
    Returns the total number of users in the system.
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view user metrics"
        )
    
    try:
        count = count_total_users(db)
        return {"count": count}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get users count: {str(e)}"
        )

@app.get("/metrics/classes/count")
async def get_classes_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get total count of classes (Admin only)
    
    Returns the total number of classes in the system.
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view class metrics"
        )
    
    try:
        count = count_total_classes(db)
        return {"count": count}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get classes count: {str(e)}"
        )

# Export endpoints (Admin only)

@app.get("/exports/users/all", response_model=list[UserResponse])
async def export_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Export all users data (Admin only)
    
    Returns all users in the system for CSV export purposes.
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to export user data"
        )
    
    try:
        users = get_all_users(db)
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export users: {str(e)}"
        )

@app.get("/exports/classes/all")
async def export_all_classes_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Export all classes data (Admin only)
    
    Returns all classes in the system for CSV export purposes.
    Uses forced dictionary conversion to bypass ORM serialization issues.
    
    Requires authentication and ADMIN role.
    """
    # Check if current user is an admin
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to export class data"
        )
    
    # Get classes as simple dictionaries (no ORM serialization issues)
    classes = get_all_classes(db)
    return classes

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
