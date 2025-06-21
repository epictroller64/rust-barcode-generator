pub mod generator;

use generator::generator::Generator;
use tauri::ipc::Response;

use crate::generator::barcode_config::BarcodeConfig;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![generate_barcode])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn generate_barcode(config: BarcodeConfig) -> Response {
    let generator = Generator::new();

    // Generate a temporary filename
    let temp_filename = format!(
        "temp_barcode_{}.png",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis()
    );

    // Convert the serializable config to internal config
    let internal_config: crate::generator::barcode_config::BarcodeConfigInternal = config.into();

    match generator
        .generate_barcode_png(
            &internal_config.data.clone(),
            internal_config,
            &temp_filename,
        )
        .map_err(|e| e.to_string())
    {
        Ok(generated_barcode) => {
            // Convert the image buffer to PNG bytes
            let mut png_bytes = Vec::new();
            generated_barcode
                .buffer
                .write_with_encoder(image::codecs::png::PngEncoder::new(&mut png_bytes))
                .map_err(|e| e.to_string())
                .unwrap();

            // Clean up the temporary file
            let _ = std::fs::remove_file(&temp_filename);

            tauri::ipc::Response::new(png_bytes)
        }
        Err(e) => {
            println!("Error generating barcode: {}", e);
            return Response::new(e.to_string());
        }
    }
}
