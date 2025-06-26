use csv::ReaderBuilder;
use serde::{Deserialize, Serialize};
use std::{fs::File, io::Cursor};
pub struct Importer {}

impl Importer {
    pub fn new() -> Self {
        Self {}
    }

    pub fn import_from_csv_bytes(
        &self,
        bytes: Vec<u8>,
    ) -> anyhow::Result<Vec<BarcodeImportRowCSV>> {
        let cursor = Cursor::new(bytes);
        let mut reader = ReaderBuilder::new().has_headers(true).from_reader(cursor);
        let mut barcodes = Vec::new();
        for result in reader.deserialize() {
            // Notice that we need to provide a type hint for automatic
            // deserialization.
            let record: BarcodeImportRowCSV = result?;
            barcodes.push(record);
        }
        Ok(barcodes)
    }
    // Read CSV file and return barcodes. Later add rest of the configuration data.
    // Read: Value
    pub fn import_from_csv(&self, file_path: &str) -> anyhow::Result<Vec<BarcodeImportRowCSV>> {
        let file = File::open(file_path).unwrap();
        let mut rdr = csv::Reader::from_reader(file);
        let mut barcodes = Vec::new();
        for result in rdr.deserialize() {
            // Notice that we need to provide a type hint for automatic
            // deserialization.
            let record: BarcodeImportRowCSV = result?;
            barcodes.push(record);
        }
        Ok(barcodes)
    }
}

#[derive(Deserialize, Debug, Serialize, Clone)]
pub struct BarcodeImportRowCSV {
    pub value: String,
    pub upper_center_text: String,
    pub lower_center_text: String,
    pub scale: i32,
    pub height_percentage: f32,
    pub width_percentage: f32,
    pub font_size: u32,
}
