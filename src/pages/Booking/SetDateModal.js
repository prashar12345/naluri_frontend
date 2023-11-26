import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastsStore } from 'react-toasts';
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import datepipeModel from '../../models/datepipemodel';
import modalModel from '../../models/modal.model';
import preferredTimeModel from '../../models/preferredTime.model';
import languagesModel from '../../models/languages.model';
import availabilityModel from '../../models/availability.model';

const SetDateModal = ({ form, setform, modalClosed }) => {
    const [appointmentTypes, setAppointmentTypes] = useState([])
    const language = useSelector(state => state.language.data)
    const [availablity, setAvailability] = useState()
    const [loading, setLoader] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            getappointmentTypes()
        }, 100)

        if (form && form.start) {
            dateChange(form.start)
        }
    }, [])

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
        if (preferredTimeModel.existsCheck(etime, availablity.disabledSlotes) || new Date(availablity.schedule.end) < new Date(value.end)) {
            ToastsStore.error("Please Select Valid Range Slot")
            return
        }


        loader(true)
        ApiClient.post("check/availablity", { start: value.start, end: value.end, counsellorId: value.counsellorId }).then(res => {
            if (res.success) {
                modalModel.close('setDateModal')
                modalClosed(value)
            }
            loader(false)
        })
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
        // loader(true)
        ApiClient.get('counsellor/appointment/type', { page: 1, count: 100, counsellorId: form.counsellorId }).then(res => {
            if (res.success) {
                setAppointmentTypes(res.data)
            }
            // loader(false)
        })
    }

    const typeChange = (p) => {
        setform({ ...form, consultation_type: p, start: '', end: '', timeClicked: false })
    }

    return <>
        <div className="modal fade" id="setDateModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-md">
                <div className="modal-content ">
                    <div className="modal-header">
                        <h5 className="modal-title">{languagesModel.translate('set_date_time', language)}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" title='Close'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={formSubmit}>
                        <div className='modal-body'>
                            <div className="form-row">
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
                                {form.start ? <>
                                    <div className='col-md-6'>
                                        <label>{languagesModel.translate('choose_time', language)}</label>
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
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button className="btn btn-primary" type="submit" disabled={form && form.timeClicked ? false : true}>{languagesModel.translate('set_text', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default SetDateModal