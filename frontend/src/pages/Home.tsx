import React, { useState, useEffect } from 'react';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { BarcodeFormat, TextPosition, type BarcodeConfig, type BarcodeDimensions, type BarcodeTextStyleConfig, type RgbColor, createBarcodeFormatWrapper, getAvailableBarcodeFormats, createDefaultBarcodeConfig } from '../lib/interfaces';
import { validationRules } from '../lib/validationRules';
import ValidationNotification from '../components/ValidationNotification';
import BarcodeDataInput from '../components/BarcodeDataInput';
import DimensionsConfig from '../components/DimensionsConfig';
import TextStyleConfig from '../components/TextStyleConfig';
import BarcodePreview from '../components/BarcodePreview';
import TemplateManager from '../components/TemplateManager';
import { getBarcodeResultAsBase64DataUrl, validateBarcodeData } from '../lib/utils';

const Home: React.FC = () => {
    const [config, setConfig] = useState<BarcodeConfig>(createDefaultBarcodeConfig());

    const [generatedBarcode, setGeneratedBarcode] = useState<string>('');
    const [autoGenerate, setAutoGenerate] = useState<boolean>(true);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

    const getCurrentValidationRule = () => {
        return validationRules.find(rule => rule.format === config.format.format);
    };


    const showValidationNotification = (errors: string[]) => {
        setValidationErrors(errors);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
    };

    const adjustDimensionsForFormat = (format: BarcodeFormat) => {
        const rule = validationRules.find(r => r.format === format);
        if (rule && rule.dimensions === 'square') {
            setConfig(prev => ({
                ...prev,
                dimensions: {
                    ...prev.dimensions,
                    height_mm: prev.dimensions.width_mm,
                    height_percentage: prev.dimensions.width_percentage
                }
            }));
        } else if (rule && rule.dimensions === 'rectangular') {
            setConfig(prev => ({
                ...prev,
                dimensions: {
                    ...prev.dimensions,
                    height_mm: 25,
                    width_mm: 50
                }
            }));
        }
    };

    const handleConfigChange = (field: keyof BarcodeConfig, value: BarcodeConfig[keyof BarcodeConfig]) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleFormatChange = (format: BarcodeFormat) => {
        setConfig(prev => ({
            ...prev,
            format: createBarcodeFormatWrapper(format)
        }));
        adjustDimensionsForFormat(format);
        if (config.data.trim()) {
            const errors = validateBarcodeData(config.data, format);
            if (errors.length > 0) {
                showValidationNotification(errors);
            }
        }
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
        const rule = getCurrentValidationRule();
        setConfig(prev => {
            const newDimensions = { ...prev.dimensions, [field]: value };
            if (rule && rule.dimensions === 'square') {
                if (field === 'width_mm') {
                    newDimensions.height_mm = value;
                } else if (field === 'height_mm') {
                    newDimensions.width_mm = value;
                } else if (field === 'width_percentage') {
                    newDimensions.height_percentage = value;
                } else if (field === 'height_percentage') {
                    newDimensions.width_percentage = value;
                }
            }

            return {
                ...prev,
                dimensions: newDimensions
            };
        });
    };

    const handleDataChange = (data: string) => {
        setConfig(prev => ({ ...prev, data }));
        if (data.trim()) {
            const errors = validateBarcodeData(data, config.format.format as BarcodeFormat);
            if (errors.length > 0) {
                showValidationNotification(errors);
            } else {
                setValidationErrors([]);
                setShowNotification(false);
            }
        } else {
            setValidationErrors([]);
            setShowNotification(false);
        }
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
                margin: 5,
                id: Date.now()
            }]
        }));
    };

    const removeText = (id: number) => {
        setConfig(prev => {
            const newTexts = prev.texts.filter(text => text.id !== id);
            return {
                ...prev,
                texts: newTexts
            };
        });
    };

    const handleLoadTemplate = (templateConfig: BarcodeConfig) => {
        setConfig(templateConfig);
        // Trigger barcode generation if auto-generate is enabled
        if (autoGenerate && templateConfig.data.trim()) {
            const errors = validateBarcodeData(templateConfig.data, templateConfig.format.format as BarcodeFormat);
            if (errors.length === 0) {
                // Use setTimeout to ensure state is updated before generating
                setTimeout(() => {
                    generateBarcode();
                }, 0);
            }
        }
    };

    useEffect(() => {
        if (autoGenerate && config.data.trim()) {
            const errors = validateBarcodeData(config.data, config.format.format as BarcodeFormat);
            if (errors.length === 0) {
                generateBarcode();
            }
        }
    }, [config, autoGenerate]);

    const generateBarcode = async () => {
        if (!config.data.trim()) return;

        const errors = validateBarcodeData(config.data, config.format.format as BarcodeFormat);
        if (errors.length > 0) {
            showValidationNotification(errors);
            return;
        }

        try {
            setIsGenerating(true);
            const dataUrl = await getBarcodeResultAsBase64DataUrl(config);
            setGeneratedBarcode(dataUrl);
        } catch (error) {
            console.error('Error generating barcode:', error);
            showValidationNotification(['Error generating barcode. Please check your configuration.']);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadBarcode = async () => {
        if (!generatedBarcode) return;

        try {
            setIsDownloading(true);
            setDownloadSuccess(false);
            const response = await fetch(generatedBarcode);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const path = await save({
                filters: [
                    {
                        name: 'PNG',
                        extensions: ['png'],
                    },
                ],
                defaultPath: `barcode-${config.data || 'generated'}.png`,
            });

            if (path) {
                await writeFile(path, uint8Array);
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 3000);
            }

        } catch (error) {
            console.error('Download failed:', error);
            showValidationNotification(['Download failed. Please try again.']);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ValidationNotification
                showNotification={showNotification}
                validationErrors={validationErrors}
                onClose={() => setShowNotification(false)}
            />

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

                    <BarcodeDataInput
                        data={config.data}
                        format={config.format.format}
                        validationErrors={validationErrors}
                        onDataChange={handleDataChange}
                    />

                    <TemplateManager
                        currentConfig={config}
                        currentFormat={config.format.format as BarcodeFormat}
                        onLoadTemplate={handleLoadTemplate}
                        onTemplatesUpdated={() => {
                            console.log('Templates updated');
                            //not useful for now
                        }}
                    />

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

                    <DimensionsConfig
                        dimensions={config.dimensions}
                        format={config.format.format}
                        onDimensionsChange={handleDimensionsChange}
                    />

                    <TextStyleConfig
                        texts={config.texts}
                        onTextChange={handleTextChange}
                        onColorChange={handleColorChange}
                        onAddText={addText}
                        onRemoveText={removeText}
                    />

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

                <BarcodePreview
                    generatedBarcode={generatedBarcode}
                    autoGenerate={autoGenerate}
                    isGenerating={isGenerating}
                    isDownloading={isDownloading}
                    downloadSuccess={downloadSuccess}
                    onGenerate={generateBarcode}
                    onDownload={downloadBarcode}
                />
            </div>
        </div>
    );
};

export default Home; 