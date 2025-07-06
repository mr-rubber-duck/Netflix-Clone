'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search, User } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isOpen && target && !target.closest('nav') && !target.closest('button')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Implement search functionality
    }
  };

  const isActive = (path: string) => {
    // Simple active link check - you can enhance this with Next.js router
    return path === '/';
  };

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'TV Shows', href: '/tv' },
    { name: 'Movies', href: '/movies' },
    { name: 'Latest', href: '/latest' },
    { name: 'My List', href: '/mylist' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 text-white">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-red-600 tracking-wider">OpenReel</h1>

        {/* Desktop Navigation - Only show on md+ screens */}
        <nav className="hidden lg:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`hover:text-red-500 transition-colors duration-200 ${
                isActive(item.href) ? 'text-red-500' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Search and User - Only show on md+ screens */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`bg-black/50 text-white px-4 py-2 pl-10 rounded border transition-all duration-200 ${
                isSearchFocused ? 'border-red-500' : 'border-white/20'
              } focus:outline-none focus:border-red-500`}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </form>

          {/* User Profile */}
          <div className="flex items-center space-x-2 cursor-pointer hover:text-red-500 transition-colors duration-200">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">User</span>
          </div>
        </div>

        {/* Hamburger Button - Only show on mobile/tablet */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation - Only show when menu is open on mobile/tablet */}
      {isOpen && (
        <nav className="md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-md px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 text-white px-4 py-2 pl-10 rounded border border-white/20 focus:outline-none focus:border-red-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </form>

          {/* Mobile Menu Items */}
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`hover:text-red-500 transition-colors duration-200 ${
                isActive(item.href) ? 'text-red-500' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile User Profile */}
          <div className="flex items-center space-x-2 py-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">User</span>
          </div>
        </nav>
      )}
    </header>
  );
}
