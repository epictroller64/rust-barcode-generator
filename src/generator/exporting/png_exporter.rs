use ::image::ImageFormat;
use image::{Rgb, RgbImage};
use std::io::Cursor;

use crate::generator::{
    exporting::paper,
    generator::GeneratedBarcode,
    image_editor::{ImageEditor, Side},
    layout::Layout,
};

pub struct ExportResult {
    pub pages: Vec<Vec<u8>>,
}

pub struct GenerationResult {
    pub page: Vec<u8>,
    pub used_barcodes: Vec<GeneratedBarcode>,
    pub has_more: bool,
    pub cursor: u32,
}

pub struct PngExporter {
    pub layout: Layout,
}

impl PngExporter {
    pub fn new(layout: Layout) -> Self {
        Self { layout }
    }

    // Creates single export page for preview
    pub fn create_export_preview(
        &self,
        barcodes: &[GeneratedBarcode],
    ) -> anyhow::Result<GenerationResult> {
        // Figure out creating multiple pages
        self.create_export_image(barcodes, 0)
    }

    pub fn create_full_export(
        &self,
        barcodes: &[GeneratedBarcode],
    ) -> anyhow::Result<Vec<GenerationResult>> {
        let mut has_more = true;
        let mut cursor = 0;
        let mut generation_results: Vec<GenerationResult> = Vec::new();
        while has_more {
            let generation_result = self.create_export_image(barcodes, cursor);
            match generation_result {
                Ok(result) => {
                    has_more = result.has_more;
                    cursor = result.cursor;
                    generation_results.push(result);
                }
                Err(_) => {}
            }
        }
        Ok(generation_results)
    }

    fn calculate_auto_margins(
        &self,
        barcode_width: u32,
        barcode_height: u32,
        image_width: u32,
        image_height: u32,
        cols: u32,
    ) -> (u32, u32) {
        let max_rows = image_height / barcode_height;
        // get remaining whitespace after calculating total item width
        let total_w = barcode_width * cols;
        let total_h = barcode_height * max_rows;
        let remaining_w = image_width - total_w;
        let remaining_h = image_height - total_h;
        let margin_x = remaining_w / 2;
        let margin_y = remaining_h / 2;
        (margin_x, margin_y)
    }

    fn calculate_max_barcodes(
        &self,
        cols: u32,
        margin_y: u32,
        spacing: u32,
        barcode_height: u32,
        paper_height: u32,
    ) -> u32 {
        // Cols are already calculated, we gotta calculate rows
        let free_height = (paper_height as f32) - (margin_y as f32 * 2.0);
        let row_height = barcode_height as f32 + spacing as f32;
        let total_rows_f: f32 = free_height / row_height;
        let total_rows = total_rows_f.floor() as u32;
        total_rows * cols
    }

    fn create_export_image(
        &self,
        barcodes: &[GeneratedBarcode],
        cursor: u32,
    ) -> anyhow::Result<GenerationResult> {
        let (image_width, image_height) = paper::get_paper_dimensions_px(&self.layout.paper);

        let minimum_margin = 0;
        let spacing = 0; // Spacing between barcodes in pixels
                         // Grid layout parameters
        let first_barcode = barcodes.first().unwrap();
        let barcode_width = first_barcode.buffer.width();
        let barcode_height = first_barcode.buffer.height();

        // Calculate grid dimensions
        let cols = (image_width - 2 * minimum_margin) / (barcode_width + spacing) as u32;
        let cols = cols.max(1); // At least 1 column
        let (margin_x, margin_y) = if self.layout.auto_margin {
            self.calculate_auto_margins(
                barcode_width,
                barcode_height,
                image_width,
                image_height,
                cols,
            )
        }
        // Margin from image edges in pixels
        else {
            (20 as u32, 20 as u32)
        };
        let max_barcodes =
            self.calculate_max_barcodes(cols, margin_y, spacing, barcode_height, image_height);
        // Create a white background image
        let mut image = RgbImage::new(image_width, image_height);
        for pixel in image.pixels_mut() {
            *pixel = Rgb([255, 255, 255]); // White background
        }

        let image_editor = ImageEditor::new();
        let border_color = Rgb([211, 211, 211]);
        let mut current_barcode_index: u32 = cursor;
        let mut used_barcodes: Vec<GeneratedBarcode> = Vec::new();
        for (index, barcode) in barcodes[cursor as usize..].iter().enumerate() {
            // Calculate grid position
            let row = index as u32 / cols;
            let col = index as u32 % cols;

            println!("Row: {}, col: {}", row, col);

            // Calculate position in pixels
            let x = margin_x + col * (barcode_width + spacing);
            let y = margin_y + row * (barcode_height + spacing);

            // Convert Luma image to RGB
            let rgb_barcode = image::DynamicImage::ImageLuma8(barcode.buffer.clone()).to_rgb8();

            // Resize barcode to fit the target size while maintaining aspect ratio
            let barcode_scale_x = barcode_width as f32 / rgb_barcode.width() as f32;
            let barcode_scale_y = barcode_height as f32 / rgb_barcode.height() as f32;
            let scale = barcode_scale_x.min(barcode_scale_y);

            let new_width = (rgb_barcode.width() as f32 * scale) as u32;
            let new_height = (rgb_barcode.height() as f32 * scale) as u32;

            let mut resized_barcode = image::imageops::resize(
                &rgb_barcode,
                new_width,
                new_height,
                image::imageops::FilterType::Nearest,
            );

            if self.layout.grid_borders {
                if row == 0 {
                    image_editor.add_border(
                        &mut resized_barcode,
                        1,
                        border_color,
                        vec![Side::Top, Side::Bottom],
                    );
                } else {
                    image_editor.add_border(
                        &mut resized_barcode,
                        1,
                        border_color,
                        vec![Side::Bottom],
                    );
                }

                if col == 0 {
                    // Row changed, add border to left side of the barcode
                    image_editor.add_border(
                        &mut resized_barcode,
                        1,
                        border_color,
                        vec![Side::Left],
                    );
                }
                if col <= cols - 1 {
                    image_editor.add_border(
                        &mut resized_barcode,
                        1,
                        border_color,
                        vec![Side::Right],
                    );
                }
            }
            // Center the barcode in its allocated space
            let offset_x = x + (barcode_width - new_width) / 2;
            let offset_y = y + (barcode_height - new_height) / 2;

            // Paste the barcode onto the main image
            image::imageops::replace(
                &mut image,
                &resized_barcode,
                offset_x.max(0).into(),
                offset_y.max(0).into(),
            );
            used_barcodes.push(barcode.clone());
            current_barcode_index += 1;
            if index as u32 == max_barcodes {
                //Limit reached exit loop and send cursor
                break;
            }
        }
        let has_more = if current_barcode_index < barcodes.len() as u32 {
            true
        } else {
            false
        };
        // Convert to PNG bytes
        let mut png_bytes = Vec::new();
        image
            .write_to(&mut Cursor::new(&mut png_bytes), ImageFormat::Png)
            .unwrap();

        Ok(GenerationResult {
            used_barcodes,
            page: png_bytes,
            has_more: has_more,
            cursor: current_barcode_index,
        })
    }
}
