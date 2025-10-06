from sqlalchemy.orm import Session
from models import Class, ClassCreate, User, Assignment, AssignmentCreate, Submission
from schemas import SubmissionCreate
from typing import Optional, List


def create_class(db: Session, class_in: ClassCreate) -> Class:
    """
    Create a new class and save it to the database.
    
    Args:
        db: Database session
        class_in: ClassCreate object containing class data
        
    Returns:
        Class: The created class object
        
    Raises:
        ValueError: If class name or code already exists
    """
    # Check if class name already exists
    existing_class_by_name = db.query(Class).filter(Class.name == class_in.name).first()
    if existing_class_by_name:
        raise ValueError(f"Class with name '{class_in.name}' already exists")
    
    # Check if class code already exists
    existing_class_by_code = db.query(Class).filter(Class.code == class_in.code).first()
    if existing_class_by_code:
        raise ValueError(f"Class with code '{class_in.code}' already exists")
    
    # If teacher_id is provided, verify the teacher exists
    if class_in.teacher_id is not None:
        teacher = db.query(User).filter(User.id == class_in.teacher_id).first()
        if not teacher:
            raise ValueError(f"Teacher with ID {class_in.teacher_id} not found")
        if teacher.role.value != "teacher":
            raise ValueError(f"User with ID {class_in.teacher_id} is not a teacher")
    
    # Create the new class
    db_class = Class(
        name=class_in.name,
        code=class_in.code,
        teacher_id=class_in.teacher_id
    )
    
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class


def get_class(db: Session, class_id: int) -> Optional[Class]:
    """
    Fetch a single class by its ID.
    
    Args:
        db: Database session
        class_id: ID of the class to fetch
        
    Returns:
        Class: The class object if found, None otherwise
    """
    return db.query(Class).filter(Class.id == class_id).first()


def get_classes(db: Session, skip: int = 0, limit: int = 100) -> List[Class]:
    """
    Fetch a list of all classes with pagination.
    
    Args:
        db: Database session
        skip: Number of classes to skip (for pagination)
        limit: Maximum number of classes to return
        
    Returns:
        List[Class]: List of class objects
    """
    return db.query(Class).offset(skip).limit(limit).all()


def update_class(db: Session, class_id: int, class_in: ClassCreate) -> Optional[Class]:
    """
    Update an existing class's name, code, or assigned teacher ID.
    
    Args:
        db: Database session
        class_id: ID of the class to update
        class_in: ClassCreate object containing updated class data
        
    Returns:
        Class: The updated class object if found, None otherwise
        
    Raises:
        ValueError: If class name or code already exists (excluding current class)
    """
    # Get the existing class
    db_class = db.query(Class).filter(Class.id == class_id).first()
    if not db_class:
        return None
    
    # Check if class name already exists (excluding current class)
    existing_class_by_name = db.query(Class).filter(
        Class.name == class_in.name,
        Class.id != class_id
    ).first()
    if existing_class_by_name:
        raise ValueError(f"Class with name '{class_in.name}' already exists")
    
    # Check if class code already exists (excluding current class)
    existing_class_by_code = db.query(Class).filter(
        Class.code == class_in.code,
        Class.id != class_id
    ).first()
    if existing_class_by_code:
        raise ValueError(f"Class with code '{class_in.code}' already exists")
    
    # If teacher_id is provided, verify the teacher exists
    if class_in.teacher_id is not None:
        teacher = db.query(User).filter(User.id == class_in.teacher_id).first()
        if not teacher:
            raise ValueError(f"Teacher with ID {class_in.teacher_id} not found")
        if teacher.role.value != "teacher":
            raise ValueError(f"User with ID {class_in.teacher_id} is not a teacher")
    
    # Update the class fields
    db_class.name = class_in.name
    db_class.code = class_in.code
    db_class.teacher_id = class_in.teacher_id
    
    db.commit()
    db.refresh(db_class)
    return db_class


def delete_class(db: Session, class_id: int) -> bool:
    """
    Delete a class by its ID.
    
    Args:
        db: Database session
        class_id: ID of the class to delete
        
    Returns:
        bool: True if class was deleted, False if class not found
    """
    db_class = db.query(Class).filter(Class.id == class_id).first()
    if not db_class:
        return False
    
    db.delete(db_class)
    db.commit()
    return True


def get_classes_by_teacher(db: Session, teacher_id: int, skip: int = 0, limit: int = 100) -> List[Class]:
    """
    Fetch all classes assigned to a specific teacher.
    
    Args:
        db: Database session
        teacher_id: ID of the teacher
        skip: Number of classes to skip (for pagination)
        limit: Maximum number of classes to return
        
    Returns:
        List[Class]: List of class objects assigned to the teacher
    """
    return db.query(Class).filter(Class.teacher_id == teacher_id).offset(skip).limit(limit).all()


def get_unassigned_classes(db: Session, skip: int = 0, limit: int = 100) -> List[Class]:
    """
    Fetch all classes that are not assigned to any teacher.
    
    Args:
        db: Database session
        skip: Number of classes to skip (for pagination)
        limit: Maximum number of classes to return
        
    Returns:
        List[Class]: List of unassigned class objects
    """
    return db.query(Class).filter(Class.teacher_id.is_(None)).offset(skip).limit(limit).all()


