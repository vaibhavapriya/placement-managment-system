import React, { createContext, useReducer, useContext }  from 'react';
const PatContext = createContext();

const initialState={
    id:null,
    userdetails:{},
}
    
function patReducer(state, action) {
    switch (action.type) {
        case 'SET_USER': {
            const { id } = action.payload;
            return { ...state, id };
        }
        case 'SET_DETAILS':{
            const { details } = action.payload;
            return { ...state, userdetails : details };
        }
        default:
            return state;
    }
}

  // Fetch the user ID from localStorage or token (Example)
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios
//         .get('http://localhost:5000/auth/me', { headers: { Authorization: `Bearer ${token}` } })
//         .then((response) => {
//             SET_USER(response.data.id); // Set the user ID
//         })
//         .catch((error) => {
//           console.error('Error fetching user data:', error);
//         });
//     }
//   }, []);
export const PatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(patReducer, initialState);

    return (
        <PatContext.Provider value={{ state, dispatch }}>
            {children}
        </PatContext.Provider>
    );
};

export const usePatContext = () => useContext(PatContext);