use image::{
    imageops::{resize, FilterType},
    ImageBuffer, Luma,
};

pub struct ImageEditor<'a> {
    pub image: &'a ImageBuffer<Luma<u8>, Vec<u8>>,
}

impl<'a> ImageEditor<'a> {
    pub fn new(image: &'a ImageBuffer<Luma<u8>, Vec<u8>>) -> Self {
        Self { image }
    }

    pub fn resize(&self, width: u32, height: u32) -> ImageBuffer<Luma<u8>, Vec<u8>> {
        resize(self.image, width, height, FilterType::Nearest)
    }

    pub fn resize_height_percentage(&self, percentage: f32) -> ImageBuffer<Luma<u8>, Vec<u8>> {
        let height = self.image.height();
        let reduced_height = (height as f32 * (percentage / 100.0)) as u32;
        self.resize(self.image.width(), reduced_height)
    }

    pub fn resize_width_percentage(&self, percentage: f32) -> ImageBuffer<Luma<u8>, Vec<u8>> {
        let width = self.image.width();
        let reduced_width = (width as f32 * (percentage / 100.0)) as u32;
        self.resize(reduced_width, self.image.height())
    }
}
