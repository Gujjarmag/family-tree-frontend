import Modal from "react-modal";
import { User, X, Calendar, Camera } from "lucide-react";
import React, { useState, useRef } from "react";

export default function AddMemberModal({
  isOpen,
  onRequestClose,
  relationType,
  formData,
  setFormData,
  handleAddMember,
}) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  // Handle file selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Member"
      className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Add Family Member
          </h3>
        </div>
        <button
          onClick={onRequestClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleAddMember} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Enter full name"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Gender
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["male", "female", "other"].map((gender) => (
              <label key={gender} className="relative">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="sr-only"
                />
                <div
                  className={`p-3 border-2 rounded-xl text-center font-medium cursor-pointer transition-all ${
                    formData.gender === gender
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-300 hover:border-slate-400 text-slate-700"
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* ---------- Photo Upload Section ---------- */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : photoPreview
              ? "border-blue-300 bg-blue-25"
              : "border-slate-300 hover:border-slate-400 bg-slate-50"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => inputRef.current?.click()}
        >
          {photoPreview ? (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
              <div className="mt-3 text-sm font-medium text-blue-700">
                Click to change photo
              </div>
            </div>
          ) : (
            <div>
              <Camera className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Drop a photo here</p>
              <p className="text-slate-500 text-sm">or click to browse</p>
            </div>
          )}
          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onRequestClose}
            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg shadow-blue-200"
          >
            Add Member
          </button>
        </div>
      </form>
    </Modal>
  );
}
