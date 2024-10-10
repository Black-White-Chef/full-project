import { useState } from "react";
import { useEffect } from "react";
import "./FeedbackModal.css";
import axios from "axios";

export default function EFeedbackModal() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }, 30000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleFeedback = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/api/v1/feedbacks/`, {
      feedback,
    });
    setFeedback("");
    setIsModalOpen(false);
  };

  const handleColseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  return (
    <>
      {isModalOpen && (
        <div className="backdrop">
          <div className="feedbackContainer">
            <h3>Please provide feedback on this site!</h3>
            <p>Your feedback would be greatly appreciated.</p>
            <form className="feedbackFrom" onSubmit={handleFeedback}>
              <textarea
                className="feedbackInput"
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Please enter your feedback."
                required
              ></textarea>
              <button className="FeedbackSbtn" type="submit">
                <span>submit</span>
              </button>
            </form>
            <button className="FeedbackCbtn" onClick={handleColseModal}>
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
}
