#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_drives])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn list_drives() -> Vec<String> {
    use std::fs;

    let mut drives = Vec::new();

    match fs::read_dir("C:\\") {
        Ok(entries) => {
            for entry in entries {
                match entry {
                    Ok(entry) => {
                        if let Some(path_str) = entry.path().to_str() {
                            drives.push(path_str.to_string());
                        }
                    },
                    Err(e) => eprintln!("Error: {}", e),
                }
            }
            println!("{:?}",drives);
        }
        Err(e) => eprintln!("Error: {}", e),
    }
    return drives
}

