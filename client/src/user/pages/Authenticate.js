import React, { useState, useContext } from 'react';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { useForm } from '../../shared/hooks/form';
import { AuthContext } from '../../shared/context/auth-context';
import { StyledForm } from '../../shared/style/StyledForm';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const Authenticate = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const {
    isLoading, error, sendRequest, clearError,
  } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    password: {
      value: '',
      isValid: false,
    },
    email: {
      value: '',
      isValid: false,
    },
  }, false);

  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData({
        ...formState.inputs,
        name: undefined,
        image: undefined,
      }, formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false,
        },
        image: {
          value: null,
          isValid: false,
        },
      }, false);
    }
    setIsLogin((prevMode) => !prevMode);
  };

  const loginSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLogin) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { 'Content-Type': 'application/json' },
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append('name', formState.inputs.name.value);
        formData.append('email', formState.inputs.email.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          'POST',
          formData);

        auth.login(responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <StyledForm onSubmit={loginSubmitHandler}>
        {isLoading && <LoadingSpinner asOverLay /> }
        <Input
          id="email"
          type="email"
          label="E-mail"
          element="input"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email"
          onInput={inputHandler}
        />
        {!isLogin && (
          <Input
            id="name"
            type="text"
            label="Name"
            element="input"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name"
            onInput={inputHandler}
          />
        )}
        {!isLogin && <ImageUpload id="image" center onInput={inputHandler} />}
        <Input
          id="password"
          type="password"
          label="Password"
          element="input"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password"
          onInput={inputHandler}
        />

        <Button type="submit" disabled={!formState.isValid}>
          {isLogin ? 'LOG IN' : 'SIGN UP'}
        </Button>
        <Button type="button" inverse onClick={switchModeHandler}>
          GO TO
          {' '}
          {isLogin ? 'SIGN UP' : 'LOG IN'}
        </Button>
      </StyledForm>
    </>
  );
};

export default Authenticate;
