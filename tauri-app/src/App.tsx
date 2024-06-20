import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

interface Drive {
  name: string;
  path: string;
}

const App: React.FC = () => {
  const [drives, setDrives] = useState<Drive[]>([]);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const driveList = await invoke<Drive[]>("list_drives");
      setDrives(driveList);
    } catch (error) {
      console.error("Error fetching drives:", error);
    }
  };

  return (
    <div className="App">
      <h1>Available Drives</h1>
      <ul>
        {drives.map((drive, index) => (
          <li key={index} style={{ cursor: "pointer" }}>
            {drive}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
