import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.svg";
import "./PollHistoryPage.css"; 

let apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";
const socket = io(apiUrl);

const PollHistoryPage = () => {
  const [polls, setPolls] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getPolls = async () => {
      const username = sessionStorage.getItem("username");

      try {
        const response = await axios.get(`${apiUrl}/polls/${username}`);
        setPolls(response.data.data);
        if (response.data.data.length === 0) {
          setShowModal(true); // Show modal if no polls exist
        }
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    getPolls();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const calculatePercentage = (count, totalVotes) => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const handleBack = () => {
    navigate("/teacher-home-page");
  };

  let questionCount = 0;

  return (
    <div className="container mt-5 w-50">
      {/* Back Button */}
      <div className="mb-4 text-left">
        <img
          src={backIcon}
          alt=""
          width={"25px"}
          style={{ cursor: "pointer" }}
          onClick={handleBack}
        />{" "}
        View <b>Poll History</b>
      </div>

      {/* Poll List */}
      {polls.length > 0 ? (
        polls.map((poll) => {
          const totalVotes = poll.options.reduce(
            (sum, option) => sum + option.votes,
            0
          );

          return (
            <div key={poll._id} className="card mb-4">
              <div className="pb-3">{`Question ${++questionCount}`}</div>
              <div className="card-body">
                <h6 className="question py-2 ps-2 text-left rounded text-white">
                  {poll.question} ?
                </h6>
                <div className="list-group mt-4">
                  {poll.options.map((option) => (
                    <div
                      key={option._id}
                      className="list-group-item rounded m-2"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{option.text}</span>
                        <span>
                          {Math.round(
                            calculatePercentage(option.votes, totalVotes)
                          )}
                          %
                        </span>
                      </div>
                      <div className="progress mt-2">
                        <div
                          className="progress-bar progress-bar-bg"
                          role="progressbar"
                          style={{
                            width: `${calculatePercentage(
                              option.votes,
                              totalVotes
                            )}%`,
                          }}
                          aria-valuenow={option.votes}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      ) : null}

      {/* Custom Styled Modal */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3 className="modal-title">🚀 No Polls Found!</h3>
            <p className="modal-text">
              It looks like you haven't created any polls yet.
              <br /> Start by entering your first question.
            </p>
            <button className="modal-button" onClick={handleCloseModal}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollHistoryPage;
