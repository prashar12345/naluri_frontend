
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {
    ToastsStore,
} from 'react-toasts';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import methodModel from '../../methods/methods';
import languagesModel from '../../models/languages.model';
import PageLayout from "../../components/global/PageLayout";
import './style.scss';
import Logo from '../../components/global/Logo';

const Resetpassword = () => {
    const history = useHistory();
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)



    const formValidation = [
        { key: 'confirmPassword', minLength: 8, confirmMatch: ['confirmPassword', 'newPassword'] },
        { key: 'newPassword', minLength: 8 },
    ]

    const [form, setForm] = useState({ id: '', email: '', confirmPassword: '', newPassword: '', code: '' });
    const [submitted, setSubmitted] = useState(false)
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });


    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }



    const hendleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true)
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid) return
        loader(true)
        ApiClient.put('reset/password', form).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                history.push('/login');
            }
            loader(false)
        })
    };


    useEffect(() => {
        if (user && user.loggedIn) {
            history.push('/dashboard')
        }
    }, [user, history])

    return (
        <PageLayout>
            <div className="login-wrapper">
                <div className="mainfromclss">
                    <div className="row m-0">
                        <div className="col-md-6  px-0">
                            <form
                                className="p-5 rounded shadow"
                                onSubmit={hendleSubmit}
                            >
                                <Link to={'/forgotpassword'}>
                                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                                </Link>
                                <div className="mb-3">
                                    <Link to='/'>
                                        <Logo className='logimg pt-4 cursor-pointer' />
                                    </Link>
                                </div>
                                <div className="text-center mb-3">

                                    <h3 className="text-left">{languagesModel.translate('reset_password', language)}</h3>
                                </div>
                                <label>{languagesModel.translate('code_text', language)}</label>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control mb-0 bginput"
                                        value={form.code}
                                        onChange={e => setForm({ ...form, code: e.target.value })}
                                        required
                                    />
                                </div>

                                <label>{languagesModel.translate('new_password', language)}</label>

                                <div className="mb-3">
                                    <div className="inputWrapper">
                                        <input
                                            type={eyes.password ? 'text' : 'password'}
                                            className="form-control mb-0 bginput"
                                            value={form.newPassword}
                                            onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                            required
                                        />
                                        <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
                                    </div>

                                    {submitted && getError('newPassword').invalid ? <div className="invalid-feedback d-block">{languagesModel.translate('min_length_validation', language)}</div> : <></>}
                                </div>

                                <label>{languagesModel.translate('confirm_password', language)}</label>

                                <div className="mb-3">
                                    <div className="inputWrapper">
                                        <input
                                            type={eyes.confirmPassword ? 'text' : 'password'}
                                            className="form-control mb-0 bginput"
                                            value={form.confirmPassword}
                                            maxLength={50}
                                            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                            required
                                        />
                                        <i className={eyes.confirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })}></i>
                                    </div>

                                    {submitted && getError('confirmPassword').err.confirmMatch ? <div className="invalid-feedback d-block">{languagesModel.translate('not_matched', language)}</div> : <></>}
                                </div>

                                <div className="text-right">
                                    <button type="submit" className="btn btn-primary loginclass">
                                        {languagesModel.translate('submit_button', language)}
                                    </button>

                                </div>
                            </form>
                        </div>
                        <div className="col-md-6 px-0">
                            <img src="./assets/img/login_Img.png" className="loginimg w-100" alt="" />
                        </div>
                    </div>


                </div>
            </div>

        </PageLayout>

    );
};

export default Resetpassword;
