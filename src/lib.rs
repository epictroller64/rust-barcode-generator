pub mod generator;

use std::sync::Mutex;

use tauri::{ipc::Response, State};
use tauri::{App, Manager};

use crate::generator::importer::BarcodeImportRowCSV;
use crate::generator::{
    barcode_config::BarcodeConfig,
    frontend_interface::{FrontendInterface, JsonResponse},
    templates::{self, Template},
};

use serde_json;

#[derive(Clone)]
struct AppState {
    frontend: FrontendInterface,
    imported_barcodes: Vec<BarcodeImportRowCSV>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            generate_barcode,
            save_template,
            get_templates,
            get_template,
            delete_template,
            import_barcodes_csv,
            get_imported_barcodes
        ])
        .setup(|app| {
            app.manage(Mutex::new(AppState {
                frontend: FrontendInterface::new(),
                imported_barcodes: vec![],
            }));
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
fn get_templates(state: State<'_, Mutex<AppState>>) -> JsonResponse {
    let state = state.lock().unwrap();
    state.frontend.get_templates()
}

#[tauri::command]
fn get_template(id: String, state: State<'_, Mutex<AppState>>) -> JsonResponse {
    let state = state.lock().unwrap();
    state.frontend.get_template(id)
}

#[tauri::command]
fn delete_template(id: String, state: State<'_, Mutex<AppState>>) -> JsonResponse {
    let state = state.lock().unwrap();
    state.frontend.delete_template(id)
}

// Save the template to the templates folder
#[tauri::command]
fn save_template(template: Template, state: State<'_, Mutex<AppState>>) -> JsonResponse {
    let state = state.lock().unwrap();
    state.frontend.save_template(template)
}

#[tauri::command]
fn generate_barcode(config: BarcodeConfig, state: State<'_, Mutex<AppState>>) -> Response {
    let state = state.lock().unwrap();
    let generated_barcode_bytes = state.frontend.generate_barcode(config);
    match generated_barcode_bytes {
        Ok(generated_barcode_bytes) => tauri::ipc::Response::new(generated_barcode_bytes),
        Err(e) => {
            println!("Error generating barcode: {}", e);
            return Response::new(e.to_string());
        }
    }
}

#[tauri::command]
fn get_imported_barcodes(state: State<'_, Mutex<AppState>>) -> JsonResponse {
    let state = state.lock().unwrap();
    JsonResponse {
        success: true,
        message: "OK".to_string(),
        data: Some(serde_json::to_value(&state.imported_barcodes).unwrap()),
    }
}

#[tauri::command]
fn import_barcodes_csv(file_bytes: Vec<u8>, state: State<'_, Mutex<AppState>>) -> JsonResponse {
    let mut state = state.lock().unwrap();
    let import_result = state.frontend.import_from_csv(file_bytes);
    match import_result {
        Ok(result) => {
            state.imported_barcodes = result;
            JsonResponse {
                success: true,
                message: "Ok".to_string(),
                data: None,
            }
        }
        Err(e) => JsonResponse {
            success: false,
            message: e.to_string(),
            data: None,
        },
    }
}
