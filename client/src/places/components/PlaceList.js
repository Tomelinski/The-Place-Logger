/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styled from 'styled-components';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import PlaceItem from './PlaceItem';

const StyledPlaceList = styled.ul`
  list-style: none;
  margin: 1rem auto;
  padding: 0;
  width: 90%;
  max-width: 40rem;
`;

const StyledPlace = styled.div`
  list-style: none;
  margin: 1rem auto;
  padding: 0;
  width: 90%;
  max-width: 40rem;
`;

const PlaceList = (props) => {
  const { items } = props;

  if (!items || items.length === 0) {
    return (
      <StyledPlace>
        <Card>
          <h2>No places found.</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </StyledPlace>
    );
  }

  // console.log(items);
  // console.log(items.length);

  return (
    <StyledPlaceList>
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </StyledPlaceList>
  );
};

export default PlaceList;
