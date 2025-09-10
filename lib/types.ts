export interface Student {
  id: string;
  name: string;
  isAbsent: boolean;
  hasBeenCalled: boolean;
  lastCalledAt?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
  settings: ClassSettings;
}

export interface ClassSettings {
  allowDuplicates: boolean;
  prioritizeNewStudents: boolean;
}

export interface TeacherData {
  classes: ClassRoom[];
  currentClassId?: string;
}