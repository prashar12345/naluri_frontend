/*********** Reduceres defined here *********/

import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage'; // default: localStorage if web, AsyncStorage if react-native
import { connectRouter } from 'connected-react-router';

// reducers
import user from './modules/user';
import loader from './modules/loader';
import search from './modules/search';
import modal from './modules/modal';
import language from './modules/language';
import { createBrowserHistory } from 'history';


/*********** History function **************/
export const history = createBrowserHistory();

const userPersistConfig = {
    key: 'admin-app',
    storage: storage,
    blacklist: ['router', 'loader'],
};

export default persistCombineReducers(userPersistConfig, {
    router: connectRouter(history),
    loader,
    user,
    search,
    modal,
    language
});
