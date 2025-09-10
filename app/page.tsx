'use client';

import Link from 'next/link';
import { useTeacherData } from '@/hooks/useTeacherData';

export default function Home() {
  const { data, loading } = useTeacherData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/classes">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Manage Classes
            </button>
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Registered Classes</h2>
          
          {data.classes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No classes registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.classes.map((classroom) => (
                <div key={classroom.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {classroom.name}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{classroom.students.length} student{classroom.students.length !== 1 ? 's' : ''}</p>
                    <p>{classroom.students.filter(s => !s.isAbsent).length} present</p>
                    <p>{classroom.students.filter(s => !s.isAbsent && !s.hasBeenCalled).length} not called</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">
                      Created: {new Date(classroom.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
