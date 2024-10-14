import "./Header.css";
import { useState } from "react";
import logoImg from "../../assets/chef/bw-chef-logo.png";

export default function Header({ setLanguage }) {
  const [isKorean, setIsKorean] = useState(true);

  const LanguageTbtn = () => {
    setIsKorean(!isKorean);
    setLanguage();
  };

  return (
    <>
      <header className="header">
        <img src={logoImg} alt="logo-Img" />
      </header>
      <div className="produceBy">
        <p>출처: Netflix, Youtube</p>
        <a
          href="https://www.instagram.com/blackwhite_chef?igsh=amhraHFrMjBuaDh3"
          target="_blank"
          rel="noopener noreferrer"
        >
          @blackwhite_chef
        </a>
      </div>

      <button className="Lbtn" onClick={LanguageTbtn}>
        {isKorean ? "English" : "한국어"}
      </button>
    </>
  );
}
