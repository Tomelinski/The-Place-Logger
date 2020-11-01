/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';

const StyledHeader = styled.div`

.main-navigation__menu-btn {
    width: 3rem;
    height: 3rem;
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-right: 2rem;
    cursor: pointer;
  }
  
  .main-navigation__menu-btn span {
    display: block;
    width: 3rem;
    height: 2.5px;
    background: white;
  }
  
  .main-navigation__title {
    color: white;
  }
  
  .main-navigation__title a {
    text-decoration: none;
    color: white;
  }
  
  .main-navigation__header-nav {
    display: none;
  }
  
  .main-navigation__drawer-nav {
    height: 100%;
  }
  
  @media (min-width: 768px) {
    .main-navigation__menu-btn {
      display: none;
    }
  
    .main-navigation__header-nav {
      display: block;
    }
  }
`;

const MainNav = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <StyledHeader>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">
            Your Places
          </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </StyledHeader>
  );
};

export default MainNav;
