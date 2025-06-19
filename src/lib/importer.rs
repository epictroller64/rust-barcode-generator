use serde::Deserialize;
use std::fs::File;
pub struct Importer {}

impl Importer {
    pub fn new() -> Self {
        Self {}
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
        println!("{:?}", barcodes);
        Ok(barcodes)
    }
}

#[derive(Deserialize, Debug)]
pub struct BarcodeImportRowCSV {
    pub value: String,
    pub upper_center_text: String,
    pub lower_center_text: String,
    pub scale: i32,
    pub height_percentage: f32,
    pub width_percentage: f32,
    pub font_size: u32,
}
