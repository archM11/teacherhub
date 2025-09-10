'use client';

import { useState } from 'react';
import { ClassRoom, Student } from '@/lib/types';
import { cn } from '@/lib/utils';
import { StudentModal } from './StudentModal';

interface RandomCallerProps {
  classroom: ClassRoom;
  onGetRandomStudent: () => Student | null;
  onUpdateSettings: (settings: Partial<ClassRoom['settings']>) => void;
  onResetCalled: () => void;
}

export function RandomCaller({ 
  classroom, 
  onGetRandomStudent, 
  onUpdateSettings, 
  onResetCalled 
}: RandomCallerProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const presentStudents = classroom.students.filter(s => !s.isAbsent);
  const studentsNotCalled = presentStudents.filter(s => !s.hasBeenCalled);
  
  const handleRandomCall = () => {
    if (presentStudents.length === 0) return;
    
    setShowModal(true);
    setIsSpinning(true);
    
    // Instant selection - no artificial delay
    const student = onGetRandomStudent();
    setSelectedStudent(student);
    setIsSpinning(false);
  };

  const handleSettingChange = (key: keyof ClassRoom['settings'], value: boolean) => {
    onUpdateSettings({ [key]: value });
  };

  if (presentStudents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Random Student Caller</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No students are present today.</p>
          <p className="text-sm text-gray-400">Mark students as present to use the random caller.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Random Student Caller</h3>
      
      {/* Settings */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-700 mb-3">Settings</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={classroom.settings.allowDuplicates}
              onChange={(e) => handleSettingChange('allowDuplicates', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Allow students to be called multiple times</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={classroom.settings.prioritizeNewStudents}
              onChange={(e) => handleSettingChange('prioritizeNewStudents', e.target.checked)}
              className="rounded"
              disabled={classroom.settings.allowDuplicates}
            />
            <span className={cn(
              "text-sm",
              classroom.settings.allowDuplicates ? "text-gray-400" : "text-gray-700"
            )}>
              Prioritize students who haven't been called
            </span>
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-md">
          <div className="text-2xl font-bold text-blue-600">{presentStudents.length}</div>
          <div className="text-sm text-blue-600">Present</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-md">
          <div className="text-2xl font-bold text-green-600">{studentsNotCalled.length}</div>
          <div className="text-sm text-green-600">Not Called</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-md">
          <div className="text-2xl font-bold text-purple-600">
            {presentStudents.length - studentsNotCalled.length}
          </div>
          <div className="text-sm text-purple-600">Called</div>
        </div>
      </div>

      {/* Random Caller Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleRandomCall}
          className="px-12 py-6 bg-blue-600 text-white rounded-2xl font-bold text-2xl hover:bg-blue-700 active:transform active:scale-95 transition-all shadow-xl hover:shadow-2xl"
        >
          Call Random Student
        </button>
        
        {selectedStudent && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="text-lg text-green-800">
              <span className="font-medium">Last called: </span>
              <span className="font-bold text-green-900">{selectedStudent.name}</span>
              {selectedStudent.lastCalledAt && (
                <span className="text-sm text-green-600 ml-2">
                  at {new Date(selectedStudent.lastCalledAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {presentStudents.some(s => s.hasBeenCalled) && (
        <div className="text-center">
          <button
            onClick={() => {
              if (confirm('Reset all students as not called? This will allow them to be called again.')) {
                onResetCalled();
                setSelectedStudent(null);
              }
            }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Reset all students as not called
          </button>
        </div>
      )}

      {/* Student Selection Modal */}
      <StudentModal
        isOpen={showModal}
        selectedStudent={selectedStudent}
        isSpinning={isSpinning}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}