import React, { } from 'react';
import Layout from '../../components/global/layout';
import './style.scss';
import { Link } from 'react-router-dom';
import Appointments from '.';
import { useSelector } from 'react-redux';
import languagesModel from '../../models/languages.model';


const AppointmentPage = (p) => {
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    return (
        <Layout>
            {user && user.role === 'Counsellor' ? <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <span className="nav-link active">{languagesModel.translate('consultation_text', language)}</span>
                </li>
                {/* {!user.addAvailability && user.role == 'Counsellor' ? <></> : <li className="nav-item">
                    <Link className="nav-link" to="/appointments/availability">Availability</Link>
                </li>} */}
                <li className="nav-item">
                    <Link className="nav-link" to="/appointments/availability">{languagesModel.translate('availability_text', language)}</Link>
                </li>
                {/* <li className="nav-item">
                    <Link className="nav-link" to="/appointments/cancel-request">{languagesModel.translate('cancellation_requests_text', language)}</Link>
                </li> */}
            </ul> : <></>}
            <Appointments />
        </Layout>
    );
};

export default AppointmentPage;
