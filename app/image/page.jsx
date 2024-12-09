"use client";

import { useEffect, useState } from "react";
import { FaFileDownload, FaImage, FaTimes } from "react-icons/fa";
import NProgress from "nprogress";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/constant/configuration";
import { toast } from "react-toastify";

export default function ImagesPage() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [isValidImage, setIsValidImage] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDragEnter = () => setDragging(true);
  const handleDragLeave = () => setDragging(false);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setIsValidImage(true);
    } else {
      setIsValidImage(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setIsValidImage(true);
    } else {
      setIsValidImage(false);
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleUrlSubmit = async () => {
    setUrlLoading(true);
    const regex = /\.(jpeg|jpg|gif|png)$/i;
    if (regex.test(imageUrl)) {
      try {
        const response = await fetch(imageUrl, { method: "GET" });
        const blob = await response.blob();
        const fileName = imageUrl.split('/').pop()?.split('?')[0] || "image";
        const file = new File([blob], fileName, { type: blob.type });
  
        setImageFile(file);
        setIsValidImage(true);
      } catch (error) {
        console.error("Error fetching image from URL:", error);
        setIsValidImage(false);
        toast.error("Failed to load image from the provided URL.");
      }
    } else {
      setIsValidImage(false);
    }
    setUrlLoading(false);
  };

  const handleCheckPlateNumber = async () => {
    if (!imageFile && !imageUrl) {
      toast.warn("Please upload an image or enter a valid image URL.");
      return;
    }

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("imageUrl", imageUrl);
      }

      setLoading(true)
      const response = await fetch(`${BACKEND_URL}/detect`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Plate Detected")
        NProgress.start()
        router.push(`list/${data.redirect}`)
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error("An error occurred while checking the plate number.");
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if(!isValidImage){
      toast.warn("Invalid image or URL. Please upload a valid image")
    }
  },[isValidImage])

  return (
    <div className="w-full mx-auto p-6">
      {loading && <LoadingSpinner overlay/>}

      <h1 className="text-3xl text-center font-semibold text-indigo-900 mb-6">
        Upload or Enter Image URL
      </h1>

      {!imageFile && (
        <div className={`relative flex flex-col justify-center items-center w-full`}>
          <div
            className={`w-full max-w-5xl bg-gray-100 p-6 rounded-lg border-2 border-dashed ${
              dragging ? "border-indigo-600" : "border-gray-300"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              key={imageFile ? imageFile.name : 'default'}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-center text-lg font-medium text-gray-700">
                Drag and drop your image here
              </p>

              <div className="flex justify-center my-4">
                <FaImage className="text-gray-500 text-8xl" />
              </div>

              <p className="block text-center text-indigo-600 hover:text-indigo-700">
                Choose a file or drag it here
              </p>
            </label>
          </div>
          <div className="bg-white p-6 rounded-lg mt-6 max-w-5xl w-full">
            <label
              htmlFor="image-url"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Or Enter Image URL
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="image-url"
                value={imageUrl}
                onChange={handleUrlChange}
                disabled={urlLoading}
                className="p-3 border border-gray-300 rounded-l-lg w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter image URL"
              />
                <button
                  onClick={handleUrlSubmit}
                  disabled={urlLoading}
                  className={`px-6 py-4 rounded-r-lg transition duration-200 flex items-center justify-center ${
                    urlLoading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {urlLoading ? (
                    <div
                      className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"
                      role="status"
                    />
                  ) : (
                    <FaFileDownload />
                  )}
                </button>
            </div>
          </div>
        </div>
      )}

      {imageFile && (
        <div className="w-full flex justify-center">
          <div className="bg-white p-6 rounded-lg mt-6 border-2 border-dashed relative max-w-5xl w-full">
            <div className="absolute right-8 flex justify-end">
              <button 
                onClick={() => {
                  setImageFile(null);
                }}
              >
                <FaTimes size={24}/>
              </button>
            </div>
            <div className="flex justify-center">
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Uploaded"
                  className="max-w-full w-full h-auto max-h-96 object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={handleCheckPlateNumber}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
        >
          Check Plate Number
        </button>
      </div>
    </div>
  );
}
