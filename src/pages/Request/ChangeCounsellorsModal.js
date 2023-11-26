import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import languagesModel from '../../models/languages.model';

const ChangeCounsellors = ({ form, setform }) => {
    const language = useSelector(state => state.language.data)

    const userDetail = (id) => {
        loader(true)
        ApiClient.get('user/detail', { id }).then(res => {
            if (res.success) {
                setform({ ...form, clinicId: res.data })
            }
            loader(false)
        })
    }

    useEffect(() => {
        if (form && form.clinicId && !form.clinicId.id) {
            userDetail(form.clinicId)
        }

    }, [form])

    return <>
        <a id="openchangeCounsellors" data-toggle="modal" data-target="#userchangeCounsellors"></a>
        <div className="modal fade" id="userchangeCounsellors" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"> {languagesModel.translate('message_text', language)}</h5>
                        <button type="button" id="closeviewappointmentModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {languagesModel.translate('please_contact', language)} <a href={`mailto:${form && form.clinicId && form.clinicId.email}`}>{form && form.clinicId && form.clinicId.email}</a> / <a href={`tel:${form && form.clinicId && form.clinicId.mobileNo ? form.clinicId.dialCode + form.clinicId.mobileNo : ''}`}>{form && form.clinicId && form.clinicId.mobileNo ? form.clinicId.dialCode + form.clinicId.mobileNo : ''}</a>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ChangeCounsellors