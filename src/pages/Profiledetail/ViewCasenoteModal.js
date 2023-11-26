import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ApiKey from '../../methods/ApiKey'
import modalModel from "../../models/modal.model";
import languagesModel from '../../models/languages.model';
import datepipeModel from "../../models/datepipemodel";
import ApiClient from "../../methods/api/apiClient";

const ViewCasenoteModal = ({ form, modalClosed }) => {
    const history = useHistory()
    const language = useSelector(state => state.language.data)
    const [fields, setFields] = useState([])

    const route = (id) => {
        let url = '/profiledetail/'
        if (form.isHideAdd) url = '/userdetail/'
        history.push(url + id)
        modalModel.close('viewcasenoteModal')
    }

    const getFields = () => {
        ApiClient.get('custom/fields', { page: 1, count: 100 }).then(res => {
            if (res.success) {
                setFields(res.data)
            }
        })
    }

    useEffect(() => {
        getFields()
    }, [form && form.id])

    return <>
        <div className="modal fade" id="viewcasenoteModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title mainhead">{languagesModel.translate('view_case_note', language)}</h5>
                        <button type="button" id="closeviewappointmentModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row text-capitalize">
                            <h6 className="col-md-12 mb-3  mt-3 poupheding">{languagesModel.translate('counsellor_detail', language)}</h6>
                            <div className="col-md-6 mb-3">
                                <label className="semiheding">{languagesModel.translate("counsellor's_Name", language)}:</label>
                                <p className="mb-0"><a onClick={e => route(form && form.counsellorId.id)} className="text-primary">{form && form.counsellorId && form.counsellorId.fullName}</a></p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="semiheding">{languagesModel.translate("counsellor's_phone_number", language)}:</label>
                                <p className="mb-0">{form && form.counsellorId && form.counsellorId.mobileNo}</p>
                            </div>

                            <h6 className="col-md-12 mb-3  mt-3 poupheding">{languagesModel.translate('user_detail', language)}</h6>
                            <div className="col-md-6 mb-3">
                                <label className="semiheding">User Name:</label>
                                <p className="mb-0"><a onClick={e => route(form && form.userId.id)} className="text-primary">{form && form.userId && form.userId.fullName}</a></p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="semiheding">{languagesModel.translate('ic_no_heading', language)}. :</label>
                                <p className="mb-0">{form && form.userId && form.userId.ic_number}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="semiheding">{languagesModel.translate('phonenumber_heading', language)}:</label>
                                <p className="mb-0">{form && form.userId && form.userId.dialCode + form.userId.mobileNo}</p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="semiheding">{languagesModel.translate('support_letter', language)}:</label>
                                <p className="mb-0">{form && form.userId && form.userId.supportLetter}</p>
                            </div>


                            <h6 className="col-md-12 mb-3 mt-3 poupheding">{languagesModel.translate('appointment_detail', language)}</h6>
                            {form && form.appointmentId ? <>
                                <div className="col-md-6 mb-3">
                                    <label className="semiheding">{languagesModel.translate('appointmentdate_heading', language)}:</label>
                                    <p className="mb-0">{form && datepipeModel.date(form.appointmentId.start)}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="semiheding">{languagesModel.translate('duration_text', language)}:</label>
                                    <p className="mb-0">{form && datepipeModel.isotime(form.appointmentId.start)} - {form && datepipeModel.isotime(form.appointmentId.end)}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="semiheding">{languagesModel.translate('consultation_type', language)}:</label>
                                    <p className="mb-0">{form && form.appointmentId.consultation_type}</p>
                                </div>
                            </> : <>
                                <div className="col-md-6 mb-3">
                                    <label className="semiheding">{languagesModel.translate('appointmentdate_heading', language)}:</label>
                                    <p className="mb-0">{form && datepipeModel.date(form.start)}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="semiheding">{languagesModel.translate('duration_text', language)}:</label>
                                    <p className="mb-0">{form && datepipeModel.isotime(form.start)} - {form && datepipeModel.isotime(form.end)}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="semiheding">{languagesModel.translate('consultation_type', language)}:</label>
                                    <p className="mb-0">{form && form.consultation_type}</p>
                                </div>
                            </>}

                            <h6 className="col-md-12 mb-3 mt-3 poupheding">{languagesModel.translate('case_note_detail', language)}</h6>

                            <div className="col-md-6 mb-3">
                                <label className="semiheding">{languagesModel.translate('added_by_text', language)}:</label>
                                <p className="mb-0"><a onClick={e => route(form && form.addedBy.id)} className="text-primary">{form && form.addedBy && form.addedBy.fullName}</a></p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="semiheding">{languagesModel.translate('case_type', language)}:</label>
                                <p className="mb-0">{form && form.caseType}</p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="semiheding">{languagesModel.translate('severity_level', language)}:</label>
                                <p className="mb-0">{form && form.severityLevel}</p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="semiheding">{languagesModel.translate('client_status', language)}:</label>
                                <p className="mb-0">{form && form.clientStatus}</p>
                            </div>


                            {fields && fields.map(itm => {
                                return <div className="col-md-6 mb-3" key={itm.id}>
                                    <label className="text-capitalize">{itm.label}</label>
                                    <p className={`mb-0 ${itm.fieldType == 'textarea' ? 'text-initial' : ''}`}>{form && form.custom && form.custom[itm.id]}</p>
                                </div>
                            })}

                            {/* <div className="col-md-12 mb-3">
                                <label className="semiheding">{languagesModel.translate('notes_text', language)}:</label>
                                <p className="mb-0 text-initial">{form && form.note}</p>
                            </div> */}

                            <div className="col-md-12 mb-3">
                                <label className="semiheding">{languagesModel.translate('file_text', language)}</label>
                                {form && form.file ? <div>
                                    {form.file.map((itm, i) => {
                                        return <span className="docFile" key={itm}>
                                            <a href={ApiKey.api + 'docs/' + itm} target="_blank"> <i className="fa fa-file"></i> {itm}</a>
                                            {/* <i className="fa fa-times" onClick={e => removeDoc(i)}></i> */}
                                        </span>
                                    })}

                                </div> : <></>}
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

export default ViewCasenoteModal