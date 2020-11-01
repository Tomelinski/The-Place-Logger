import React, { useContext } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Button from '../FormElements/Button';

import { AuthContext } from '../../context/auth-context';

const StyledLink = styled.div`
.nav-links {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .nav-links li {
    margin: 1rem;
  }
  
  .nav-links a {
    border: 1px solid transparent;
    color: #292929;
    text-decoration: none;
    padding: 0.5rem;
  }
  
  .nav-links a:hover,
  .nav-links a:active,
  .nav-links a.active {
    background: #f8df00;
    border-color: #292929;
    color: #292929;
  }
  
  .nav-links button {
    cursor: pointer;
    border: 1px solid #292929;
    color: #292929;
    background: transparent;
    padding: 0.5rem;
    font: inherit;
  }
  
  .nav-links button:focus {
    outline: none;
  }
  
  .nav-links button:hover,
  .nav-links button:active {
    background: #292929;
    color: white;
  }
  
  @media (min-width: 768px) {
    .nav-links {
      flex-direction: row;
    }
  
    .nav-links li {
      margin: 0 0.5rem;
    }
  
    .nav-links a {
      color: white;
      text-decoration: none;
    }
  
    .nav-links button {
      border: 1px solid white;
      color: white;
      background: transparent;
    }
    
    .nav-links button:hover,
    .nav-links button:active {
      background: #f8df00;
      color: #292929;
    }
  }
  
`;

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <StyledLink>
      <ul className="nav-links">
        <li>
          <NavLink to="/" exact>All USERS</NavLink>
        </li>
        {/* Only visable while User is logged in */}
        {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
        )}
        {/* Only visable while User is logged in */}
        {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACES</NavLink>
        </li>
        )}
        {/* Only visable while User is logged in */}
        {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
        )}
        {auth.isLoggedIn && (
        <li>
          <Button onClick={auth.logout}>LOGOUT</Button>
        </li>
        )}
      </ul>
    </StyledLink>
  );
};

export default NavLinks;
