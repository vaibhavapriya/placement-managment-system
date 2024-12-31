import React from 'react'

function BookingInterview() {
    const [selectedSlot, setSelectedSlot] = useState("");

    const handleBook = async () => {
      try {
        const res = await axios.post("/api/interviews/book", {
          interviewId: interview._id,
          bookedSlot: selectedSlot,
        });
        alert("Slot booked successfully");
      } catch (err) {
        console.error(err);
        alert("Error booking slot");
      }
    };
      
  return (
    <div>BookingInterview
        <div>
        <h3>Available Slots:</h3>
        {interview.timeSlots.map((slot) => (
          <button key={slot} onClick={() => setSelectedSlot(slot)}>
            {slot}
          </button>
        ))}
        <button onClick={handleBook}>Confirm Slot</button>
      </div>
    </div>
  )
}

export default BookingInterview