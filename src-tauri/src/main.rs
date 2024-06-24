#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde_json::map::Entry;
use walkdir::WalkDir;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_drives,list_dir,go_one_step_back,find_dir,go_dir])
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
        }
        Err(e) => eprintln!("Error: {}", e),
    }
    return drives
}

#[tauri::command]
fn go_one_step_back(path: &str) -> Option<String> {
    use std::path::Path;

    let path = Path::new(path);
    
    return path.parent().map(|parent| parent.to_string_lossy().to_string());
}


#[tauri::command]
fn list_dir(path: String) -> Vec<String> {
    use std::fs;

    let mut drives = Vec::new();

    match fs::read_dir(&path) {
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

#[tauri::command]
fn go_dir(dir_path: String) -> Vec<String> {
    use walkdir::WalkDir;

    let mut result = Vec::new();

    for entry in WalkDir::new(dir_path).into_iter().filter_map(|e| e.ok()) {
        result.push(entry.path().display().to_string());
    }

    result
}

#[tauri::command]
fn find_dir(dir_path: String, filename: String) -> Vec<String> {
    use std::path::PathBuf;
    use walkdir::WalkDir;

    let mut results = Vec::new();
    let dir = PathBuf::from(dir_path);


    for entry in WalkDir::new(dir).into_iter().filter_map(|e| e.ok()) {
        if entry.path().display().to_string() == filename{
            println!("{}", entry.path().display());    
        }
        
    }

    results
}