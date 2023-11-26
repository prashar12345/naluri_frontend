import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import methodModel from "../../methods/methods";
import datepipeModel from "../../models/datepipemodel";
import modalModel from "../../models/modal.model";
import DatePicker from "react-datepicker";
import preferredTimeModel from "../../models/preferredTime.model";
import ApiClient from "../../methods/api/apiClient";
import languagesModel from '../../models/languages.model';
import availabilityModel from "../../models/availability.model";

const ProfiledataModal = ({ form, filters, setFilters, book }) => {
    const language = useSelector(state => state.language.data)
    const [filter, setFilter] = useState({ consultation_type: '', start: '', appointmentType: '' })
    const [availablity, setAvailability] = useState()
    const [appointmentTypes, setAppointmentTypes] = useState([])
    const [loading, setLoader] = useState(false)
    const [availableDates, setavailableDates] = useState()
    const [aTypeLoader, setATypeLoader] = useState(false)
    const [weekAvaialability, setWeekAvaialability] = useState([])
    const confirmbooking = () => {
        if (!filter.appointmentType) {
            ToastsStore.error('Please select Appointment Type')
            return
        }

        let ext = appointmentTypes.find(itm => itm.appointmentType.id == filter.appointmentType)
        let time = ext ? ext.appointmentType.time : 60
        let end = new Date(filter.start)
        end = end.setMinutes(end.getMinutes() + Number(time))
        end = new Date(end).toISOString()
        let value = { ...filter, end }

        let etime = datepipeModel.isototime(value.end)

        let aend = availablity.schedule.end
        if (!aend) aend = datepipeModel.datetoIsotime(`${datepipeModel.datetostring(filter.start)} ${availablity.weeklyAvailablity.end}`)

        // console.log("schedule aend", availablity.schedule.end)
        // console.log("weeklyAvailablity aend", availablity.weeklyAvailablity.end)
        // console.log("aend", aend)
        console.log("value", value)
        if (preferredTimeModel.existsCheck(etime, availablity.disabledSlotes) || new Date(aend) < new Date(value.end)) {
            ToastsStore.error("Please Select Valid Range Slot")
            return
        }


        // return

        setFilters(filter)
        modalModel.close('profiledataModal')

        if (filter.consultation_type === 'Video') {
            book(form, filter)
        } else {
            modalModel.open('confirmbookingModal')
        }
    }

    const getappointmentTypes = () => {
        setATypeLoader(true)
        ApiClient.get('counsellor/appointment/type', { page: 1, count: 100, counsellorId: form.id }).then(res => {
            if (res.success) {
                setAppointmentTypes(res.data)
                let aTypes = res.data
                if (aTypes.length) {
                    let ext = aTypes.find(itm => itm.appointmentType.time === "90")
                    setFilter({ ...filter, appointmentType: ext ? ext.appointmentType.id : aTypes[0].appointmentType.id });
                } else {
                    setFilter({ ...filter, appointmentType: '' });
                }
            }

            setATypeLoader(false)
        })
    }


    const dateChange = (start, timeClicked = false) => {
        setFilter({ ...filter, start, timeClicked: timeClicked })
        let time = '09:00:00'
        if (datepipeModel.datetostring(start) == datepipeModel.datetostring(new Date())) {
            let current = datepipeModel.datetoIsotime(new Date())
            let ext = preferredTimeModel.list.find(itm => preferredTimeModel.lesserCheck(current, itm.name))
            if (ext) time = ext.name
        }

        let date = datepipeModel.datetostring(start)
        let s = datepipeModel.datetoIsotime(`${date} ${time}`)
        setFilters({ ...filters, start: s })
        checkAvailability(start)
    }


    const setTime = (time) => {
        let value = ''
        let start = filter.start ? filter.start : new Date()
        let date = datepipeModel.datetostring(start)
        value = datepipeModel.datetoIsotime(`${date} ${time}`)
        setFilter({ ...filter, start: value, timeClicked: true })
    }

    const checkAvailability = (start, consultation_type) => {
        let counsellorId = form.id

        setLoader(true)
        ApiClient.get('get/schedule', { date: start, counsellorId: counsellorId, consultation_type: consultation_type ? consultation_type : filter.consultation_type }).then(res => {
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
                    setFilter({ ...filter, start: start, consultation_type: data.schedule.consultation_type })
                } else {
                    setFilter({ ...filter, start: start, consultation_type: consultation_type ? consultation_type : filter.consultation_type })
                }

                setAvailability(data)
            }
            setLoader(false)
        })
    }

    const disable = () => {
        let keys = [
            'consultation_type',
            'appointmentType',
            'start',
            'timeClicked'
        ]
        let value = false
        keys.map(itm => {
            if (!filter[itm]) value = true
        })
        return value
    }

    const typeChange = (type) => {
        setFilter({ ...filter, consultation_type: type, timeClicked: false })
        if (filter.start) checkAvailability(filter.start, type)
    }

    useEffect(() => {
        setAvailability('')
        setFilter({ ...filters })
    }, [filters])

    useEffect(() => {
        if (form && form.id) {
            getappointmentTypes()
            availabledates()
            getWeekAvailability(form.id)
        }
        if (filter.start) dateChange(filter.start, true)
    }, [form.extra])


    const getWeekAvailability = (id) => {
        ApiClient.get('weekly/availability', { counsellorId: id }).then(res => {
            if (res.success) {
                setWeekAvaialability(res.data)
            }
        })
    }

    const singleAppointment = (id) => {
        let value = ''
        if (appointmentTypes && appointmentTypes.length) {
            let ext = appointmentTypes.find(itm => itm.appointmentType.id == id)
            if (ext) value = ext.appointmentType.appointmentType
        }

        return value
    }

    const availabledates = () => {
        ApiClient.get('counsellor/schedules', { counsellorId: form.id }).then(res => {
            if (res.success) {
                setavailableDates(res.data)
            }
        })
    }
    const copy = () => {
        let host = window.location.host
        let http = 'https://'
        if (host.split(':')) http = 'http://'
        let url = http + host + '/consultation?cId=' + form.id
        // navigator.clipboard.writeText(url)
        ToastsStore.success("URL Copied")

        var textField = document.createElement('textarea')
        textField.innerText = url
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
    }

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    return <>
        <div className="modal fade" id="profiledataModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content contentmodal pt-0 pb-0">
                    <div className="row mx-0">
                        <div className="col-md-5 pl-0 ">
                            <img src={methodModel.userImg(form && form.image, '/assets/img/noimage.png')} className="profileimagnew" />
                        </div>

                        <div className="col-md-7 pt-4 pb-4 pl-5 consultation-modal">
                            <div className="text-right">
                                <i className="fa fa-times close" title="Close" data-dismiss="modal"></i>
                            </div>

                            <div className="">
                                <h5 className="username d-flex">{form && form.fullName}
                                    <i className="fa fa-copy copyIcon" title="Copy Profile URL" onClick={e => copy()}></i>
                                </h5>



                                <h3 className="locationcls">{languagesModel.translate('timezone', language)}</h3>

                                <p className="mb-1">{form && form.timezonename}</p>

                                <h3 className="locationcls">{languagesModel.translate('accreditations&membership', language)}</h3>
                                <p className="mb-1">{form && form.institute} <br />
                                    {form && form.degree}
                                </p>
                                {form && form.expertise ? <p className="text-primary"><em>{form && form.fullName} {languagesModel.translate('aspecialises_in', language)} {form && form.expertise && form.expertise.map(val => { return <span>, {val}</span> })}</em></p> : <></>}

                                <h3 className="locationcls"><i className="fa fa-map-marker-alt mr-1" aria-hidden="true"></i> {languagesModel.translate('location_text', language)}</h3>
                                {/* <p></p> */}
                                <p className="popuppara text-capitalize">{form && form.healthClinicId && translate2(form.healthClinicId.nameTranslate, form.healthClinicId.name)}</p>

                                <label className="appointment_type text-capitalize">{languagesModel.translate('appointment_type', language)}</label>
                                <div className="dropdown mb-3">
                                    <button className={`btn btn-outline-primary`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {aTypeLoader ? <>Loading...</> : <>{filter.appointmentType ? singleAppointment(filter.appointmentType) : languagesModel.translate('select_appointment_type', language)}</>}
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {appointmentTypes && appointmentTypes.map(itm => {
                                            return <a className={`dropdown-item ${filter.appointmentType == itm.appointmentType.id && 'active'}`} onClick={() => setFilter({ ...filter, appointmentType: itm.appointmentType.id })} key={itm.id}>{itm.appointmentType.appointmentType}</a>
                                        })}
                                    </div>
                                </div>
                                {availableDates && availableDates.length ? <h3 className="locationcls">{languagesModel.translate('availabile_date', language)}</h3> : <></>}
                                {
                                    availableDates && availableDates.map(itm => {
                                        return <button className={`active-btn m-1 `} type="button" onClick={e => dateChange(datepipeModel.datetoIso(itm.start))} >
                                            {datepipeModel.date(itm.start)}
                                        </button>

                                    })
                                }

                                <div className="d-flex mt-4 mb-3 consultationDivs">
                                    <div onClick={e => typeChange('In-person')} className={`whatsapvideodiv text-center ${filter.consultation_type === 'In-person' ? 'bg-primary text-white' : ''}`}>
                                        <div className="wtext">{languagesModel.translate('in-person_consultation', language)}</div>
                                    </div>
                                    <div onClick={e => typeChange('Video')} className={`facetoface text-center ${filter.consultation_type === 'Video' ? 'bg-primary text-white' : ''}`}>
                                        <div className="ctext">{languagesModel.translate('video_consultation', language)}</div>
                                    </div>
                                </div>

                                <div className="d-flex calanderdivs">
                                    <div className="calanderdiv bookindatepicker2">
                                        <DatePicker minDate={new Date()} onKeyDown={e => e.preventDefault()} selected={filter.start ? datepipeModel.isotodate(filter.start) : ''} onChange={e => { dateChange(datepipeModel.datetoIso(e)) }} id="bookindatepicker2" className="dateInput" />
                                        <div className="datetext"><i className="fa fa-calendar mr-1" aria-hidden="true"></i>{filter && filter.start ? datepipeModel.date(filter.start) : languagesModel.translate('date_text', language)}</div>
                                        <div className="calOverLay" onClick={e => { document.getElementById('bookindatepicker2').click() }}></div>
                                    </div>

                                    <div className="dropdown pretimeDropdown">
                                        <div className="timediv" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <div className="timetext"> <i className='far fa-clock mr-1'></i>
                                                {filter && filter.timeClicked ? datepipeModel.isotime(filter.start) : languagesModel.translate('time_text', language)}
                                            </div>
                                        </div>

                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            {availablity && preferredTimeModel.timelist(filter.start).map(itm => {
                                                if (availabilityModel.checkAvailability(availablity, itm.name))
                                                    return <a className={`dropdown-item ${datepipeModel.time(itm.name) == datepipeModel.isotime(filter.start) && 'active'} ${preferredTimeModel.existsCheck(itm.name, availablity.disabledSlotes) ? 'disabled' : ''}`} onClick={() => setTime(itm.name)} key={itm.id}>{datepipeModel.time(itm.name)}
                                                    </a>
                                            })}
                                        </div>
                                    </div>

                                </div>
                                <button className="btn btn-primary roundbtn mt-3" disabled={disable()} onClick={() => confirmbooking()}>{loading ? 'Loading..' : languagesModel.translate('confirm_booking', language)}</button>
                            </div>
                            <div className="detailclss">
                                <h3></h3>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ProfiledataModal