import React, { useState } from "react";
import axios from "axios";

const FormInterview = ({ jobId, closeModal, students }) => {
  const [slots, setSlots] = useState([{ startTime: "", endTime: "" }]);
  const [type, setType] = useState("virtual");
  const [videoCallLink, setVideoCallLink] = useState("");
  const [location, setLocation] = useState("");
  const [allowBooking, setAllowBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = slots.map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    );
    setSlots(updatedSlots);
  };

  const addSlot = () => {
    setSlots([...slots, { startTime: "", endTime: "" }]);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (students.length === 0) {
      setError("No shortlisted students found for this job.");
      return;
    }

    const hasEmptyFields = slots.some(
      (slot) => !slot.startTime || !slot.endTime
    );
    if (hasEmptyFields) {
      setError("Please fill in all the fields for each slot.");
      return;
    }

    if (type === "virtual" && !videoCallLink) {
      setError("Please provide a video call link for virtual interviews.");
      return;
    }

    if (type === "in-person" && !location) {
      setError("Please provide a location for in-person interviews.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to schedule interviews.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/interviews/schedule",
        {
          jobId,
          slots,
          type,
          videoCallLink,
          location,
          allowBooking,
          students,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      closeModal();
    } catch (err) {
      setError("Failed to schedule interviews. Please try again.");
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
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
            >
              <option value="virtual">Virtual</option>
              <option value="in-person">In-Person</option>
            </select>
          </div>

          {/* Dynamic Fields */}
          {type === "virtual" ? (
            <div className="mb-4">
              <label className="block font-medium mb-1">Video Call Link</label>
              <input
                type="url"
                value={videoCallLink}
                onChange={(e) => setVideoCallLink(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter video call link"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block font-medium mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter interview location"
              />
            </div>
          )}

          {/* Slots Section */}
          <div className="mb-4">
            {slots.map((slot, index) => (
              <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
                <h3 className="font-semibold mb-2">Slot {index + 1}</h3>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Start Time</label>
                  <input
                    type="datetime-local"
                    value={slot.startTime}
                    onChange={(e) =>
                      handleSlotChange(index, "startTime", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">End Time</label>
                  <input
                    type="datetime-local"
                    value={slot.endTime}
                    onChange={(e) =>
                      handleSlotChange(index, "endTime", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
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
            <button
              type="button"
              onClick={addSlot}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add Slot
            </button>
          </div>

          {/* Allow Booking Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={allowBooking}
              onChange={(e) => setAllowBooking(e.target.checked)}
              className="mr-2"
            />
            <label className="font-medium">Allow Booking by Candidates</label>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Schedule Interviews"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormInterview;


