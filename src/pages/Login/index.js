import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PageLayout from "../../components/global/PageLayout";
import {
  ToastsStore,
} from 'react-toasts';
import { login_success } from '../../actions/user';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import { Link } from 'react-router-dom';
import methodModel from '../../methods/methods'
import './style.scss';
import Layout from '../../components/global/layout';
import languagesModel from '../../models/languages.model';
import Logo from '../../components/global/Logo';

const Login = () => {
  const history = useHistory();
  const user = useSelector(state => state.user)
  const language = useSelector(state => state.language.data)
  const [number, setnumber] = useState()
  const [countryCode, setCountryCode] = useState('+60')
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [eyes, setEyes] = useState({ password: false });

  useEffect(() => {
    if (user && user.loggedIn) {
      if (!user.assessmentFilled && user.role === 'user') {
        history.push('/assessment')
      } else {
        history.push('/dashboard')
      }
    }
  }, [])

  const loginlogs = () => {
    let url = 'clicks'
    let param = {
      event: 'login'
    }
    ApiClient.post(url, param).then(res => {
    })
  }
  const hendleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ic_number: username,
      password,
      role,
      mobileNo: role === 'user' ? number : '',
      dialCode: role === 'user' ? countryCode : ''
    };

    loader(true)

    ApiClient.post('user/signin', data).then(res => {
      loader(false)
      loginlogs()
      if (res.success) {
        ToastsStore.success(res.message)
        localStorage.setItem("token", res.data.access_token)
        dispatch(login_success(res.data))
        // history.push('/dashboard');
        ApiClient.dropoff('Complete login/create an account', res.data)

        if (!res.data.assessmentFilled && res.data.role === 'user') {
          history.push('/assessment')
        } else {
          history.push('/dashboard')
        }
      }
    })
  };
  useEffect(() => {
    loader(true)
    setTimeout(() => {
      loader(false)
    }, 500);
  }, [])

  return (
    <PageLayout>
      <div className="container">
        <div className="login-wrapper">
          <div className="mainfromclss">
            <div className="row">
              <div className="col-md-6  px-0 order-2 order-md-0 ">
                <form
                  className="px-5 py-3 rounded shadow"
                  onSubmit={hendleSubmit}
                >
                  <div className="mb-3">
                    <Link to="/">
                      <Logo className='logimg' />
                      {/* <img src="/assets/img/Naluri Colour Vector.png" className="logimg" alt="" /> */}
                    </Link>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-left lgtext">{languagesModel.translate('login_text', language)}</h3>
                    <div className="mt-2">
                      <Link to="/register" className="text-primary Allready"> {languagesModel.translate('not_account', language)}  <span className="loglink">{languagesModel.translate('create_account', language)} </span></Link>
                    </div>
                  </div>

                  <div className="mb-3 roleBtns">
                    <button type="button" className={role === 'user' ? 'btn btn-primary' : 'btn btn-outline-primary'} onClick={() => setRole('user')}>{languagesModel.translate('users_text', language)} </button>
                    <button type="button" className={role === 'Counsellor' ? 'btn btn-primary' : 'btn btn-outline-primary'} onClick={() => setRole('Counsellor')}>{languagesModel.translate('counsellor_newtext', language)}</button>
                    <button type="button" className={role === 'Clinic Admin' ? 'btn btn-primary' : 'btn btn-outline-primary'} onClick={() => setRole('Clinic Admin')}>{languagesModel.translate('clinic_admin_text', language)}</button>

                  </div>
                  <div className="mb-3">
                    {role === 'user' ?
                      <div className="phoneInput">
                        <input
                          type="text"
                          className="form-control" placeholder='+60'
                          maxLength={4}
                          value={countryCode}
                          onChange={e => setCountryCode(e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          className="form-control" placeholder={languagesModel.translate('mobile_number', language)}
                          value={number}
                          maxLength={16}
                          onChange={e => setnumber(methodModel.isNumber(e))}
                          required
                        />
                      </div>
                      : <input
                        type="email"
                        className="form-control mb-0 bginput"
                        placeholder={`${languagesModel.translate('email_text', language)}*`}
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                      />}

                  </div>

                  <div className="mb-3 inputWrapper">
                    <input
                      type={eyes.password ? 'text' : 'password'}
                      className="form-control mb-0 bginput"
                      value={password}
                      placeholder={`${languagesModel.translate('password_text', language)}*`}
                      onChange={e => setPassword(e.target.value)}
                      maxLength={50}
                      required
                    />
                    <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
                  </div>


                  <div className="text-center">
                    <button type="submit" className="btn btn-primary loginclass mb-4">
                      {languagesModel.translate('login_text', language)}
                    </button>
                  </div>
                  <div className="text-center">
                    <Link to="/forgotpassword" className="text-primary"> {languagesModel.translate('fgorgot_password', language)}</Link>

                  </div>
                </form>
              </div>
              <div className="col-md-6 px-0">
                <img src="./assets/img/login_Img.png" className="loginimg w-100" />
              </div>
            </div>
          </div>
        </div >
      </div>
    </PageLayout>
  );
};

export default Login;
