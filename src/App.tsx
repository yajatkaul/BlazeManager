import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

interface Drive {
  name: string;
  path: string;
}

const App: React.FC = () => {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [files, setFiles] = useState<Drive[]>([]);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const driveList = await invoke<Drive[]>(`list_drives`);
      setDrives(driveList);
    } catch (error) {
      console.error("Error fetching drives:", error);
    }
  };

  const loadFiles = async (path) => {
    try {
      const driveList = await invoke<Drive[]>("list_dir", { path: path }); //invoke('my_custom_command', { invokeMessage: 'Hello!' })
      console.log(driveList);
      setFiles(driveList);
    } catch (error) {
      console.error("Error fetching drives:", error);
    }
  };

  return (
    <div className="App">
      <h1>Available Drives</h1>
      <ul>
        {drives.map((drive, index) => (
          <li
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => loadFiles(drive)}
          >
            {drive}
          </li>
        ))}
      </ul>
      <p>Files</p>
      {files.map((path) => (
        <li>{path}</li>
      ))}
    </div>
  );
};

export default App;
