import React from 'react';

const About: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">About Barcode Generator</h1>
                <p className="text-lg text-gray-600">A modern, cross-platform barcode generation tool</p>
            </div>

            <div className="space-y-12">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Formats</h3>
                            <p className="text-gray-600">Support for Code 128, Code 39, EAN-13, EAN-8, UPC, and QR codes</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                            <div className="text-4xl mb-4">🎨</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customizable</h3>
                            <p className="text-gray-600">Adjust size, colors, and text display options</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                            <div className="text-4xl mb-4">💾</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Export Ready</h3>
                            <p className="text-gray-600">Download barcodes as high-quality PNG images</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Lightweight</h3>
                            <p className="text-gray-600">Built with Rust and Tauri for optimal performance</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">Supported Barcode Types</h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="space-y-3">
                            <div className="py-3 border-b border-gray-100 last:border-b-0">
                                <strong>Code 128:</strong> High-density alphanumeric barcode
                            </div>
                            <div className="py-3 border-b border-gray-100 last:border-b-0">
                                <strong>Code 39:</strong> Industrial barcode standard
                            </div>
                            <div className="py-3 border-b border-gray-100 last:border-b-0">
                                <strong>EAN-13:</strong> International retail product codes
                            </div>
                            <div className="py-3 border-b border-gray-100 last:border-b-0">
                                <strong>EAN-8:</strong> Compact version of EAN-13
                            </div>
                            <div className="py-3 border-b border-gray-100 last:border-b-0">
                                <strong>UPC:</strong> Universal Product Code for retail
                            </div>
                            <div className="py-3 border-b border-gray-100 last:border-b-0">
                                <strong>QR Code:</strong> 2D matrix barcode for data storage
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">Technology</h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="mb-4">
                            This application is built using modern web technologies with a Rust backend:
                        </p>
                        <ul className="space-y-2">
                            <li className="py-2 border-b border-gray-100 last:border-b-0">
                                <strong>Frontend:</strong> React with TypeScript
                            </li>
                            <li className="py-2 border-b border-gray-100 last:border-b-0">
                                <strong>Backend:</strong> Rust with Tauri
                            </li>
                            <li className="py-2 border-b border-gray-100 last:border-b-0">
                                <strong>UI:</strong> Modern, responsive design
                            </li>
                            <li className="py-2 border-b border-gray-100 last:border-b-0">
                                <strong>Performance:</strong> Native speed with web flexibility
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 