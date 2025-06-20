import React, { useState } from 'react';

// Make it proper


const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact & Support</h1>
                <p className="text-lg text-gray-600">Get help or provide feedback about the Barcode Generator</p>
            </div>

            <div className="space-y-12">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                            <div className="text-3xl mb-4">📧</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                            <p className="text-gray-600 mb-4">For technical issues and feature requests</p>
                            <a href="mailto:support@email.ee" className="text-blue-600 font-medium hover:underline">
                                support@email.ee
                            </a>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                            <div className="text-3xl mb-4">🐛</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bug Reports</h3>
                            <p className="text-gray-600 mb-4">Report issues or unexpected behavior</p>
                            <a href="https://github.com/epictroller64/issues" className="text-blue-600 font-medium hover:underline">
                                GitHub Issues
                            </a>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                            <div className="text-3xl mb-4">💡</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Requests</h3>
                            <p className="text-gray-600 mb-4">Suggest new features or improvements</p>
                            <a href="https://github.com/epictroller64/discussions" className="text-blue-600 font-medium hover:underline">
                                GitHub Discussions
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block font-medium text-gray-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="block font-medium text-gray-700 mb-2">Subject *</label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                            >
                                <option value="">Select a subject</option>
                                <option value="bug-report">Bug Report</option>
                                <option value="feature-request">Feature Request</option>
                                <option value="general-inquiry">General Inquiry</option>
                                <option value="support">Technical Support</option>
                                <option value="feedback">Feedback</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="message" className="block font-medium text-gray-700 mb-2">Message *</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Please describe your issue, request, or feedback in detail..."
                                required
                                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring resize-y min-h-[120px]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg text-base cursor-pointer transition-colors duration-200 hover:bg-blue-700"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact; 