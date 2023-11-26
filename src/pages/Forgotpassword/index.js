import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import PageLayout from "../../components/global/PageLayout";
import {
    ToastsStore,
} from 'react-toasts';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import OTPModal from '../Signup/OTOModal';
import './style.scss';
import languagesModel from '../../models/languages.model';
import Logo from '../../components/global/Logo';


const Forgotpassword = () => {
    const history = useHistory();
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [form, setForm] = useState({ ic_number: '' });
    const [otpForm, setOtpForm] = useState({ otp: '', id: '' })



    const hendleSubmit = (e) => {
        e.preventDefault();
        loader(true)

        ApiClient.post('forgot/otp', form).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                history.push('/resetpassword')
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
            <div className="container">
                <div className="login-wrapper">
                    <div className="mainfromclss">
                        <div className="row">
                            <div className="col-md-6  px-0 order-2 order-md-0 ">
                                <form
                                    className="p-5 rounded shadow"
                                    onSubmit={hendleSubmit}
                                >
                                    <Link to={'/login'}>
                                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                                    </Link>


                                    <div className="mb-3">
                                        <Link to={'/'}>
                                            <Logo className='logimg pt-4' />
                                        </Link>
                                    </div>
                                    <div className="text-center mb-3">
                                        <h3 className="text-left lgtext">{languagesModel.translate('fgorgot_password', language)}</h3>
                                    </div>
                                    <label></label>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className="form-control  mb-0 bginput" placeholder={`${languagesModel.translate('forgot_placeholder', language)}*`}
                                            value={form.ic_number}
                                            required
                                            onChange={e => setForm({ ...form, ic_number: e.target.value })}
                                        />

                                    </div>

                                    <div className="text-right">
                                        <button type="submit" className="btn btn-primary loginclass">{languagesModel.translate('send_btutton', language)}</button>
                                    </div>
                                </form>
                            </div>

                            <div className="col-md-6 px-0">
                                <img src="./assets/img/login_Img.png" className="loginimg w-100" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OTPModal form={otpForm} setform={setOtpForm} page="forgot" />

        </PageLayout>
    );
};

export default Forgotpassword;
