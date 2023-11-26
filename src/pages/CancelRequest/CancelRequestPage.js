import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CancelRequest from '.';
import Layout from '../../components/global/layout';
import languagesModel from '../../models/languages.model';

const CancelRequestPage = (p) => {
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const searchState = useSelector((state) => state.search);

    useEffect(() => {
        if (user && user.loggedIn) {
        }
    }, [searchState, user])



    return (
        <Layout>
            {user && user.role === 'Counsellor' ? <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <Link className="nav-link" to="/appointments">{languagesModel.translate('consultation_text', language)}</Link>
                </li>
                {/* {!user.addAvailability && user.role === 'Counsellor' ? <></> : <li className="nav-item">
                    <Link className="nav-link" to="/appointments/availability">Availability</Link>
                </li>} */}
                <li className="nav-item">
                    <Link className="nav-link" to="/appointments/availability">{languagesModel.translate('availability_text', language)}</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link active" to="/appointments/cancel-request">{languagesModel.translate('cancellation_requests_text', language)}</Link>
                </li>
            </ul> : <></>}

            <CancelRequest />
        </Layout>
    );
};

export default CancelRequestPage;
