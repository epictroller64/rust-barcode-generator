import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-16">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center text-gray-900 font-semibold text-xl no-underline">
                        <span className="text-2xl mr-2">📊</span>
                        <span className="hidden sm:inline">Barcode Generator</span>
                    </Link>
                </div>

                <ul className="flex space-x-8">
                    <li>
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 no-underline ${isActive('/')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            Generator
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/about"
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 no-underline ${isActive('/about')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            About
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contact"
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 no-underline ${isActive('/contact')
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation; 