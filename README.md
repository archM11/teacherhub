# TeacherHub

A comprehensive hub of tools for teachers, starting with a smart random student caller.

## Features

### Random Student Caller
- **Smart Selection**: Randomly select students from your class
- **Attendance Tracking**: Mark students as absent/present
- **Duplicate Control**: Choose whether students can be called multiple times
- **Priority System**: Prioritize students who haven't been called yet
- **Progress Tracking**: See how many students haven't been called
- **Visual Feedback**: Engaging spinning animation during selection

### Class Management
- **Multiple Classes**: Create and manage multiple classes
- **Persistent Storage**: All data is saved to your browser's localStorage
- **Easy Navigation**: Switch between classes with a click
- **Student Management**: Add, remove, and manage students in each class

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and go to `http://localhost:3000` (or the port shown in terminal)

## How to Use

1. **Create a Class**: Click "New Class" and enter a class name
2. **Add Students**: Select your class and click "Add Student" to add students
3. **Set Attendance**: Mark any absent students by clicking "Mark Absent"
4. **Configure Settings**: 
   - Toggle "Allow students to be called multiple times" if you want repeats
   - Toggle "Prioritize students who haven't been called" for fair distribution
5. **Call Random Student**: Click the big blue button to randomly select a present student
6. **Track Progress**: See stats showing present students, called students, and remaining students

## Technical Details

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Storage**: localStorage for data persistence
- **State Management**: React hooks with custom data management layer

## Future Features

This is designed to be a hub for multiple teaching tools. Planned additions include:
- Grade book and assignment tracking
- Lesson planning tools
- Student behavior tracking
- Parent communication tools
- And more!

## Development

The app uses a clean, modular architecture:
- `/lib/types.ts` - TypeScript interfaces
- `/lib/storage.ts` - localStorage utilities
- `/hooks/useTeacherData.ts` - Data management hook
- `/components/` - Reusable React components

Build for production:
```bash
npm run build
npm start
```
