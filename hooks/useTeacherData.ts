import { useState, useEffect } from 'react';
import { TeacherData, ClassRoom, Student } from '@/lib/types';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/utils';

export function useTeacherData() {
  const [data, setData] = useState<TeacherData>({ classes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedData = storage.getData();
    setData(loadedData);
    setLoading(false);
  }, []);

  const addClass = (name: string) => {
    const newClass: ClassRoom = {
      id: generateId(),
      name,
      students: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        allowDuplicates: false,
        prioritizeNewStudents: true,
      },
    };
    storage.addClass(newClass);
    setData(storage.getData());
    return newClass.id;
  };

  const updateClass = (classId: string, updates: Partial<ClassRoom>) => {
    storage.updateClass(classId, updates);
    setData(storage.getData());
  };

  const deleteClass = (classId: string) => {
    storage.deleteClass(classId);
    setData(storage.getData());
  };

  const addStudent = (classId: string, studentName: string) => {
    const classroom = storage.getClass(classId);
    if (classroom) {
      const newStudent: Student = {
        id: generateId(),
        name: studentName,
        isAbsent: false,
        hasBeenCalled: false,
      };
      classroom.students.push(newStudent);
      storage.updateClass(classId, classroom);
      setData(storage.getData());
    }
  };

  const updateStudent = (classId: string, studentId: string, updates: Partial<Student>) => {
    storage.updateStudent(classId, studentId, updates);
    setData(storage.getData());
  };

  const deleteStudent = (classId: string, studentId: string) => {
    const classroom = storage.getClass(classId);
    if (classroom) {
      classroom.students = classroom.students.filter(s => s.id !== studentId);
      storage.updateClass(classId, classroom);
      setData(storage.getData());
    }
  };

  const setCurrentClass = (classId: string) => {
    storage.setCurrentClass(classId);
    setData(storage.getData());
  };

  const resetCalledStudents = (classId: string) => {
    storage.resetCalledStudents(classId);
    setData(storage.getData());
  };

  const getRandomStudent = (classId: string): Student | null => {
    const classroom = storage.getClass(classId);
    if (!classroom) return null;

    const availableStudents = classroom.students.filter(s => !s.isAbsent);
    
    if (availableStudents.length === 0) return null;

    let candidates = availableStudents;

    if (!classroom.settings.allowDuplicates) {
      const notCalledStudents = availableStudents.filter(s => !s.hasBeenCalled);
      if (notCalledStudents.length > 0) {
        candidates = notCalledStudents;
      } else {
        resetCalledStudents(classId);
        candidates = availableStudents;
      }
    }

    if (classroom.settings.prioritizeNewStudents && !classroom.settings.allowDuplicates) {
      const notCalledStudents = candidates.filter(s => !s.hasBeenCalled);
      if (notCalledStudents.length > 0) {
        candidates = notCalledStudents;
      }
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selectedStudent = candidates[randomIndex];

    updateStudent(classId, selectedStudent.id, {
      hasBeenCalled: true,
      lastCalledAt: new Date().toISOString(),
    });

    return selectedStudent;
  };

  return {
    data,
    loading,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    updateStudent,
    deleteStudent,
    setCurrentClass,
    resetCalledStudents,
    getRandomStudent,
  };
}