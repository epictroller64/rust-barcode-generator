import React from 'react';
import type { BarcodeTextStyleConfig, RgbColor } from '../lib/interfaces';
import { TextPosition } from '../lib/interfaces';

interface TextStyleConfigProps {
    texts: BarcodeTextStyleConfig[];
    onTextChange: (index: number, field: keyof BarcodeTextStyleConfig, value: BarcodeTextStyleConfig[keyof BarcodeTextStyleConfig]) => void;
    onColorChange: (index: number, field: keyof RgbColor, value: number) => void;
    onAddText: () => void;
    onRemoveText: (id: number) => void;
}

const TextStyleConfig: React.FC<TextStyleConfigProps> = ({
    texts,
    onTextChange,
    onColorChange,
    onAddText,
    onRemoveText
}) => {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Text Styles</h3>
                <button
                    onClick={onAddText}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                    Add Text
                </button>
            </div>
            {texts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-lg mb-2">No text elements configured</p>
                    <p className="text-sm">Click &quot;Add Text&quot; to add text labels to your barcode</p>
                    <button
                        onClick={onAddText}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                        Add Text
                    </button>
                </div>
            ) : (
                texts.map((textConfig, index) => (
                    <div key={textConfig.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-gray-900">Text {index + 1}</h4>
                            <button
                                onClick={() => onRemoveText(textConfig.id)}
                                className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                                <input
                                    type="text"
                                    value={textConfig.text}
                                    onChange={(e) => onTextChange(index, 'text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus-ring"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Size</label>
                                    <input
                                        type="number"
                                        value={textConfig.text_size}
                                        onChange={(e) => onTextChange(index, 'text_size', parseInt(e.target.value))}
                                        min="8"
                                        max="72"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus-ring"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
                                    <input
                                        type="number"
                                        value={textConfig.margin}
                                        onChange={(e) => onTextChange(index, 'margin', parseInt(e.target.value))}
                                        min="0"
                                        max="50"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus-ring"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <select
                                    value={textConfig.text_position}
                                    onChange={(e) => onTextChange(index, 'text_position', e.target.value as TextPosition)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus-ring"
                                >
                                    {Object.values(TextPosition).map(position => (
                                        <option key={position} value={position}>{position}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
                                <input
                                    type="text"
                                    value={textConfig.font}
                                    onChange={(e) => onTextChange(index, 'font', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-600">R</label>
                                        <input
                                            type="number"
                                            value={textConfig.text_color.r}
                                            onChange={(e) => onColorChange(index, 'r', parseInt(e.target.value))}
                                            min="0"
                                            max="255"
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600">G</label>
                                        <input
                                            type="number"
                                            value={textConfig.text_color.g}
                                            onChange={(e) => onColorChange(index, 'g', parseInt(e.target.value))}
                                            min="0"
                                            max="255"
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus-ring"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600">B</label>
                                        <input
                                            type="number"
                                            value={textConfig.text_color.b}
                                            onChange={(e) => onColorChange(index, 'b', parseInt(e.target.value))}
                                            min="0"
                                            max="255"
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus-ring"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TextStyleConfig; 