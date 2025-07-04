use anyhow::Ok;
use fontdue::Font;
use image::{DynamicImage, ImageBuffer, Luma, Rgb, RgbImage};
use std::fs;
use std::io::BufWriter;

use ab_glyph::{FontArc, PxScale};
use imageproc::drawing::draw_text_mut;

use crate::generator::{
    barcode_config::{BarcodeConfigInternal, BarcodeTextStyleConfigInternal, TextPosition},
    calculator::DimensionCalculator,
    image_editor::ImageEditor,
};

pub struct Generator {}

impl Generator {
    pub fn new() -> Self {
        Self {}
    }
    pub fn generate_barcode_svg(
        &self,
        data: &str,
        config: BarcodeConfigInternal,
        filename: &str,
    ) -> anyhow::Result<GeneratedBarcode> {
        let barcode = zxingcpp::create(config.format)
            .from_str(data)?
            .to_svg_with(&zxingcpp::write().scale(5))?;
        fs::write(filename, barcode)?;
        Ok(GeneratedBarcode {
            file_path: filename.to_string(),
            value: data.to_string(),
            buffer: ImageBuffer::new(0, 0),
        })
    }

    pub fn generate_barcode_png(
        &self,
        data: &str,
        config: BarcodeConfigInternal,
        filename: &str,
    ) -> anyhow::Result<GeneratedBarcode> {
        self.generate_barcode_png_with_dpi(data, config, filename, 300.0)
    }

    fn calculate_total_text_height_mm(&self, config: &BarcodeConfigInternal) -> f32 {
        // Check texts which are upper and lower, and calculate the total height
        let mut total_height = 0.0;
        for text in &config.texts {
            if text.text_position == TextPosition::Upper
                || text.text_position == TextPosition::Lower
                || text.text_position == TextPosition::UpperCenter
                || text.text_position == TextPosition::LowerCenter
            {
                total_height += text.text_size as f32 + text.margin as f32;
            }
        }
        total_height
    }

    pub fn generate_barcode_png_with_dpi(
        &self,
        data: &str,
        config: BarcodeConfigInternal,
        filename: &str,
        dpi: f32,
    ) -> anyhow::Result<GeneratedBarcode> {
        let barcode = zxingcpp::create(config.format)
            .from_str(data)?
            .to_image_with(
                &zxingcpp::write()
                    .with_quiet_zones(config.quiet_zones)
                    .scale(config.scale),
            )?;

        let width_mm = config.dimensions.width_mm;
        let height_mm = if config.texts.is_empty() {
            config.dimensions.height_mm
        } else {
            let text_height_mm = self.calculate_total_text_height_mm(&config);
            (config.dimensions.height_mm - text_height_mm).max(1.0) // Ensure minimum height of 1mm
        };

        // calculate the height of the added texts in mm, subtract them. otherwise text will be distorted

        let (width, height) = (
            DimensionCalculator::new().mm_to_px(width_mm, dpi),
            DimensionCalculator::new().mm_to_px(height_mm, dpi),
        );

        let width = width.max(1);
        let height = height.max(1);

        // Debug prints
        //println!("Barcode data size: {} bytes", barcode.data().len());
        //println!("Calculated dimensions: {}x{} pixels", width, height);
        //println!(
        //    "Expected data size: {} bytes",
        //    width as usize * height as usize
        // );

        // Use the actual barcode dimensions instead of calculated ones
        let barcode_width = barcode.width() as u32;
        let barcode_height = barcode.height() as u32;

        let image: ImageBuffer<Luma<u8>, Vec<u8>> =
            ImageBuffer::from_raw(barcode_width, barcode_height, barcode.data().to_vec())
                .expect("Failed to create image buffer");
        let image_editor = ImageEditor::new();
        // Resize image as needed
        let image = if config.dimensions.width_percentage != 100.0 {
            image_editor.resize_width_percentage(&image, config.dimensions.width_percentage)
        } else {
            image.clone()
        };
        let mut final_image = image_editor.resize_dimensions(&image, width, height);

        if config.dimensions.height_percentage != 100.0 {
            final_image =
                image_editor.resize_height_percentage(&image, config.dimensions.height_percentage);
        }

        for text_cfg in &config.texts {
            final_image = add_text_to_luma_image(final_image, &text_cfg.text, text_cfg)?;
        }

        //final_image = image_editor.add_border(final_image, 2, vec![Side::Top, Side::Left]);

        // Save with custom DPI
        save_image_with_dpi(&final_image, filename, dpi)?;

        Ok(GeneratedBarcode {
            file_path: filename.to_string(),
            value: data.to_string(),
            buffer: image,
        })
    }
}

