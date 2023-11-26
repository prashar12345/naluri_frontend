/*
 * @file: main.js
 * @description: App Configration
 * @date: 27 July 2022
 * @author: Mohit
 * */

import React from 'react';
import {
    ToastsContainer,
    ToastsStore,
    ToastsContainerPosition
} from 'react-toasts';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import configureStore from './config';
import { createBrowserHistory } from 'history';
import {
    Switch,
    Route
} from 'react-router-dom';
import './scss/main.scss';

import Home from './pages/Home';
import Assessments from './pages/Assessment/Assessments';
import UserRequest from './pages/UserRequest';
import RescheduleRequest from './pages/RescheduleRequest';
import Booking from './pages/Booking';
import Cancellation from './pages/Cancellation';
import AppointmentType from './pages/AppointmentType';
import ConfirmBooking from './pages/ConfirmBooking';
import CalendarPage from './pages/Calendar';
import AppointmentProposal from './pages/AppointmentProposal';
import CAAppointments from './pages/CAAppointments';
import CancelRequestPage from './pages/CancelRequest/CancelRequestPage';
import AppointmentPage from './pages/Appointments/AppointmentPage';
import CasenoteRequest from './pages/CAAppointments/CasenoteRequest';
import Faq from './pages/FAQ';
import Audittrail from './pages/Audittrail/Audittrail'
import AssessmentDashboard from './pages/Assesment_dashboard';
import UserDashboard from './pages/User_Dasboard';
import AllUsers from './pages/Users/AllUsers';
import Login from './pages/Login';
import Forgotpassword from './pages/Forgotpassword';
import Resetpassword from './pages/Resetpassword';
import Dashboard from './pages/Dashboard';
import Counselorsearch from './pages/Counselorsearch';
import Profile from './pages/Profile'
import Appointments from './pages/Appointments'
import Availability from './pages/Availability'
import Counsellors from './pages/Counsellors'
import Profiledetail from './pages/Profiledetail'
import Privacypolicy from './pages/Privacypolicy'
import Users from './pages/Users'
import Paymentplans from './pages/Paymentplans'
import Request from './pages/Request'
import Consultation from './pages/Consultation'
import Signup from './pages/Signup'
import Settings from './pages/Settings'
import AddAssessment from './pages/Assessment/AddAssessment'
import Aboutus from './pages/Aboutus';
import BlogCategories from './pages/BlogCategories';
import Bloglisting from './pages/Bloglisting';
import BlogDetail from './pages/BlogDetail';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contactus from './pages/Contactus';
import Routes from './routes';
import CasenoteDashboard from './pages/CasenoteDashboard';

export const history = createBrowserHistory();
/************ store configration *********/
const { persistor, store } = configureStore(history);

import "react-pagination-js/dist/styles.css"; // import css

export default () => {
    return (<>
        <Provider store={store}>
            <PersistGate loading={'loading ...'} persistor={persistor}>
                <ConnectedRouter history={history}>
                    <Route>
                        <Switch>
                            <Route exact={true} path="/" store={store} component={Home} />
                            <Route exact={true} path="/dashboard" store={store} component={Dashboard} />
                            <Route exact={true} path="/casenotedashboard" store={store} component={CasenoteDashboard} />
                            <Route exact={true} path="/counselorsearch" store={store} component={Counselorsearch} />
                            <Route exact={true} path="/appointments" store={store} component={AppointmentPage} />
                            <Route exact={true} path="/ca-appointments" store={store} component={CAAppointments} />
                            <Route exact={true} path="/counsellors/appointments" store={store} component={Appointments} />
                            <Route exact={true} path="/appointments/availability" store={store} component={Availability} />
                            <Route exact={true} path="/appointments/cancel-request" store={store} component={CancelRequestPage} />
                            <Route exact={true} path="/counsellors/availability" store={store} component={Availability} />
                            <Route exact={true} path="/counsellors" store={store} component={Counsellors} />
                            <Route exact={true} path="/cancellation" store={store} component={Cancellation} />
                            <Route exact={true} path="/casenoterequest" store={store} component={CasenoteRequest} />
                            <Route exact={true} path="/users" store={store} component={Users} />
                            <Route exact={true} path="/users/all" store={store} component={AllUsers} />
                            <Route exact={true} path="/paymentplans" store={store} component={Paymentplans} />
                            <Route exact={true} path="/consultation" store={store} component={Consultation} />
                            <Route exact={true} path="/ca-appointments/calendar" store={store} component={CalendarPage} />
                            <Route exact={true} path="/appointments/calendar" store={store} component={CalendarPage} />
                            <Route exact={true} path="/profiledetail/:id" store={store} component={Profiledetail} />
                            <Route exact={true} path="/userdetail/:userId" store={store} component={Profiledetail} />
                            <Route exact={true} path="/profile" store={store} component={Profile} />
                            <Route exact={true} path="/settings" store={store} component={Settings} />
                            <Route exact={true} path="/assessment" store={store} component={AddAssessment} />
                            <Route exact={true} path="/assessments" store={store} component={Assessments} />
                            <Route exact={true} path="/booking" store={store} component={Booking} />
                            <Route exact={true} path="/appointment-types" store={store} component={AppointmentType} />
                            <Route exact={true} path="/Booking" store={store} component={Booking} />
                            <Route exact={true} path="/faq" store={store} component={Faq} />
                            <Route exact={true} path="/appointment-proposal" store={store} component={AppointmentProposal} />
                            <Route exact={true} path="/confirm-booking" store={store} component={ConfirmBooking} />
                            <Route exact={true} path="/login" store={store} component={Login} />Request
                            <Route exact={true} path="/requests" store={store} component={Request} />
                            <Route exact={true} path="/reschedule-request" store={store} component={RescheduleRequest} />
                            <Route exact={true} path="/user-requests" store={store} component={UserRequest} />
                            <Route exact={true} path="/privacypolicy" store={store} component={Privacypolicy} />
                            <Route exact={true} path="/register" component={Signup} />
                            <Route exact={true} path="/assesmentdashboard" component={AssessmentDashboard} />
                            <Route exact={true} path="/userdashboard" component={UserDashboard} />
                            <Route exact={true} path="/aboutus" component={Aboutus} />
                            <Route exact={true} path="/contactus" component={Contactus} />
                            <Route exact={true} path="/blogdetail/:id" component={BlogDetail} />
                            <Route exact={true} path="/bloglisting/:cat" component={Bloglisting} />
                            <Route exact={true} path="/blogcategories" component={BlogCategories} />
                            <Route exact={true} path="/forgotpassword" store={store} component={Forgotpassword} />
                            <Route exact={true} path="/resetpassword" store={store} component={Resetpassword} />
                            <Route exact={true} path="/audittrail" store={store} component={Audittrail} />
                            <Route exact={true} path="/terms" store={store} component={Terms} />
                            <Route exact={true} path="/privacy" store={store} component={Privacy} />
                            <Routes store={store} />
                        </Switch>
                    </Route>
                </ConnectedRouter>
            </PersistGate>
        </Provider>
        <div id="loader" className="loaderDiv d-none">
            <div>
                <img src="/assets/img/loader.gif" alt="logo" className="loaderlogo" />
            </div>
        </div>
        <ToastsContainer
            position={ToastsContainerPosition.TOP_RIGHT}
            store={ToastsStore}
        />
    </>
    );
};
