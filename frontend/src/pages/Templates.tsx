import React, { useState, useEffect } from 'react';
import { LocalApi } from '../lib/LocalApi';
import type { Template, BarcodeFormat } from '../lib/interfaces';

const Templates: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<BarcodeFormat | 'all'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState<string | null>(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    useEffect(() => {
        if (selectedFormat === 'all') {
            setFilteredTemplates(templates);
        } else {
            const filtered = templates.filter(template =>
                template.config.format.format === selectedFormat
            );
            setFilteredTemplates(filtered);
        }
    }, [templates, selectedFormat]);

    const loadTemplates = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await LocalApi.getTemplates();
            if (result.success && result.data) {
                setTemplates(result.data as Template[]);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
            setError('Failed to load templates');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTemplate = async (templateId: string) => {
        if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const result = await LocalApi.deleteTemplate(templateId);
            if (result.success) {
                await loadTemplates();
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error deleting template:', error);
            setError('Failed to delete template');
        } finally {
            setIsLoading(false);
        }
    };

    const getAvailableFormats = (): BarcodeFormat[] => {
        const formats = new Set<BarcodeFormat>();
        templates.forEach(template => {
            formats.add(template.config.format.format as BarcodeFormat);
        });
        return Array.from(formats).sort();
    };

    const formatDate = (timestamp: string) => {
        try {
            const date = new Date(parseInt(timestamp));
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        } catch {
            return 'Unknown date';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Template Management</h1>
                <p className="text-lg text-gray-600">Manage your saved barcode templates</p>
            </div>

            <div className="max-w-7xl mx-auto px-8">
                {/* Filter Controls */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Filter by format:</label>
                            <select
                                value={selectedFormat}
                                onChange={(e) => setSelectedFormat(e.target.value as BarcodeFormat | 'all')}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="all">All Formats</option>
                                {getAvailableFormats().map(format => (
                                    <option key={format} value={format}>{format}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={loadTemplates}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            >
                                {isLoading ? 'Loading...' : 'Refresh'}
                            </button>
                            <span className="text-sm text-gray-500">
                                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Templates List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading templates...</p>
                    </div>
                ) : filteredTemplates.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                        <p className="text-gray-600">
                            {selectedFormat === 'all'
                                ? 'Create your first template in the Generator tab'
                                : `No templates found for ${selectedFormat} format`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {template.name}
                                                </h3>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                    {template.config.format.format}
                                                </span>
                                            </div>

                                            {template.description && (
                                                <p className="text-gray-600 mb-3">{template.description}</p>
                                            )}

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                                                <div>
                                                    <span className="font-medium">Data:</span>
                                                    <div className="truncate">{template.config.data}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Scale:</span>
                                                    <div>{template.config.scale}x</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Texts:</span>
                                                    <div>{template.config.texts.length}</div>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Created:</span>
                                                    <div>{formatDate(template.id)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => setShowDetails(showDetails === template.id ? null : template.id)}
                                                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                                            >
                                                {showDetails === template.id ? 'Hide' : 'Details'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTemplate(template.id)}
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Detailed View */}
                                    {showDetails === template.id && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h4 className="font-medium text-gray-900 mb-3">Template Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h5 className="font-medium text-gray-700 mb-2">Dimensions</h5>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <div>Width: {template.config.dimensions.width_mm}mm ({template.config.dimensions.width_percentage}%)</div>
                                                        <div>Height: {template.config.dimensions.height_mm}mm ({template.config.dimensions.height_percentage}%)</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="font-medium text-gray-700 mb-2">Settings</h5>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <div>Quiet Zones: {template.config.quiet_zones ? 'Enabled' : 'Disabled'}</div>
                                                        <div>Scale: {template.config.scale}x</div>
                                                    </div>
                                                </div>
                                                {template.config.texts.length > 0 && (
                                                    <div className="md:col-span-2">
                                                        <h5 className="font-medium text-gray-700 mb-2">Text Elements</h5>
                                                        <div className="space-y-2">
                                                            {template.config.texts.map((text, index) => (
                                                                <div key={text.id} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                                                                    <div className="font-medium">Text {index + 1}: {text.text}</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        Position: {text.text_position} |
                                                                        Size: {text.text_size}px |
                                                                        Font: {text.font} |
                                                                        Margin: {text.margin}px
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Templates; 