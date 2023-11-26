/*
 * @file: loalder.js
 * @description: Reducers and actions for store/manipulate loading  data
 * @date: 10 June 2020
 * @author: Mohit
 */

/******** Reducers ********/

const initialState = {
  isLoading: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'IS_LOADING':
      return { ...state, isLoading: action.status };

    case 'LOG_OUT':
      return { ...initialState };

    default:
      return state;
  }
}
