import { invoke } from "@tauri-apps/api/core";
import type { BarcodeConfig, BarcodeImportRowCSV, JsonResponse, Layout, Template } from "./interfaces";

export const LocalApi = {
    generateBarcode: async (config: BarcodeConfig) => {
        const result = await invoke('generate_barcode', { config });
        return result as ArrayBuffer;
    },
    getLayout: async () => {
        const result = await invoke('get_layout');
        return result as JsonResponse<Layout>;
    },
    saveTemplate: async (template: Template) => {
        const result = await invoke('save_template', { template });
        return result as JsonResponse<Template>;
    },
    getTemplates: async () => {
        const result = await invoke('get_templates');
        return result as JsonResponse<Template[]>;
    },
    getTemplate: async (id: string) => {
        const result = await invoke('get_template', { id });
        return result as JsonResponse<Template>;
    },
    deleteTemplate: async (id: string) => {
        const result = await invoke('delete_template', { id });
        return result as JsonResponse<void>;
    },
    submitFile: async (bytes: number[]) => {
        const result = await invoke('import_barcodes_csv', { fileBytes: bytes })
        return result as JsonResponse<void>
    },
    getImportedBarcodes: async () => {
        const result = await invoke('get_imported_barcodes')
        return result as JsonResponse<BarcodeImportRowCSV[]>
    }
}