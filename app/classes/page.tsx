'use client';

import { useTeacherData } from '@/hooks/useTeacherData';
import { ClassManager } from '@/components/ClassManager';
import { StudentList } from '@/components/StudentList';
import { RandomCaller } from '@/components/RandomCaller';

export default function ClassesPage() {
  const {
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
  } = useTeacherData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const currentClass = data.currentClassId 
    ? data.classes.find(c => c.id === data.currentClassId)
    : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Manager - Full width on mobile, 1 column on desktop */}
          <div className="lg:col-span-1">
            <ClassManager
              classes={data.classes}
              currentClassId={data.currentClassId}
              onAddClass={addClass}
              onSelectClass={setCurrentClass}
              onDeleteClass={deleteClass}
            />
          </div>

          {/* Main Content Area - Full width on mobile, 2 columns on desktop */}
          <div className="lg:col-span-2">
            {!currentClass ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">
                  Select a class from the left to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Class Header */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Current Class: {currentClass.name}
                  </h2>
                  <p className="text-gray-600">
                    {currentClass.students.length} student{currentClass.students.length !== 1 ? 's' : ''} • 
                    {currentClass.students.filter(s => !s.isAbsent).length} present • 
                    {currentClass.students.filter(s => !s.isAbsent && !s.hasBeenCalled).length} not called yet
                  </p>
                </div>

                {/* Random Caller */}
                <RandomCaller
                  classroom={currentClass}
                  onGetRandomStudent={() => getRandomStudent(currentClass.id)}
                  onUpdateSettings={(settings) => updateClass(currentClass.id, { settings: { ...currentClass.settings, ...settings } })}
                  onResetCalled={() => resetCalledStudents(currentClass.id)}
                />

                {/* Student List */}
                <StudentList
                  students={currentClass.students}
                  onAddStudent={(name) => addStudent(currentClass.id, name)}
                  onUpdateStudent={(studentId, updates) => updateStudent(currentClass.id, studentId, updates)}
                  onDeleteStudent={(studentId) => deleteStudent(currentClass.id, studentId)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}