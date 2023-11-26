/*
 * @file: user.js
 * @description: Reducers and actions for store/manipulate user's  data
 * @date: 28.11.2019
 * @author: Poonam
 */

/******** Reducers ********/

const initialState = {
  id: '', value: 'hide'
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'MODAL_SUCCESS':
      return { ...state, ...action.data };
    case 'MODAL_OUT':
      return initialState;
    default:
      return state;
  }
}
