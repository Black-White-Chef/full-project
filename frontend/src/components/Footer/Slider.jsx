import { useEffect, useRef, useState } from "react";
import "./Slider.scss";
import axios from "axios";

export default function Slider({ update, setUpdate }) {
  // const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const isFetching = useRef(false); // API 재호출을 제어하는 플래그

  const trackRef = useRef(null); // 트랙 전체를 참조

  const [animationSpeed, setAnimationSpeed] = useState(45); // 기본 애니메이션 속도
  const [animationSpeedBOT, setAnimationSpeedBOT] = useState(35); // 기본 애니메이션 속도

  // const fetchData = async () => {
  //   if (!isFetching.current) {
  //     isFetching.current = true; // API 호출 중임을 표시
  //     try {
  //       const res = await axios.get(`/api/v1/comments/all/`);
  //       setData(res.data.data);
  //       // console.log("api 호출!!!");
  //     } catch (error) {
  //       console.error("API 호출 실패", error);
  //     } finally {
  //       isFetching.current = false; // API 호출 완료
  //     }
  //   }
  // };

  // // console.log(data);

  // useEffect(() => {
  //   fetchData();

  //   const intervalId = setInterval(() => {
  //     fetchData(); // 일정 시간마다 API 재호출
  //   }, 120000); // 120초마다 호출

  //   return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 타이머 정리
  // }, []);

  // ************ 테스트

  const fetchData = async () => {
    if (!isFetching.current) {
      isFetching.current = true;
      try {
        const res = await axios.get(`/api/v1/comments/all/`);
        setData(res.data.data); // API로부터 데이터 가져오기
      } catch (error) {
        console.error("API 호출 실패", error);
      } finally {
        isFetching.current = false;
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // update가 true일 때만 데이터 가져오기
  useEffect(() => {
    if (update) {
      fetchData().then(() => {
        setUpdate(false); // 데이터 가져온 후 다시 false로 변경
      });
    }
  }, [update, setUpdate]);

  useEffect(() => {
    // 트랙의 너비를 계산하는 함수
    const calculateTrackWidth = () => {
      if (trackRef.current) {
        const newSpeed = Math.max(15, Math.min(60, 45 * (data.length / 10))); // 데이터 개수에 따라 속도 조정
        const botSpeed = Math.max(15, Math.min(60, 35 * (data.length / 10)));
        setAnimationSpeed(newSpeed);
        setAnimationSpeedBOT(botSpeed);
      }
    };

    calculateTrackWidth(); // 트랙 너비 계산

    window.addEventListener("resize", calculateTrackWidth);

    return () => {
      window.removeEventListener("resize", calculateTrackWidth);
    };
  }, [data]);

  return (
    <>
      <div className="slider-wrapper">
        <div className="slider">
          <div
            className="slide-track"
            ref={trackRef}
            style={{
              animation: `scroll ${animationSpeed}s linear infinite`,
            }}
          >
            {Array.isArray(data) &&
              data.length > 0 &&
              data.concat(data).map((item, index) => (
                <div className="slide" key={index}>
                  {item.comment}
                  <span className="name">-{item.nickname}</span>
                </div>
              ))}

            {/* {texts.concat(texts).map((text, index) => (
              <div className="slide" key={index}>
                {text}
              </div>
            ))} */}
          </div>
        </div>
        <div className="slider">
          <div
            className="slide-track"
            style={{
              animation: `scroll ${animationSpeedBOT}s linear infinite`,
            }}
          >
            {Array.isArray(data) &&
              data.length > 0 &&
              data.concat(data).map((item, index) => (
                <div className="slide" key={index}>
                  {item.comment}
                  <span className="name">-{item.nickname}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="gap"></div>
    </>
  );
}
