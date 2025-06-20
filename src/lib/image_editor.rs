use image::{
    imageops::{resize, FilterType},
    ImageBuffer, Luma, Pixel,
};

use crate::calculator::DimensionCalculator;

pub struct ImageEditor {}

impl ImageEditor {
    pub fn new() -> Self {
        Self {}
    }
    pub fn resize_dimensions(
        &self,
        image: &ImageBuffer<Luma<u8>, Vec<u8>>,
        width: u32,
        height: u32,
    ) -> ImageBuffer<Luma<u8>, Vec<u8>> {
        resize(image, width, height, FilterType::Nearest)
    }

    pub fn resize_height_percentage(
        &self,
        image: &ImageBuffer<Luma<u8>, Vec<u8>>,
        percentage: f32,
    ) -> ImageBuffer<Luma<u8>, Vec<u8>> {
        let height = image.height();
        let reduced_height = (height as f32 * (percentage / 100.0)) as u32;
        self.resize_dimensions(image, image.width(), reduced_height)
    }

    pub fn resize_width_percentage(
        &self,
        image: &ImageBuffer<Luma<u8>, Vec<u8>>,
        percentage: f32,
    ) -> ImageBuffer<Luma<u8>, Vec<u8>> {
        let width = image.width();
        let reduced_width = (width as f32 * (percentage / 100.0)) as u32;
        self.resize_dimensions(image, reduced_width, image.height())
    }

    // Add border to create grid when stacked on paper - creates double borders tho
    pub fn add_border<P, Container>(
        &self,
        image: &mut ImageBuffer<P, Container>,
        thickness: u32,
        color: P,
        sides: Vec<Side>,
    ) where
        P: Pixel<Subpixel = u8> + 'static + Copy,
        Container: std::ops::Deref<Target = [P::Subpixel]> + std::ops::DerefMut,
    {
        // Color pixels on the edge
        let (w, h) = image.dimensions();
        for wp in 0..w {
            for hp in 0..h {
                if sides.contains(&Side::Left) && wp < thickness {
                    image.put_pixel(wp, hp, color);
                }
                if sides.contains(&Side::Right) && wp >= w - thickness {
                    image.put_pixel(wp, hp, color);
                }
                if sides.contains(&Side::Top) && hp < thickness {
                    image.put_pixel(wp, hp, color);
                }
                if sides.contains(&Side::Bottom) && hp >= h - thickness {
                    image.put_pixel(wp, hp, color);
                }
            }
        }
    }
    pub fn resize_to_dimensions_mm(
        &self,
        width_mm: f32,
        height_mm: f32,
        image: &ImageBuffer<Luma<u8>, Vec<u8>>,
    ) -> ImageBuffer<Luma<u8>, Vec<u8>> {
        let width_px = DimensionCalculator::new().mm_to_px(width_mm, 300.0);
        let height_px = DimensionCalculator::new().mm_to_px(height_mm, 300.0);
        self.resize_dimensions(image, width_px, height_px)
    }
}

#[derive(PartialEq)]
pub enum Side {
    Left,
    Right,
    Top,
    Bottom,
}
