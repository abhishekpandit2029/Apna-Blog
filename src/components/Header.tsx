import { BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={28} />
          <h1 className="text-xl font-bold text-gray-800">BlogHaven</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">Home</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">Popular</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">Categories</a>
          <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">About</a>
        </nav>
      </div>
    </header>
  );
};