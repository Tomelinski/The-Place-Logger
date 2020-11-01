import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
// import styled from 'styled-components';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form';
import Card from '../../shared/components/UIElements/Card';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/context/auth-context';

import { StyledForm } from '../../shared/style/StyledForm';

const UpdatePlace = () => {
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { placeId } = useParams();

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: false,
    },
    description: {
      value: '',
      isValid: false,
    },
  }, false);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          }, true,
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchPlaces();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
        },
        { Authorization: `Bearer ${auth.token}` });
      history.push(`/${auth.userId}/places`);
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <Card>
        <h2>Could not find place</h2>
      </Card>
    );
  }

  return (
    <>
      {!isLoading && loadedPlace && (
      <StyledForm onSubmit={placeUpdateSubmitHandler}>
        <ErrorModal error={error} onClear={clearError} />
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputHandler}
          value={loadedPlace.title}
          valid
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description(Min 5 char)"
          onInput={inputHandler}
          value={loadedPlace.description}
          valid
        />
        <Button type="Submit" disabled={!formState.isValid}>
          Update Place
        </Button>
      </StyledForm>
      )}
    </>
  );
};

export default UpdatePlace;
