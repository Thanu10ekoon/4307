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
    <div className="card">
      <h4 style={{ marginBottom: '15px' }}>Leave Feedback</h4>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your thoughts about this event..."
          required
          className="form-textarea"
        />
        <button 
          type="submit"
          className="btn btn-success btn-full"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}