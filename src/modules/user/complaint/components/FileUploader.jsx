import React, { useState } from "react";

const FileUploader = ({ onFilesChange }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
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
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="
              .jpg,.jpeg,.png,.gif,.bmp,.webp,.tif,.tiff,.ico,.svg,
              .mp4,.webm,.ogv,.ogg,.mov,.flv,.m3u8,.3gp,
              .mp3,.wav,.aac,
              image/jpeg,image/png,image/gif,image/bmp,image/webp,image/tiff,image/x-icon,image/svg+xml,
              video/mp4,video/webm,video/ogg,video/quicktime,video/x-flv,application/x-mpegURL,video/3gpp,
              audio/mpeg,audio/wav,audio/ogg,audio/aac
            "
          />
        </label>
        <div className="flex items-center gap-2 mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <span className="text-xs text-gray-500">
            Imágenes: .jpg, .jpeg, .png, .gif, .bmp, .webp, .tif, .tiff, .ico, .svg&nbsp;|&nbsp;
            Video/Audio: .mp4, .webm, .ogv, .ogg, .mov, .flv, .m3u8, .3gp, .mp3, .wav, .aac
          </span>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
