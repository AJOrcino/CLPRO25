from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Text, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Enum as SQLEnum
import enum
from typing import Optional
from pydantic import BaseModel, validator
from datetime import datetime
from database import Base

class UserRole(enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)

    # Relationships
    classes_taught = relationship("Class", back_populates="teacher")
    enrollments = relationship("Enrollment", back_populates="student")
    assignments_created = relationship("Assignment", back_populates="creator")
    submissions = relationship("Submission", back_populates="student")

class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    code = Column(String, unique=True, index=True, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    teacher = relationship("User", back_populates="classes_taught")
    enrollments = relationship("Enrollment", back_populates="class_")
    assignments = relationship("Assignment", back_populates="class_")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    class_ = relationship("Class", back_populates="enrollments")
    student = relationship("User", back_populates="enrollments")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    class_ = relationship("Class", back_populates="assignments")
    creator = relationship("User", back_populates="assignments_created")
    submissions = relationship("Submission", back_populates="assignment")

# Pydantic schemas for Class
class ClassBase(BaseModel):
    name: str
    code: str
    teacher_id: Optional[int] = None

class ClassCreate(ClassBase):
    @validator('name')
    def validate_name(cls, v):
        if len(v) < 1:
            raise ValueError('Class name cannot be empty')
        return v
    
    @validator('code')
    def validate_code(cls, v):
        if len(v) < 3:
            raise ValueError('Class code must be at least 3 characters long')
        return v.upper()  # Convert to uppercase

class ClassResponse(ClassBase):
    id: int
    teacher_id: Optional[int] = None

    model_config = {"from_attributes": True}

# Pydantic schemas for Assignment
class AssignmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    class_id: int

class AssignmentCreate(AssignmentBase):
    @validator('name')
    def validate_name(cls, v):
        if len(v) < 1:
            raise ValueError('Assignment name cannot be empty')
        return v
    
    @validator('class_id')
    def validate_class_id(cls, v):
        if v <= 0:
            raise ValueError('Class ID must be a positive integer')
        return v

class AssignmentResponse(AssignmentBase):
    id: int
    creator_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    grade = Column(Float, nullable=True)  # For teacher to fill
    time_spent_minutes = Column(Integer, nullable=False)  # Core AI data input for engagement
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", back_populates="submissions")
