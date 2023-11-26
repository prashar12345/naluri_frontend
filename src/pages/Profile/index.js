import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import './profile.scss'
import { useSelector } from 'react-redux';
import methodModel from '../../methods/methods';
import languagesModel from '../../models/languages.model';
import stateModel from '../../models/states.model';
import countryModel from '../../models/country.model';
import ApiKey from '../../methods/ApiKey';
import PageLayout from '../../components/global/PageLayout';

const Profile = () => {
  const [form, setForm,] = useState({ firstName: '', lastName: '', timeZone: '', mobileNo: '', gender: '', image: '', ic_number: '', dialCode: '+60' });
  const user = useSelector((state) => state.user);
  const language = useSelector(state => state.language.data)
  const [data, setData] = useState('');
  const [timezones, setTimezones] = useState([])

  const gallaryData = () => {
    // loader(true)
    ApiClient.get(`user`, { id: user.id }).then(res => {
      if (res.success) {
        setForm(res.data)
        setData(res.data)
      }
      // loader(false)

    })
  };


  const getTimezone = () => {
    ApiClient.get('timezones', {}).then(res => {
      if (res.success) {
        setTimezones(res.data)

      }
    })
  }



  useEffect(
    () => {
      if (user && user.loggedIn) {
        gallaryData();
        getTimezone()
      }
    },
    []
  );
  const download = (url) => {
    let link = document.createElement("a");
    link.download = 'support latter';
    link.target = '_download'
    link.href = url;
    link.click();
    link.remove()
  }

  return (
    <>

      <Layout>
        <div className='container'>


          <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
            <h3 className='ViewUser'>{languagesModel.translate('view_profile_text', language)}</h3>
            <Link to="/settings" className="btn btn-primary">
              <i className="fa fa-edit" />
            </Link>
          </div>
          <div className='pprofile1'>
            <div className="form-row">
              <div className="col-md-12 text-center mb-3">
                <label className="profileImageLabel">
                  <img src={methodModel.userImg(data && data.image)} className="profileImage" />
                </label>

              </div>
              <div className='col-md-12'>
                <h5 className='mb-3 hedcls'>{languagesModel.translate('details_text', language)}</h5>
              </div>
              <div className="col-md-6">

                <label>{languagesModel.translate('first_name', language)}</label>
                <p className="bg-light rounded py-2">{data && data.firstName}</p>
              </div>
              <div className="col-md-6">
                <label>{languagesModel.translate('last_name', language)}</label>
                <p className="bg-light rounded py-2">{data && data.lastName}</p>
              </div>
              {/* <div className="col-md-6">
          <label>Role</label>
          <p className="bg-light rounded py-2">{data && data.role}</p>
        </div> */}

              {data && data.email ? <div className="col-md-6">
                <label>{languagesModel.translate('email_text', language)}</label>
                <p className="bg-light rounded py-2">{data && data.email}</p>
              </div> : <></>}

              <div className="col-md-6">
                <label>{languagesModel.translate('role_text', language)}</label>
                <p className="bg-light rounded py-2">{data && data.role}</p>
              </div>


              {data && data.nationality ? <div className="col-md-6">
                <label>{languagesModel.translate('nationality_text', language)}</label>
                <p className="bg-light rounded py-2">{data && data.nationality}</p>
              </div> : <></>}
              {data && data.ic_number ? <div className="col-md-6">
                <label>{languagesModel.translate('icnumber_text', language)}</label>
                <p className="bg-light rounded py-2">{data && data.ic_number}</p>
              </div> : <></>}


              <div className="col-md-6">
                <label>{languagesModel.translate('mobileno_text', language)}</label>
                <p className="bg-light rounded py-2">{data && data.dialCode + data.mobileNo}</p>
              </div>


              {data && data.dob && <div className="col-md-6">
                <label>{languagesModel.translate('date_of_birth', language)}</label>
                <p className="bg-light rounded py-2">{data && data.dob}</p>
              </div>}

              {data && data.gender && <div className="col-md-6">
                <label>{languagesModel.translate('gender_text', language)}</label>
                <p className="bg-light rounded py-2 text-capitalize">{data && data.gender}</p>
              </div>}


              <div className="col-md-6 mb-3">
                <label>{languagesModel.translate('timezone', language)}<span className="start">*</span></label>
                <select
                  className="form-control"
                  value={form && form.timeZone}
                  onChange={e => setForm({ ...form, timeZone: e.target.value })}
                  required
                  disabled
                >
                  <option value="">Select Option</option>
                  {timezones && timezones.map(itm => {
                    return <option value={itm.id} key={itm.id}>GMT{itm.utc_offset}</option>
                  })}
                </select>
              </div>
            </div>
          </div>

          {form.healthClinicId && (form.role == 'Clinic Admin' || form.role == 'Counsellor') ? <div className='pprofile1 mt-3'>
            <div className='row'>
              <div className='col-md-12'>
                <h5 className='mb-3 hedcls'>{languagesModel.translate('health_clinic_text', language)}</h5>
              </div>

              <div className="col-md-6 mb-3">
                <label>{languagesModel.translate('name_text', language)}</label>
                <p className="text">{form.healthClinicId.name}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label>{languagesModel.translate('country_text', language)}</label>
                <p className="text">{countryModel.name(form.healthClinicId.country)}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label>{languagesModel.translate('state_text', language)}</label>
                <p className="text">{stateModel.name(form.healthClinicId.state, form.healthClinicId.country)}</p>
              </div>
              <div className="col-md-6 mb-3">
                <label>{languagesModel.translate('city_text', language)}</label>
                <p className="text">{form.healthClinicId.city}</p>
              </div>
            </div>
          </div> : <></>}

          {form.role == 'user' ?
            <>  <div className='pprofile1 mt-3'>
              <div className='row'>
                {/* <div className='col-md-12'>
              <h5 className='mb-3 hedcls'>Provided support letter</h5>
            </div> */}
                <div className="col-md-6 mb-3">
                  <label>Has support letter been provided?</label>
                  <p className="bg-light rounded py-2">{form && form.supportLetter}</p>
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Support Doc</label>
                  <div>
                    {form && form.supportLetterFile ? <div>
                      {form.supportLetterFile.map((itm, i) => {
                        return <span className="docFile" key={itm}>
                          {/* <a href={ApiKey.api + 'docs/' + itm} target="_blank"> */}
                          <i className="fa fa-file"></i> {itm}
                          <div className='mt-2 text-right'>
                            <i className="fa fa-download text-primary cursor-pointer" onClick={e => download(ApiKey.api + 'docs/' + itm)}></i>
                          </div>
                        </span>
                      })}

                    </div> : <></>}
                  </div>


                </div>
              </div>
            </div>
            </> : <></>}

          {form.role == 'Counsellor' ?
            <>  <div className='pprofile1 mt-3'>
              <div className='row'>
                <div className='col-md-12'>
                  <h5 className='mb-3 hedcls'>{languagesModel.translate('clinic_admin_text', language)}</h5>
                </div>
                <div className="col-md-6">
                  <label>{languagesModel.translate('clinic_name', language)}</label>
                  <p className="bg-light rounded py-2">{data && data.clinicId.fullName}</p>
                </div>
                {/* <div className="col-md-6">
              <label>{languagesModel.translate('reschedule_time_text', language)}</label>
              <p className="bg-light rounded py-2">{data && data.clinicId.rescheduleTime} hrs</p>
            </div> */}
                {/* <div className="col-md-6">
          <label>Address</label>
          <p className="bg-light rounded py-2">{data && data.clinicId.address}</p>
        </div> */}
                <div className="col-md-6">
                  <label>{languagesModel.translate('mobileno_text', language)}</label>
                  <p className="bg-light rounded py-2">{data && data.clinicId.dialCode + data.clinicId.mobileNo}</p>
                </div>

                <div className="col-md-6 mb-3">
                  <label>{languagesModel.translate('timezone', language)}<span className="start">*</span></label>
                  <select
                    className="form-control"
                    value={form && form.timeZone}
                    onChange={e => setForm({ ...form, timeZone: e.target.value })}
                    required
                    disabled

                  >
                    <option value="">{languagesModel.translate('select_option', language)}</option>
                    {timezones && timezones.map(itm => {
                      return <option value={itm.id} key={itm.id}>GMT{itm.utc_offset}</option>
                    })}
                  </select>
                </div>
              </div>
            </div>

              <div className='pprofile1 mt-3'>
                <div className='row'>
                  <div className='col-md-12'>
                    <h5 className='mb-3 hedcls'>{languagesModel.translate('consultation_drop', language)}</h5>
                  </div>

                  <div className="col-md-6">
                    <label>{languagesModel.translate('expertise_text', language)}</label><br></br>
                    {form && form.expertise && form.expertise.map((itm, i) => {
                      return <span className="badge badge-primary m-1" key={itm}>{itm}</span>
                    })}
                  </div>

                  <div className="col-md-6">
                    <label>{languagesModel.translate('languages_text', language)}</label><br></br>
                    <div className="col-md-12">
                      {form && form.language && form.language.map((itm, i) => {
                        return <span className="badge badge-primary m-1" key={itm}>{itm}</span>
                      })}
                    </div>
                  </div>
                  {/* <div className="col-md-6">
              <label>Address</label>
              <p className="bg-light rounded py-2">{data && data.clinicId.address}</p>
            </div> */}
                  <div className="col-md-6">
                    <label>{languagesModel.translate('institution_text', language)}</label>

                    <p className="bg-light rounded py-2">{data && data.institute}</p>

                  </div>

                  <div className="col-md-6 mb-3">
                    <label>{languagesModel.translate('degree_text', language)}</label>
                    <p className="bg-light rounded py-2">{data && data.degree}</p>
                  </div>
                </div>

              </div></> : <></>}

        </div>
      </Layout>
    </>
  );
};

export default Profile;
