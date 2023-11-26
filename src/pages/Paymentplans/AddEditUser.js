import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";

const AddEditPaymentplans = ({ form, setform, modalClosed, setSubmitted, submitted, emailErr, setEmailErr, icErr, setIcErr }) => {
    const [loading, setLoading] = useState(false)
    const user = useSelector(state => state.user)

    const formValidation = [
        { key: 'mobileNo', minLength: 9 },
        { key: 'ic_number', minLength: 6 },
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
        let value = { role: form.role, dialCode: form.dialCode, firstName: form.firstName, lastName: form.lastName, image: form.image, email: form.email, nationality: form.nationality, ic_number: form.ic_number, id: form.id, mobileNo: form.mobileNo, clinicId: user.clinicId, counsellorId: user.id }
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
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{form && form.id ? 'Edit' : 'Add'} Plansgit</h5>
                        <button type="button" id="closeuserModal" className="close" data-dismiss="modal" aria-label="Close">
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
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.firstName}
                                        onChange={e => setform({ ...form, firstName: e.target.value })}
                                        required
                                    />


                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.lastName}
                                        onChange={e => setform({ ...form, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={e => { setform({ ...form, email: e.target.value }); checkEmail(e.target.value) }}
                                    />
                                    {emailErr ? <div className="invalid-feedback d-block">{emailErr}</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Mobile No</label>
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
                                            className="form-control" placeholder='Mobile No.'
                                            value={form && form.mobileNo}
                                            maxLength={12}
                                            onChange={e => setform({ ...form, mobileNo: methodModel.isNumber(e) })}
                                            required
                                        />
                                    </div>
                                    {submitted && getError('mobileNo').invalid ? <div className="invalid-feedback d-block">Min Length is 9</div> : <></>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>Nationality</label>
                                    <select className="form-control"
                                        value={form && form.nationality}
                                        onChange={e => { setform({ ...form, nationality: e.target.value, ic_number: '' }); }}
                                        disabled={form.id ? true : false}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="Malaysian">Malaysian</option>
                                        <option value="Non-Malaysian">Non-Malaysian</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>IC/Passport Number</label>
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
                                    <label>Role</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.role}
                                        disabled
                                    />
                                </div>
                            </div>

                        </div>


                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default AddEditPaymentplans