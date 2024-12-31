import React, { useState, useEffect } from "react";
import axios from "axios";

// Helper function to format time to IST
const formatTimeToIST = (utcTime) => {
  const date = new Date(utcTime);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };
  return date.toLocaleString("en-IN", options);
};

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
          `http://localhost:5000/interviews/slots/${interviewId}`,
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
  }, [interviewId]); // Dependency on interviewId to fetch fresh slots if it changes

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
        { interviewId: interviewId, slotId: selectedSlot },
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
    <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="modal-content bg-white p-8 rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto shadow-lg"> {/* Added max-h-screen and overflow-y-auto */}
        <h3 className="text-lg font-bold text-center mb-6">Schedule Interview</h3> {/* Added more spacing */}
        {loading ? (
          <p className="text-center">Loading available slots...</p>
        ) : (
          <div>
            <h4 className="text-md mb-6">Available Slots:</h4> {/* Increased spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Increased spacing */}
              {slots.map((slot) => (
                <button
                  key={slot._id}
                  onClick={() => handleSlotSelection(slot._id)}
                  disabled={slot.status === "booked"}
                  className={`px-6 py-3 rounded-lg font-medium text-white ${slot.status === "booked" ? "bg-red-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-400"} transition-all duration-300 ease-in-out`}
                >
                  {formatTimeToIST(slot.startTime)}{" "}
                  {slot.status === "booked" ? "(Booked)" : "(Open)"}
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end space-x-6"> {/* Increased space between buttons */}
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors duration-300"
              >
                {loading ? "Booking..." : "Book Slot"}
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition-colors duration-300"
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
