use image::Rgb;

use crate::barcode_config::BarcodeConfigBuilder;
use crate::barcode_config::TextPosition;
use crate::generator::Generator;
// Generate barcodes in bulk and export to file
use crate::importer::BarcodeImportRowCSV;
use crate::importer::Importer;

pub struct BulkGenerator {
    output_dir: String,
}

impl BulkGenerator {
    pub fn new() -> Self {
        Self {
            output_dir: "output".to_string(),
        }
    }

    pub fn generate_barcodes_from_csv(&self, file_path: &str) -> anyhow::Result<()> {
        let importer = Importer::new();
        let barcodes = importer.import_from_csv(file_path)?;
        self.generate_barcodes(barcodes)
    }

    pub fn generate_barcodes(&self, barcodes: Vec<BarcodeImportRowCSV>) -> anyhow::Result<()> {
        let generator = Generator::new();

        for barcode in barcodes {
            let mut config_builder = BarcodeConfigBuilder::new();

            // Add upper text if not empty
            if !barcode.upper_center_text.is_empty() {
                config_builder = config_builder.add_text(
                    barcode.upper_center_text.as_str(),
                    Rgb([255, 0, 0]),
                    barcode.font_size,
                    TextPosition::UpperCenter,
                );
            }

            // Add lower text if not empty
            if !barcode.lower_center_text.is_empty() {
                config_builder = config_builder.add_text(
                    barcode.lower_center_text.as_str(),
                    Rgb([255, 0, 0]),
                    barcode.font_size,
                    TextPosition::LowerCenter,
                );
            }

            config_builder = config_builder.set_scale(barcode.scale);
            config_builder = config_builder.resize_height_percentage(barcode.height_percentage);
            config_builder = config_builder.resize_width_percentage(barcode.width_percentage);

            let config = config_builder.build();
            generator.generate_barcode_png(
                barcode.value.as_str(),
                config,
                &format!("{}/{}.png", self.output_dir, barcode.value),
            )?;
        }
        Ok(())
    }
}
