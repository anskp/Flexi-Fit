import React, { useState } from "react";

export default function GymProfile() {
  const [gymDetails, setGymDetails] = useState({
    name: "FlexiFit Gym",
    address: "Main Road, Bangalore, Karnataka, India",
    contact: "+91 98765 43210",
    email: "contact@flexifitgym.com",
    established: "2020",
    description:
      "FlexiFit Gym is a premium fitness center offering personalized training, group classes, and wellness programs. Our mission is to empower every member to achieve their fitness goals in a supportive and energetic environment.",
    facilities: [
      "Cardio Zone",
      "Strength Training",
      "CrossFit Area",
      "Yoga Studio",
      "Steam & Shower",
      "Nutrition Bar",
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(gymDetails);

  const handleEdit = () => {
    setFormData(gymDetails);
    setIsEditing(true);
  };

  const handleSave = () => {
    setGymDetails(formData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacilitiesChange = (index, value) => {
    const updatedFacilities = [...formData.facilities];
    updatedFacilities[index] = value;
    setFormData((prev) => ({ ...prev, facilities: updatedFacilities }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Gym Profile</h1>
          <p className="text-gray-400">Manage your gym’s identity and amenities</p>
        </div>
        <button
          onClick={handleEdit}
          className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded-lg shadow-md transition"
        >
          Edit Details
        </button>
      </div>

      {/* Gym Info */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg mb-10">
        <h2 className="text-xl font-semibold text-teal-400 mb-4">{gymDetails.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
          <p><span className="font-medium text-white"> Address:</span> {gymDetails.address}</p>
          <p><span className="font-medium text-white"> Contact:</span> {gymDetails.contact}</p>
          <p><span className="font-medium text-white"> Email:</span> {gymDetails.email}</p>
          <p><span className="font-medium text-white"> Established:</span> {gymDetails.established}</p>
        </div>
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-2"> Description</h3>
          <p className="text-gray-300 text-sm">{gymDetails.description}</p>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
        <h2 className="text-white text-lg font-semibold mb-4"> Facilities</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
          {gymDetails.facilities.map((facility, index) => (
            <li key={index} className="bg-gray-800 rounded-md px-4 py-2 shadow-sm">
              {facility}
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-xl shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-4">Edit Gym Details</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md"
                placeholder="Gym Name"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md"
                placeholder="Address"
              />
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md"
                placeholder="Contact"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md"
                placeholder="Email"
              />
              <input
                name="established"
                value={formData.established}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md"
                placeholder="Established Year"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md"
                rows={3}
                placeholder="Description"
              />
              <div>
                <h3 className="text-white font-semibold mb-2">Facilities</h3>
                {formData.facilities.map((facility, index) => (
                  <input
                    key={index}
                    value={facility}
                    onChange={(e) => handleFacilitiesChange(index, e.target.value)}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-md mb-2"
                    placeholder={`Facility ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
