'use client';

import { useState } from 'react';
import { Student } from '@/lib/types';

interface AbsenteeManagerProps {
  students: Student[];
  onQuickAbsent: (studentNames: string) => void;
  onUpdateStudent: (studentId: string, updates: Partial<Student>) => void;
}

export function AbsenteeManager({ students, onQuickAbsent, onUpdateStudent }: AbsenteeManagerProps) {
  const [showAbsenteeForm, setShowAbsenteeForm] = useState(false);
  const [absentNames, setAbsentNames] = useState('');

  const handleQuickAbsentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (absentNames.trim()) {
      onQuickAbsent(absentNames);
      setAbsentNames('');
      setShowAbsenteeForm(false);
    }
  };

  const absentStudents = students.filter(s => s.isAbsent);

  return (
    <div className="mb-6">
      {/* Quick Absentee Tool */}
      <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-orange-800">Absentee Management</h4>
          <button
            onClick={() => setShowAbsenteeForm(!showAbsenteeForm)}
            className="bg-orange-500 text-white px-3 py-1 text-sm rounded-md hover:bg-orange-600 transition-colors"
          >
            {showAbsenteeForm ? 'Close' : 'Mark Absentees'}
          </button>
        </div>

        {showAbsenteeForm && (
          <form onSubmit={handleQuickAbsentSubmit} className="mb-3">
            <p className="text-sm text-orange-600 mb-2">
              Type partial names separated by commas or new lines:
            </p>
            <textarea
              value={absentNames}
              onChange={(e) => setAbsentNames(e.target.value)}
              placeholder="John, Jane, Mike..."
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg shadow-sm text-gray-900 placeholder-gray-600 bg-white"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Mark as Absent
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAbsenteeForm(false);
                  setAbsentNames('');
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Quick absent/present toggles */}
        <div className="text-sm text-orange-700">
          <span className="font-medium">{absentStudents.length} absent</span>
          {absentStudents.length > 0 && (
            <button
              onClick={() => {
                absentStudents.forEach(student => {
                  onUpdateStudent(student.id, { isAbsent: false });
                });
              }}
              className="ml-3 text-green-600 hover:text-green-800 underline"
            >
              Mark all present
            </button>
          )}
        </div>
      </div>
    </div>
  );
}