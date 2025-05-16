import React, { useState } from "react";

const FileUploader = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) =>
      file.name.endsWith(".pdf")
    );
    setFiles(selectedFiles);
    onFilesChange(selectedFiles);

    // Limpia el input para permitir subir el mismo archivo de nuevo si se desea
    e.target.value = null;
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="w-full">
      <div className="border border-gray-300 rounded-md p-4">
        <ul className="space-y-2">
          {files.length > 0 ? (
            files.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
              >
                <span>{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No se han subido archivos</li>
          )}
        </ul>
        <label className="block mt-4">
          <span className="text-blue-500 cursor-pointer hover:underline">
            Subir archivo
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
