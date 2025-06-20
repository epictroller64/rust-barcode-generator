pub struct DimensionCalculator {}

impl DimensionCalculator {
    pub fn new() -> Self {
        Self {}
    }

    /// Converts millimeters to pixels at the given DPI
    pub fn mm_to_px(&self, mm: f32, dpi: f32) -> u32 {
        // 1 inch = 25.4 mm
        // pixels = (mm / 25.4) * dpi
        ((mm / 25.4) * dpi).round() as u32
    }

    /// Converts pixels to millimeters at the given DPI
    pub fn px_to_mm(&self, px: u32, dpi: f32) -> f32 {
        // mm = (px / dpi) * 25.4
        (px as f32 / dpi) * 25.4
    }

    /// Converts inches to pixels at the given DPI
    pub fn inches_to_px(&self, inches: f32, dpi: f32) -> u32 {
        (inches * dpi).round() as u32
    }

    /// Converts pixels to inches at the given DPI
    pub fn px_to_inches(&self, px: u32, dpi: f32) -> f32 {
        px as f32 / dpi
    }

    /// Gets dimensions in pixels for A4 paper at the given DPI
    pub fn get_a4_dimensions_px(&self, dpi: f32) -> (u32, u32) {
        // A4 dimensions in mm: 210 x 297
        let width_px = self.mm_to_px(210.0, dpi);
        let height_px = self.mm_to_px(297.0, dpi);
        (width_px, height_px)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mm_to_px() {
        let calc = DimensionCalculator::new();
        assert_eq!(calc.mm_to_px(25.4, 300.0), 300); // 1 inch at 300 DPI
        assert_eq!(calc.mm_to_px(10.0, 72.0), 28); // ~28.346 rounded
    }

    #[test]
    fn test_px_to_mm() {
        let calc = DimensionCalculator::new();
        assert!((calc.px_to_mm(300, 300.0) - 25.4).abs() < 0.001); // 1 inch
    }

    #[test]
    fn test_a4_dimensions() {
        let calc = DimensionCalculator::new();
        let (width, height) = calc.get_a4_dimensions_px(300.0);
        assert_eq!(width, 2480);
        assert_eq!(height, 3508);
    }
}
