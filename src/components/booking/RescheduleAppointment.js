
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ToastsStore } from 'react-toasts';
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from '../../methods/methods';
import datepipeModel from '../../models/datepipemodel';
import modalModel from '../../models/modal.model';
import preferredTimeModel from '../../models/preferredTime.model';
import languagesModel from '../../models/languages.model';

const RescheduleAppointment = ({ form = { appointmentId: '', userId: '', user: '', start: '', end: '', counsellorId: '', disabledSlotes: [] }, setform, modalClosed }) => {
    const history = useHistory()
    const language = useSelector(state => state.language.data)
    const user = useSelector(state => state.user)
    const [appointmentTypes, setAppointmentTypes] = useState([])
    const [availablity, setAvailability] = useState()


    const setTime = (time) => {
        let value = ''
        let date = datepipeModel.datetostring(form.start)
        value = datepipeModel.datetoIsotime(`${date} ${time}`)
        setform({ ...form, start: value, timeClicked: true })
    }

    const formSubmit = (e) => {
        e.preventDefault()
        let ext = appointmentTypes.find(itm => itm.appointmentType.id == form.appointmentType)
        let time = ext ? ext.appointmentType.time : 60
        let end = new Date(form.start)
        end = end.setMinutes(end.getMinutes() + Number(time))
        end = new Date(end).toISOString()
        let value = { ...form, end }


        let etime = datepipeModel.isototime(value.end)
        if (preferredTimeModel.existsCheck(etime, availablity.disabledSlotes)) {
            ToastsStore.error("Please Select Valid Range Slot")
            return
        }


        loader(true)
        ApiClient.post("check/availablity", { start: value.start, end: value.end, counsellorId: value.counsellorId }).then(res => {
            if (res.success) {
                if (user.role == 'user') {
                    modalModel.close('rescheduleappointmentModal')

                    let prms = {
                        appointmentId: value.appointmentId,
                        counsellorId: value.counsellorId,
                        end: value.end,
                        start: value.start,
                        userId: value.userId,
                        consultation_type: value.consultation_type,
                        page: 'reschedule'
                    }
                    let prmsurl = methodModel.setPrams(prms)
                    history.push('booking' + prmsurl)
                } else {
                    reschedule(value)
                }
            } else {
                loader(false)
            }
        })
    }

    const dateChange = (start) => {
        setform({ ...form, start, timeClicked: false })
        checkAvailability(start)
    }


    const checkAvailability = (start) => {
        let counsellorId = form.counsellorId

        loader(true)
        ApiClient.get('get/schedule', { date: start, counsellorId: counsellorId, consultation_type: form.consultation_type }).then(res => {
            if (res.success) {
                let disabledSlotes = []
                if (res.bookedSlots.length) {
                    res.bookedSlots.map(itm => {
                        let slotes = preferredTimeModel.getSlots(itm.start, itm.end, 1)
                        disabledSlotes = [...disabledSlotes, ...slotes]
                    })
                }
                let data = {
                    schedule: res.schedule,
                    bookedSlots: res.bookedSlots,
                    disabledSlotes
                }
                setAvailability(data)
            }
            loader(false)
        })
    }

    const reschedule = (value) => {
        loader(true)
        ApiClient.post('reschedule/request', value).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                document.getElementById("closerescheduleappointmentModal").click()
                modalClosed()
            }
            loader(false)
        })
    }


    const getappointmentTypes = () => {
        // loader(true)
        ApiClient.get('counsellor/appointment/type', { page: 1, count: 100, counsellorId: form.counsellorId }).then(res => {
            if (res.success) {
                setAppointmentTypes(res.data)
            }
            // loader(false)
        })
    }

    const no = () => {
        modalModel.close('rescheduleConfirm')
        modalModel.open('rescheduleappointmentModal')
    }

    const yes = () => {
        modalModel.close('rescheduleConfirm')
        let prms = {
            appointmentId: form.appointmentId,
            counsellorId: form.counsellorId,
            end: form.end,
            start: form.start,
            page: 'user-reschedule'
        }
        let prmsurl = methodModel.setPrams(prms)
        history.push('consultation' + prmsurl)
    }

    const typeChange = (p) => {
        setform({ ...form, consultation_type: p, start: '', end: '', timeClicked: false })
    }


    useEffect(() => {
        getappointmentTypes()
        if (form && form.start) {
            dateChange(form.start)
        }
    }, [])

    return <>
        <a id="openrescheduleappointmentModal" data-toggle="modal" data-target="#rescheduleappointmentModal"></a>
        <div className="modal fade" id="rescheduleappointmentModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-md">
                <div className="modal-content ">
                    <div className="modal-header">
                        <h5 className="modal-title">{form && form.appointmentId ? languagesModel.translate('reschedule_text', language) : languagesModel.translate('add_text', language)} {languagesModel.translate('consultation_text', language)}</h5>
                        <button type="button" id="closerescheduleappointmentModal" className="close" data-dismiss="modal" aria-label="Close" title='Close'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={formSubmit}>
                        <div className='modal-body'>
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label> {languagesModel.translate('user_text', language)}</label>
                                    <p className="mb-0 form-control">{form && form.user.fullName}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('appointment_type', language)}</label>
                                    <select className="form-control" required value={form && form.appointmentType ? form.appointmentType : ''} onChange={e => setform({ ...form, appointmentType: e.target.value })}>
                                        <option value="">{languagesModel.translate('select_option', language)}</option>
                                        {appointmentTypes && appointmentTypes.map(itm => {
                                            return <option key={itm.id} value={itm.appointmentType.id}>{itm.appointmentType.appointmentType}</option>
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
                                        <option value="" disabled>{languagesModel.translate('select_option', language)}</option>
                                        <option value="In-person">{languagesModel.translate('in-person_consultation', language)}</option>
                                        <option value="Video">{languagesModel.translate('video_consultation', language)}</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('date_text', language)}</label>
                                    <input type="date" className="form-control" min={datepipeModel.datetostring(new Date())} value={datepipeModel.datetostring(form && form.start)} onChange={e => { dateChange(datepipeModel.datetoIso(`${e.target.value} 09:00:00`)) }} required />
                                </div>
                                {form.start && availablity && availablity.schedule && availablity.schedule.start ? <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('time_text', language)}</label>
                                    <div className="dropdown mr-2 pretimeDropdown">
                                        <button className={`btn dropclass dropdown-toggle ${form.start && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className='far fa-clock mr-1'></i>
                                            {form && form.timeClicked ? datepipeModel.isotime(form.start) : languagesModel.translate('time_text', language)}
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            {preferredTimeModel.list.map(itm => {
                                                if (preferredTimeModel.lesserCheck(availablity.schedule.start, itm.name) && preferredTimeModel.greaterCheck(availablity.schedule.end, itm.name))
                                                    return <a className={`dropdown-item ${datepipeModel.time(itm.name) == datepipeModel.isotime(form.start) && 'active'} ${preferredTimeModel.existsCheck(itm.name, availablity.disabledSlotes) && 'disabled'}`} onClick={() => setTime(itm.name)} key={itm.id}>{datepipeModel.time(itm.name)}</a>
                                            })}
                                        </div>
                                    </div>
                                </div> : <></>}
                                {availablity && availablity.schedule && !availablity.schedule.start ? <div className="col-md-12 text-center text-danger">
                                    Not available
                                </div> : <></>}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button className="btn btn-primary" type="submit" disabled={form && form.timeClicked ? false : true}>{form && form.appointmentId ? languagesModel.translate('reschedule_text', language) : languagesModel.translate('add_text', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default RescheduleAppointment