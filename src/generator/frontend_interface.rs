use serde::Serialize;

use crate::generator::{
    barcode_config::BarcodeConfig,
    generator::Generator,
    importer::{BarcodeImportRowCSV, Importer},
    templates::{self, Template},
};

// COntains everything needed to communicate with frontend
#[derive(Clone)]
pub struct FrontendInterface {}

impl FrontendInterface {
    pub fn new() -> FrontendInterface {
        Self {}
    }

    pub fn generate_barcode(&self, config: BarcodeConfig) -> anyhow::Result<Vec<u8>> {
        let generator = Generator::new();

        // Generate a temporary filename
        let temp_filename = format!(
            "temp_barcode_{}.png",
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis()
        );

        // Convert the serializable config to internal config
        let internal_config: crate::generator::barcode_config::BarcodeConfigInternal =
            config.into();

        let generated_barcode = generator
            .generate_barcode_png(
                &internal_config.data.clone(),
                internal_config,
                &temp_filename,
            )
            .unwrap();

        let mut png_bytes = Vec::new();
        generated_barcode
            .buffer
            .write_with_encoder(image::codecs::png::PngEncoder::new(&mut png_bytes))
            .map_err(|e| e.to_string())
            .unwrap();

        // Clean up the temporary file
        let _ = std::fs::remove_file(&temp_filename);
        Ok(png_bytes)
    }

    pub fn save_template(&self, template: Template) -> JsonResponse {
        let result = templates::save_template(template);
        match result {
            Ok(_) => JsonResponse {
                success: true,
                message: "Successfully saved template".to_string(),
                data: None,
            },
            Err(e) => JsonResponse {
                success: false,
                message: e.to_string(),
                data: None,
            },
        }
    }

    pub fn delete_template(&self, id: String) -> JsonResponse {
        let result = templates::delete_template(&id);
        match result {
            Ok(_) => JsonResponse {
                success: true,
                message: "Template deleted successfully".to_string(),
                data: None,
            },
            Err(e) => JsonResponse {
                success: false,
                message: e.to_string(),
                data: None,
            },
        }
    }

    pub fn get_templates(&self) -> JsonResponse {
        let template_response = templates::get_templates();
        match template_response {
            Ok(templates) => JsonResponse {
                success: true,
                message: "Templates fetched successfully".to_string(),
                data: Some(serde_json::to_value(&templates).unwrap()),
            },
            Err(e) => JsonResponse {
                success: false,
                message: e.to_string(),
                data: None,
            },
        }
    }

    // Import barcodes from CSV to Tauri state (send back from interface to tauri thread and thens ave it)
    pub fn import_from_csv(&self, file_bytes: Vec<u8>) -> anyhow::Result<Vec<BarcodeImportRowCSV>> {
        let importer = Importer::new();
        let barcodes_result = importer.import_from_csv_bytes(file_bytes);
        barcodes_result
    }

    pub fn get_template(&self, id: String) -> JsonResponse {
        let template_response = templates::get_template(id);
        match template_response {
            Ok(template) => JsonResponse {
                success: true,
                message: "Template fetched successfully".to_string(),
                data: Some(serde_json::to_value(&template).unwrap()),
            },
            Err(e) => JsonResponse {
                success: false,
                message: e.to_string(),
                data: None,
            },
        }
    }
}

#[derive(Serialize)]
pub struct JsonResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<serde_json::Value>,
}
