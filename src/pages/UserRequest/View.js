
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import datepipeModel from '../../models/datepipemodel';
import languagesModel from '../../models/languages.model';

const ViewModal = ({ form, modalClosed }) => {
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)

    useEffect(() => {

    }, [])


    return <>
        <a id="openviewModal" data-toggle="modal" data-target="#viewModal"></a>
        <div className="modal fade" id="viewModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{languagesModel.translate('view_request', language)}</h5>
                        <button type="button" id="closeviewModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className='modal-body'>
                        <div className="form-row">
                            <div className="col-md-6 mb-3">
                                <label>{languagesModel.translate('schedule_date', language)}</label>
                                <p className="mb-0">{form && form.scheduleId && datepipeModel.date(form.scheduleId.scheduleDate)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>{languagesModel.translate('slot_text', language)}</label>
                                <p className="mb-0">{form && form.slotId && datepipeModel.time(form.slotId.start)}-{form && form.slotId && datepipeModel.time(form.slotId.end)}</p>
                            </div>
                            <div className="col-md-12 mb-3">
                                <h5>{languagesModel.translate('user_detail', language)}</h5>
                                <div className="form-row viewFormRow">
                                    <div className="col-md-6 mb-3">
                                        <label>{languagesModel.translate('name_text', language)}</label>
                                        <p className="mb-0">{form && form.userId.fullName}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>{languagesModel.translate('icnumber_text', language)}</label>
                                        <p className="mb-0">{form && form.userId.ic_number}</p>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>{languagesModel.translate('mobile_number', language)}</label>
                                        <p className="mb-0">{form && form.userId.dialCode && form.userId.dialCode + form.userId.mobileNo}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" type="button" data-dismiss="modal">{languagesModel.translate('cancel_button', language)}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ViewModal