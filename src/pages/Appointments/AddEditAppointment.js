
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ToastsStore } from 'react-toasts';
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from '../../methods/methods';
import datepipeModel from '../../models/datepipemodel';
import preferredTimeModel from '../../models/preferredTime.model';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import languagesModel from '../../models/languages.model';
import availabilityModel from '../../models/availability.model';

const AddEditAppointment = ({ form, setform, modalClosed }) => {
    const history = useHistory()
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [users, setUsers] = useState()
    const [appointmentTypes, setAppointmentTypes] = useState([])
    const [availablity, setAvailability] = useState()
    const [userDropdown, setUserDropdown] = useState({ show: false, search: '' })
    const [loading, setLoader] = useState(false)
    const setPlaceholder = () => {
        setTimeout(() => {
            let el = document.getElementById("bookindatepicker1")
            if (el) el.setAttribute('placeholder', 'DD/MM/YYYY')
        }, 1);
    }

    const getUsers = () => {
        let counsellorId = ''
        if (user.role == 'Counsellor') counsellorId = user.id
        let clinicId = ''
        if (user.role == 'Clinic Admin') {
            clinicId = user.id
            counsellorId = form.counsellorId
        }
        if (user.role == 'user') {
            counsellorId = form.counsellorId
        }

        if (!counsellorId) return

        ApiClient.get('user/listing', { counsellorId, clinicId, role: 'user', page: 1, count: 100 }).then(res => {
            if (res.success) {
                setUsers(res.data)
            }
            // loader(false)
        })
    }

    const singleUser = (id) => {
        let ext = users.find(itm => itm.id == id)
        return ext
    }

    const setTime = (time) => {
        let value = ''
        let date = datepipeModel.datetostring(form.start)
        value = datepipeModel.datetoIsotime(`${date} ${time}`)
        setform({ ...form, start: value, timeClicked: true })
    }

    const formSubmit = (e) => {
        e.preventDefault()

        if (!form.userId) {
            ToastsStore.error("User Name is Required")
            return
        }

        let ext = appointmentTypes.find(itm => itm.appointmentType.id == form.appointmentType)
        let time = ext ? ext.appointmentType.time : 60
        let end = new Date(form.start)
        end = end.setMinutes(end.getMinutes() + Number(time))
        end = new Date(end).toISOString()

        let counsellorId = user.id
        if (user.role == 'Clinic Admin' || user.role == 'user') counsellorId = form.counsellorId
        let value = { ...form, end, counsellorId: counsellorId }


        let etime = datepipeModel.isototime(value.end)
        if (preferredTimeModel.existsCheck(etime, availablity.disabledSlotes) || new Date(availablity.schedule.end) < new Date(end)) {
            ToastsStore.error("Please Select Valid Range Slot")
            return
        }

        loader(true)
        ApiClient.post("check/availablity", { start: value.start, end: value.end, counsellorId: value.counsellorId }).then(res => {
            if (res.success) {
                formcontinue(value)
            } else {
                loader(false)
            }
        })
    }

    const formcontinue = (value) => {
        if (value && value.appointmentId) {
            value.appointment_type = value.appointmentType,
                loader(true)
            let method = 'post'
            let url = 'reschedule/request'
            if (user.role == 'Clinic Admin' || user.role == 'user') {
                url = 'reschedule/request/ca'
                method = 'put'
            }
            ApiClient.allApi(url, value, method).then(res => {
                if (res.success) {
                    ToastsStore.success(res.message)
                    document.getElementById("closeappointmentModal").click()
                    modalClosed()
                }
                loader(false)
            })
        } else {
            let filter = {
                clinicAddress: value.clinicAddress,
                counsellorId: value.counsellorId,
                start: value.start,
                end: value.end,
                userId: value.userId,
                mobileNo: singleUser(value.userId).mobileNo,
                dialCode: singleUser(value.userId).dialCode,
                consultation_type: value.consultation_type,
                appointmentType: value.appointmentType,
                appointment_type: value.appointmentType,
                page: 'add-appointment'
            }

            document.getElementById("closeappointmentModal").click()

            if (form.modal == 'link') {
                let url = 'booking/link'
                ApiClient.post(url, filter).then(res => {
                    if (res.success) {
                        ToastsStore.success(res.message)
                        document.getElementById("closeappointmentModal").click()
                        modalClosed()
                    }
                    loader(false)
                })
            } else {
                let prm = methodModel.setPrams(filter)
                history.push('/booking' + prm)
            }

        }
    }

    const dateChange = (start) => {
        setform({ ...form, start, timeClicked: false })
        checkAvailability(start)
    }

    const checkAvailability = (start, consultation_type) => {
        let counsellorId = form.counsellorId
        if (!counsellorId) counsellorId = user.id

        setLoader(true)
        ApiClient.get('get/schedule', { date: start, counsellorId: counsellorId, consultation_type: consultation_type ? consultation_type : form.consultation_type }).then(res => {
            if (res.success) {
                let disabledSlotes = []
                if (res.bookedSlots.length) {
                    res.bookedSlots.map(itm => {
                        let slotes = preferredTimeModel.getSlots(itm.start, itm.end)
                        disabledSlotes = [...disabledSlotes, ...slotes]
                    })
                }
                let data = {
                    schedule: res.schedule,
                    bookedSlots: res.bookedSlots,
                    weeklyAvailablity: res.weeklyAvailablity,
                    disabledSlotes
                }

                if (data.schedule.start) {
                    setform({ ...form, start: start, consultation_type: data.schedule.consultation_type, timeClicked: false })
                } else {
                    setform({ ...form, start: start, consultation_type: consultation_type ? consultation_type : form.consultation_type, timeClicked: false })
                }

                setAvailability(data)
            }
            setLoader(false)
        })
    }

    const getappointmentTypes = () => {
        let counsellorId = form.counsellorId
        if (!counsellorId) counsellorId = user.id
        if (!counsellorId) return
        // loader(true)
        ApiClient.get('counsellor/appointment/type', { page: 1, count: 100, counsellorId: counsellorId }).then(res => {
            if (res.success) {
                setAppointmentTypes(res.data)
            }
            // loader(false)
        })
    }

    const typeChange = (p) => {
        setform({ ...form, consultation_type: p, start: '', end: '', timeClicked: false })
    }


    useEffect(() => {
        // getUsers()
        getappointmentTypes()
        if (form && form.start) {
            dateChange(form.start)
        }
        setPlaceholder()
    }, [form.counsellorId])

    useEffect(() => {
        if (form && form.start) {
            dateChange(form.start)
        }
        searchUser('', false)
    }, [form.calDate])

    const searchUser = (p, show = true) => {
        setUserDropdown({ ...userDropdown, search: p, show: show })
        ApiClient.get('user/dropdown', { search: p }).then(res => {
            if (res.success) {
                setUsers(res.data)
            }
        })
    }

    return <>
        <a id="openappointmentModal" data-toggle="modal" data-target="#appointmentModal"></a>
        <div className="modal fade" id="appointmentModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content ">
                    <div className="modal-header">
                        {form.modal == 'link' ? <h5 className="modal-title"> {languagesModel.translate('send_consultation_sessions_link', language)}</h5> : <h5 className="modal-title">{form && form.appointmentId ? languagesModel.translate('reschedule_text', language) : languagesModel.translate('add_text', language)} {languagesModel.translate('consultation_text', language)}</h5>}
                        <button type="button" id="closeappointmentModal" className="close" data-dismiss="modal" aria-label="Close" title='Close'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={formSubmit}>
                        <div className='modal-body'>
                            <div className="form-row">
                                {/* {user.role} */}
                                {user.role == 'Clinic Admin' ? <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('counsellor_newtext', language)}</label>
                                    <select className="form-control" disabled={form && form.appointmentId ? true : false} required value={form && form.counsellorId ? form.counsellorId : ''} onChange={e => setform({ ...form, counsellorId: e.target.value })}>
                                        <option value="" disabled>{languagesModel.translate('select_user', language)}</option>
                                        {form.counsellors && form.counsellors.map(itm => {
                                            return <option key={itm.id} value={itm.id}>{itm.fullName}</option>
                                        })}
                                    </select>
                                </div> : <></>}

                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('user_text', language)}</label>
                                    {user.role != 'user' ? <div className="dropdown usersearchDropdown">
                                        <button className="btn btn-outline-primary dropdown-toggle w-100" type="button" onClick={e => { searchUser('', !userDropdown.show) }}>
                                            {userDropdown.selecteditem && form && form.userId ? userDropdown.selecteditem.fullName : languagesModel.translate('select_user', language)}
                                        </button>
                                        <div className={`dropdown-menu ${userDropdown.show ? 'show' : ''}`}>
                                            <div className="px-2">
                                                <input type="text" className="form-control mb-3" placeholder="Search" value={userDropdown.search} onChange={e => searchUser(e.target.value)} />
                                            </div>
                                            <div className="dropdownUserList">
                                                {users && users.map(itm => {
                                                    return <a className={`dropdown-item ${form && form.userId === itm.id ? 'active' : ''}`} onClick={e => { setUserDropdown({ ...userDropdown, show: false, search: '', selecteditem: itm }); setform({ ...form, userId: itm.id }) }} key={itm.id}>{itm.fullName}</a>
                                                })}
                                            </div>
                                        </div>
                                    </div> : <input type="text" className="form-control" disabled value={user.fullName} />}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('appointment_type', language)}</label>
                                    <select
                                        className="form-control"
                                        required
                                        value={form && form.appointmentType ? form.appointmentType : ''}
                                        onChange={e => setform({ ...form, appointmentType: e.target.value })}
                                        disabled={user.role != 'Counsellor' && form && form.appointmentType ? true : false}
                                    >
                                        <option value="" disabled>{languagesModel.translate('select_option', language)}</option>
                                        {appointmentTypes && appointmentTypes.map(itm => {
                                            return <option key={itm.id} value={itm.appointmentType ? itm.appointmentType.id : ''}>{itm.appointmentType && itm.appointmentType.appointmentType}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('mode_of_consultation', language)}</label>
                                    <select className="form-control"
                                        value={form.consultation_type}
                                        onChange={e => typeChange(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled> {languagesModel.translate('select_option', language)}</option>
                                        <option value="In-person">{languagesModel.translate('in-personConsultation', language)}</option>
                                        <option value="Video">{languagesModel.translate('video_consultation', language)}</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('date_text', language)}</label>
                                    {/* <input type="date" className="form-control" min={datepipeModel.datetostring(new Date())} value={datepipeModel.datetostring(form && form.start)} onChange={e => { dateChange(datepipeModel.datetoIso(`${e.target.value} 09:00:00`)) }} required /> */}
                                    <DatePicker minDate={new Date()} onKeyDown={e => e.preventDefault()} selected={form.start ? datepipeModel.isotodate(form.start) : ""} onChange={e => { dateChange(datepipeModel.datetoIso(e)) }} id="bookindatepicker1" className="form-control" />

                                </div>
                                {/* {form.start && availablity && availablity.schedule && availablity.schedule.start ? <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('time_text', language)}</label>
                                    <div className="dropdown mr-2 pretimeDropdown">
                                        <button className={`btn dropclass dropdown-toggle ${form.start && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className='far fa-clock mr-1'></i>
                                            {form && form.timeClicked ? datepipeModel.isotime(form.start) : languagesModel.translate('time_text', language)}
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            {preferredTimeModel.timelist(form.start).map(itm => {
                                                if (preferredTimeModel.lesserCheck(availablity.schedule.start, itm.name) && preferredTimeModel.greaterCheck(availablity.schedule.end, itm.name))
                                                    return <a className={`dropdown-item ${datepipeModel.time(itm.name) == datepipeModel.isotime(form.start) && 'active'} ${preferredTimeModel.existsCheck(itm.name, availablity.disabledSlotes) && 'disabled'}`} onClick={() => setTime(itm.name)} key={itm.id}>{datepipeModel.time(itm.name)}</a>
                                            })}
                                        </div>
                                    </div>
                                </div> : <></>} */}

                                {form.start ? <>
                                    <div className='col-md-6'>
                                        <div className="dropdown pretimeDropdown w-100">
                                            <div className="btn btn-primary w-100" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className='far fa-clock mr-1'></i>
                                                {form && form.timeClicked ? datepipeModel.isotime(form.start) : languagesModel.translate('time_text', language)}

                                            </div>

                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                {availablity && preferredTimeModel.timelist(form.start).map(itm => {
                                                    if (availabilityModel.checkAvailability(availablity, itm.name))
                                                        return <a className={`dropdown-item ${datepipeModel.time(itm.name) == datepipeModel.isotime(form.start) && 'active'} ${preferredTimeModel.existsCheck(itm.name, availablity.disabledSlotes) ? 'disabled' : ''}`} onClick={() => setTime(itm.name)} key={itm.id}>{datepipeModel.time(itm.name)}
                                                        </a>
                                                })}
                                            </div>
                                        </div>

                                    </div>
                                </> : <></>}



                            </div>
                        </div>
                        <div className="modal-footer">

                            {loading ? <div className='loading text-success'>Loading....</div> : <></>}


                            <button className="btn btn-secondary" type="button" data-dismiss="modal"> {languagesModel.translate('close_btutton', language)}</button>
                            {form.modal == 'link' ? <button className="btn btn-primary" type="submit" disabled={form && form.timeClicked ? false : true}>
                                {languagesModel.translate('send_btutton', language)}</button> : <button className="btn btn-primary" type="submit" disabled={form && form.timeClicked ? false : true}>{form && form.appointmentId ? languagesModel.translate('reschedule_text', language) : languagesModel.translate('add_text', language)}
                            </button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default AddEditAppointment