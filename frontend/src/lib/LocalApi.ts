import { invoke } from "@tauri-apps/api/core";
import type { BarcodeConfig, JsonResponse, Template } from "./interfaces";

export const LocalApi = {
    generateBarcode: async (config: BarcodeConfig) => {
        const result = await invoke('generate_barcode', { config });
        return result as ArrayBuffer;
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
    }
}