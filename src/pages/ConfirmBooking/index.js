import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { ToastsStore } from 'react-toasts';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import datepipeModel from '../../models/datepipemodel';
import languagesModel from '../../models/languages.model';
import './style.scss';

const ConfirmBooking = (p) => {
    const language = useSelector(state => state.language.data)
    const history = useHistory()
    const [form, setForm] = useState()
    const [userData, setuserData] = useState()
    const [counsellordata, setcounsellorData] = useState()
    const user = useSelector(state => state.user)

    const getUserdetail = (id) => {
        loader(true)
        ApiClient.get(`user/detail`, { id }).then(res => {
            if (res.success) {
                setuserData(res.data)
            }
            loader(false)
        })
    };



    const getConnslordetail = (id) => {
        loader(true)
        ApiClient.get(`user/detail`, { id }).then(res => {
            if (res.success) {
                setcounsellorData(res.data)
            }
            loader(false)
        })
    }

    const back = () => {
        if (user.role == 'Counsellor') {
            history.push('/appointments')
        } else if (user.role == 'Clinic Admin') {
            history.push('/ca-appointments')
        } else {
            history.push('/requests')
        }
    }

    useEffect(() => {
        let intakeform = localStorage.getItem("intakeform")
        if (intakeform) {
            intakeform = JSON.parse(intakeform)
            if (intakeform.appointment) intakeform.appointmentId = intakeform.appointment
            setForm(intakeform)
            getUserdetail(intakeform.userId)
            getConnslordetail(intakeform.counsellorId)
        }
    }, [])

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    return (
        <>
            <div className='mainbookindiv d-flex '>
                <div className='container my-auto'>
                    <div className='row '>
                        <div className='col-md-7 detaildivclss'>

                            <div className=''>
                                <div className='text-center'>
                                    <i className="far fa-check-circle Successfullytick mb-3 mt-3" aria-hidden="true"></i>
                                    <p className='Successfullycls'>{languagesModel.translate('consultation_booking_successfully', language)}</p>

                                </div>

                                <div className='skydiv'>
                                    <div className='text-center mb-4'>
                                        <p className='graycolr mb-0'>{form && form.consultation_type} {languagesModel.translate('consultation_appointment_with', language)}</p>
                                        <h3 className='Counsellornamecls'>{languagesModel.translate('counsellor_newtext', language)} {counsellordata && counsellordata.fullName}</h3>
                                    </div>



                                    <div className='d-flex'>
                                        <div>
                                            <p className='graycolr mb-0'><i className="far fa-clock iconclor mr-1" aria-hidden="true"></i>{languagesModel.translate('when_text', language)}</p>
                                            <p className='datetimecolor'>{form && datepipeModel.date(form.start)} | {form && datepipeModel.isotime(form.start)} - {form && datepipeModel.isotime(form.end)}</p>
                                        </div>

                                        <div className=' ml-3'>
                                            <p className='graycolr mb-0'><i className="fa fa-map-marker-alt iconclor mr-1" aria-hidden="true"></i>{languagesModel.translate('location_text', language)}</p>
                                            <p className='datetimecolor'>{counsellordata && translate2(counsellordata.healthClinicId.nameTranslate, counsellordata.healthClinicId.name)}</p>
                                        </div>

                                    </div>


                                </div>

                                <div className='text-center'>
                                    <Link to="/dashboard" className='bookbutton mt-3 mb-4'>{languagesModel.translate('back_home', language)}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};
export default ConfirmBooking;
