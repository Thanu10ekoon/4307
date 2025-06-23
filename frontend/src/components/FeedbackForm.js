import { useState } from "react";
import axios from "../api/axios";

export default function FeedbackForm({ eventId, onFeedbackSubmitted }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.post("/feedback/submit", {
        event_id: eventId,
        user_email: user.email,
        message,
      });
      setMessage("");
      alert('Feedback submitted successfully!');
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', padding: '15px', border: '1px solid #dee2e6', backgroundColor: 'white' }}>
      <h4>Leave Feedback</h4>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your thoughts about this event..."
        required
        style={{ 
          width: '100%', 
          padding: '10px', 
          border: '1px solid #ccc', 
          marginBottom: '10px',
          minHeight: '80px'
        }}
      />
      <button 
        type="submit"
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none' 
        }}
      >
        Submit Feedback
      </button>
    </form>
  );
}