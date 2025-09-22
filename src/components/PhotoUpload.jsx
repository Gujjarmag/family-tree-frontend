import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function PhotoUpload({ onCropped }) {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const getCroppedImage = async () => {
    const imageElement = await createImage(image);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(imageElement, x, y, width, height, 0, 0, width, height);

    canvas.toBlob((blob) => {
      onCropped(blob); // send to parent (upload later)
    }, "image/jpeg");
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (error) => reject(error));
      img.src = url;
    });

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2 block"
      />
      {image && (
        <div className="relative w-64 h-64 bg-gray-200 rounded overflow-hidden mb-2">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1} // square crop (good for profile photos)
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}
      {image && (
        <button
          onClick={getCroppedImage}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Crop & Save
        </button>
      )}
    </div>
  );
}
