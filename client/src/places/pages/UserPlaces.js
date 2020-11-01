import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

// import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
  // clearError, error,
  const {
    isLoading, sendRequest,
  } = useHttpClient();
  const { userId } = useParams();
  const [loadedPlaces, setLoadedPlaces] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
        setLoadedPlaces(responseData.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedhandler = (deletePlaceId) => {
    setLoadedPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== deletePlaceId));
  };

  return (
    <>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {isLoading && <div className="center"><LoadingSpinner asOverlay /></div>}
      {!isLoading
      && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedhandler} />}
    </>
  );
};

export default UserPlaces;
