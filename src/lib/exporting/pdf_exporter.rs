use printpdf::*;

use crate::generator::GeneratedBarcode;

pub struct PdfExporter {}

impl PdfExporter {
    pub fn new() -> Self {
        Self {}
    }

    pub fn create_pdf(&self, barcodes: Vec<GeneratedBarcode>) -> Vec<u8> {
        let mut doc = PdfDocument::new("My first PDF");
        let (width, height) = get_page_dimensions(Page::A4);
        let page_contents = self.add_barcodes_to_page(&mut doc, barcodes);
        let page = PdfPage::new(Mm(width), Mm(height), page_contents);
        let pdf_bytes: Vec<u8> = doc
            .with_pages(vec![page])
            .save(&PdfSaveOptions::default(), &mut Vec::new());
        pdf_bytes
    }

    fn add_barcodes_to_page(
        &self,
        doc: &mut PdfDocument,
        barcodes: Vec<GeneratedBarcode>,
    ) -> Vec<Op> {
        let mut warnings = Vec::new();
        let mut images = Vec::<XObjectId>::new();
        for barcode in barcodes {
            let image = RawImage::decode_from_bytes(&barcode.buffer, &mut warnings).unwrap();
            let image_xobject_id = doc.add_image(&image);
            images.push(image_xobject_id);
        }
        let page1_contents = images
            .iter()
            .map(|id| Op::UseXobject {
                id: id.clone(),
                transform: XObjectTransform::default(),
            })
            .collect();
        page1_contents
    }
}

fn get_page_dimensions(page: Page) -> (f32, f32) {
    match page {
        Page::A4 => (210.0, 297.0),
        Page::A3 => (297.0, 420.0),
        Page::A2 => (420.0, 594.0),
        Page::A1 => (594.0, 841.0),
        Page::A0 => (841.0, 1189.0),
    }
}

enum Page {
    A4,
    A3,
    A2,
    A1,
    A0,
}
