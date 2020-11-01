/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';

const StyledUserItem = styled.li`
    
    margin: 1rem;
    width: calc(45% - 2rem);
    min-width: 17.5rem;
  
  a {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    padding: 1rem;
    color: white;
    background: #292929;
  }
  
  a:hover,
  a:active {
    background: #ffd900;
  }
  
  .user-item__content {
    padding: 0;
  }
  
  .user-item__image {
    width: 4rem;
    height: 4rem;
    margin-right: 1rem;
  }
  
  .user-item__info h2 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: normal;
    color: #ffd900;
  }
  
  &:hover h2,
  &:active h2,
  &:hover h3,
  &:active h3 {
    color: #292929;
  }
  
  .user-item__info h3 {
    margin: 0;
  }
`;

const UserItem = (props) => (
  <StyledUserItem className="user-item">
    <Card className="user-item__content">
      <Link to={`/${props.id}/places`}>

        <div className="user-item__image">
          <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
        </div>
        <div className="user-item__info">
          <h2>{props.name}</h2>
          <h3>
            {props.placeCount}
            {' '}
            {props.placeCount === 1 ? 'Place' : 'Places'}
          </h3>
        </div>
      </Link>
    </Card>
  </StyledUserItem>
);

export default UserItem;
