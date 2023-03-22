import React from "react";
import "./artistsinglepopup.scss";

const ArtistSinglePopup = (props) => {
  return (
    <div className="popup-box">
      <div className="box">
        <div className="box-inner">
          <div className="popup-header">Request</div>
          <div className="close-icon" onClick={props.handleClose}>
            x
          </div>
        </div>
        {props.content}
      </div>
    </div>
  );
};

export default ArtistSinglePopup;
