import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';

const PatContext = createContext();

const initialState = {
  id: null,
  userdetails: {},
};

function patReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      const { id, details } = action.payload; // Now including `details` in the action
      return { ...state, id:id, userdetails: details };
    case 'SET_DETAILS': {
      const { details } = action.payload;
      return { ...state, userdetails: details };
    }
    default:
      return state;
  }
}

export const PatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(patReducer, initialState);


  return (
    <PatContext.Provider value={{ state, dispatch }}>
      {children}
    </PatContext.Provider>
  );
};

export const usePatContext = () => useContext(PatContext);
