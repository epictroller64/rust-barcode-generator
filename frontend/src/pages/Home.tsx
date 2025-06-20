import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { BarcodeFormat, TextPosition, type BarcodeConfig, type BarcodeDimensions, type BarcodeTextStyleConfig, type RgbColor, createBarcodeFormatWrapper, getAvailableBarcodeFormats } from '../lib/interfaces';

const Home: React.FC = () => {
    const [config, setConfig] = useState<BarcodeConfig>({
        format: createBarcodeFormatWrapper(BarcodeFormat.Code128),
        texts: [{
            text: '123456789',
            text_color: { r: 0, g: 0, b: 0 },
            text_size: 12,
            text_position: TextPosition.Lower,
            font: 'Arial',
            margin: 5
        }],
        scale: 2,
        quiet_zones: true,
        dimensions: {
            height_percentage: 100,
            width_percentage: 100,
            width_mm: 50,
            height_mm: 25
        },
        data: '123456789'
    });

    const [generatedBarcode, setGeneratedBarcode] = useState<string>('');
    const [autoGenerate, setAutoGenerate] = useState<boolean>(true);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const handleConfigChange = (field: keyof BarcodeConfig, value: BarcodeConfig[keyof BarcodeConfig]) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleFormatChange = (format: BarcodeFormat) => {
        setConfig(prev => ({
            ...prev,
            format: createBarcodeFormatWrapper(format)
        }));
    };

    const handleTextChange = (index: number, field: keyof BarcodeTextStyleConfig, value: BarcodeTextStyleConfig[keyof BarcodeTextStyleConfig]) => {
        setConfig(prev => ({
            ...prev,
            texts: prev.texts.map((text, i) =>
                i === index ? { ...text, [field]: value } : text
            )
        }));
    };

    const handleColorChange = (index: number, field: keyof RgbColor, value: number) => {
        setConfig(prev => ({
            ...prev,
            texts: prev.texts.map((text, i) =>
                i === index ? {
                    ...text,
                    text_color: { ...text.text_color, [field]: value }
                } : text
            )
        }));
    };

    const handleDimensionsChange = (field: keyof BarcodeDimensions, value: number) => {
        setConfig(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, [field]: value }
        }));
    };

    const addText = () => {
        setConfig(prev => ({
            ...prev,
            texts: [...prev.texts, {
                text: 'New Text',
                text_color: { r: 0, g: 0, b: 0 },
                text_size: 12,
                text_position: TextPosition.Lower,
                font: 'Arial',
                margin: 5
            }]
        }));
    };

    const removeText = (index: number) => {
        if (config.texts.length > 1) {
            setConfig(prev => ({
                ...prev,
                texts: prev.texts.filter((_, i) => i !== index)
            }));
        }
    };

    // Auto-generate barcode when config changes
    useEffect(() => {
        if (autoGenerate && config.data.trim()) {
            generateBarcode();
        }
    }, [config, autoGenerate]);

    // generate barcode and get bytebuffer back from tauri
    const generateBarcode = async () => {
        if (!config.data.trim()) return;

        try {
            setIsGenerating(true);
            const result = await invoke('generate_barcode', { config });
            const arrayBuffer = result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            let binaryString = '';
            for (let i = 0; i < uint8Array.length; i++) {
                binaryString += String.fromCharCode(uint8Array[i]);
            }
            const base64String = btoa(binaryString);
            const dataUrl = `data:image/png;base64,${base64String}`;
            setGeneratedBarcode(dataUrl);
        } catch (error) {
            console.error('Error generating barcode:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadBarcode = () => {
        if (generatedBarcode) {
            const link = document.createElement('a');
            link.href = generatedBarcode;
            link.download = `barcode-${config.texts[0]?.text || 'generated'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Barcode Generator</h1>
                <p className="text-lg text-gray-600">Generate professional barcodes with custom configurations</p>
            </div>
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Configuration</h2>
                        <div className="flex items-center space-x-3">
                            <label className="text-sm font-medium text-gray-700">Auto-generate</label>
                            <button
                                onClick={() => setAutoGenerate(!autoGenerate)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${autoGenerate ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoGenerate ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block font-medium text-gray-700 mb-2">Barcode Data</label>
                        <input
                            type="text"
                            value={config.data}
                            onChange={(e) => handleConfigChange('data', e.target.value)}
                            placeholder="Enter barcode data"
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block font-medium text-gray-700 mb-2">Barcode Format</label>
                        <select
                            value={config.format.format}
                            onChange={(e) => handleFormatChange(e.target.value as BarcodeFormat)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                        >
                            {getAvailableBarcodeFormats().map(format => (
                                <option key={format} value={format}>{format}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block font-medium text-gray-700 mb-2">Scale</label>
                        <input
                            type="number"
                            value={config.scale}
                            onChange={(e) => handleConfigChange('scale', parseInt(e.target.value))}
                            min="1"
                            max="10"
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block font-medium text-gray-700 mb-2">Quiet Zones</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={config.quiet_zones}
                                onChange={(e) => handleConfigChange('quiet_zones', e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label className="font-normal">Enable quiet zones</label>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dimensions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Width (mm)</label>
                                <input
                                    type="number"
                                    value={config.dimensions.width_mm}
                                    onChange={(e) => handleDimensionsChange('width_mm', parseFloat(e.target.value))}
                                    step="0.1"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Height (mm)</label>
                                <input
                                    type="number"
                                    value={config.dimensions.height_mm}
                                    onChange={(e) => handleDimensionsChange('height_mm', parseFloat(e.target.value))}
                                    step="0.1"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Width %</label>
                                <input
                                    type="number"
                                    value={config.dimensions.width_percentage}
                                    onChange={(e) => handleDimensionsChange('width_percentage', parseFloat(e.target.value))}
                                    step="1"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-2">Height %</label>
                                <input
                                    type="number"
                                    value={config.dimensions.height_percentage}
                                    onChange={(e) => handleDimensionsChange('height_percentage', parseFloat(e.target.value))}
                                    step="1"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-base focus:border-blue-500 focus-ring"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Text Styles</h3>
                            <button
                                onClick={addText}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                            >
                                Add Text
                            </button>
                        </div>
                        {config.texts.map((textConfig, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-900">Text {index + 1}</h4>
                                    {config.texts.length > 1 && (
                                        <button
                                            onClick={() => removeText(index)}
                                            className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                                        <input
                                            type="text"
                                            value={textConfig.text}
                                            onChange={(e) => handleTextChange(index, 'text', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus-ring"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Text Size</label>
                                            <input
                                                type="number"
                                                value={textConfig.text_size}
                                                onChange={(e) => handleTextChange(index, 'text_size', parseInt(e.target.value))}
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
                                                onChange={(e) => handleTextChange(index, 'margin', parseInt(e.target.value))}
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
                                            onChange={(e) => handleTextChange(index, 'text_position', e.target.value as TextPosition)}
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
                                            onChange={(e) => handleTextChange(index, 'font', e.target.value)}
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
                                                    onChange={(e) => handleColorChange(index, 'r', parseInt(e.target.value))}
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
                                                    onChange={(e) => handleColorChange(index, 'g', parseInt(e.target.value))}
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
                                                    onChange={(e) => handleColorChange(index, 'b', parseInt(e.target.value))}
                                                    min="0"
                                                    max="255"
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:border-blue-500 focus-ring"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!autoGenerate && (
                        <button
                            onClick={generateBarcode}
                            disabled={isGenerating || !config.data.trim()}
                            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg text-base cursor-pointer transition-colors duration-200 hover:bg-blue-700 active:transform active:translate-y-px disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? 'Generating...' : 'Generate Barcode'}
                        </button>
                    )}
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Preview</h2>
                        {!autoGenerate && (
                            <button
                                onClick={generateBarcode}
                                disabled={isGenerating || !config.data.trim()}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg text-sm cursor-pointer transition-colors duration-200 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? 'Generating...' : 'Generate'}
                            </button>
                        )}
                    </div>
                    <div className="min-h-[300px] flex items-center justify-center">
                        {generatedBarcode ? (
                            <div className="text-center">
                                <img
                                    src={generatedBarcode}
                                    alt="Generated barcode"
                                    className="max-w-full max-h-96 border border-gray-200 rounded-lg"
                                />
                                <button
                                    onClick={downloadBarcode}
                                    className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-green-700"
                                >
                                    Download PNG
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400">
                                <div className="text-6xl mb-4">📊</div>
                                <p className="text-lg">Your barcode will appear here</p>
                                <p className="text-sm mt-2">
                                    {autoGenerate
                                        ? 'Configure settings and enter barcode data'
                                        : 'Click "Generate" to create your barcode'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home; 