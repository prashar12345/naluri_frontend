
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ToastsStore } from 'react-toasts';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import modalModel from '../../models/modal.model';
import languagesModel from '../../models/languages.model';

const MarkasComplete = ({ form, modalClosed }) => {
    const language = useSelector(state => state.language.data)
    const history = useHistory()
    const user = useSelector(state => state.user)
    useEffect(() => {

    }, [])


    const markComplete = (userAttended) => {
        if (window.confirm("Do you want to complete this appointment")) {
            loader(true)
            ApiClient.put('mark/complete', { appointmentId: form.id, userAttended: userAttended }).then(res => {
                if (res.success) {
                    ToastsStore.success(res.message)
                    modalModel.close('markasCompleteModal')
                    modalClosed()
                }
                loader(false)
            })
        }
    }


    return <>
        <div className="modal fade" id="markasCompleteModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-md">
                <div className="modal-content ">
                    <div className="modal-header">
                        <h5 className="modal-title">{languagesModel.translate('mark_as_complete', language)}</h5>
                        <button type="button" id="closeappointmentModal" className="close" data-dismiss="modal" aria-label="Close" title='Close'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className='modal-body'>
                        <div className="form-row">
                            {languagesModel.translate('did_the_user_attend_the_session', language)}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" type="button" onClick={() => markComplete('no')}> {languagesModel.translate('no_text', language)}</button>
                        <button className="btn btn-primary" type="button" onClick={() => markComplete('yes')}>{languagesModel.translate('yes_text', language)}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default MarkasComplete