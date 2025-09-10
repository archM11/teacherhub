import { TeacherData, ClassRoom, Student } from './types';

const STORAGE_KEY = 'teacherhub_data';

export const storage = {
  getData(): TeacherData {
    if (typeof window === 'undefined') {
      return { classes: [] };
    }
    
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initialData: TeacherData = { classes: [] };
      this.setData(initialData);
      return initialData;
    }
    
    return JSON.parse(data);
  },

  setData(data: TeacherData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  addClass(classroom: ClassRoom): void {
    const data = this.getData();
    data.classes.push(classroom);
    this.setData(data);
  },

  updateClass(classId: string, updatedClass: Partial<ClassRoom>): void {
    const data = this.getData();
    const index = data.classes.findIndex(c => c.id === classId);
    if (index !== -1) {
      data.classes[index] = { 
        ...data.classes[index], 
        ...updatedClass, 
        updatedAt: new Date().toISOString() 
      };
      this.setData(data);
    }
  },

  deleteClass(classId: string): void {
    const data = this.getData();
    data.classes = data.classes.filter(c => c.id !== classId);
    if (data.currentClassId === classId) {
      data.currentClassId = undefined;
    }
    this.setData(data);
  },

  getClass(classId: string): ClassRoom | undefined {
    const data = this.getData();
    return data.classes.find(c => c.id === classId);
  },

  setCurrentClass(classId: string): void {
    const data = this.getData();
    data.currentClassId = classId;
    this.setData(data);
  },

  updateStudent(classId: string, studentId: string, updates: Partial<Student>): void {
    const data = this.getData();
    const classroom = data.classes.find(c => c.id === classId);
    if (classroom) {
      const studentIndex = classroom.students.findIndex(s => s.id === studentId);
      if (studentIndex !== -1) {
        classroom.students[studentIndex] = {
          ...classroom.students[studentIndex],
          ...updates
        };
        this.setData(data);
      }
    }
  },

  resetCalledStudents(classId: string): void {
    const data = this.getData();
    const classroom = data.classes.find(c => c.id === classId);
    if (classroom) {
      classroom.students.forEach(student => {
        student.hasBeenCalled = false;
        student.lastCalledAt = undefined;
      });
      this.setData(data);
    }
  }
};