import React from "react";
import Logo from "../../images/logo1.png";
import "./footer.scss";

const footer = () => {
  return (
    <div className="footer-main">
      <img className="footer-main-img" src={Logo} alt="logo" />
      <div className="footer-logo">Classic Chords</div>
      <div className="footer-main-copywrite">
        © Copyright Classic Chords, llc. All right reserved.
      </div>
    </div>
  );
};

export default footer;
