/* eslint-disable react/destructuring-assignment */
import React, { useReducer, useEffect } from 'react';

import { validate } from '../../util/validators';
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || '',
    isTouched: false,
    isValid: props.valid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  const changeHangler = (event) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH',
      isTouched: true,
    });
  };

  const element = props.element === 'input' ? (
    <input
      id={id}
      type={props.type}
      placeholder={props.placeholder}
      onChange={changeHangler}
      onBlur={touchHandler}
      value={value}
    />
  ) : (
    <textarea
      id={id}
      rows={props.rows || 3}
      onChange={changeHangler}
      onBlur={touchHandler}
      value={value}
    />
  );

  return (
    <div className={`form-control ${!isValid && inputState.isTouched && 'form-control--invalid'}`}>
      <label htmlFor={id}>{props.label}</label>
      {element}
      {!isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
