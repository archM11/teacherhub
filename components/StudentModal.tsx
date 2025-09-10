'use client';

import { useEffect } from 'react';
import { Student } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StudentModalProps {
  isOpen: boolean;
  selectedStudent: Student | null;
  onClose: () => void;
  isSpinning: boolean;
}

export function StudentModal({ isOpen, selectedStudent, onClose, isSpinning }: StudentModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>

        <div className="mb-6">
          <div className={cn(
            "mx-auto w-32 h-32 rounded-full flex items-center justify-center transition-all duration-200",
            isSpinning ? "bg-blue-200 animate-spin border-4 border-blue-300" : selectedStudent ? "bg-green-100 border-4 border-green-300" : "bg-gray-100"
          )}>
            {isSpinning ? (
              <div className="text-2xl font-bold text-gray-600">...</div>
            ) : selectedStudent ? (
              <div className="text-2xl font-bold text-green-600">✓</div>
            ) : (
              <div className="text-2xl font-bold text-gray-400">?</div>
            )}
          </div>
        </div>

        <div className="mb-6">
          {isSpinning ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Selecting...</h2>
              <p className="text-gray-600">Please wait</p>
            </>
          ) : selectedStudent ? (
            <>
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                {selectedStudent.name}
              </h2>
              <p className="text-lg text-gray-600">You&apos;re up!</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready?</h2>
              <p className="text-gray-600">Click to select a student</p>
            </>
          )}
        </div>

        {!isSpinning && (
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}