#[derive(Default)]
pub struct PdfExporter {}

impl PdfExporter {
    pub fn new() -> Self {
        Self {}
    }
    pub fn create_export_preview(&self) -> anyhow::Result<Vec<u8>> {
        todo!()
    }
}
