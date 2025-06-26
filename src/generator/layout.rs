use std::{fs::File, io::Write};

use serde::{Deserialize, Serialize};

use crate::generator::{
    barcode_config::BarcodeConfig,
    exporting::{paper::Paper, pdf_exporter::PdfExporter, png_exporter::PngExporter},
    generator::GeneratedBarcode,
};

#[derive(Serialize, Deserialize, PartialEq)]
pub enum ExportFile {
    PDF,
    PNG,
}

#[derive(Serialize, Deserialize)]
pub struct Layout {
    pub config: BarcodeConfig,
    pub max_rows: u32,
    pub max_cols: u32,
    pub paper: Paper,
    pub auto_margin: bool,
    pub grid_borders: bool,
    pub export_file: ExportFile,
}

pub struct ExportManager {}

// Handles placing barcodes on different papers
impl ExportManager {
    pub fn new() -> Self {
        Self {}
    }

    pub fn generate_export_pages(
        &self,
        layout: Layout,
        barcodes: Vec<GeneratedBarcode>,
    ) -> anyhow::Result<()> {
        match layout.export_file {
            ExportFile::PDF => {
                let pdf_exporter = PdfExporter::new();
                Ok(())
            }
            ExportFile::PNG => {
                let png_exporter = PngExporter::new(layout);
                let result = png_exporter.create_full_export(barcodes.as_slice());
                match result {
                    Ok(result) => {
                        // Temp solution - save images to
                        let mut index = 1;
                        for export in result {
                            let mut temp_file =
                                File::create(format!("/temp/export_{}.png", index))?;
                            temp_file.write_all(&export.page);
                            index += 1;
                        }
                        Ok(())
                    }
                    Err(e) => Err(e),
                }
            }
        }
    }

    // Create preview of one page to send back to frontend
    pub fn generate_export_preview(
        &self,
        layout: Layout,
        barcodes: Vec<GeneratedBarcode>,
    ) -> anyhow::Result<Vec<u8>> {
        match layout.export_file {
            ExportFile::PNG => {
                let png_exporter = PngExporter::new(layout);
                let result = png_exporter.create_export_preview(barcodes.as_slice());
                match result {
                    Ok(r) => Ok(r.page),
                    Err(e) => Err(e),
                }
            }
            ExportFile::PDF => {
                let pdf_exporter = PdfExporter::new();
                pdf_exporter.create_export_preview()
            }
        }
    }
}
