import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import { useHistory } from 'react-router';
import { ToastsStore } from 'react-toasts';
import methodModel from '../../methods/methods';
import loader from '../../methods/loader';
import PageLayout from '../../components/global/PageLayout';
import ApiClient from '../../methods/api/apiClient';
import languagesModel from '../../models/languages.model';
import { Link } from 'react-router-dom';

const Contactus = (p) => {
    const language = useSelector(state => state.language.data)
    const dispatch = useDispatch()
    const [emailErr, setEmailErr] = useState(false)
    const history = useHistory()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', country: '', mobileNo: '', reason: '', })
    const [submitted, setSubmitted] = useState(false)
    const formValidation = [
        { key: 'name', name: true },
        { key: 'email', email: true },
        { key: 'country', country: true },
        { key: 'mobileNo', minLength: 9 },
        { key: 'reason', reason: true },
        { key: 'message', message: true },
    ]
    const checkEmail = (e) => {
        setEmailErr('')
        setLoading(true)
        ApiClient.get('check/email', { email: e }, '', true).then(res => {
            if (!res.success) {
                if (res.error.message === 'Email already taken' && data.email != e) {
                    setEmailErr(res.error.message)
                }
            }
            setLoading(false)
        })
    }
    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }


    const handleSubmit = e => {
        e.preventDefault();
        setSubmitted(true)
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid || emailErr) return
        let value = {
            name: form.name,
            email: form.email,
            country: form.country,
            mobileNo: form.mobileNo,
            reason: form.reason,
            message: form.message,
        }

        loader(true)
        ApiClient.post('contact/us', value).then(res => {
            if (res.success) {

                ToastsStore.success(res.message)
                history.push('/');
            }
            loader(false)
        })
    };

    useEffect(() => {
        // loader(true)
        // setTimeout(() => {
        //     loader(false)
        // }, 500);
    }, [])

    return (

        <PageLayout>

            <div className='container'>
                <div className="login-wrapper ">

                    <div className="mb-3">
                        <h3 className="text-center contactext">{languagesModel.translate('contact_us', language)}</h3>
                    </div>
                    <form
                        className="form-row bg-formdark contact-us"
                        onSubmit={handleSubmit} >
                        <div className="col-md-6 px-0">
                            <img src="/assets/img/contactus.jpg" className="loginimg w-100" />
                        </div>
                        <div className="col-md-6  px-0 order-2 order-md-0 ">
                            <form
                                className="p-5 rounded shadow contactbgclor form-row m-0">
                                <div className="mb-3 col-12">

                                    <input
                                        type="text"
                                        className="form-control mb-0 bginput"
                                        placeholder={`${languagesModel.translate('full_name', language)}*`}
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-3 col-md-6">

                                    <input
                                        type="email"
                                        className="form-control mb-0 bginput"
                                        placeholder={`${languagesModel.translate('email_text', language)}*`}
                                        value={form.email}
                                        onChange={e => { setForm({ ...form, email: e.target.value }); checkEmail(e.target.value) }}
                                        required
                                    />
                                    {submitted && getError('email').invalid && !emailErr ? <div className="invalid-feedback d-block">{languagesModel.translate('invalid_email', language)}</div> : <></>}
                                    {emailErr ? <div className="invalid-feedback d-block">{emailErr}</div> : <></>}
                                </div>
                                <div className="mb-3 col-md-6">

                                    <input
                                        type="text"
                                        className="form-control mb-0 bginput"
                                        placeholder={`${languagesModel.translate('mobileno_text', language)}*`}
                                        value={form.mobileNo}
                                        maxLength={16}
                                        onChange={e => setForm({ ...form, mobileNo: methodModel.isNumber(e) })}

                                        required
                                    />

                                    {submitted && getError('mobileNo').invalid && !getError('dialCode').invalid ? <div className="invalid-feedback d-block">{languagesModel.translate('min_length_text', language)}</div> : <></>}
                                </div>

                                <div className="mb-3 inputWrapper col-12">
                                    <input
                                        className="form-control mb-0 bginput"
                                        placeholder={`${languagesModel.translate('country_text', language)}*`}
                                        value={form.country}
                                        onChange={e => setForm({ ...form, country: e.target.value })}
                                        maxLength={50}
                                        required
                                    />

                                </div>

                                <div className="mb-3 col-12">
                                    <input
                                        type="text"
                                        className="form-control mb-0 bginput"
                                        placeholder={`${languagesModel.translate('reason_text', language)}*`}
                                        value={form.reason}
                                        onChange={e => setForm({ ...form, reason: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="mb-3 inputWrapper  col-12">

                                    <textarea id="textarea" name="textarea" rows="4" cols="50" className="form-control mb-0 bginput"
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        placeholder={`${languagesModel.translate('message_text', language)}*`}
                                        value={form.message}
                                        required
                                    >
                                    </textarea>
                                </div>


                                <div className="text-center col-12">
                                    <button type="submit" className="submitbutton mt-4">
                                        {languagesModel.translate('submit_button', language)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </form>
                </div >

            </div>
        </PageLayout>
    );
};

export default Contactus;
