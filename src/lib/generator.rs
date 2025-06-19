use anyhow::Ok;
use fontdue::Font;
use image::{DynamicImage, ImageBuffer, Luma, Rgb, RgbImage};
use std::fs;

use ab_glyph::{FontArc, PxScale};
use imageproc::drawing::draw_text_mut;

use crate::{
    barcode_config::{BarcodeConfig, BarcodeTextStyleConfig, TextPosition},
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
        config: BarcodeConfig,
        filename: &str,
    ) -> anyhow::Result<()> {
        let barcode = zxingcpp::create(config.format)
            .from_str(data)?
            .to_svg_with(&zxingcpp::write().scale(5))?;
        fs::write(filename, barcode)?;
        Ok(())
    }

    pub fn generate_barcode_png(
        &self,
        data: &str,
        config: BarcodeConfig,
        filename: &str,
    ) -> anyhow::Result<()> {
        let barcode = zxingcpp::create(config.format)
            .from_str(data)?
            .to_image_with(
                &zxingcpp::write()
                    .with_quiet_zones(false)
                    .scale(config.scale),
            )?;
        let (width, height) = (barcode.width() as u32, barcode.height() as u32);
        let image: ImageBuffer<Luma<u8>, Vec<u8>> =
            ImageBuffer::from_raw(width, height, barcode.data().to_vec())
                .expect("Failed to create image buffer");

        // Resize image as needed
        let image_editor = ImageEditor::new(&image);
        let mut final_image = if config.dimensions.width_percentage != 100.0 {
            image_editor.resize_width_percentage(config.dimensions.width_percentage)
        } else {
            image.clone()
        };

        if config.dimensions.height_percentage != 100.0 {
            final_image =
                image_editor.resize_height_percentage(config.dimensions.height_percentage);
        }

        for text_cfg in &config.texts {
            final_image = add_text_to_luma_image(final_image, &text_cfg.text, text_cfg)?;
        }

        final_image.save(filename)?;
        Ok(())
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
    style: &BarcodeTextStyleConfig,
) -> anyhow::Result<ImageBuffer<Luma<u8>, Vec<u8>>> {
    let font = FontArc::try_from_slice(include_bytes!("../../assets/DejaVuSans.ttf")).unwrap();
    let fontcalc = Font::from_bytes(
        include_bytes!("../../assets/DejaVuSans.ttf") as &[u8],
        fontdue::FontSettings::default(),
    )
    .unwrap();

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
