import React, { useState, useEffect } from 'react';
import { LocalApi } from '../lib/LocalApi';
import type { Template, BarcodeConfig, BarcodeFormat } from '../lib/interfaces';

interface TemplateManagerProps {
    currentConfig: BarcodeConfig;
    currentFormat: BarcodeFormat;
    onLoadTemplate: (config: BarcodeConfig) => void;
    onTemplatesUpdated?: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ currentConfig, currentFormat, onLoadTemplate, onTemplatesUpdated }) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showLoadDialog, setShowLoadDialog] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    useEffect(() => {
        loadTemplates();
    }, [currentFormat]);

    useEffect(() => {
        const filtered = templates.filter(template =>
            template.config.format.format === currentFormat
        );
        setFilteredTemplates(filtered);
    }, [templates, currentFormat]);

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

    const handleSaveTemplate = async () => {
        if (!templateName.trim()) {
            setError('Template name is required');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const newTemplate: Template = {
                id: Date.now().toString(),
                name: templateName.trim(),
                description: templateDescription.trim(),
                config: { ...currentConfig }
            };

            const result = await LocalApi.saveTemplate(newTemplate);
            if (result.success) {
                // Reload templates after saving
                await loadTemplates();

                // Notify parent component that templates were updated
                if (onTemplatesUpdated) {
                    onTemplatesUpdated();
                }

                setTemplateName('');
                setTemplateDescription('');
                setShowSaveDialog(false);
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error saving template:', error);
            setError('Failed to save template');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadTemplate = (template: Template) => {
        onLoadTemplate(template.config);
        setShowLoadDialog(false);
    };

    const handleDeleteTemplate = async (templateId: string) => {
        if (!confirm('Are you sure you want to delete this template?')) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const result = await LocalApi.deleteTemplate(templateId);
            if (result.success) {
                await loadTemplates();

                if (onTemplatesUpdated) {
                    // when templates are updated, notify parent component
                    onTemplatesUpdated();
                }
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

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowSaveDialog(true)}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Save Template
                    </button>
                    <button
                        onClick={() => setShowLoadDialog(true)}
                        disabled={filteredTemplates.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Load Template ({filteredTemplates.length})
                    </button>
                </div>
            </div>

            {showSaveDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Save Template</h3>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Template Name *
                                </label>
                                <input
                                    type="text"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter template name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={templateDescription}
                                    onChange={(e) => setTemplateDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Enter template description"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setTemplateName('');
                                    setTemplateDescription('');
                                    setError(null);
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTemplate}
                                disabled={isLoading || !templateName.trim()}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLoadDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Load Template</h3>
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        {filteredTemplates.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No templates available for {currentFormat} format
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{template.name}</h4>
                                                {template.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                                                )}
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Data: {template.config.data}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 ml-4">
                                                <button
                                                    onClick={() => handleLoadTemplate(template)}
                                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                                >
                                                    Load
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowLoadDialog(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateManager; 