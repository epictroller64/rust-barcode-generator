use crate::generator::barcode_config::BarcodeConfig;
use uuid::Uuid;

// Create templates for barcodes which contain all the configurations for the barcode.
// This allows for bulk generation of barcodes etc
#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct Template {
    pub config: BarcodeConfig,
    pub name: String,
    pub description: String,
    pub id: String,
}

impl Template {
    pub fn new(config: BarcodeConfig, name: String, description: String) -> Self {
        Self {
            config,
            name,
            description,
            id: Uuid::new_v4().to_string(),
        }
    }

    pub fn with_id(config: BarcodeConfig, name: String, description: String, id: String) -> Self {
        Self {
            config,
            name,
            description,
            id,
        }
    }

    pub fn from_config(self, config: BarcodeConfig) -> Self {
        Self { config, ..self }
    }

    pub fn generate_new_id(&mut self) {
        self.id = Uuid::new_v4().to_string();
    }
}
