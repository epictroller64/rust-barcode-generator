import type { BarcodeConfig, BarcodeFormat } from "./interfaces";
import { LocalApi } from "./LocalApi";
import { validationRules } from "./validationRules";

export const validateBarcodeData = (data: string, format: BarcodeFormat): string[] => {
    const rule = validationRules.find(r => r.format === format);
    if (!rule) return [];

    const errors: string[] = [];

    if (data.length < rule.minLength) {
        errors.push(`${format} requires at least ${rule.minLength} characters`);
    }
    if (data.length > rule.maxLength) {
        errors.push(`${format} supports maximum ${rule.maxLength} characters`);
    }

    if (!rule.allowedCharactersRegex.test(data)) {
        if (rule.allowedCharacters.length > 0) {
            errors.push(`${format} only supports: ${rule.allowedCharacters.join(', ')}`);
        } else {
            errors.push(`${format} contains invalid characters`);
        }
    }

    return errors;
};

// Get the barcode result or get thrown error if it fails. Needs attention for error handling.
export const getBarcodeResultAsBase64DataUrl = async (config: BarcodeConfig) => {
    const result = await LocalApi.generateBarcode(config);
    const arrayBuffer = result as ArrayBuffer;
    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    const base64String = btoa(binaryString);
    const dataUrl = `data:image/png;base64,${base64String}`;
    return dataUrl;
}