pub fn calculate_text_width(text: &str, font: &Font, font_size: f32) -> f32 {
    let mut width = 0.0;
    for ch in text.chars() {
        let (metrics, _) = font.rasterize(ch, font_size);
        width += metrics.advance_width;
    }
    width
}

fn add_text_to_luma_image(
    luma_img: ImageBuffer<Luma<u8>, Vec<u8>>,
    text: &str,
    style: &BarcodeTextStyleConfigInternal,
) -> anyhow::Result<ImageBuffer<Luma<u8>, Vec<u8>>> {
    let font_path = format!("./assets/{}.ttf", style.font);
    let font_bytes = fs::read(&font_path).map_err(|e| {
        anyhow::anyhow!(
            "Failed to load font {} with path {} from files: {}",
            style.font,
            font_path,
            e
        )
    })?;
    let cloned_font_bytes = font_bytes.clone();

    let font = FontArc::try_from_vec(font_bytes).unwrap();

    let fontcalc = Font::from_bytes(cloned_font_bytes, fontdue::FontSettings::default()).unwrap();

    let scale = PxScale::from(style.text_size as f32);
    let text_width = calculate_text_width(&text, &fontcalc, style.text_size as f32);
    let text_height: u32 = style.text_size + 10; // Add some margin
    let barcode_width = luma_img.width();
    let barcode_height = luma_img.height();

    let rgb_barcode = DynamicImage::ImageLuma8(luma_img).to_rgb8();

    let center_x = ((barcode_width as i32 - text_width as i32) / 2).max(0);

    let (new_width, new_height, barcode_y, text_x, text_y) = match style.text_position {
        TextPosition::Upper => (
            barcode_width,
            barcode_height + text_height,
            text_height, // barcode starts after text
            10,          // text at the very top, left
            5,
        ),
        TextPosition::Lower => (
            barcode_width,
            barcode_height + text_height,
            0,  // barcode at the top
            10, // text below barcode, left
            barcode_height + 5,
        ),
        TextPosition::UpperCenter => (
            barcode_width,
            barcode_height + text_height,
            text_height,
            center_x,
            5,
        ),
        TextPosition::LowerCenter => (
            barcode_width,
            barcode_height + text_height,
            0,
            center_x,
            barcode_height + 5,
        ),
        TextPosition::None => {
            // No text, just return the barcode as Luma
            return Ok(DynamicImage::ImageRgb8(rgb_barcode).to_luma8());
        }
    };

    let mut final_img = RgbImage::new(new_width, new_height as u32);
    // Fill with white
    for pixel in final_img.pixels_mut() {
        *pixel = Rgb([255, 255, 255]);
    }
    // Paste barcode
    image::imageops::replace(&mut final_img, &rgb_barcode, 0, barcode_y.into());
    // Draw text
    draw_text_mut(
        &mut final_img,
        style.text_color,
        text_x,
        text_y as i32,
        scale,
        &font,
        text,
    );
    // Convert back to Luma for further grayscale processing
    Ok(DynamicImage::ImageRgb8(final_img).to_luma8())
}

#[derive(Debug, Clone)]
pub struct GeneratedBarcode {
    pub file_path: String,
    pub value: String,
    pub buffer: ImageBuffer<Luma<u8>, Vec<u8>>,
}

/// Save an image with custom DPI metadata
fn save_image_with_dpi(
    image: &ImageBuffer<Luma<u8>, Vec<u8>>,
    filename: &str,
    dpi: f32,
) -> anyhow::Result<()> {
    let file = fs::File::create(filename)?;
    let ref mut w = BufWriter::new(file);

    let mut encoder = png::Encoder::new(w, image.width(), image.height());

    // Set DPI metadata using pHYs chunk
    // Convert DPI to pixels per meter (1 inch = 0.0254 meters)
    let pixels_per_meter = (dpi / 0.0254) as u32;
    encoder.set_pixel_dims(Some(png::PixelDimensions {
        xppu: pixels_per_meter,
        yppu: pixels_per_meter,
        unit: png::Unit::Meter,
    }));

    encoder.set_color(png::ColorType::Grayscale);
    encoder.set_depth(png::BitDepth::Eight);

    let mut writer = encoder.write_header()?;
    writer.write_image_data(image.as_raw())?;

    Ok(())
}
