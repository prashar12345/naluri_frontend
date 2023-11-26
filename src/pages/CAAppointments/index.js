import React, { useState } from 'react';
import Layout from '../../components/global/layout';
import './style.scss';
import AppointmentProposal from '../AppointmentProposal';
import CancelRequest from '../CancelRequest';
import RescheduleRequest from '../RescheduleRequest';
import Appointments from '../Appointments';
import languagesModel from '../../models/languages.model';
import { useSelector } from 'react-redux';

const CAAppointments = (p) => {
    const [tab, setTab] = useState('sessions')
    const language = useSelector(state => state.language.data)

    return (
        <Layout>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <span className={`nav-link ${tab === 'sessions' && 'active'}`} onClick={() => setTab('sessions')}>{languagesModel.translate('consultation_text', language)}</span>
                </li>
                <li className="nav-item">
                    <span className={`nav-link ${tab === 'proposal' && 'active'}`} href="#" onClick={() => setTab('proposal')}>{languagesModel.translate('appointment_proposal', language)}</span>
                </li>
                <li className="nav-item">
                    <span className={`nav-link ${tab === 'cancellation' && 'active'}`} href="#" onClick={() => setTab('cancellation')}>{languagesModel.translate('cancellation_requests_text', language)}</span>
                </li>
                <li className="nav-item">
                    <span className={`nav-link ${tab === 'reschedule' && 'active'}`} href="#" onClick={() => setTab('reschedule')}>{languagesModel.translate('reschedule_requests', language)}</span>
                </li>
            </ul>

            <div>
                {tab === 'sessions' && <>
                    <Appointments />
                </>}
                {tab === 'proposal' && <AppointmentProposal />}
                {tab === 'cancellation' && <CancelRequest />}
                {tab === 'reschedule' && <RescheduleRequest />}
            </div>
        </Layout >

    );
};

export default CAAppointments;
