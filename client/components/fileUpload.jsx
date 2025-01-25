"use client"
import React, { useState } from 'react';
import api from '@/utils/api';
import LinearBuffer from './laoder';

const PlantImageUpload = () => {
  const [plantImage, setPlantImage] = useState(null);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loader,setLoader] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload JPEG or PNG.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File must be smaller than 10MB');
        return;
      }

      setPlantImage(file);
      setError(null);
    }
  };

  const handleAnalyse = async () => {
    setLoader(true)
    if (!plantImage) return;

    const formData = new FormData();
    formData.append('plantImage', plantImage);

    try {
      const response = await api.post('/analyse', formData);
      const data= response.data.plantAnalysisResult
      setAnalysisResult(data);
    } catch (err) {
      setError('Plant analysis failed');
      console.error(err);
    }finally {
        setLoader(false);
      }
  };

  const clearFile = () => {
    setPlantImage(null);
    setError(null);
  };

  const closePopup = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="bg-black mx-10 text-white p-6 border border-gray-800 rounded-lg mb-28">
      <input
        type="file"
        id="plant-image-upload"
        className="hidden"
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg"
      />
      <label
        htmlFor="plant-image-upload"
        className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-700 p-6 hover:border-gray-500 transition-colors duration-300"
      >
        {plantImage ? (
          <div className="flex items-center space-x-4">
            <span>{plantImage.name}</span>
            <button onClick={(e) => {
              e.preventDefault();
              clearFile();
            }}>
              ×
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-center">
              Upload Plant Image
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Max 10MB (JPEG/PNG)
            </p>
          </>
        )}
      </label>

      {plantImage && (
        <div
className='mt-3'
        >
            {
                loader ?  <div className='mt-7'><LinearBuffer/></div> : <button    onClick={handleAnalyse}
                className="mt-4 w-full bg-[#f2f2f2] text-black p-2 rounded">  Analyse Plant</button>
            }

        </div>
      )}

      {error && (
        <div className="text-red-500 mt-2 text-sm text-center">
          {error}
        </div>
      )}

      {analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg  w-[80%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-400">Plant Analysis</h2>
              <button onClick={closePopup} className="text-white">×</button>
            </div>
            <div className="space-y-2">
                  <div className="text-white">{analysisResult}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantImageUpload;
