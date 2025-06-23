use crate::generator::{barcode_config::BarcodeConfig, database::Database};
use uuid::Uuid;

const TEMPLATES_PATH: &str = "templates.json";

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

pub fn save_template(template: Template) -> anyhow::Result<()> {
    let db = Database::new(TEMPLATES_PATH.to_string());
    let result = db.save_template(&template);
    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(anyhow::anyhow!("Failed to save template: {}", e)),
    }
}

pub fn get_templates() -> anyhow::Result<Vec<Template>> {
    let db = Database::new(TEMPLATES_PATH.to_string());
    let result = db.load_templates();
    match result {
        Ok(templates) => Ok(templates.values().cloned().collect()),
        Err(e) => {
            eprintln!("Failed to load templates: {}", e);
            Err(anyhow::anyhow!("Failed to load templates: {}", e))
        }
    }
}

pub fn get_template(id: String) -> anyhow::Result<Template> {
    let db = Database::new(TEMPLATES_PATH.to_string());
    let result = db.load_template(&id);
    match result {
        Ok(Some(template)) => Ok(template),
        Ok(None) => Err(anyhow::anyhow!("Template not found")),
        Err(e) => Err(anyhow::anyhow!("Failed to load template: {}", e)),
    }
}

pub fn delete_template(id: &str) -> anyhow::Result<()> {
    let db = Database::new(TEMPLATES_PATH.to_string());
    let result = db.delete_template(id);
    match result {
        Ok(_) => Ok(()),
        Err(e) => Err(anyhow::anyhow!("Failed to delete template: {}", e)),
    }
}
