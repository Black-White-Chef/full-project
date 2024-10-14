import { useEffect, useState } from "react";
import Header from "./components/Header/Header.jsx";
import { blackData } from "./utills/black.js";
import { whiteData } from "./utills/white.js";
import { judgeData } from "./utills/judge.js";
import "./App.css";
import Slider from "./components/Footer/Slider.jsx";
import Modal from "./components/Modal/Modal.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import FeedbackModal from "./components/FeedbackModal/FeedbackModal.jsx";
import EFeedbackModal from "./components/FeedbackModal/EFeedbackModal.jsx";

function App() {
  const [isKorean, setIsKorean] = useState(true);
  const [isUpdate, setIsupdate] = useState(false); // 응원메세지 입력시 슬라이더 데이터 업데이트

  useEffect(() => {
    AOS.init();
  }, []);

  const setLanguage = () => {
    setIsKorean(!isKorean);
    // console.log(isKorean);
  };

  return (
    <>
      <Header setLanguage={setLanguage} />
      {isKorean ? <FeedbackModal /> : <EFeedbackModal />}

      <div className="jchef">
        {judgeData.chef.map((item, index) => (
          <div className="chefList" key={index}>
            <div
              className="imageContainer"
              data-aos="flip-left"
              data-aos-easing="ease-out-cubic"
              data-aos-duration="2000"
            >
              <img src={item.image} alt={item.name} />
              <div className="mouse">
                <h1>{isKorean ? item.name : item.Ename}</h1>
                <p>{isKorean ? item.detail : item.Edetail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container">
        <div className="wchef">
          {whiteData.chef.map((item, index) => (
            <div
              className="chefList white"
              key={index}
              data-aos="fade-up-right"
              data-aos-duration="2000"
            >
              <div className="imageContainer">
                <img src={item.image} alt={item.name} />
                <div
                  className="mouse"
                  onClick={() => window.open(item.restaurant)}
                >
                  <h1>{isKorean ? item.name : item.Ename}</h1>
                  <p>{isKorean ? item.detail : item.Edetail}</p>
                  <p className="infoMsg">
                    {isKorean ? whiteData.info : whiteData.Einfo}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bchef">
          {blackData.chef.map((item, index) => (
            <div
              className="chefList black"
              key={index}
              data-aos="fade-up-left"
              data-aos-duration="2000"
            >
              <div className="imageContainer">
                <img src={item.image} alt={item.name} />
                <div
                  className="mouse"
                  onClick={() => {
                    if (!item.restaurant) return;

                    window.open(item.restaurant);
                  }}
                >
                  <h1>{isKorean ? item.name : item.Ename}</h1>
                  <p>{isKorean ? item.detail : item.Edetail}</p>
                  <p className="infoMsg">
                    {isKorean ? blackData.info : blackData.Einfo}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section>
        <Modal update={() => setIsupdate(true)} />
      </section>
      <footer>
        <Slider update={isUpdate} setUpdate={setIsupdate} />
      </footer>
    </>
  );
}

export default App;
