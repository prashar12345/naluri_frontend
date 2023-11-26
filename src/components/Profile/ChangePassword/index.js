import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ToastsStore } from 'react-toasts';
import { logout } from '../../../actions/user';
import ApiClient from '../../../methods/api/apiClient';
import loader from '../../../methods/loader';
import methodModel from '../../../methods/methods';
import languagesModel from '../../../models/languages.model';

const ChangePassword = p => {
  const language = useSelector(state => state.language.data)
  const dispatch = useDispatch()
  const history = useHistory()
  const [form, setForm] = useState({ confirmPassword: '', currentPassword: '', newPassword: '' })
  const [submitted, setSubmitted] = useState(false)
  const formValidation = [
    { key: 'confirmPassword', minLength: 8, confirmMatch: ['confirmPassword', 'newPassword'], password: true },
    { key: 'currentPassword', minLength: 8, password: true },
    { key: 'newPassword', minLength: 8, password: true },
  ]
  const [eyes, setEyes] = useState({ password: false, confirmPassword: false, currentPassword: false });

  const getError = (key) => {
    return methodModel.getError(key, form, formValidation)
  }

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true)
    let invalid = methodModel.getFormError(formValidation, form)
    if (invalid) return

    loader(true)
    ApiClient.put('change/password', form).then(res => {
      if (res.success) {
        ToastsStore.success(res.message)
        dispatch(logout())
        history.push('/login');
      }
      loader(false)
    })
  };

  return (
    <>
      <form
        className="form-row py-3"
        onSubmit={handleSubmit}
      >
        <div className="col-md-12 mb-3">
          <label>{languagesModel.translate('currrent_password', language)}<span className="start">*</span></label>
          <div className="inputWrapper">
            <input
              type={eyes.currentPassword ? 'text' : 'password'}
              className="form-control"
              value={form.currentPassword}
              maxLength="20"

              onChange={e => setForm({ ...form, currentPassword: e.target.value })}
              required
            />
            <i className={eyes.currentPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, currentPassword: !eyes.currentPassword })}></i>
          </div>
          {submitted && getError('currentPassword').invalid ? <div className="invalid-feedback d-block">{languagesModel.translate('special_character_password', language)}</div> : <></>}
        </div>

        <div className="col-md-12 mb-3">
          <label>{languagesModel.translate('new_password', language)}<span className="start">*</span></label>

          <div className="inputWrapper">
            <input
              type={eyes.password ? 'text' : 'password'}
              className="form-control"
              value={form.newPassword}
              maxLength="20"
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
              required
            />
            <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
          </div>
          {submitted && getError('newPassword').invalid ? <div className="invalid-feedback d-block">{languagesModel.translate('special_character_password', language)}</div> : <></>}
        </div>

        <div className="col-md-12 mb-3">
          <label>{languagesModel.translate('confirm_password', language)}<span className="start">*</span></label>

          <div className="inputWrapper">
            <input
              type={eyes.confirmPassword ? 'text' : 'password'}
              className="form-control"
              value={form.confirmPassword}
              maxLength="20"
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
            <i className={eyes.confirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })}></i>
          </div>
          {submitted && getError('confirmPassword').invalid ? <>

            {/* {getError('confirmPassword').err.minLength ? <div>Min Length must be 8 characters long</div> : <></>} */}
            {getError('confirmPassword').err.confirmMatch ? <div className="invalid-feedback d-block">{languagesModel.translate('not_matched', language)}</div> : <></>}

          </> : <></>}

        </div>

        <div className="col-md-12 text-right">
          <button type="submit" className="btn btn-primary">
            {languagesModel.translate('update_button', language)}
          </button>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
