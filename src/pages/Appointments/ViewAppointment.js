import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import ApiClient from "../../methods/api/apiClient";
import datepipeModel from "../../models/datepipemodel";
import modalModel from "../../models/modal.model";
import statusModel from '../../models/status.model';
import stateModel from '../../models/states.model';
import languagesModel from '../../models/languages.model';
import countryModel from "../../models/country.model";

const ViewAppointment = ({ form, setform, reschedule }) => {
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const history = useHistory()
    const [counsellors, setConsellors] = useState([])
    const viewIntake = () => {
        modalModel.close('viewappointmentModal')
        history.push('/booking?appointmentId=' + form.id + '&page=view')
    }


    const getCounsellors = () => {
        ApiClient.get('user/listing', { page: 1, count: 100, role: 'Counsellor', clinicId: user.id }).then(res => {
            if (res.success) {
                setConsellors(res.data)
            }
        })
    }

    const cancelBooking = (itm) => {
        modalModel.close('viewappointmentModal')
        history.push('/cancellation?id=' + itm.id)
    }

    const route = (id) => {
        modalModel.close('caseNoteModal')
        modalModel.close('viewcasenoteModal')
        let url = '/profiledetail/'
        if (form.isHideAdd) url = '/userdetail/'
        modalModel.close('viewappointmentModal')
        history.push(url + id)
    }

    useEffect(() => {
        getCounsellors()
    }, [])

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    return <>
        <a id="openviewappointmentModal" data-toggle="modal" data-target="#viewappointmentModal"></a>
        <div className="modal fade" id="viewappointmentModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{languagesModel.translate('view_consultation_session', language)}</h4>
                        <button type="button" id="closeviewappointmentModal" className="close" data-dismiss="modal" aria-label="Close" title="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row">
                            <h6 className="col-md-12 mb-3 poupheding ">{languagesModel.translate('appointment_detail', language)}</h6>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate('appointmentdate_heading', language)}</strong>
                                <p className="mb-0">{datepipeModel.date(form && form.start)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate('appointment_time', language)}</strong>
                                <p className="mb-0">{datepipeModel.isotime(form && form.start)}-{datepipeModel.isotime(form && form.end)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate('status_heading', language)}</strong>
                                <p className="mb-0">{form && statusModel.name(form.status)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate('mode_of_consultation', language)}</strong>
                                <p className="mb-0">{form && form.consultation_type}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate('added_case_note', language)}</strong>
                                <p className="mb-0">{form && form.caseNote ? languagesModel.translate('yes_text', language) : languagesModel.translate('no_text', language)}</p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate('did_the_user_attend_the_session', language)}</strong>
                                <p className="mb-0 text-capitalize">{form && form.userAttended}</p>
                            </div>

                            <h6 className="col-md-12 mb-3 poupheding">{languagesModel.translate('user_text', language)}</h6>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate('user_name', language)}</strong>
                                <p className="mb-0">
                                    <a onClick={e => route(form && form.userId && form.userId.id)} className="text-primary">
                                        {form && form.userId && form.userId.fullName}
                                    </a>
                                </p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate('ic_no_heading', language)}</strong>
                                <p className="mb-0">{form && form.userId && form.userId.ic_number}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate('phonenumber_heading', language)}</strong>
                                <p className="mb-0">{form && form.userId && form.userId.dialCode + form.userId.mobileNo}</p>
                            </div>

                            <h6 className="col-md-12 mb-3 poupheding">{languagesModel.translate('counsellor_newtext', language)}</h6>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate("counsellor's_Name", language)}</strong>
                                <p className="mb-0">
                                    <a onClick={e => route(form && form.counsellor && form.counsellor.id)} className="text-primary">{form && form.counsellor && form.counsellor.fullName}
                                    </a>
                                </p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>{languagesModel.translate("counsellor's_phone_number", language)}</strong>
                                <p className="mb-0">{form && form.counsellor && form.counsellor.dialCode + form.counsellor.mobileNo}</p>
                            </div>

                            {form && form.status == 'Cancelled' ? <>
                                <h6 className="col-md-12 mb-3 poupheding">{languagesModel.translate('booking_cancellation', language)}</h6>
                                <div className="col-md-6 mb-3">
                                    <strong>{languagesModel.translate("reason_text", language)}</strong>
                                    <p className="mb-0">{form && form.cancelReason}</p>
                                </div>
                            </> : <></>}

                            {form && form.consultation_type == 'In-person' ? <>
                                <h6 className="col-md-12 mb-3 poupheding">{languagesModel.translate('health_clinic_text', language)}</h6>
                                <div className="col-md-6 mb-3">
                                    <strong>{languagesModel.translate("name_text", language)}</strong>
                                    <p className="mb-0">{form && form.healthClinicId ? translate2(form.healthClinicId.nameTranslate, form.healthClinicId.name) : ''}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <strong>{languagesModel.translate("location_text", language)}</strong>
                                    <p className="mb-0">{form && form.healthClinicId ? form.healthClinicId.city + ', ' + stateModel.name(form.healthClinicId.state, form.healthClinicId.country) + ', ' + countryModel.name(form.healthClinicId.country) : ''}</p>
                                </div>
                            </> : <></>}


                        </div>

                    </div>

                    <div className="modal-footer">
                        <a className="btn btn-primary" onClick={e => viewIntake()}>{languagesModel.translate('view_intake_form', language)}</a>
                        {form && form.status == 'Upcoming' && user.role == 'user' && form.consultation_type == 'Video' ? <a href={form && form.join_url} target="_blank" className="btn btn-primary">{languagesModel.translate('zoom_link', language)}</a> : <></>}
                        {form && form.status == 'Upcoming' & user.role != 'user' && form.consultation_type == 'Video' ? <a href={form && form.start_url} target="_blank" className="btn btn-primary">{languagesModel.translate('zoom_link', language)}</a> : <></>}
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate("close_btutton", language)}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ViewAppointment