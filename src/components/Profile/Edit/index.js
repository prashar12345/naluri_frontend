import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApiClient from '../../../methods/api/apiClient';
import loader from '../../../methods/loader';
import { ToastsStore } from 'react-toasts';
import methodModel from '../../../methods/methods';
import { login_success } from '../../../actions/user';
import datepipeModel from '../../../models/datepipemodel';
import expertiseModel from '../../../models/expertise.model';
import languagesModel from '../../../models/languages.model';

const EditProfile = p => {
  const user = useSelector((state) => state.user);
  const language = useSelector(state => state.language.data)
  const [form, setForm] = useState({ firstName: '', lastName: '', mobileNo: '', gender: '', image: '', ic_number: '', dialCode: '+60', healthClinicId: '', institute: '', degree: '' });
  const [data, setData] = useState()
  const [emailErr, setEmailErr] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [timezones, setTimezones] = useState([])
  const [loading, setLoading] = useState(false)
  const [healthclinic, sethealthclinics] = useState()
  const dispatch = useDispatch();
  const today = new Date()
  const dobmax = new Date().setFullYear(today.getFullYear() - 18)
  const dobmin = new Date().setFullYear(today.getFullYear() - 100)


  const formValidation = [
    { key: 'ic_number', minLength: 6 },
    { key: 'mobileNo', minLength: 9 },
    { key: 'email', email: true },
    { key: 'dialCode', dialCode: true },
  ]

  const gallaryData = () => {
    // loader(true)
    ApiClient.get(`user`, { id: user.id }).then(res => {

      if (res.success) {

        let healthClinicId = res.data.healthClinicId ? res.data.healthClinicId.id : ""
        setForm({ ...form, ...res.data, healthClinicId, degree: res.data.degree, institute: res.data.institute })
        setData(res.data)
      }
      // loader(false)

    })
  };

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
      email: form.email,
      ic_number: form.ic_number,
      firstName: form.firstName,
      lastName: form.lastName,
      dialCode: form.dialCode,
      dob: form.dob,
      gender: form.gender,
      mobileNo: form.mobileNo,
      image: form.image,
      address: form.address,
      country: form.country,
      timeZone: form.timeZone,
      state: form.state,
      postal_code: form.postal_code,
      city: form.city,
      consultation_type: form.consultation_type,
      expertise: form.expertise,
      language: form.language,
      // clinicId: '17',
      healthClinicId: form.healthClinicId,
      id: form.id,
      institute: form.institute,
      degree: form.degree
    }

    loader(true)
    ApiClient.put('user', value).then(res => {
      if (res.success) {
        let uUser = { ...user, ...value }
        dispatch(login_success(uUser))
        ToastsStore.success(res.message)
      }
      loader(false)
    })
  };

  const uploadImage = (e) => {
    setForm({ ...form, baseImg: e.target.value })
    let files = e.target.files
    let file = files.item(0)
    loader(true)
    ApiClient.postFormData('image/upload?modelName=users&role=' + form.role, { file: file, modelName: 'users' }).then(res => {
      if (res.success) {
        let image = res.data.fullpath
        setForm({ ...form, image: image, baseImg: '' })
      } else {
        setForm({ ...form, baseImg: '' })
      }
      loader(false)
    })
  }

  const healthclinics = () => {
    ApiClient.get('health/clinics', { page: 1, count: 100 }).then(res => {
      if (res.success) {
        sethealthclinics(res.data)
      }
    })
  }
  const getTimezone = () => {
    ApiClient.get('timezones', {}).then(res => {
      if (res.success) {
        setTimezones(res.data)

      }
    })
  }


  const expertise = () => {
    let exp = []
    if (form.expertise) exp = form.expertise
    let value = []
    expertiseModel.list.map(itm => {
      if (itm != exp.find(it => it === itm)) {
        value.push(itm)
      }
    })
    return value
  }

  const languages = () => {
    let exp = []
    if (form.language) exp = form.language
    let value = []
    languagesModel.list.map(itm => {
      if (itm != exp.find(it => it === itm)) {
        value.push(itm)
      }
    })
    return value
  }

  const removeExpertise = (index) => {
    let exp = []
    if (form.expertise) exp = form.expertise
    exp.splice(index, 1);

    setForm({ ...form, expertise: exp })
  }

  const removeLanguage = (index) => {
    let exp = []
    if (form.language) exp = form.language
    exp.splice(index, 1);
    setForm({ ...form, language: exp })
  }

  const addExpertise = (value) => {
    let exp = []
    if (form.expertise) exp = form.expertise
    exp.push(value)
    setForm({ ...form, expertise: exp })
  }

  const addLanguage = (value) => {
    let exp = []
    if (form.language) exp = form.language
    exp.push(value)
    setForm({ ...form, language: exp })
  }


  useEffect(
    () => {
      if (user && user.loggedIn) {
        gallaryData();
        getTimezone();
        healthclinics();
      }
    },
    []
    // here '[]' is used for, loop se bachne k liye
  );

  return (
    <>
      <form
        className="py-3"
        onSubmit={handleSubmit}
      >
        <div
          className="py-3 form-row pprofile1"
        >

          <div className="col-md-12 text-center mb-3">
            <label className="profileImageLabel">
              <img src={methodModel.userImg(form && form.image)} className="profileImage" />
              <input
                id="bannerImage"
                type="file"
                className="d-none"
                accept={`image/${form.role === 'Counsellor' ? 'png' : '*'}`}
                value={form.baseImg ? form.baseImg : ''}
                onChange={(e) => uploadImage(e)}
              />

              <i className="fa fa-edit" title="Upload Image"></i>
            </label>
          </div>

          <div className='col-md-12'>
            <h5 className='mb-3 hedcls'>{languagesModel.translate('details_text', language)}</h5>
          </div>

          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('first_name', language)}<span className="start">*</span></label>
            <input
              type="text"
              className="form-control"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('last_name', language)}<span className="start">*</span></label>
            <input
              type="text"
              className="form-control"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>


          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('date_of_birth', language)}<span className="start">*</span></label>
            <input
              type="date"
              className="form-control"
              min={datepipeModel.datetostring(dobmin)}
              max={datepipeModel.datetostring(dobmax)}
              value={form.dob ? form.dob : ''}
              onChange={e => { setForm({ ...form, dob: e.target.value }) }}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('gender_text', language)}<span className="start">*</span></label>
            <div>
              <label className='mr-3'>
                <input
                  type="radio"
                  name='gender'
                  className="mr-1"
                  value="male"
                  checked={form && form.gender === 'male' ? true : false}
                  onChange={e => { setForm({ ...form, gender: e.target.value }) }}
                  required
                /> {languagesModel.translate('male_text', language)}
              </label>
              <label>
                <input
                  type="radio"
                  name='gender'
                  className="mr-1"
                  value="female"
                  checked={form && form.gender === 'female' ? true : false}
                  onChange={e => { setForm({ ...form, gender: e.target.value }) }}
                  required
                /> {languagesModel.translate('female_text', language)}
              </label>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('email_text', language)} {methodModel.emailRequiredFor(form.role) ? <span className="text-danger">*</span> : <></>}</label>
            <input
              type="email"
              className="form-control"
              value={form.email ? form.email : ''}
              onChange={e => { setForm({ ...form, email: e.target.value }); checkEmail(e.target.value) }}
              required={methodModel.emailRequiredFor(form.role)}
            />

            {submitted && getError('email').invalid && !emailErr ? <div className="invalid-feedback d-block">{languagesModel.translate('invalid_email', language)}</div> : <></>}
            {emailErr ? <div className="invalid-feedback d-block">{emailErr}</div> : <></>}
          </div>

          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('role_text', language)}</label>
            <input
              type="text"
              className="form-control"
              value={form.role ? form.role : ''}
              disabled
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('nationality_text', language)}<span className="start">*</span></label>
            <select className="form-control"
              value={form && form.nationality}
              onChange={e => { setForm({ ...form, nationality: e.target.value, ic_number: '' }); }}
              required
              disabled
            >
              <option value="">{languagesModel.translate('select_option', language)}</option>
              <option value="Malaysian">{languagesModel.translate('malaysian_text', language)}</option>
              <option value="Non-Malaysian">{languagesModel.translate('non-malaysian', language)}</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('mobileno_text', language)}<span className="start">*</span></label>
            <div className="phoneInput">
              <input
                type="text"
                className="form-control" placeholder='+60'
                value={form && form.dialCode}
                maxLength={4}
                onChange={e => setForm({ ...form, dialCode: e.target.value })}
                required
              />
              <input
                type="text"
                className="form-control" placeholder='Mobile No.'
                value={form && form.mobileNo}
                maxLength={12}
                onChange={e => setForm({ ...form, mobileNo: methodModel.isNumber(e) })}
                required
              />
            </div>
            {submitted && getError('dialCode').invalid ? <div className="invalid-feedback d-block">{languagesModel.translate('invalid_country_code', language)}</div> : <></>}
            {submitted && getError('mobileNo').invalid && !getError('dialCode').invalid ? <div className="invalid-feedback d-block">{languagesModel.translate('min_length_text', language)}</div> : <></>}
          </div>


          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('timezone', language)}<span className="start">*</span></label>
            <select
              className="form-control"
              value={form && form.timeZone}
              onChange={e => setForm({ ...form, timeZone: e.target.value })}
              required
            >
              <option value="">{languagesModel.translate('select_option', language)}</option>
              {timezones && timezones.map(itm => {
                return <option value={itm.id} key={itm.id}>GMT{itm.utc_offset}</option>
              })}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('health_clinic_text', language)}<span className="start">*</span></label>
            <select
              className="form-control"
              value={form && form.healthClinicId}
              onChange={e => setForm({ ...form, healthClinicId: e.target.value })}
              required
            >
              <option value="">{languagesModel.translate('select_option', language)}</option>
              {healthclinic && healthclinic.map(itm => {
                return <option value={itm.id} key={itm.id}>{itm.name}</option>
              })}
            </select>
          </div>
        </div>


        {form.role === 'Counsellor' && <div
          className="py-3 form-row pprofile1 mt-3"
        >
          <div className="col-md-12">
            <h5 className="mb-3">{languagesModel.translate('consultation_drop', language)}</h5>
          </div>

          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('expertise_text', language)}</label>
            <div className="form-row">
              <div className="col-md-8 mb-3">
                <div className="dropdown expertiseDropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {languagesModel.translate('add_expertise_text', language)}
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {expertise().map(itm => {
                      return <a className="dropdown-item" key={itm} onClick={() => addExpertise(itm)}>{itm}</a>
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                {form && form.expertise && form.expertise.map((itm, i) => {
                  return <span className="badge badge-primary m-1" key={itm}>{itm} <i className="fa fa-times ml-1 cursor-pointer" onClick={() => removeExpertise(i)}></i></span>
                })}
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('languages_text', language)}</label>
            <div className="form-row">
              <div className="col-md-8 mb-3">
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownLanguage" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {languagesModel.translate('add_languages_text', language)}
                  </button>
                  <div className="dropdown-menu" aria-labelledby="dropdownLanguage">
                    {languages().map(itm => {
                      return <a className="dropdown-item" key={itm} onClick={() => addLanguage(itm)}>{itm}</a>
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                {form && form.language && form.language.map((itm, i) => {
                  return <span className="badge badge-primary m-1" key={itm}>{itm} <i className="fa fa-times ml-1 cursor-pointer" onClick={() => removeLanguage(i)}></i></span>
                })}
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('institute_text', language)}<sapn className="start">*</sapn></label>

            <input
              type="text"
              className="form-control"
              maxLength={50}
              value={form && form.institute}
              onChange={e => setForm({ ...form, institute: e.target.value })}
              required
            />

          </div> <div className="col-md-6 mb-3">
            <label>{languagesModel.translate('degree_text', language)}<sapn className="start">*</sapn></label>

            <input
              type="text"
              className="form-control"
              maxLength={50}
              value={form && form.degree}
              onChange={e => setForm({ ...form, degree: e.target.value })}
              required
            />

          </div>
        </div>}
        <div className="text-right mt-3">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {languagesModel.translate('update_button', language)}
          </button>
        </div>
      </form>

    </>
  );
};

export default EditProfile;
