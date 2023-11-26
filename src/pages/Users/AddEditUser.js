import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import languagesModel from '../../models/languages.model';

const AddEditUser = ({ form, setform, modalClosed, setSubmitted, submitted, emailErr, setEmailErr, icErr, setIcErr }) => {
    const language = useSelector(state => state.language.data)
    const [loading, setLoading] = useState(false)
    const [counsellors, setCounsellor] = useState([])
    const user = useSelector(state => state.user)

    const formValidation = [
        { key: 'mobileNo', minLength: 9 },
        { key: 'ic_number', minLength: 6 },
        { key: 'dialCode', dialCode: true },
        { key: 'email', email: true }
    ]

    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid || emailErr || icErr) return
        let method = 'post'
        let url = 'add/user'
        let clinicId = user.clinicId
        let counsellorId = form.counsellorId
        if (user.role == 'Clinic Admin') {
            clinicId = user.id
        }
        if (user.role == 'Counsellor') {
            counsellorId = user.id
        }


        let value = { supportLetter: form.supportLetter, role: form.role, dialCode: form.dialCode, firstName: form.firstName, lastName: form.lastName, image: form.image, email: form.email, nationality: form.nationality, ic_number: form.ic_number, id: form.id, mobileNo: form.mobileNo, clinicId, counsellorId }
        if (value.id) {
            method = 'put'
            url = 'user'
            delete value.password
        } else {
            delete value.id
        }

        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                document.getElementById('closeuserModal').click()
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
                if (res.error.message == 'Email already taken') {
                    setEmailErr(res.error.message)
                }
            }
            setLoading(false)
        })
    }

    const checkIc = (e) => {
        setIcErr('')
        setLoading(true)
        ApiClient.get('check/icnumber', { ic_number: e }, '', true).then(res => {
            if (!res.success) {
                setIcErr(res.error.message)
            }
            setLoading(false)
        })
    }

    const getCounsellors = () => {
        let clinicId = ''
        if (user.role == 'Clinic Admin') {
            clinicId = user.id
        }
        setLoading(true)
        ApiClient.get('user/listing', { page: 1, count: 100, role: 'Counsellor', clinicId }).then(res => {
            if (res.success) {
                setCounsellor(res.data)
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        getCounsellors()
    }, [])

    const uploadImage = (e) => {
        setform({ ...form, baseImg: e.target.value })
        let files = e.target.files
        let file = files.item(0)
        loader(true)
        ApiClient.postFormData('image/upload?modelName=users', { file: file, modelName: 'users' }).then(res => {
            if (res.success) {
                let image = res.data.fullpath
                setform({ ...form, image: image, baseImg: '' })
            } else {
                setform({ ...form, baseImg: '' })
            }
            loader(false)
        })
    }

    return <>
        <a id="openuserModal" data-toggle="modal" data-target="#userModal"></a>
        <div className="modal fade" id="userModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{form && form.id ? languagesModel.translate('edit_text', language) : languagesModel.translate('add_text', language)}  {languagesModel.translate('user_text', language)}</h5>
                        <button type="button" id="closeuserModal" className="close" data-dismiss="modal" aria-label="Close" title="close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-md-12 text-center mb-3">
                                    <label className="profileImageLabel">
                                        <img src={methodModel.userImg(form && form.image)} className="profileImage" />
                                        <input
                                            id="bannerImage"
                                            type="file"
                                            className="d-none"
                                            accept="image/*"
                                            value={form.baseImg ? form.baseImg : ''}
                                            onChange={(e) => uploadImage(e)}
                                        />

                                        <i className="fa fa-edit"></i>
                                    </label>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('first_name', language)}<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.firstName}
                                        onChange={e => setform({ ...form, firstName: e.target.value })}
                                        required
                                    />


                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('last_name', language)}<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.lastName}
                                        onChange={e => setform({ ...form, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('email_text', language)} (Optional){emailErr ? <span className="star">*</span> : <></>}</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={e => { setform({ ...form, email: e.target.value }); checkEmail(e.target.value) }}
                                    />
                                    {submitted && getError('email').invalid && !emailErr ? <div className="invalid-feedback d-block">invalid Email</div> : <></>}

                                    {emailErr ? <div className="invalid-feedback d-block">{emailErr}</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('mobileno_text', language)}<span className="star">*</span></label>
                                    <div className="phoneInput">
                                        <input
                                            type="text"
                                            className="form-control" placeholder='+60'
                                            value={form && form.dialCode}
                                            maxLength={4}
                                            onChange={e => setform({ ...form, dialCode: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            className="form-control" placeholder="Mobile No"
                                            value={form && form.mobileNo}
                                            maxLength={12}
                                            onChange={e => setform({ ...form, mobileNo: methodModel.isNumber(e) })}
                                            required
                                        />
                                    </div>
                                    {submitted && getError('dialCode').invalid ? <div className="invalid-feedback d-block">invalid country code</div> : <></>}
                                    {submitted && getError('mobileNo').invalid && !getError('dialCode').invalid ? <div className="invalid-feedback d-block">Min Length is 9</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('nationality_text', language)}<span className="star">*</span></label>
                                    <select className="form-control"
                                        value={form && form.nationality}
                                        onChange={e => { setform({ ...form, nationality: e.target.value, ic_number: '' }); }}
                                        disabled={form.id ? true : false}
                                        required
                                    >
                                        <option value="">{languagesModel.translate('select_option', language)}</option>
                                        <option value="Malaysian">Malaysian</option>
                                        <option value="Non-Malaysian">Non-Malaysian</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('ic_no_heading', language)}<span className="star">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form && form.ic_number}
                                        maxLength={form.nationality == 'Malaysian' ? 12 : 16}
                                        onChange={e => { setform({ ...form, ic_number: e.target.value }); checkIc(e.target.value) }}
                                        required
                                        disabled={form.id ? true : false}
                                    />
                                    {submitted && !icErr && getError('ic_number').invalid ? <div className="invalid-feedback d-block">Min Length is 6</div> : <></>}
                                    {icErr ? <div className="invalid-feedback d-block">{icErr}</div> : <></>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('role_text', language)}</label>
                                    <input
                                        type="text"
                                        // placeholder={`${languagesModel.translate('user_text', language)}*`}
                                        className="form-control"
                                        value={form.role}
                                        disabled
                                    />
                                </div>




                                {user.role == 'Clinic Admin' ? <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('counsellor_newtext', language)}<span className="star">*</span></label>
                                    <select className="form-control"
                                        value={form && form.counsellorId}
                                        onChange={e => { setform({ ...form, counsellorId: e.target.value }) }}
                                        required
                                        disabled={form.id ? true : false}
                                    >
                                        <option value="">{languagesModel.translate('select_option', language)}</option>
                                        {counsellors && counsellors.map(itm => {
                                            return <option value={itm.id} key={itm.id}>{itm.fullName}</option>
                                        })}
                                    </select>
                                </div> : <></>}

                                <div className="col-md-12 mb-3">
                                    <label className="required">{languagesModel.translate('Have_you_provided', language)} </label>
                                    <select className="form-control" value={form.supportLetter} onChange={e => { setform({ ...form, supportLetter: e.target.value }); }} required>
                                        <option value="">{languagesModel.translate('select_option', language)}</option>
                                        <option value="yes">{languagesModel.translate('yes_text', language)}</option>
                                        <option value="no">{languagesModel.translate('no_text', language)}</option>
                                    </select>
                                </div>

                            </div>

                        </div>


                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>{languagesModel.translate('add_text', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default AddEditUser