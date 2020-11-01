/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

const Backdrop = (props) => {
  const content = <div className="backdrop" onClick={props.onClick} />;

  return ReactDOM.createPortal(content, document.getElementById('backdrop-hook'));
};

export default Backdrop;
