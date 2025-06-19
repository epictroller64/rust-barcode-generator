use rust_barcode_generator::barcode_config::BarcodeConfigBuilder;
use rust_barcode_generator::bulk_generator::BulkGenerator;

fn main() {
    let bulk_generator = BulkGenerator::new();
    bulk_generator
        .generate_barcodes_from_csv("barcodes.csv")
        .unwrap();
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
