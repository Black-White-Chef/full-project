import { useEffect, useRef, useState } from "react";
import "./Slider.scss";
import axios from "axios";

export default function Slider({ update, setUpdate }) {
  const [data, setData] = useState([]);
  const isFetching = useRef(false); // API 재호출을 제어하는 플래그
  const trackRef = useRef(null); // 트랙 전체를 참조
  const [animationSpeed, setAnimationSpeed] = useState(45); // 기본 애니메이션 속도
  const [animationSpeedBOT, setAnimationSpeedBOT] = useState(35); // 기본 애니메이션 속도

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
        const trackWidth = trackRef.current.scrollWidth; // 트랙 전체의 너비
        // const viewportWidth = trackRef.current.clientWidth; // 보이는 영역의 너비

        const scrollDuration = Math.max(45, trackWidth / 100); // 트랙 너비에 기반해 애니메이션 속도 계산
        const botDuration = Math.max(35, trackWidth / 160); // 두 번째 트랙을 위한 속도 계산

        setAnimationSpeed(scrollDuration); // 새로운 애니메이션 속도 설정
        setAnimationSpeedBOT(botDuration);
      }
    };

    calculateTrackWidth(); // 트랙 너비 계산

    window.addEventListener("resize", calculateTrackWidth); // 화면 크기가 변경될 때 재계산

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
