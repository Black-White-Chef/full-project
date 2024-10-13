import { useEffect, useRef, useState } from "react";
import "./Slider.scss";
import axios from "axios";

export default function Slider() {
  // const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const isFetching = useRef(false); // API 재호출을 제어하는 플래그

  const trackRef = useRef(null); // 트랙 전체를 참조
  const [totalWidth, setTotalWidth] = useState(0); // 트랙의 총 너비

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
    // console.log("all api 호출 요청");
    if (!isFetching.current) {
      isFetching.current = true; // API 호출 중임을 표시
      try {
        const res = await axios.get(`/api/v1/comments/all/`);
        setData(res.data.data);
        // console.log("all API 호출 완료");
      } catch (error) {
        console.error("API 호출 실패", error);
      } finally {
        isFetching.current = false; // API 호출 완료
      }
    }
  };

  useEffect(() => {
    fetchData(); // 최초 API 호출
  }, []);

  useEffect(() => {
    // 트랙의 너비를 계산하는 함수
    const calculateTrackWidth = () => {
      if (trackRef.current) {
        const trackWidth = Array.from(trackRef.current.children).reduce(
          (total, slide) => total + slide.offsetWidth,
          0
        );
        setTotalWidth(trackWidth * 2); // 총 너비를 두 배로 설정 (concat * 2)

        // const newSpeed = Math.max(15, Math.min(60, 45 * (data.length / 10))); // 데이터 개수에 따라 속도 조정

        // 현재 mock 데이터랑 연결되어있음. 나중에 변경 해줘야 함
        const newSpeed = Math.max(15, Math.min(60, 45 * (data.length / 10))); // 데이터 개수에 따라 속도 조정

        const botSpeed = Math.max(15, Math.min(60, 35 * (data.length / 10)));
        setAnimationSpeed(newSpeed);
        setAnimationSpeedBOT(botSpeed);
      }
    };

    // console.log(animationSpeed);
    // console.log(animationSpeedBOT);

    calculateTrackWidth(); // 트랙 너비 계산

    // 윈도우 리사이즈 시 트랙 너비 재계산
    window.addEventListener("resize", calculateTrackWidth);

    return () => {
      window.removeEventListener("resize", calculateTrackWidth);
    };
  }, [data]);

  // 트랙이 다 이동했을 때 API 호출을 트리거
  useEffect(() => {
    const trackElement = trackRef.current;

    const handleScroll = () => {
      const computedStyle = window.getComputedStyle(trackElement);
      const matrix = computedStyle.transform;
      // console.log("matrix 값:", matrix); // 트랜스폼 값 확인
      if (matrix !== "none") {
        const translateX = parseFloat(matrix.split(",")[4]);
        // console.log("translateX 값:", translateX); // 트랜스폼 위치 확인
        const threshold = -totalWidth / 2 + 100; // 임계값을 약간 조정하여 호출 조건 완화
        // console.log(totalWidth);
        if (translateX <= threshold && isFetching) {
          // 트랙이 절반 이동했을 때 API 호출
          // console.log("fetchData() 호출");
          fetchData();

          //-2238.63
        }
      }
    };

    // 애니메이션 타이밍에 맞춰 API 호출 감지
    const intervalId = setInterval(handleScroll, 1000 / 60); // 매 프레임마다 감지

    return () => clearInterval(intervalId); // 언마운트 시 타이머 정리
  }, [totalWidth]);

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
