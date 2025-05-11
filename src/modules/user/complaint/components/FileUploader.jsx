import React, { useState } from "react";

const FileUploader = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) =>
      file.name.endsWith(".pdf")
    );
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    onFilesChange([...files, ...selectedFiles]); // Notifica al padre los archivos seleccionados
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
          {files.map((file, index) => (
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
          ))}
          {files.length === 0 && (
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
          />
        </label>
      </div>
    </div>
  );
};

export default FileUploader;