use image::Rgb;
use zxingcpp::BarcodeFormat;

use crate::generator::barcode_config::BarcodeConfigBuilder;
use crate::generator::barcode_config::TextPosition;
use crate::generator::generator::GeneratedBarcode;
use crate::generator::generator::Generator;
// Generate barcodes in bulk and export to file
use crate::generator::importer::BarcodeImportRowCSV;

pub struct BulkGenerator {
    output_dir: String,
}

impl BulkGenerator {
    pub fn new() -> Self {
        Self {
            output_dir: "output".to_string(),
        }
    }

    pub fn generate_barcodes(
        &self,
        barcodes: Vec<BarcodeImportRowCSV>,
    ) -> anyhow::Result<Vec<GeneratedBarcode>> {
        self.generate_barcodes_with_dpi(barcodes, 300.0)
    }

    pub fn generate_barcodes_with_dpi(
        &self,
        barcodes: Vec<BarcodeImportRowCSV>,
        dpi: f32,
    ) -> anyhow::Result<Vec<GeneratedBarcode>> {
        let generator = Generator::new();

        let mut generated_barcodes: Vec<GeneratedBarcode> = Vec::new();

        for barcode in barcodes {
            let mut config_builder = BarcodeConfigBuilder::new();
            config_builder.set_format(BarcodeFormat::Code39);
            // Add upper text if not empty
            if !barcode.upper_center_text.is_empty() {
                config_builder.add_text(
                    barcode.upper_center_text.as_str(),
                    Rgb([255, 0, 0]),
                    barcode.font_size,
                    TextPosition::UpperCenter,
                );
            }

            // Add lower text if not empty
            if !barcode.lower_center_text.is_empty() {
                config_builder.add_text(
                    barcode.lower_center_text.as_str(),
                    Rgb([255, 0, 0]),
                    barcode.font_size,
                    TextPosition::LowerCenter,
                );
            }

            config_builder.set_scale(barcode.scale);
            config_builder.resize_height_percentage(barcode.height_percentage);
            config_builder.resize_width_percentage(barcode.width_percentage);

            let mut config = config_builder.build();
            config.data = barcode.value.clone();
            let internal_config: crate::generator::barcode_config::BarcodeConfigInternal =
                config.into();
            let generated_barcode = generator.generate_barcode_png_with_dpi(
                barcode.value.as_str(),
                internal_config,
                &format!("{}/{}.png", self.output_dir, barcode.value),
                dpi,
            )?;
            generated_barcodes.push(generated_barcode);
        }
        Ok(generated_barcodes)
    }
}
