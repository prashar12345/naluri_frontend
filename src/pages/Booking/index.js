import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import { useHistory } from 'react-router';
import PageLayout from '../../components/global/PageLayout';
import ApiClient from '../../methods/api/apiClient';
import methodModel from '../../methods/methods';
import loader from '../../methods/loader';
import datepipeModel from '../../models/datepipemodel';
import { ToastsStore } from 'react-toasts';
import modalModel from '../../models/modal.model';
import ContentModal from './ContentModal';
import SetDateModal from './SetDateModal';
import countryModel from '../../models/country.model';
import languagesModel from '../../models/languages.model';
import bookingModel from '../../models/booking.model';


const Booking = (p) => {
    const today = new Date()
    const history = useHistory()
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [cdetail, setCdetail] = useState()
    const [contentData, setContentData] = useState({ acknowledgeAgree: false, consultantAgree: false, consentAgree: false, readingconsentform: false, consenttoMinistry: false, appointmentId: '', counsellorId: '' })
    const [submitted, setSubmitted] = useState(false)
    const [consentform, setconsentform] = useState({ counsellorId: '', appointmentId: '' })
    const [appointments, setAppointments] = useState()
    const [isView, setIsView] = useState(false)
    const [tabs, setTabs] = useState('profile')
    const [dateform, setDateForm] = useState({
        counsellorId: '', start: '',
        end: '',
        appointmentType: ''
    })

    const [intakeform, setIntakeform] = useState({
        ic_number: '',
        minor: '',
        gender: '',
        dob: '',
        dialCode: '',
        mobileNo: '',
        email: '',
        consultation_type: 'In-person',
        clinicAddress: '',
        homeAddress: '',
        guardianName: '',
        guardianDialCode: '+60',
        guardianMobileNo: '',
        guardianRelation: '',
        concern: '',
        counsellorId: '',
        start: '',
        end: ''
    })

    const dobmax = new Date().setFullYear(today.getFullYear() - 18)
    const dobmin = new Date().setFullYear(today.getFullYear() - 100)
    const formValidation = [
        { key: 'ic_number', minLength: 6 },
        { key: 'mobileNo', minLength: 9 },
        { key: 'guardianMobileNo', minLength: 9 },
    ]
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [oldcounsellors, setCounsellors] = useState([])
    const getCounsellors = () => {
        loader(true)
        ApiClient.get('connected/counsellors', { userId: user.id }).then(res => {
            if (res.success) {
                setCounsellors(res.data)
            }
            loader(false)
        })
    }

    const getAppointments = (id) => {
        ApiClient.get('user/appointments', { page: 1, count: 100, status: 'Completed', counsellorId: id }).then(res => {
            if (res.success) {
                let appointment = res.data
                setAppointments(appointment)
            }
        })
    }

    const getConsellor = () => {
        loader(true)
        let counsellorId = methodModel.getPrams('counsellorId')
        ApiClient.get('user/detail', { id: counsellorId }).then(res => {
            if (res.success) {
                let counsellor = res.data
                setCdetail(counsellor)
                getUser(counsellor)
            } else {
                loader(false)
            }
        })
    }

    const getUser = (counsellor) => {
        loader(true)
        let userId = methodModel.getPrams('userId')
        if (user.role === 'user') userId = user.id
        ApiClient.get('user/detail', { id: userId }).then(res => {
            if (res.success) {
                let consultation_type = methodModel.getPrams('consultation_type')
                let healthClinicId = counsellor.healthClinicId
                let clinicAddress = ''
                if (healthClinicId) {
                    clinicAddress = `${healthClinicId ? healthClinicId.city : ''}, ${healthClinicId ? healthClinicId.state : ''}, ${healthClinicId ? healthClinicId.country : ''}`
                }
                setIntakeform({
                    ...intakeform,
                    ...res.data,
                    userId: res.data.id,
                    homeAddress: res.data.address,
                    counsellorId: counsellor.id,
                    consultation_type: consultation_type ? consultation_type : 'In-person',
                    clinicAddress: clinicAddress,
                    start: methodModel.getPrams('start'),
                    end: methodModel.getPrams('end'),
                })
            }
            loader(false)
        })
    }

    const getError = (key) => {
        let value = methodModel.getError(key, intakeform, formValidation)
        return value
    }

    const getAppointment = (id) => {
        loader(true)
        ApiClient.get('appointment', { id: id }).then(res => {
            if (res.success) {
                let appointment = res.data
                let auser = res.data.userId
                let userId = auser.id
                let counsellor = res.data.counsellor
                let counsellorId = counsellor.id
                setCdetail({ ...counsellor, healthClinicId: appointment.healthClinicId })

                if (appointment.state) getState(appointment.country)
                if (appointment.city) getCity(appointment.state, appointment.country)
                if (userId !== user.id && user.role === 'user') {
                    ToastsStore.error("You are not authorized to book this appointment")
                    history.push("/")
                }

                let start = res.data.start
                let end = res.data.end
                if (methodModel.getPrams('start')) start = methodModel.getPrams('start')
                if (methodModel.getPrams('end')) end = methodModel.getPrams('end')

                if (userId) {
                    let consultation_type = methodModel.getPrams('consultation_type')
                    setIntakeform({
                        ...intakeform,
                        ...auser,
                        ...appointment,
                        userId: userId,
                        counsellorId: counsellorId,
                        consultation_type: consultation_type ? consultation_type : appointment.consultation_type,
                        clinicAddress: appointment.clinicAddress ? appointment.clinicAddress : counsellor.address,
                        homeAddress: appointment.homeAddress ? appointment.homeAddress : auser.address,
                        start: start,
                        end: end,
                    })
                }


                if (methodModel.getPrams('page') === 'reschedule') {
                    start = methodModel.getPrams('start')
                    end = methodModel.getPrams('end')
                    userId = methodModel.getPrams('userId')
                    counsellorId = methodModel.getPrams('counsellorId')
                }

            }
            loader(false)
        })
    }

    const skip = () => {
        submitConfirm()
    }


    const book = (form) => {
        if (form.casenote) transferCaseNote()
        loader(true)
        let method = 'post'
        let url = 'appointment/request'
        if (user.role === 'Counsellor') url = 'add/appointment/counsellor'

        if (form.id) {
            method = 'put'
            url = 'appointment'
        } else {
            delete form.id
        }

        ApiClient.allApi(url, form, method).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                history.push('/confirm-booking')
                page('Submit form')
                page('Consultation booking confirmed')
                // if (user.role === 'Counsellor') {
                //     history.push('/appointments')
                // } else if (user.role === 'Clinic Admin') {
                //     history.push('/ca-appointments')
                // } else {
                //     history.push('/requests')
                // }
            }
            loader(false)
        })
    }

    const transferCaseNote = (form) => {
        let payload = {
            "userId": user.id,
            "appointmentId": form.casenote.appointmentId,
            "counsellorId": form.casenote.counsellorId,
            "newCounsellorId": form.counsellorId
        }
        ApiClient.post('transfer/request', payload).then(res => {
            if (res.success) {
            }
        })
    }

    const onSubmit = (e) => {
        if (e) e.preventDefault()
        if (isView) return
        setSubmitted(true)

        let invalid = methodModel.getFormError(formValidation, intakeform, 'intakeform')
        if (e && invalid) return

        if (!intakeform.start || !intakeform.end) {
            ToastsStore.error("Please set Date and Time")
            return
        }



        if (tabs === 'profile') {
            setTabs('emergency')
        }
        if (tabs === 'emergency') setTabs('discussion')
        if (tabs === 'discussion') setTabs('consent')
        if (tabs === 'consent') submitConfirm()
    }


    const submitConfirm = () => {
        let casenote = ''
        if (contentData.casenote) casenote = {
            counsellorId: consentform.counsellorId,
            appointmentId: consentform.appointmentId
        }

        let value = {
            page: methodModel.getPrams('page'),
            casenote,
            counsellorId: intakeform.counsellorId,
            userId: intakeform.userId,
            start: intakeform.start,
            end: intakeform.end,
            ic_number: intakeform.ic_number,
            minor: intakeform.minor,
            gender: intakeform.gender,
            dob: intakeform.dob,
            dialCode: intakeform.dialCode,
            mobileNo: intakeform.mobileNo,
            email: intakeform.email,
            consultation_type: intakeform.consultation_type,
            clinicAddress: intakeform.clinicAddress,
            homeAddress: intakeform.homeAddress,
            guardianName: intakeform.guardianName,
            guardianDialCode: intakeform.guardianDialCode,
            guardianMobileNo: intakeform.guardianMobileNo,
            guardianRelation: intakeform.guardianRelation,
            concern: intakeform.concern,
            country: intakeform.country,
            state: intakeform.state,
            city: intakeform.city,
            postal_code: intakeform.postal_code,
            appointmentType: dateform.appointmentType ? dateform.appointmentType : methodModel.getPrams('appointmentType'),
            appointment_type: dateform.appointmentType ? dateform.appointmentType : methodModel.getPrams('appointmentType')
        }

        if (methodModel.getPrams('appointmentId')) {
            value.id = methodModel.getPrams('appointmentId')
            value.appointmentId = methodModel.getPrams('appointmentId')
        }


        let valArr = Object.keys(value)
        valArr.map(itm => {
            if (!value[itm]) delete value[itm]
        })

        if (methodModel.getPrams('page') === 'reschedule') {
            if (user.role === 'user') {
                let url = 'reschedule/request/ca'
                let method = 'put'
                delete value.id
                ApiClient.allApi(url, value, method).then(res => {
                    if (res.success) {
                        ToastsStore.success(res.message)
                        history.push('/requests')
                    }
                    loader(false)
                })
            }

        } else {
            localStorage.setItem("intakeform", JSON.stringify(value))
            book(value)
        }
    }



    useEffect(() => {
        getCounsellors()
        if (methodModel.getPrams('page') === 'view') setIsView(true)
        if (methodModel.getPrams('page') === 'invite' && user.role != 'user') {
            ToastsStore.error("Please login as user")
            history.push("/")
            return
        }
        let appointmentId = methodModel.getPrams('appointmentId')
        if (appointmentId) {
            getAppointment(appointmentId)
        } else {
            let userId = methodModel.getPrams('userId')
            if (userId && userId != user.id && user.role === 'user') {
                ToastsStore.error("You are not authorized to book this appointment")
                history.push("/")
                return
            }
            getConsellor()
        }

        if (user.id) {
            page('Land on intake form')
        }
    }, [])

    const agreed = () => {
        modalModel.close('contentModal')
        setContentData({ ...contentData, consentAgree: true })
    }


    const openDateModal = () => {
        setDateForm({
            counsellorId: intakeform.counsellorId,
            start: intakeform.start,
            end: intakeform.end,
            consultation_type: intakeform.consultation_type,
            appointmentType: methodModel.getPrams('appointmentType')
        })
        modalModel.open('setDateModal')
    }

    const modalClosed = (value) => {
        setIntakeform({ ...intakeform, start: value.start, end: value.end, consultation_type: value.consultation_type })
    }

    const back = () => {
        history.goBack()
    }


    const changeCounsellor = (id) => {
        getAppointments(id)
    }


    const getState = (code) => {
        ApiClient.get('states', { countryCode: code }).then(res => {
            if (res.success) {
                setStates(res.data)
            }
        })
    }

    const getCity = (code, country) => {
        ApiClient.get('city', { countryCode: country ? country : intakeform.country, stateCode: code }).then(res => {
            if (res.success) {
                setCities(res.data)
            }
        })
    }



    const check = (p) => {
        let profilekeys = [
            'homeAddress',
            'country',
            'state',
            'postal_code'
        ]

        let emergencyKeys = [
            'guardianName',
            'guardianRelation',
            'guardianDialCode',
            'guardianMobileNo'
        ]

        let discussionKeys = [
            'concern'
        ]

        let consentKeys = [
            'acknowledgeAgree',
            'consultantAgree',
            'consentAgree'
        ]

        let value = true
        if (p === 'profile') {
            profilekeys.map(itm => {
                if (!intakeform[itm]) {
                    value = false
                    return
                }
                if (getError(itm).invalid) {
                    value = false
                    return
                }
            })
        }

        else if (p === 'emergency') {
            [...emergencyKeys, ...profilekeys].map(itm => {
                if (!intakeform[itm]) {
                    value = false
                    return
                }
                if (getError(itm).invalid) {
                    value = false
                    return
                }
            })
        }

        else if (p === 'discussion') {
            [...emergencyKeys, ...profilekeys, ...discussionKeys].map(itm => {
                if (!intakeform[itm]) {
                    value = false
                    return
                }
                if (getError(itm).invalid) {
                    value = false
                    return
                }
            })
        }

        else if (p === 'consent') {
            [...emergencyKeys, ...profilekeys, ...discussionKeys].map(itm => {
                if (!intakeform[itm]) {
                    value = false
                    return
                }
                if (getError(itm).invalid) {
                    value = false
                    return
                }
            })

            consentKeys.map(itm => {
                if (!contentData[itm]) {
                    value = false
                    return
                }
            })
        }

        return value
    }

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    const page = (page = '') => {
        if (user.id) ApiClient.dropoff(page, user)
    }

    return (
        <PageLayout>
            <form onSubmit={onSubmit}>
                <div className="container">

                    <div className="row mt-3 bookingfromclss">

                        <div className="col-md-8 mb-5" id="main">
                            <div className="text-right">
                                <a className='backbtn mr-2' href="#" onClick={() => back()}>{languagesModel.translate('back_button', language)}</a>
                                {user.role === 'Counsellor' || user.role === 'Clinic Admin' ? !isView ? <a className='backbtn pl-4' href="#" onClick={e => skip()}>Skip</a> : <></> : <></>}

                            </div>
                            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title ">
                                            <a className={`acordian_design pt-3  justify-content-between pl-0 ${tabs != 'profile' ? 'collapsed' : ''}`}>
                                                {languagesModel.translate('personal_details', language)}

                                                {check('profile') ? <i className="fa fa-check-circle greentick ml-3" aria-hidden="true"></i> : <></>}
                                                <i className="fa fa-angle-down acordiandropicon" aria-hidden="true"></i>

                                            </a>


                                        </h4>


                                    </div>
                                    {tabs === 'profile' && <div id="collapseOne" className={`panel-collapse collapse show`}>
                                        <div className="panel-body">

                                            <div className='bgbagroundcolr'>
                                                {/* <h3 className='Personalhead'>Personal Details</h3> */}

                                                <input
                                                    placeholder={languagesModel.translate('full_name', language)}
                                                    value={intakeform.fullName}
                                                    type="text"
                                                    className="form-control wtclor mt-3"
                                                    required
                                                    disabled
                                                />

                                                <div className='row' >
                                                    <div className='col-md-6'>

                                                        <input
                                                            disabled
                                                            placeholder={languagesModel.translate('icnumber_text', language)}
                                                            value={intakeform.ic_number}
                                                            type="text"
                                                            className="form-control wtclor mt-3"
                                                            id="intakeform-ic_number"
                                                            required />
                                                        {submitted && getError('ic_number').invalid ? <div className="invalid-feedback d-block">Min Length is 5</div> : <></>}

                                                        <input
                                                            type="date"
                                                            className="form-control wtclor mt-3 "
                                                            min={datepipeModel.datetostring(dobmin)}
                                                            max={datepipeModel.datetostring(dobmax)}
                                                            value={intakeform.dob ? intakeform.dob : ''}
                                                            onChange={e => { setIntakeform({ ...intakeform, dob: e.target.value }) }}
                                                            disabled
                                                            required
                                                        />


                                                        <div className="phoneInput">
                                                            <input
                                                                type="text"
                                                                className="form-control wtclor mt-3" placeholder='+60'
                                                                value={intakeform && intakeform.dialCode}
                                                                onChange={e => setIntakeform({ ...intakeform, dialCode: e.target.value })}
                                                                required
                                                                disabled
                                                            />
                                                            <input
                                                                type="text"
                                                                className="form-control wtclor mt-3" placeholder={languagesModel.translate('mobileno_text', language)}
                                                                value={intakeform && intakeform.mobileNo}
                                                                maxLength={12}
                                                                disabled
                                                                onChange={e => setIntakeform({ ...intakeform, mobileNo: methodModel.isNumber(e) })}
                                                                required

                                                            />
                                                        </div>

                                                    </div>



                                                    <div className='col-md-6'>
                                                        <select className="form-control mt-3"
                                                            value={intakeform && intakeform.nationality}
                                                            onChange={e => { setIntakeform({ ...intakeform, nationality: e.target.value, ic_number: '' }); }}
                                                            required
                                                            disabled
                                                        >
                                                            <option value="">{languagesModel.translate('nationality_text', language)}*</option>
                                                            <option value="Malaysian">Malaysian</option>
                                                            <option value="Non-Malaysian">Non-Malaysian</option>
                                                        </select>


                                                        <select className="form-control mt-3"
                                                            value={intakeform && intakeform.gender}
                                                            onChange={e => { setIntakeform({ ...intakeform, gender: e.target.value }); }}
                                                            required
                                                            disabled
                                                        >
                                                            <option value="">{languagesModel.translate('gender_text', language)}*</option>
                                                            <option value="male">{languagesModel.translate('male_text', language)}</option>
                                                            <option value="female">{languagesModel.translate('male_text', language)}</option>
                                                        </select>

                                                        <input
                                                            type="email"
                                                            className='form-control wtclor mt-3'
                                                            placeholder={languagesModel.translate('email_text', language)}
                                                            value={intakeform.email ? intakeform.email : ''}
                                                            onChange={e => { setIntakeform({ ...intakeform, email: e.target.value }); }}
                                                            disabled
                                                        />

                                                    </div>

                                                </div>

                                                <h3 className='Personalhead mt-4 mb-3 ml-2'>{languagesModel.translate('home_address', language)}</h3>
                                                <div className='form-row'>
                                                    <div className='col-md-12'>
                                                        <input
                                                            type="text"
                                                            placeholder={`${languagesModel.translate('street_address', language)}*`}
                                                            value={intakeform.homeAddress ? intakeform.homeAddress : ''}
                                                            onChange={e => { setIntakeform({ ...intakeform, homeAddress: e.target.value }); }}
                                                            className="form-control wtclor"
                                                            required
                                                            disabled={isView}
                                                        />
                                                    </div>

                                                    <div className='col-md-4 mt-3'>
                                                        <select className="form-control" value={intakeform.country} onChange={e => { getState(e.target.value); setIntakeform({ ...intakeform, country: e.target.value, state: '', city: '' }) }} required disabled={isView}>
                                                            <option value="">{languagesModel.translate('country_text', language)}*</option>
                                                            {countryModel.list.map(itm => {
                                                                return <option value={itm.isoCode} key={itm.isoCode}>{itm.name}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className='col-md-4 mt-3'>
                                                        <select className="form-control" value={intakeform.state} onChange={e => { getCity(e.target.value); setIntakeform({ ...intakeform, state: e.target.value }) }} required disabled={isView}>
                                                            <option value="">{languagesModel.translate('state_text', language)}*</option>
                                                            {states.map(itm => {
                                                                return <option value={itm.isoCode}>{itm.name}</option>
                                                            })}
                                                        </select>
                                                    </div>

                                                    <div className='col-md-4 mt-3'>
                                                        <select className="form-control" value={intakeform.city} onChange={e => { setIntakeform({ ...intakeform, city: e.target.value }) }} disabled={isView}>
                                                            <option value="">{languagesModel.translate('city_text', language)}</option>
                                                            {cities.map(itm => {
                                                                return <option value={itm.name}>{itm.name}</option>
                                                            })}
                                                        </select>
                                                    </div>

                                                    <div className='col-md-4 mt-3'>
                                                        <input className="form-control" placeholder={`${languagesModel.translate('zipcode_text', language)}*`} type="text" maxLength="6" value={intakeform.postal_code} onChange={e => setIntakeform({ ...intakeform, postal_code: e.target.value })} required disabled={isView} />
                                                    </div>

                                                    {!isView && <div className='col-md-12 text-right'>
                                                        <button className='wtroundbtn'>{languagesModel.translate('save_btn', language)}</button>
                                                    </div>}


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                </div>

                                <div className="panel panel-default mt-3">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a className={`acordian_design pt-3 pl-0 ${tabs != 'emergency' || isView ? 'collapsed' : ''}`}>
                                                {languagesModel.translate('emergency_contact', language)}

                                                {check('emergency') ? <i className="fa fa-check-circle greentick ml-3" aria-hidden="true"></i> : <></>}

                                                <i className="fa fa-angle-down acordiandropicon" aria-hidden="true"></i>
                                            </a>
                                        </h4>
                                    </div>

                                    {tabs === 'emergency' || isView ? <div id="collapseTwo" className={`panel-collapse collapse show`}>
                                        <div className="panel-body ">
                                            <div className='bgbagroundcolr'>
                                                <input
                                                    type="text"
                                                    placeholder={languagesModel.translate('guardian_name', language) + '*'}
                                                    value={intakeform.guardianName}
                                                    onChange={e => setIntakeform({ ...intakeform, guardianName: e.target.value })}
                                                    className="form-control wtclor"
                                                    required
                                                    disabled={isView}
                                                />

                                                <div className="form-row">
                                                    <div className='col-md-6'>
                                                        <select
                                                            className="form-control wtclor mt-3"
                                                            required
                                                            value={intakeform.guardianRelation}
                                                            onChange={e => setIntakeform({ ...intakeform, guardianRelation: e.target.value })}
                                                            disabled={isView}>
                                                            <option value="">{languagesModel.translate('guardian_relationship', language)}*</option>
                                                            {bookingModel.relationships.map(itm => {
                                                                return <option value={itm.id}>{itm.name}</option>
                                                            })}
                                                        </select>
                                                    </div>



                                                    <div className='col-md-6'>
                                                        <div className="phoneInput">
                                                            <input
                                                                type="text"
                                                                className="form-control wtclor mt-3" placeholder='+60'
                                                                value={intakeform && intakeform.guardianDialCode}
                                                                onChange={e => setIntakeform({ ...intakeform, guardianDialCode: e.target.value })}
                                                                required
                                                                disabled={isView}
                                                            />
                                                            <input
                                                                type="text"
                                                                className="form-control wtclor mt-3" placeholder={languagesModel.translate('mobileno_text', language) + '*'}
                                                                value={intakeform && intakeform.guardianMobileNo}
                                                                id="intakeform-guardianMobileNo"
                                                                maxLength={12}
                                                                onChange={e => setIntakeform({ ...intakeform, guardianMobileNo: methodModel.isNumber(e) })}
                                                                required
                                                                disabled={isView}
                                                            />
                                                        </div>
                                                        {submitted && getError('guardianMobileNo').invalid ? <div className="invalid-feedback d-block">Min Length is 10</div> : <></>}


                                                    </div>

                                                    {!isView && <div className='col-md-12 mt-3'>
                                                        <label className='checkcontent'>  <input type="checkbox" required value={intakeform.guardianAgree} onChange={e => { setIntakeform({ ...intakeform, guardianAgree: e.target.checked }) }} className='mr-2'></input> {languagesModel.translate('emergency_contact_check', language)}*</label>
                                                        <div className=' text-right mt-5'>
                                                            <button className='wtroundbtn mr-2' onClick={e => setTabs('profile')}>{languagesModel.translate('back_button', language)}</button>
                                                            <button className='wtroundbtn'>{languagesModel.translate('save_btn', language)}</button>
                                                        </div>
                                                    </div>}


                                                </div>
                                            </div>
                                        </div>
                                    </div> : <></>
                                    }
                                </div>

                                <div className="panel panel-default mt-3 ">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a className={`acordian_design pt-3 pl-0 ${tabs != 'discussion' || isView ? 'collapsed' : ''}`}>
                                                {languagesModel.translate('topic_of_discussion', language)}
                                                {check('discussion') ? <i className="fa fa-check-circle greentick ml-3" aria-hidden="true"></i> : <></>}
                                                <i className="fa fa-angle-down acordiandropicon" aria-hidden="true"></i>
                                            </a>
                                        </h4>
                                    </div>


                                    {tabs === 'discussion' || isView ? <div id="collapseThree" className={`panel-collapse collapse show`}>
                                        <div className="panel-body">
                                            <div className='bgbagroundcolr'>
                                                <textarea
                                                    type="text"
                                                    placeholder={languagesModel.translate('main_concern_to_talk_about', language)}
                                                    className="form-control wtclor"
                                                    value={intakeform.concern}
                                                    onChange={e => setIntakeform({ ...intakeform, concern: e.target.value })}
                                                    required
                                                    disabled={isView}
                                                />


                                                {!isView && <div className='row' >
                                                    <div className='col-md-12'>
                                                        <div className=' text-right mt-5'>
                                                            <button className='wtroundbtn mr-2' onClick={e => setTabs('emergency')}> {languagesModel.translate('back_button', language)}</button>
                                                            <button className='wtroundbtn'>{languagesModel.translate('save_btn', language)}</button>
                                                        </div>
                                                    </div>
                                                </div>}

                                            </div>
                                        </div>
                                    </div> : <></>
                                    }


                                </div>


                                {!isView ? <>
                                    <div className="panel panel-default mt-3 ">
                                        <div className="panel-heading" role="tab" id="headingFour">
                                            <h4 className="panel-title">
                                                <a className={`acordian_design pt-3 pl-0 ${tabs != 'consent' ? 'collapsed' : ''}`}>
                                                    {languagesModel.translate('consultation_service_consent_form', language)}
                                                    {check('consent') ? <i className="fa fa-check-circle greentick ml-3" aria-hidden="true"></i> : <></>}
                                                    <i className="fa fa-angle-down acordiandropicon" aria-hidden="true"></i>
                                                </a>
                                            </h4>
                                        </div>

                                        {tabs === 'consent' ? <div id="collapseFour" className={`panel-collapse collapse show`}>
                                            <div className="panel-body ">
                                                <div className='bgbagroundcolr'>
                                                    <p className='checkcontent' >{languagesModel.translate('consultation_service_paira', language)}<a target="_blank" href="https://drive.google.com/file/d/1jFrKHYm6DJUgeH9dw8gNhqTglcOEfdjV/view"> click here</a>.</p>


                                                    {/* .. */}
                                                    <label className="mb-3 d-block">
                                                        <input type="checkbox" title="Please agree Terms ans Policies" className="mr-2" checked={contentData.readingconsentform ? true : false} onChange={(e) => setContentData({ ...contentData, readingconsentform: e.target.checked })} required />
                                                        {languagesModel.translate('consultation_service_check_one', language)} *
                                                    </label>
                                                    <label className="mb-3 d-block">
                                                        <input type="checkbox" title="Please agree Terms ans Policies" className="mr-2" checked={contentData.consenttoMinistry ? true : false} onChange={(e) => setContentData({ ...contentData, consenttoMinistry: e.target.checked })} required />
                                                        {languagesModel.translate('consultation_service_check_two', language)}
                                                    </label>
                                                    {/* ... */}


                                                    {user.role === 'user' ? <>
                                                        {contentData.casenote ? <div className="form-row">
                                                            <div className="col-md-6 mb-3">
                                                                <label><span className="start">*</span> {languagesModel.translate('counsellor_newtext', language)}</label>
                                                                <select className="form-control" value={consentform && consentform.counsellorId} onChange={e => { setconsentform({ ...consentform, counsellorId: e.target.value }); changeCounsellor(e.target.value) }} required>
                                                                    <option value=""> {languagesModel.translate('select_counsellor', language)}</option>
                                                                    {oldcounsellors && oldcounsellors.map(itm => {
                                                                        return <option value={itm.id} key={itm.id}>{itm.fullName}</option>
                                                                    })}
                                                                </select>
                                                            </div>
                                                            {consentform.counsellorId ? <div className="col-md-6 mb-3">
                                                                <label>Appointments<span className="start">*</span></label>
                                                                <select className="form-control" value={consentform && consentform.appointmentId} onChange={e => { setconsentform({ ...consentform, appointmentId: e.target.value }) }} required>
                                                                    <option value="">Select Option</option>
                                                                    {appointments && appointments.map(itm => {
                                                                        return <option value={itm.id} key={itm.id}>{datepipeModel.date(itm.start)} | {datepipeModel.isotime(itm.start)}-{datepipeModel.isotime(itm.end)}</option>
                                                                    })}
                                                                </select>
                                                            </div> : <></>}
                                                        </div> : <></>}
                                                    </> : <></>}



                                                    <div className='form-row'>
                                                        <div className='col-md-6'>
                                                            <button className='wtroundbtn w-100 mr-2' onClick={e => setTabs('discussion')}> {languagesModel.translate('back_button', language)}</button>
                                                        </div>
                                                        <div className='col-md-6'>
                                                            {methodModel.getPrams('page') === 'reschedule' ? <button className='Book_Appointment'>{languagesModel.translate('reschedule_button', language)}</button> : <button className='Book_Appointment'>{languagesModel.translate('book_appointment', language)}</button>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : <></>
                                        }
                                    </div>

                                </> : <></>}



                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className='rightbgcolr'>
                                {/* <div className='bookrightdiv'> */}
                                <img src={methodModel.userImg(cdetail && cdetail.image, '/assets/img/noimage.png')} className=' bookrightimg ' />
                                {/* </div> */}

                                <div className='bookdetailcls'>

                                    <p className='bookparastyle'>{languagesModel.translate('consultation_booking_summary', language)}</p>

                                    <h3 className='personname'>{cdetail && cdetail.fullName}</h3>
                                    <p className='pertitalecls'>{languagesModel.translate('title_text', language)}</p>

                                    <p className='graycl mb-0 mt-4'><i className="fa fa-comments iconclorcls mr-2" aria-hidden="true"></i>{languagesModel.translate('consultation_preference', language)}</p>
                                    <h3 className='facetofacecls ml-4'>{intakeform && intakeform.consultation_type} Consultation</h3>

                                    <p className='graycl mb-0 mt-4'><i className="fa fa-map-marker-alt iconclorcls  mr-2" aria-hidden="true"></i>{languagesModel.translate('location_text', language)}</p>
                                    <h3 className='facetofacecls ml-4'>{cdetail && translate2(cdetail.healthClinicId && cdetail.healthClinicId.nameTranslate, cdetail.healthClinicId && cdetail.healthClinicId.name)}</h3>


                                    <p className='graycl mb-0 mt-4'><i className="fa fa-clock iconclorcls  mr-2" aria-hidden="true"></i>{languagesModel.translate('when_text', language)}</p>
                                    <h3 className='facetofacecls ml-4 mb-3'>{intakeform.start ? datepipeModel.date(intakeform.start) : 'Date'} | {intakeform.start ? datepipeModel.isotime(intakeform.start) : 'Time'}</h3>
                                    <button type="button" className="btn btn-primary" disabled={isView} onClick={openDateModal}>{languagesModel.translate('change_date&time', language)}</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </form >


            <ContentModal form={contentData} modalClosed={agreed} />
            {modalModel.modal('setDateModal') ? <SetDateModal form={dateform} setform={setDateForm} modalClosed={modalClosed} setIntakeform={setIntakeform} /> : <></>}
        </PageLayout >
    );
};
export default Booking;
