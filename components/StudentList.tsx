'use client';

import { useState } from 'react';
import { Student } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AbsenteeManager } from './AbsenteeManager';

interface StudentListProps {
  students: Student[];
  onAddStudent: (name: string) => void;
  onUpdateStudent: (studentId: string, updates: Partial<Student>) => void;
  onDeleteStudent: (studentId: string) => void;
}

export function StudentList({ students, onAddStudent, onUpdateStudent, onDeleteStudent }: StudentListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [bulkStudentNames, setBulkStudentNames] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim());
      setNewStudentName('');
      setIsAdding(false);
    }
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkStudentNames.trim()) {
      const names = bulkStudentNames
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      names.forEach(name => {
        if (!students.some(s => s.name.toLowerCase() === name.toLowerCase())) {
          onAddStudent(name);
        }
      });
      
      setBulkStudentNames('');
      setIsBulkAdding(false);
    }
  };

  const handleQuickAbsent = (studentNames: string) => {
    const names = studentNames
      .split(/[,\n]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    students.forEach(student => {
      const shouldBeAbsent = names.some(name => 
        student.name.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(student.name.toLowerCase())
      );
      if (shouldBeAbsent && !student.isAbsent) {
        onUpdateStudent(student.id, { isAbsent: true });
      }
    });
  };

  const presentStudents = students.filter(s => !s.isAbsent);
  const absentStudents = students.filter(s => s.isAbsent);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Students</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAdding(true)}
            className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600 transition-colors"
          >
            + Add Student
          </button>
          <button
            onClick={() => setIsBulkAdding(true)}
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            Bulk Add
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Enter student name"
              className="flex-1 px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg shadow-sm text-gray-900 placeholder-gray-600 bg-white"
              autoFocus
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewStudentName('');
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isBulkAdding && (
        <form onSubmit={handleBulkSubmit} className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Bulk Add Students</h4>
          <p className="text-sm text-blue-600 mb-3">Enter one student name per line:</p>
          <textarea
            value={bulkStudentNames}
            onChange={(e) => setBulkStudentNames(e.target.value)}
            placeholder={`John Doe\nJane Smith\nMike Johnson\n...`}
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm text-gray-900 placeholder-gray-600 bg-white"
            rows={6}
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add All Students
            </button>
            <button
              type="button"
              onClick={() => {
                setIsBulkAdding(false);
                setBulkStudentNames('');
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Quick Absentee Tool */}
      <AbsenteeManager 
        students={students}
        onQuickAbsent={handleQuickAbsent}
        onUpdateStudent={onUpdateStudent}
      />

      {students.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No students yet. Add your first student!</p>
      ) : (
        <div className="space-y-4">
          {/* Present Students */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Present ({presentStudents.length})</h4>
            <div className="space-y-2">
              {presentStudents.map((student) => (
                <div
                  key={student.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border-2 transition-all',
                    student.hasBeenCalled 
                      ? 'bg-blue-50 border-blue-300 shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {student.hasBeenCalled && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                    <span className={cn(
                      'font-medium text-lg',
                      student.hasBeenCalled ? 'text-blue-800' : 'text-gray-800'
                    )}>
                      {student.name}
                    </span>
                    {student.hasBeenCalled && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full font-medium">
                          CALLED
                        </span>
                        {student.lastCalledAt && (
                          <span className="text-xs text-blue-500">
                            {new Date(student.lastCalledAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateStudent(student.id, { isAbsent: true })}
                      className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                    >
                      Mark Absent
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${student.name}? This cannot be undone.`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 px-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Absent Students */}
          {absentStudents.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Absent ({absentStudents.length})</h4>
              <div className="space-y-2">
                {absentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2 rounded-md bg-red-50 border border-red-200"
                  >
                    <span className="font-medium text-red-700">{student.name}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateStudent(student.id, { isAbsent: false })}
                        className="text-green-500 hover:text-green-700 text-sm px-2 py-1"
                      >
                        Mark Present
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${student.name}? This cannot be undone.`)) {
                            onDeleteStudent(student.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 px-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}