use crate::generator::GeneratedBarcode;

// Allow exporting barcodes to different final formats
pub struct Exporter {}

impl Exporter {
    pub fn new() -> Self {
        Self {}
    }

    pub fn export_barcodes_to_pdf(&self, _barcodes: GeneratedBarcode) {}
}
