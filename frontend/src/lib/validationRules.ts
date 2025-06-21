import { BarcodeFormat } from "./interfaces"


type ValidationRule = {
    format:BarcodeFormat 
    maxLength: number
    minLength: number
    allowedCharacters: string[]
    allowedCharactersRegex: RegExp
    dimensions: 'square' | 'rectangular'
}

export const validationRules: ValidationRule[] = [
    {
        format: BarcodeFormat.Code128,
        maxLength: 99,
        minLength: 1,
        allowedCharacters: [],
        allowedCharactersRegex: /^[A-Za-z0-9\s\-\.\/\+\%]+$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.Code39,
        maxLength: 43,
        minLength: 1,
        allowedCharacters: ['0-9', 'A-Z', '-', '.', ' ', '$', '/', '+', '%'],
        allowedCharactersRegex: /^[0-9A-Z\-\s\.\$\/\+\%]+$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.QRCode,
        maxLength: 2953,
        minLength: 1,
        allowedCharacters: [],
        allowedCharactersRegex: /^[\x00-\xFF]+$/,
        dimensions: 'square'
    },
    {
        format: BarcodeFormat.EAN13,
        maxLength: 13,
        minLength: 13,
        allowedCharacters: ['0-9'],
        allowedCharactersRegex: /^[0-9]{13}$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.EAN8,
        maxLength: 8,
        minLength: 8,
        allowedCharacters: ['0-9'],
        allowedCharactersRegex: /^[0-9]{8}$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.UPCA,
        maxLength: 12,
        minLength: 12,
        allowedCharacters: ['0-9'],
        allowedCharactersRegex: /^[0-9]{12}$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.UPCE,
        maxLength: 8,
        minLength: 8,
        allowedCharacters: ['0-9'],
        allowedCharactersRegex: /^[0-9]{8}$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.DataMatrix,
        maxLength: 2335,
        minLength: 1,
        allowedCharacters: [],
        allowedCharactersRegex: /^[\x00-\xFF]+$/,
        dimensions: 'square'
    },
    {
        format: BarcodeFormat.PDF417,
        maxLength: 1850,
        minLength: 1,
        allowedCharacters: [],
        allowedCharactersRegex: /^[\x00-\xFF]+$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.Aztec,
        maxLength: 3832,
        minLength: 1,
        allowedCharacters: [],
        allowedCharactersRegex: /^[\x00-\xFF]+$/,
        dimensions: 'square'
    },
    {
        format: BarcodeFormat.Codabar,
        maxLength: 20,
        minLength: 4,
        allowedCharacters: ['0-9', 'A-D', '-', '.', '/', ':', '+', '$'],
        allowedCharactersRegex: /^[0-9A-D\-\s\.\/\:\+\$]+$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.Code93,
        maxLength: 48,
        minLength: 1,
        allowedCharacters: ['0-9', 'A-Z', '-', '.', ' ', '$', '/', '+', '%'],
        allowedCharactersRegex: /^[0-9A-Z\-\s\.\$\/\+\%]+$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.DataBar,
        maxLength: 14,
        minLength: 14,
        allowedCharacters: ['0-9'],
        allowedCharactersRegex: /^[0-9]{14}$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.DataBarExpanded,
        maxLength: 74,
        minLength: 4,
        allowedCharacters: ['0-9', 'A-Z', '-', '.', ' ', '$', '/', '+', '%'],
        allowedCharactersRegex: /^[0-9A-Z\-\s\.\$\/\+\%]+$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.DataBarLimited,
        maxLength: 14,
        minLength: 14,
        allowedCharacters: ['0-9'],
        allowedCharactersRegex: /^[0-9]{14}$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.ITF,
        maxLength: 14,
        minLength: 2,
        allowedCharacters: ['0-9'],
        allowedCharactersRegex: /^[0-9]+$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.MaxiCode,
        maxLength: 150,
        minLength: 1,
        allowedCharacters: [],
        allowedCharactersRegex: /^[\x00-\xFF]+$/,
        dimensions: 'square'
    },
    {
        format: BarcodeFormat.MicroQRCode,
        maxLength: 35,
        minLength: 1,
        allowedCharacters: [],
        allowedCharactersRegex: /^[\x00-\xFF]+$/,
        dimensions: 'square'
    },
    {
        format: BarcodeFormat.RMQRCode,
        maxLength: 3617,
        minLength: 1,
        allowedCharacters: [],
        allowedCharactersRegex: /^[\x00-\xFF]+$/,
        dimensions: 'rectangular'
    },
    {
        format: BarcodeFormat.DXFilmEdge,
        maxLength: 6,
        minLength: 6,
        allowedCharacters: ['0-9'],
        allowedCharactersRegex: /^[0-9]{6}$/,
        dimensions: 'rectangular'
    }
]