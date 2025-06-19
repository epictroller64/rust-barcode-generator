use ::image::ImageFormat;
use image::{ImageBuffer, Rgb, RgbImage};
use std::io::Cursor;

use crate::generator::GeneratedBarcode;

pub struct PdfExporter {}

impl PdfExporter {
    pub fn new() -> Self {
        Self {}
    }

    pub fn create_pdf(&self, barcodes: Vec<GeneratedBarcode>) -> Vec<u8> {
        // For now, let's create a PNG image instead
        self.create_barcode_grid_image(barcodes)
    }

    pub fn create_barcode_grid_image(&self, barcodes: Vec<GeneratedBarcode>) -> Vec<u8> {
        // Image dimensions in pixels (high resolution for good quality)
        let image_width = 2480; // A4 width at 300 DPI
        let image_height = 3508; // A4 height at 300 DPI

        let first_barcode = barcodes.first().unwrap();
        let barcode_width = first_barcode.buffer.width();
        let barcode_height = first_barcode.buffer.height();

        // Grid layout parameters
        let margin = 40; // Margin from image edges in pixels
        let spacing = 40; // Spacing between barcodes in pixels

        // Calculate grid dimensions
        let cols = (image_width - 2 * margin) / (barcode_width + spacing);
        let cols = cols.max(1) as usize; // At least 1 column

        // Create a white background image
        let mut image = RgbImage::new(image_width, image_height);
        for pixel in image.pixels_mut() {
            *pixel = Rgb([255, 255, 255]); // White background
        }

        for (index, barcode) in barcodes.iter().enumerate() {
            // Calculate grid position
            let row = index / cols;
            let col = index % cols;

            // Calculate position in pixels
            let x = margin + col as u32 * (barcode_width + spacing);
            let y = margin + row as u32 * (barcode_height + spacing);

            // Convert Luma image to RGB
            let rgb_barcode = image::DynamicImage::ImageLuma8(barcode.buffer.clone()).to_rgb8();

            // Resize barcode to fit the target size while maintaining aspect ratio
            let barcode_scale_x = barcode_width as f32 / rgb_barcode.width() as f32;
            let barcode_scale_y = barcode_height as f32 / rgb_barcode.height() as f32;
            let scale = barcode_scale_x.min(barcode_scale_y);

            let new_width = (rgb_barcode.width() as f32 * scale) as u32;
            let new_height = (rgb_barcode.height() as f32 * scale) as u32;

            let resized_barcode = image::imageops::resize(
                &rgb_barcode,
                new_width,
                new_height,
                image::imageops::FilterType::Nearest,
            );

            // Center the barcode in its allocated space
            let offset_x = x + (barcode_width as u32 - new_width as u32) / 2;
            let offset_y = y + (barcode_height as u32 - new_height as u32) / 2;

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
