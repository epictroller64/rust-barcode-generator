use rust_barcode_generator::{bulk_generator::BulkGenerator, exporting::pdf_exporter::PdfExporter};

fn main() {
    let bulk_generator = BulkGenerator::new();
    let barcodes = bulk_generator
        .generate_barcodes_from_csv("barcodes.csv")
        .unwrap();
    let pdf_exporter = PdfExporter::new();
    let pdf_bytes = pdf_exporter.create_pdf(barcodes);
    std::fs::write("barcodes.pdf", pdf_bytes).unwrap();
}

//fn run_gui() {
//Application::new().run(|cx: &mut App| {
//let bounds = Bounds::centered(None, size(px(500.), px(500.0)), cx);
//cx.open_window(
//WindowOptions {
//window_bounds: Some(WindowBounds::Windowed(bounds)),
//..Default::default()
//},
//|_, cx| {
//cx.new(|_| HomeView {
//text: "World".into(),
//})
//},
//)
//.unwrap();
//});
//}
