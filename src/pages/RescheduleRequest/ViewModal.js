import React, { } from "react";
import { useSelector } from "react-redux";
import datepipeModel from "../../models/datepipemodel";
import languagesModel from '../../models/languages.model';

const ViewModal = ({ form }) => {
    const language = useSelector(state => state.language.data)

    return <>
        <a id="openviewModal" data-toggle="modal" data-target="#viewModal"></a>
        <div className="modal fade" id="viewModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"> {languagesModel.translate('view_appointment', language)}</h5>
                        <button type="button" id="closeviewappointmentModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="col-md-6 mb-3">
                                <label>{languagesModel.translate('date_time_heading', language)}</label>
                                <p className="mb-0">{form && datepipeModel.date(form.createdAt)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>{languagesModel.translate('user_name', language)}</label>
                                <p className="mb-0">{form && form.userId && form.userId.fullName}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>{languagesModel.translate('ic_no_heading', language)}</label>
                                <p className="mb-0">{form && form.userId && form.userId.ic_number}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>{languagesModel.translate('phonenumber_heading', language)}</label>
                                <p className="mb-0">{form && form.userId && form.userId.dialCode + form.userId.mobileNo}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>{languagesModel.translate('appointmentdate_heading', language)}</label>
                                <p className="mb-0">{datepipeModel.date(form && form.appointmentDate)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>{languagesModel.translate('appointment_time', language)}</label>
                                <p className="mb-0">{datepipeModel.isotime(form && form.start)}-{datepipeModel.isotime(form && form.end)}</p>
                            </div>
                        </div>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ViewModal