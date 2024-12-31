import React, { useState } from "react";
import axios from "axios";

const FormInterview = ({ jobId, closeModal, students }) => {
  const [slots, setSlots] = useState([
    { startTime: "", endTime: "", location: "", videoCallLink: "" },
  ]);
  const [type, setType] = useState("virtual");
  const [allowBooking, setAllowBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index][field] = value;
    setSlots(updatedSlots);
  };

  const addSlot = () => {
    setSlots([...slots, { startTime: "", endTime: "", location: "", videoCallLink: "" }]);
  };

  const removeSlot = (index) => {
    const updatedSlots = slots.filter((_, i) => i !== index);
    setSlots(updatedSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyFields = slots.some((slot) =>
      type === "virtual"
        ? !slot.startTime || !slot.endTime || !slot.videoCallLink
        : !slot.startTime || !slot.endTime || !slot.location
    );

    if (hasEmptyFields) {
      setError("Please fill all fields for each slot.");
      return;
    }

    if (!students.length) {
      setError("No shortlisted students found for this job.");
      return;
    }

    setError(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to schedule interviews.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/interviews/schedule",
        {
          jobId,
          slots,
          type,
          allowBooking,
          students,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      closeModal();
    } catch (error) {
      console.error("Error scheduling interviews:", error);
      setError("Failed to schedule interviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Schedule Interviews</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Interview Type */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Interview Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="virtual">Virtual</option>
              <option value="in-person">In-Person</option>
            </select>
          </div>

          {/* Slots */}
          {slots.map((slot, index) => (
            <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
              <h3 className="font-semibold mb-2">Slot {index + 1}</h3>
              <div className="mb-4">
                <label className="block font-medium mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={slot.startTime}
                  onChange={(e) => handleSlotChange(index, "startTime", e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={slot.endTime}
                  onChange={(e) => handleSlotChange(index, "endTime", e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              {type === "virtual" ? (
                <div className="mb-4">
                  <label className="block font-medium mb-1">Video Call Link</label>
                  <input
                    type="url"
                    value={slot.videoCallLink}
                    onChange={(e) => handleSlotChange(index, "videoCallLink", e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={slot.location}
                    onChange={(e) => handleSlotChange(index, "location", e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
              )}
              {slots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove Slot
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSlot} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            + Add Slot
          </button>
          <div className="mb-4 flex items-center mt-4">
            <input
              type="checkbox"
              checked={allowBooking}
              onChange={(e) => setAllowBooking(e.target.checked)}
              className="mr-2"
            />
            <label className="font-medium">Allow Booking by Candidates</label>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 mr-2">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule Interviews"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormInterview;

