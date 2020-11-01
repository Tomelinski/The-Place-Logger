/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styled from 'styled-components';
import Card from '../../shared/components/UIElements/Card';

import UserItem from './UserItem';

const StyledUserList = styled.ul`

    list-style: none;
    margin: 0 auto;
    padding: 0;
    width: 90%;
    max-width: 50rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  
`;

const UserList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Users Found</h2>
        </Card>
      </div>
    );
  }
  return (
    <StyledUserList className="user-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </StyledUserList>
  );
};

export default UserList;
