import React, { useState, useEffect } from "react";
import axios from "axios";

function FormSlot({ interviewId, onClose }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available slots for the interview
    const fetchSlots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/interviews/slots/${interviewId}`, {interviewId},// Get slots for interviewId
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSlots(response.data);
      } catch (error) {
        console.error("Error fetching slots:", error);
        alert("Failed to fetch slots.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const handleSlotSelection = (slotId) => {
    setSelectedSlot(slotId);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      alert("Please select a slot.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/interviews/slot/${interviewId}/${selectedSlot}`,
        { interviewId: interviewId,  slotId: selectedSlot },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Slot successfully booked!");
      onClose(); // Close the modal after booking
    } catch (error) {
      console.error("Error booking slot:", error);
      alert("Failed to book the slot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="text-lg font-bold">Schedule Interview</h3>
        {loading ? (
          <p>Loading available slots...</p>
        ) : (
          <div>
            <h4 className="text-md mb-4">Available Slots:</h4>
            <div className="grid grid-cols-3 gap-4">
            {slots.map((slot) => (
            <button
                key={slot._id}
                onClick={() => handleSlotSelection(slot._id)}
                disabled={slot.status === "booked"}
                className={`px-4 py-2 border rounded ${slot.status === "booked" ? "bg-red-500 text-white cursor-not-allowed" : "bg-green-500 text-white"}`}
            >
                {slot.startTime} {slot.status === "booked" ? "(Booked)" : "(Open)"}
            </button>
            ))}

            </div>
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
              >
                {loading ? "Booking..." : "Book Slot"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400 ml-4"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormSlot;
