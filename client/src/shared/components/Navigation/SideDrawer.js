import React from 'react';
import styled from 'styled-components';
import reactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

const StyledDrawer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  height: 100vh;
  width: 70%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
`;

const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <StyledDrawer onClick={props.onClick}>{props.children}</StyledDrawer>
    </CSSTransition>
  );

  return reactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
