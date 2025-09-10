'use client';

import { useState } from 'react';
import { ClassRoom } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ClassManagerProps {
  classes: ClassRoom[];
  currentClassId?: string;
  onAddClass: (name: string) => void;
  onSelectClass: (classId: string) => void;
  onDeleteClass: (classId: string) => void;
}

export function ClassManager({
  classes,
  currentClassId,
  onAddClass,
  onSelectClass,
  onDeleteClass,
}: ClassManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      onAddClass(newClassName.trim());
      setNewClassName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Classes</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          + New Class
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Enter class name"
              className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm text-gray-900 placeholder-gray-600 bg-white"
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
                setNewClassName('');
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {classes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No classes yet. Create your first class!</p>
        ) : (
          classes.map((classroom) => (
            <div
              key={classroom.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors',
                currentClassId === classroom.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              )}
              onClick={() => onSelectClass(classroom.id)}
            >
              <div>
                <h3 className="font-medium text-gray-800">{classroom.name}</h3>
                <p className="text-sm text-gray-500">
                  {classroom.students.length} student{classroom.students.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete "${classroom.name}"? This cannot be undone.`)) {
                    onDeleteClass(classroom.id);
                  }
                }}
                className="text-red-500 hover:text-red-700 px-2 py-1"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}