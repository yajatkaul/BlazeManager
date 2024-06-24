import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const App: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [searchFile, SetSearchFile] = useState<string>("");
  const [searchToDir, setSearchToDir] = useState<string>("");

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

  const jumpToDir = async (e: any) => {
    try {
      e.preventDefault();
      const dir = await invoke<string[]>("go_dir", {
        dirPath: searchToDir,
      });
      setFiles(dir);
    } catch (e) {
      console.log(e);
    }
  };

  const search = async (e: any) => {
    try {
      e.preventDefault();
      const dir = await invoke<string>("find_dir", {
        filename: searchFile,
        dirPath: currentPath,
      });
      console.log(dir);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <button onClick={goBack} className="fixed btn">
        Back
      </button>
      <form onSubmit={jumpToDir}>
        <label className="input input-bordered flex items-center gap-2 fixed justify-center bottom-0">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchToDir}
            onChange={(e) => {
              setSearchToDir(e.target.value);
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </form>
      <form onSubmit={search} className="flex fixed right-0">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchFile}
            onChange={(e) => {
              SetSearchFile(e.target.value);
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <button onClick={search} className="btn">
          click
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {files.map((path, index) => (
          <button
            onClick={() => loadFiles(path)}
            className="btn btn-neutral"
            key={index}
          >
            {path}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
