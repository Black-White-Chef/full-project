import { useState } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import "./Modal.css";
import axios from "axios";

export default function Modal({ update }) {
  // const API_URL = import.meta.env.VITE_API_URL;
  const [modal, setModal] = useState(false);
  const [isNickname, setIsNickname] = useState(""); // 닉네임 생성
  const [isDisabled, setIsDisabled] = useState(false); // 버튼 비활성화 상태 추가
  const [nickname, setNickname] = useState(""); // 응원 닉네임
  const [comment, setComment] = useState(""); // 응원 메세지
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // 버튼 비활성화 상태
  const [countdown, setCountdown] = useState(0); // 카운트다운 상태

  // 닉네임 생성 함수
  const createNicknameHandler = (e) => {
    e.preventDefault();
    axios
      .post(`/api/v1/nicknames/`, {
        nickname: isNickname,
      })
      .then((res) => {
        if (res.status === 201) {
          setIsDisabled(true); // 성공 시 버튼 비활성화
        }
      })
      .catch((err) => alert(err.response.data.error));
  };

  // 응원 메세지 생성 함수
  const handleModal = (e) => {
    e.preventDefault();
    // console.log("Nickname:", nickname);
    // console.log("Comment:", comment);

    axios
      .post(`/api/v1/comments/`, {
        nickname,
        comment_text: comment,
      })
      .then(() => {
        // console.log(res);
        update(); // 슬라이더 업데이트 true로 설정

        // 버튼 비활성화 및 카운트다운 시작
        setIsButtonDisabled(true);
        setCountdown(30); // 카운트다운 10초로 설정

        // 10초 카운트다운
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(countdownInterval); // 카운트다운이 0이 되면 인터벌 중지
              setIsButtonDisabled(false); // 버튼 활성화
              return 0; // 카운트다운을 0으로 설정
            }
            return prev - 1; // 카운트다운 1초씩 감소
          });
        }, 1000); // 1초마다 호출

        setModal(false);

        // 입력 값 초기화
        setNickname("");
        setComment("");
      })
      .catch((err) => alert(err.response.data.comment_text));

    // post 성공해야지 모달 내리고, input 내용 초기화
    // 갑자기 든 생각은 nickname으로 '닉네임 생성' 하고 댓글 생성할 때도 nickname으로 '댓글 생성'
    // 하는데, 한 사용자가 nickname을 여러번 입력하게 된다면 2번 째 부터는 '닉네임 생성'에서 중복에러가 뜰 수도 있지 않을까 싶음
  };

  return (
    <>
      <div className="modalContainer">
        <Fab
          size="medium"
          color="primary"
          aria-label="add"
          onClick={() => {
            setModal((prev) => !prev);
          }}
        >
          <AddIcon />
        </Fab>
        {/* {modal && ( */}
        <div className={`modal ${modal ? "show" : "hide"}`}>
          <div className="MH">
            <h3>응원 메세지를 입력해주세요!</h3>
            <h4>Please enter a message of support!!</h4>
          </div>

          <form className="nickNameCreate" onSubmit={createNicknameHandler}>
            <input
              className="CNI"
              onChange={(e) => setIsNickname(e.target.value)}
              placeholder="Create a nickname"
              disabled={isDisabled}
            />
            <button
              className="CNIB"
              type="submit"
              // onClick={createNicknameHandler}
              disabled={isDisabled} // 버튼 상태 관리
            >
              +
            </button>
          </form>
          {isDisabled && (
            <div>
              <p className="sucessMsg">
                닉네임 생성 성공! 응원 메세지를 작성해주세요.
              </p>
              <p className="sucessMsg">
                Nickname creation success! Please write a message of support.
              </p>
            </div>
          )}
          <form className="submitForm" onSubmit={handleModal}>
            <input
              className="nicknameInput"
              label="Nickname"
              required
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <textarea
              className="commentInput"
              // defaultValue=""
              placeholder="Comments"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              maxLength="30"
            />
            <div className="btnc">
              <button
                type="submit"
                className="sbtn"
                disabled={isButtonDisabled} // 버튼 비활성화 상태에 따라 비활성화
              >
                SUBMIT {isButtonDisabled && `(${countdown})`}{" "}
                {/* 버튼 비활성화 시 카운트다운 표시 */}
              </button>
            </div>
          </form>
        </div>
        {/* )} */}
      </div>
    </>
  );
}