def search_classes(db: Session, search_term: str, skip: int = 0, limit: int = 100) -> List[Class]:
    """
    Search classes by name or code.
    
    Args:
        db: Database session
        search_term: Term to search for in class name or code
        skip: Number of classes to skip (for pagination)
        limit: Maximum number of classes to return
        
    Returns:
        List[Class]: List of class objects matching the search term
    """
    return db.query(Class).filter(
        (Class.name.ilike(f"%{search_term}%")) | 
        (Class.code.ilike(f"%{search_term}%"))
    ).offset(skip).limit(limit).all()


def count_total_users(db: Session) -> int:
    """
    Count the total number of users in the users table.
    
    Args:
        db: Database session
        
    Returns:
        int: Total count of users
    """
    return db.query(User).count()


def count_total_classes(db: Session) -> int:
    """
    Count the total number of classes in the classes table.
    
    Args:
        db: Database session
        
    Returns:
        int: Total count of classes
    """
    return db.query(Class).count()


def get_all_users(db: Session) -> List[User]:
    """
    Fetch all users from the users table without pagination.
    
    Args:
        db: Database session
        
    Returns:
        List[User]: List of all user objects
    """
    return db.query(User).all()


def get_all_classes(db: Session) -> List[dict]:
    """
    Fetch all classes from the classes table without pagination.
    Uses forced dictionary conversion to bypass ORM serialization issues.
    
    Args:
        db: Database session
        
    Returns:
        List[dict]: List of class dictionaries with only necessary fields
    """
    # Fetch all classes using SQLAlchemy query
    classes = db.query(Class).all()
    
    # Convert to simple dictionaries with only necessary columns
    # This bypasses ORM relationship serialization issues
    class_dicts = []
    for class_obj in classes:
        class_dict = {
            'id': class_obj.id,
            'name': class_obj.name,
            'code': class_obj.code,
            'teacher_id': class_obj.teacher_id
        }
        class_dicts.append(class_dict)
    
    return class_dicts


def create_assignment(db: Session, assignment_in: AssignmentCreate, creator_id: int) -> Assignment:
    """
    Create a new assignment and save it to the database.
    
    Args:
        db: Database session
        assignment_in: AssignmentCreate object containing assignment data
        creator_id: ID of the user creating the assignment
        
    Returns:
        Assignment: The created assignment object
        
    Raises:
        ValueError: If class doesn't exist or creator is not authorized
    """
    # Verify the class exists
    class_obj = db.query(Class).filter(Class.id == assignment_in.class_id).first()
    if not class_obj:
        raise ValueError(f"Class with ID {assignment_in.class_id} not found")
    
    # Verify the creator exists and is a teacher or admin
    creator = db.query(User).filter(User.id == creator_id).first()
    if not creator:
        raise ValueError(f"User with ID {creator_id} not found")
    
    if creator.role.value not in ["teacher", "admin"]:
        raise ValueError(f"User with ID {creator_id} is not authorized to create assignments")
    
    # Create the new assignment
    db_assignment = Assignment(
        name=assignment_in.name,
        description=assignment_in.description,
        class_id=assignment_in.class_id,
        creator_id=creator_id
    )
    
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


def create_submission(db: Session, submission_in: SubmissionCreate) -> Submission:
    """
    Create a new submission and save it to the database.
    
    Args:
        db: Database session
        submission_in: SubmissionCreate object containing submission data
        
    Returns:
        Submission: The created submission object
        
    Raises:
        ValueError: If assignment or student doesn't exist, or student is not enrolled in the class
    """
    # Verify the assignment exists
    assignment = db.query(Assignment).filter(Assignment.id == submission_in.assignment_id).first()
    if not assignment:
        raise ValueError(f"Assignment with ID {submission_in.assignment_id} not found")
    
    # Verify the student exists and is a student
    student = db.query(User).filter(User.id == submission_in.student_id).first()
    if not student:
        raise ValueError(f"User with ID {submission_in.student_id} not found")
    
    if student.role.value != "student":
        raise ValueError(f"User with ID {submission_in.student_id} is not a student")
    
    # Verify the student is enrolled in the class that contains this assignment
    from models import Enrollment
    enrollment = db.query(Enrollment).filter(
        Enrollment.student_id == submission_in.student_id,
        Enrollment.class_id == assignment.class_id
    ).first()
    
    if not enrollment:
        raise ValueError(f"Student with ID {submission_in.student_id} is not enrolled in the class for assignment {submission_in.assignment_id}")
    
    # Check if student has already submitted this assignment
    existing_submission = db.query(Submission).filter(
        Submission.assignment_id == submission_in.assignment_id,
        Submission.student_id == submission_in.student_id
    ).first()
    
    if existing_submission:
        raise ValueError(f"Student with ID {submission_in.student_id} has already submitted assignment {submission_in.assignment_id}")
    
    # Create the new submission
    db_submission = Submission(
        assignment_id=submission_in.assignment_id,
        student_id=submission_in.student_id,
        time_spent_minutes=submission_in.time_spent_minutes
    )
    
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission