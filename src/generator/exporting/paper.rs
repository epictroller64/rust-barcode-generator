use crate::generator::calculator::DimensionCalculator;

pub enum Paper {
    A4,
}

pub fn get_paper_dimensions_mm(paper: &Paper, dpi: f32) -> (f32, f32) {
    match paper {
        Paper::A4 => (
            DimensionCalculator::new().px_to_mm(2480, dpi),
            DimensionCalculator::new().px_to_mm(3508, dpi),
        ),
    }
}
pub fn get_paper_dimensions_px(paper: &Paper) -> (u32, u32) {
    match paper {
        Paper::A4 => (2480 as u32, 3508 as u32),
    }
}
