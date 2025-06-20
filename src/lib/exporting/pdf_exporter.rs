use ::image::ImageFormat;
use image::{ImageBuffer, ImageEncoder, Rgb, RgbImage};
use std::io::Cursor;

use crate::{
    generator::GeneratedBarcode,
    image_editor::{ImageEditor, Side},
};

pub struct PdfExporter {}

impl PdfExporter {
    pub fn new() -> Self {
        Self {}
    }

    pub fn create_pdf(&self, barcodes: Vec<GeneratedBarcode>) -> Vec<u8> {
        self.create_barcode_grid_image(barcodes)
    }

    fn create_grid(&self) {}

    pub fn create_barcode_grid_image(&self, barcodes: Vec<GeneratedBarcode>) -> Vec<u8> {
        let image_width = 2480; // A4 width at 300 DPI
        let image_height = 3508; // A4 height at 300 DPI

        let first_barcode = barcodes.first().unwrap();
        let barcode_width = first_barcode.buffer.width();
        let barcode_height = first_barcode.buffer.height();

        // Grid layout parameters
        let margin = 20; // Margin from image edges in pixels
        let spacing = 0; // Spacing between barcodes in pixels

        // Calculate grid dimensions
        let cols = (image_width - 2 * margin) / (barcode_width + spacing) as u32;
        let cols = cols.max(1); // At least 1 column

        // Create a white background image
        let mut image = RgbImage::new(image_width, image_height);
        for pixel in image.pixels_mut() {
            *pixel = Rgb([255, 255, 255]); // White background
        }

        let image_editor = ImageEditor::new();
        for (index, barcode) in barcodes.iter().enumerate() {
            // Calculate grid position
            let row = index as u32 / cols;
            let col = index as u32 % cols;

            println!("Row: {}, col: {}", row, col);

            // Calculate position in pixels
            let x = margin + col * (barcode_width + spacing);
            let y = margin + row * (barcode_height + spacing);

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

            if row == 0 {
                image_editor.add_border(
                    &mut resized_barcode,
                    1,
                    Rgb([255, 0, 0]),
                    vec![Side::Top, Side::Bottom],
                );
            } else {
                image_editor.add_border(
                    &mut resized_barcode,
                    1,
                    Rgb([255, 0, 0]),
                    vec![Side::Bottom],
                );
            }

            if col == 0 {
                // Row changed, add border to left side of the barcode
                image_editor.add_border(
                    &mut resized_barcode,
                    1,
                    Rgb([255, 0, 0]),
                    vec![Side::Left],
                );
            }
            if col <= cols - 1 {
                image_editor.add_border(
                    &mut resized_barcode,
                    1,
                    Rgb([255, 0, 0]),
                    vec![Side::Right],
                );
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
