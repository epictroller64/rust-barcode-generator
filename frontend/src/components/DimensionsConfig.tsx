import React from 'react';
import type { BarcodeDimensions } from '../lib/interfaces';
import { validationRules } from '../lib/validationRules';

interface DimensionsConfigProps {
    dimensions: BarcodeDimensions;
    format: string;
    onDimensionsChange: (field: keyof BarcodeDimensions, value: number) => void;
}

const DimensionsConfig: React.FC<DimensionsConfigProps> = ({
    dimensions,
    format,
    onDimensionsChange
}) => {
    const getCurrentValidationRule = () => {
        return validationRules.find(rule => rule.format === format);
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions</h3>
            {(() => {
                const rule = getCurrentValidationRule();
                if (rule && rule.dimensions === 'square') {
                    return (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center text-blue-800">
                                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Square format detected - dimensions will be automatically synchronized</span>
                            </div>
                        </div>
                    );
                }
                return null;
            })()}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Width (mm)</label>
                    <input
                        type="number"
                        value={dimensions.width_mm}
                        onChange={(e) => onDimensionsChange('width_mm', parseFloat(e.target.value))}
                        step="0.1"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Height (mm)</label>
                    <input
                        type="number"
                        value={dimensions.height_mm}
                        onChange={(e) => onDimensionsChange('height_mm', parseFloat(e.target.value))}
                        step="0.1"
                        className={`w-full px-3 py-3 border rounded-lg text-base focus:ring ${getCurrentValidationRule()?.dimensions === 'square'
                            ? 'bg-gray-50 border-gray-200'
                            : 'border-gray-300 focus:border-blue-500'
                            }`}
                        disabled={getCurrentValidationRule()?.dimensions === 'square'}
                    />
                    {getCurrentValidationRule()?.dimensions === 'square' && (
                        <p className="text-xs text-gray-500 mt-1">Auto-synced with width</p>
                    )}
                </div>
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Width %</label>
                    <input
                        type="number"
                        value={dimensions.width_percentage}
                        onChange={(e) => onDimensionsChange('width_percentage', parseFloat(e.target.value))}
                        step="1"
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700 mb-2">Height %</label>
                    <input
                        type="number"
                        value={dimensions.height_percentage}
                        onChange={(e) => onDimensionsChange('height_percentage', parseFloat(e.target.value))}
                        step="1"
                        className={`w-full px-3 py-3 border rounded-lg text-base focus:ring ${getCurrentValidationRule()?.dimensions === 'square'
                            ? 'bg-gray-50 border-gray-200'
                            : 'border-gray-300 focus:border-blue-500'
                            }`}
                        disabled={getCurrentValidationRule()?.dimensions === 'square'}
                    />
                    {getCurrentValidationRule()?.dimensions === 'square' && (
                        <p className="text-xs text-gray-500 mt-1">Auto-synced with width</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DimensionsConfig; 