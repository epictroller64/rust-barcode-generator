use ::image::ImageFormat;
use image::{Rgb, RgbImage};
use std::io::Cursor;

use crate::generator::{
    exporting::paper::{self, Paper},
    generator::GeneratedBarcode,
    image_editor::{ImageEditor, Side},
};

pub struct PdfExportConfig {
    pub use_grid: bool,
    pub auto_margin: bool,
    pub paper: Paper,
}

pub struct PdfExporter {
    pub config: PdfExportConfig,
}

impl PdfExporter {
    pub fn new(config: PdfExportConfig) -> Self {
        Self { config }
    }

    // Its actually pNG
    pub fn create_pdf(&self, barcodes: Vec<GeneratedBarcode>) -> Vec<u8> {
        self.create_barcode_grid_image(barcodes)
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
    pub fn create_barcode_grid_image(&self, barcodes: Vec<GeneratedBarcode>) -> Vec<u8> {
        let (image_width, image_height) = paper::get_paper_dimensions_px(&self.config.paper);

        let minimum_margin = 0;
        let spacing = 0; // Spacing between barcodes in pixels
                         // Grid layout parameters
        let first_barcode = barcodes.first().unwrap();
        let barcode_width = first_barcode.buffer.width();
        let barcode_height = first_barcode.buffer.height();

        // Calculate grid dimensions
        let cols = (image_width - 2 * minimum_margin) / (barcode_width + spacing) as u32;
        let cols = cols.max(1); // At least 1 column
        let (margin_x, margin_y) = if self.config.auto_margin {
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
        // Create a white background image
        let mut image = RgbImage::new(image_width, image_height);
        for pixel in image.pixels_mut() {
            *pixel = Rgb([255, 255, 255]); // White background
        }

        let image_editor = ImageEditor::new();
        let border_color = Rgb([211, 211, 211]);
        for (index, barcode) in barcodes.iter().enumerate() {
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

            if self.config.use_grid {
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
        }

        // Convert to PNG bytes
        let mut png_bytes = Vec::new();
        image
            .write_to(&mut Cursor::new(&mut png_bytes), ImageFormat::Png)
            .unwrap();

        png_bytes
    }
}
