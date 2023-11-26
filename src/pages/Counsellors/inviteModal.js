import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import languagesModel from '../../models/languages.model';

const InviteModal = ({ form, setform, modalClosed, setSubmitted, submitted, emailErr, setEmailErr }) => {
    const [loading, setLoading] = useState(false)
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)

    const formValidation = []
    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid || emailErr) return
        let url = 'invite'
        let value = { email: form.email, clinicId: user.id, role: form.role, healthClinicId: user.healthClinicId }
        loader(true)
        ApiClient.post(url, value).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                document.getElementById('closeinviteModal').click()
                modalClosed()
            }
            loader(false)
        })
    }

    const checkEmail = (e) => {
        setEmailErr('')
        setLoading(true)
        ApiClient.get('check/email', { email: e }, '', true).then(res => {
            if (!res.success) {
                setEmailErr(res.error.message)
            }
            setLoading(false)
        })
    }



    return <>
        <a id="openInviteModal" data-toggle="modal" data-target="#inviteModal"></a>
        <div className="modal fade" id="inviteModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{languagesModel.translate('invite_counsellor_button', language)}</h5>
                        <button type="button" id="closeinviteModal" className="close" data-dismiss="modal" aria-label="Close" title="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-md-12 mb-3">
                                    <label>{languagesModel.translate('email_text', language)}</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={e => { setform({ ...form, email: e.target.value }); checkEmail(e.target.value) }}
                                        required
                                        disabled={form.id ? true : false}
                                    />
                                    {emailErr ? <div className="invalid-feedback d-block">{emailErr}</div> : <></>}
                                </div>
                            </div>

                        </div>


                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>{languagesModel.translate('send_btutton', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default InviteModal