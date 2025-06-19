use image::Rgb;
use rust_barcode_generator::barcode_config::{BarcodeConfigBuilder, TextPosition};
use rust_barcode_generator::generator::Generator;
use zxingcpp::BarcodeFormat;

fn main() {
    let generator = Generator::new();
    let config = BarcodeConfigBuilder::new()
        .resize_height_percentage(50.0)
        .resize_width_percentage(50.0)
        .set_format(BarcodeFormat::Code128)
        .set_scale(7)
        .add_text(
            "abcABCCCCCCCC1234567890",
            Rgb([255, 0, 0]),
            65,
            TextPosition::UpperCenter,
        )
        .add_text(
            "abcABCCCCCCCC1234567890",
            Rgb([255, 0, 0]),
            25,
            TextPosition::LowerCenter,
        )
        .build();
    if let Err(e) = generator.generate_barcode_png("123456789012", config, "barcode.png") {
        eprintln!("Error: {}", e);
    }
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
