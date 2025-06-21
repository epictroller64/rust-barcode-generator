// Handle database operations for templates
// Going to be simple JSON for now

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

pub struct Database {
    file_path: String,
}

impl Database {
    pub fn new(file_path: String) -> Self {
        Self { file_path }
    }

    pub fn save<T: Serialize>(&self, data: &T) -> Result<(), Box<dyn std::error::Error>> {
        let json = serde_json::to_string_pretty(data)?;
        fs::write(&self.file_path, json)?;
        Ok(())
    }

    pub fn load<T: DeserializeOwned>(&self) -> Result<T, Box<dyn std::error::Error>> {
        if !Path::new(&self.file_path).exists() {
            return Err("Database file does not exist".into());
        }

        let json = fs::read_to_string(&self.file_path)?;
        let data: T = serde_json::from_str(&json)?;
        Ok(data)
    }

    pub fn load_or_default<T: DeserializeOwned + Default>(
        &self,
    ) -> Result<T, Box<dyn std::error::Error>> {
        if !Path::new(&self.file_path).exists() {
            return Ok(T::default());
        }

        self.load()
    }

    pub fn exists(&self) -> bool {
        Path::new(&self.file_path).exists()
    }

    pub fn delete(&self) -> Result<(), Box<dyn std::error::Error>> {
        if self.exists() {
            fs::remove_file(&self.file_path)?;
        }
        Ok(())
    }
}

pub trait DeserializeOwned: for<'de> Deserialize<'de> {}

impl<T> DeserializeOwned for T where T: for<'de> Deserialize<'de> {}

impl Database {
    pub fn save_templates(
        &self,
        templates: &HashMap<String, crate::generator::templates::Template>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.save(templates)
    }

    pub fn load_templates(
        &self,
    ) -> Result<HashMap<String, crate::generator::templates::Template>, Box<dyn std::error::Error>>
    {
        self.load_or_default()
    }

    pub fn save_template(
        &self,
        template: &crate::generator::templates::Template,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut templates = self.load_templates().unwrap_or_default();
        templates.insert(template.id.clone(), template.clone());
        self.save_templates(&templates)
    }

    pub fn load_template(
        &self,
        id: &str,
    ) -> Result<Option<crate::generator::templates::Template>, Box<dyn std::error::Error>> {
        let templates = self.load_templates()?;
        Ok(templates.get(id).cloned())
    }

    pub fn delete_template(&self, id: &str) -> Result<(), Box<dyn std::error::Error>> {
        let mut templates = self.load_templates()?;
        templates.remove(id);
        self.save_templates(&templates)
    }

    pub fn list_templates(
        &self,
    ) -> Result<Vec<crate::generator::templates::Template>, Box<dyn std::error::Error>> {
        let templates = self.load_templates()?;
        Ok(templates.into_values().collect())
    }
}
