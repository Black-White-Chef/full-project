import { useEffect, useRef, useState } from "react";
import "./Slider.scss";
import axios from "axios";

export default function Slider() {
  // const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const isFetching = useRef(false); // API 재호출을 제어하는 플래그

  const fetchData = async () => {
    if (!isFetching.current) {
      isFetching.current = true; // API 호출 중임을 표시
      try {
        const res = await axios.get(`/api/v1/comments/all/`);
        setData(res.data.data);
        // console.log("api 호출!!!");
      } catch (error) {
        console.error("API 호출 실패", error);
      } finally {
        isFetching.current = false; // API 호출 완료
      }
    }
  };

  // console.log(data);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData(); // 일정 시간마다 API 재호출
    }, 120000); // 120초마다 호출

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return (
    <>
      <div className="slider-wrapper">
        <div className="slider">
          <div className="slide-track slide-track-t">
            {Array.isArray(data) &&
              data.length > 0 &&
              data.map(
                (
                  item // data가 배열인지 확인
                ) => (
                  <div className="slide" key={item.id}>
                    {item.comment}
                    <span className="name">-{item.nickname}</span>
                  </div>
                )
              )}

            {/* {texts.concat(texts).map((text, index) => (
              <div className="slide" key={index}>
                {text}
              </div>
            ))} */}
          </div>
        </div>
        <div className="slider">
          <div className="slide-track slide-track-b">
            {Array.isArray(data) &&
              data.length > 0 &&
              data.map(
                (
                  item // data가 배열인지 확인
                ) => (
                  <div className="slide" key={item.id}>
                    {item.comment}
                    <span className="name">-{item.nickname}</span>
                  </div>
                )
              )}
            {/* {texts.concat(texts).map((text, index) => (
              <div className="slide" key={index}>
                {text}
              </div>
            ))} */}
          </div>
        </div>
      </div>
      <div className="gap"></div>
    </>
  );
}
