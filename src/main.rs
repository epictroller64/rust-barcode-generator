use image::Rgb;
use rust_barcode_generator::generator::{
    BarcodeConfig, BarcodeTextStyleConfig, Generator, TextPosition,
};
use zxingcpp::BarcodeFormat;

fn main() {
    let generator = Generator::new();
    if let Err(e) = generator.generate_barcode_png(
        "123456789012",
        BarcodeConfig {
            format: BarcodeFormat::Code128,
            filename: "test.png".to_string(),
            texts: vec![
                BarcodeTextStyleConfig {
                    text: "text".to_string(),
                    text_color: Rgb([255, 0, 0]),
                    text_size: 35,
                    text_position: TextPosition::UpperCenter,
                },
                BarcodeTextStyleConfig {
                    text: "text".to_string(),
                    text_color: Rgb([255, 0, 0]),
                    text_size: 25,
                    text_position: TextPosition::LowerCenter,
                },
            ],
        },
    ) {
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
