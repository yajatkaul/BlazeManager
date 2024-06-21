import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const App: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const driveList = await invoke<string[]>(`list_drives`);
      setFiles(driveList);
    } catch (error) {
      console.error("Error fetching drives:", error);
    }
  };

  const loadFiles = async (path: string) => {
    try {
      const fileList = await invoke<string[]>("list_dir", { path: path });
      setFiles(fileList);
      setCurrentPath(path); // Set the current path
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const goBack = async () => {
    try {
      const dir = await invoke<string>("go_one_step_back", {
        path: currentPath,
      });
      loadFiles(dir);
    } catch (error) {
      console.error("Error going back:", error);
    }
  };

  return (
    <div className="App">
      <button onClick={goBack}>Back</button>
      <p>Files</p>
      <ul>
        {files.map((path, index) => (
          <li key={index} onClick={() => loadFiles(path)}>
            {path}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
