import { useState } from "react";
import { useEffect } from "react";
import "./FeedbackModal.css";
import axios from "axios";

export default function FeedbackModal() {
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
            <h3>이 사이트에 대한 피드백을 입력해 주세요!</h3>
            <p>피드백을 입력해 주시면 큰 힘이 됩니다.</p>
            <form className="feedbackFrom" onSubmit={handleFeedback}>
              <textarea
                className="feedbackInput"
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="피드백을 입력해 주세요"
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
