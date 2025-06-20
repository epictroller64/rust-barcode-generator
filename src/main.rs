use rust_barcode_generator::{
    bulk_generator::BulkGenerator,
    exporting::{
        paper::Paper,
        pdf_exporter::{PdfExportConfig, PdfExporter},
    },
};

fn main() {
    let bulk_generator = BulkGenerator::new();

    // Generate barcodes with custom DPI (600 DPI for high quality printing)
    let barcodes = bulk_generator
        .generate_barcodes_with_dpi_from_csv("barcodes.csv", 300.0)
        .unwrap();

    let pdf_exporter = PdfExporter::new(PdfExportConfig {
        auto_margin: true,
        use_grid: true,
        paper: Paper::A4,
    });
    let png_bytes = pdf_exporter.create_pdf(barcodes);
    std::fs::write("barcodes_grid.png", png_bytes).unwrap();
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
