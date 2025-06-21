import React from 'react';
import { validationRules } from '../lib/validationRules';

interface BarcodeDataInputProps {
    data: string;
    format: string;
    validationErrors: string[];
    onDataChange: (data: string) => void;
}

const BarcodeDataInput: React.FC<BarcodeDataInputProps> = ({
    data,
    format,
    validationErrors,
    onDataChange
}) => {
    const getCurrentValidationRule = () => {
        return validationRules.find(rule => rule.format === format);
    };

    return (
        <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">Barcode Data</label>
            <input
                type="text"
                value={data}
                onChange={(e) => onDataChange(e.target.value)}
                placeholder="Enter barcode data"
                className={`w-full px-3 py-3 border rounded-lg text-base focus:ring ${validationErrors.length > 0 && data.trim()
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                    }`}
            />
            {(() => {
                const rule = getCurrentValidationRule();
                if (rule) {
                    return (
                        <div className="mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                                <span>Length: {rule.minLength}-{rule.maxLength} characters</span>
                                <span>Format: {rule.dimensions}</span>
                                {rule.allowedCharacters.length > 0 && (
                                    <span>Chars: {rule.allowedCharacters.join(', ')}</span>
                                )}
                            </div>
                        </div>
                    );
                }
                return null;
            })()}
            {data.trim() && (
                <div className="mt-2 flex items-center">
                    {validationErrors.length > 0 ? (
                        <div className="flex items-center text-red-600">
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">Invalid data</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-green-600">
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">Valid data</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BarcodeDataInput; 