/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const StyledPlaceItem = styled.li`
  margin: 1rem 0;

.place-item__content {
  padding: 0;
}

.place-item__info {
  padding: 1rem;
  text-align: center;
}

.place-item__image {
  width: 100%;
  height: 12.5rem;
  margin-right: 1.5rem;
}

.place-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.place-item__info h2,
.place-item__info h3,
.place-item__info p {
  margin: 0 0 0.5rem 0;
}

.place-item__actions {
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #ccc;
}

.place-item__actions button,
.place-item__actions a {
  margin: 0.5rem;
}


@media (min-width: 768px) {
  .place-item__image {
    height: 20rem;
  } 
}
`;

const StyledPlaceModal = styled.div`
margin: 1rem 0;

.map-container{
  height:20rem;
  width:100%;
}

.place-item__modal-content {
  padding: 0;
}

.place-item__modal-actions {
  text-align: right;
}
`;

const PlaceItem = (props) => {
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        'DELETE',
        null,
        { Authorization: `Bearer ${auth.token}` },
      );
      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <StyledPlaceModal>
        <Modal
          show={showMap}
          onCancel={closeMapHandler}
          header={props.address}
          contentClass="place-item__modal-content"
          footerClass="place-item__modal-actions"
          footer={<button onClick={closeMapHandler}>Close</button>}
        >
          <div className="map-container">
            <Map center={props.coordinates} zoom={16} />
          </div>
        </Modal>
        <Modal
          show={showConfirmModal}
          onCancel={cancelDeleteHandler}
          header="Are you sure?"
          footerClass="place-item__modal-actions"
          footer={(
            <>
              <Button onClick={confirmDeleteHandler} danger>DELETE</Button>
              <Button onClick={cancelDeleteHandler} inverse>CANCEL</Button>
            </>
          )}
        >
          <p>Do you want to proceed and delete this place? action cannot be undone</p>
        </Modal>
      </StyledPlaceModal>
      <StyledPlaceItem>
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>View on map</Button>
            {auth.userId === props.creatorId
            && (<Button to={`/places/${props.id}`}>Edit</Button>)}
            {auth.userId === props.creatorId
            && (<Button onClick={showDeleteWarningHandler} danger>Delete</Button>)}
          </div>

        </Card>
      </StyledPlaceItem>
    </>
  );
};

export default PlaceItem;
