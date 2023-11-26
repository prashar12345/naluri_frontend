/*
 * @file: user.js
 * @description: Reducers and actions for store/manipulate user's  data
 * @date: 28.11.2019
 * @author: Poonam
 */

/******** Reducers ********/

const initialState = {
  data: ''
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SEARCH_SUCCESS':
      return { ...state, data: action.data };
    case 'SEARCH_OUT':
      return initialState;
    default:
      return state;
  }
}
