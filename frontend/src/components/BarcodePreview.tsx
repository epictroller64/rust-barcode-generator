import React from 'react';

interface BarcodePreviewProps {
    generatedBarcode: string;
    autoGenerate: boolean;
    isGenerating: boolean;
    isDownloading: boolean;
    downloadSuccess: boolean;
    onGenerate: () => void;
    onDownload: () => void;
}

const BarcodePreview: React.FC<BarcodePreviewProps> = ({
    generatedBarcode,
    autoGenerate,
    isGenerating,
    isDownloading,
    downloadSuccess,
    onGenerate,
    onDownload
}) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Preview</h2>
                {!autoGenerate && (
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating}
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
                            onClick={onDownload}
                            disabled={isDownloading}
                            className={`mt-4 px-6 py-3 font-semibold rounded-lg cursor-pointer transition-colors duration-200 ${downloadSuccess
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : isDownloading
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                        >
                            {downloadSuccess ? (
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Downloaded!
                                </span>
                            ) : isDownloading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Downloading...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Download PNG
                                </span>
                            )}
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
    );
};

export default BarcodePreview; 