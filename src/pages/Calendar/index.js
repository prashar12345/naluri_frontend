import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import './style.scss';
import "react-datepicker/dist/react-datepicker.css";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction'
import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import statusModel from '../../models/status.model';
import ViewAppointment from '../Appointments/ViewAppointment';
import AddEditAppointment from '../Appointments/AddEditAppointment';
import { useHistory } from 'react-router-dom';
import methodModel from '../../methods/methods';
import modalModel from '../../models/modal.model';
import languagesModel from '../../models/languages.model';
import ViewCalendar from './ViewCalendar';
import AddEditavailability from "../Availability/AddEditAvailability"

const CalendarPage = (p) => {
    const history = useHistory()
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [data, setData] = useState([])
    const [form, setform] = useState({ start: '' })
    const [filters, setFilter] = useState({ page: 1, count: 1000, search: '', counsellorId: '', status: '' })
    const [availablities, setAvailabilities] = useState([])
    const [availablityForm, setAvailabilityForm] = useState({ scheduleDate: '' })
    const [viewData, setViewData] = useState([])
    const [events, setEvent] = useState([])
    const [catEvents, setCalEvents] = useState([])
    const [counsellors, setConsellors] = useState([])
    const calendarRef = React.createRef()


    const getCounsellors = () => {
        ApiClient.get('user/listing', { page: 1, count: 100, role: 'Counsellor', clinicId: user.id }).then(res => {
            if (res.success) {
                setConsellors(res.data)
            }
        })
    }

    const getAvailabilty = (addedBy, filter = {}) => {
        ApiClient.get('schedules', { page: 1, count: 100, addedBy: addedBy }).then(res => {
            if (res.success) {
                setAvailabilities(res.data)
                setFilter({ ...filters, ...filter })
                getData(filter, res.data)
            }
        })
    }

    const getData = (p = filters, adata = availablities) => {
        let filter = {
            ...filters,
            ...p
        }
        ApiClient.get('counsellor/appointments', filter).then(res => {
            if (res.success) {
                setData(res.data)
                let event = []
                // adata.map(itm => {
                //     let value = {
                //         start: datepipeModel.isotodate(itm.start),
                //         end: datepipeModel.isotodate(itm.end),
                //         className: 'availability',
                //         id: itm.id,
                //         title: `availability`
                //     }
                //     event.push(value)
                // })
                // res.data.map(itm => {
                //     let value = {
                //         start: datepipeModel.isotodate(itm.start),
                //         end: datepipeModel.isotodate(itm.end),
                //         className: 'appointments',
                //         id: itm.id,
                //         title: `${datepipeModel.isotime(itm.start)}-${datepipeModel.isotime(itm.start)} ${itm.status}`
                //     }
                //     event.push(value)
                // })
                setEvents(adata, res.data)
            }
        })
    }

    const setEvents = (adata = [], sdata = data) => {
        let event = []
        let aevent = []

        adata.map(itm => {
            let value = {
                start: datepipeModel.isotodate(itm.start),
                end: datepipeModel.isotodate(itm.end),
                className: 'availability',
                id: itm.id,
                title: `availability`
            }
            aevent.push({ ...value, detail: itm })
            event.push(value)
        })

        sdata.map(itm => {
            let value = {
                start: datepipeModel.isotodate(itm.start),
                end: datepipeModel.isotodate(itm.end),
                className: 'appointments',
                id: itm.id,
                title: `${datepipeModel.isotime(itm.start)}-${datepipeModel.isotime(itm.start)} ${itm.status}`
            }
            event.push(value)
        })
        setEvent(event)
    }

    const statusChange = (status) => {
        let filter = {
            search: '',
            status: status,
            page: 1
        }
        setFilter({ ...filters, ...filter })
        getData(filter)
    }

    const signleAppointment = (id) => {
        let ext = data.find(itm => itm.id == id)
        return ext
    }

    const signleAvailability = (id) => {
        let ext = availablities.find(itm => itm.id == id)
        return ext
    }

    const renderEventContent = (eventInfo) => {
        let title = eventInfo.event._def.title
        let id = eventInfo.event._def.publicId
        if (title == 'availability') {
            let itm = signleAvailability(id)
            return (<>Availablity: {datepipeModel.isotime(itm && itm.start)}-{datepipeModel.isotime(itm && itm.end)}{ }</>)
        } else {
            let itm = signleAppointment(id)
            let className = 'other'
            if (itm && itm.status) {
                if (itm.status == 'Under Approval') className = 'text-warning'
                if (itm.status == 'Cancelled') className = 'text-danger'
                if (itm.status == 'Upcoming') className = 'text-success'
                if (itm.status == 'Reschedule') className = 'text-info'
                return (<>{datepipeModel.isotime(itm.start)}-{datepipeModel.isotime(itm.end)}<br /> <span className={className}>{statusModel.name(itm.status)}</span></>)
            }

        }
    }

    const handleDateClick = (e) => {
        let cdate = datepipeModel.datetostring(e.date)
        let ndate = datepipeModel.datetostring(new Date())
        if (cdate == ndate || e.date > new Date()) {
            setform({ start: datepipeModel.datetoIso(e.dateStr), end: '', consultation_type: 'In-person', counsellors: counsellors, calDate: datepipeModel.datetoIso(e.dateStr) })
            let evt = []
            if (data && data.length) evt = data.filter(itm => datepipeModel.datetostring(itm.start) == e.dateStr)


            let availablity = ''
            if (availablities && availablities.length) availablity = availablities.find(itm => datepipeModel.datetostring(itm.start) == e.dateStr)

            let payload = {
                events: evt,
                availablity: availablity ? availablity : '',
                date: e.date
            }

            if (user.role == 'Counsellor') {
                ApiClient.get('get/schedule', { date: datepipeModel.datetoIso(e.date), counsellorId: user.id }).then(res => {
                    if (res.success) {
                        let payload = {
                            events: evt,
                            weeklyAvailablity: res.weeklyAvailablity,
                            availablity: res.schedule,
                            date: e.date
                        }
                        setCalEvents(payload)
                        modalModel.open('ViewCalendarModal')
                    }
                })
            } else {
                setCalEvents(payload)
                modalModel.open('ViewCalendarModal')
            }

        }
    }

    const handleEventClick = e => {
        let id = e.event._def.publicId
        let title = e.event._def.title
        if (title == 'availability') {

        } else {
            viewAppointment(id)
        }
    }

    const viewAppointment = (id) => {
        ApiClient.get('appointment', { id: id }).then(res => {
            if (res.success) {
                setViewData(res.data)
                document.getElementById("openviewappointmentModal").click()
            }
        })
    }

    const modalClosed = () => {
        getData()
    }

    const tab = () => {
        if (user.role == 'Clinic Admin') {
            history.push("/ca-appointments")
        } else {
            history.push("/appointments")
        }
    }

    const search = (p = {}) => {
        let filter = {
            page: 1,
            ...p
        }
        setFilter({ ...filters, ...filter })
        getData({ ...filters, ...filter })
    }


    useEffect(() => {
        let counsellorId = ''
        if (user.role == 'Counsellor') counsellorId = user.id
        let clinicId = ''
        if (user.role == 'Clinic Admin') {
            clinicId = user.id
        }

        getCounsellors()
        if (counsellorId) {
            getAvailabilty(counsellorId, { counsellorId, clinicId })
        } else {
            search({ counsellorId, clinicId })
        }

    }, [])


    const editAvailability = () => {
        let payload = {}
        if (catEvents && catEvents.availablity && catEvents.availablity.start) {
            let itm = catEvents.availablity
            payload = {
                id: itm.id,
                start: datepipeModel.isototime(itm.start),
                end: datepipeModel.isototime(itm.end),
                scheduleDate: datepipeModel.datetostring(catEvents.date),
                consultation_type: itm.consultation_type
            }
        } else {
            let itm = catEvents.weeklyAvailablity
            payload = {
                start: itm.start,
                end: itm.end,
                scheduleDate: datepipeModel.datetostring(catEvents.date),
                consultation_type: ''
            }
        }

        // console.log("catEvents.availablity", payload)
        setAvailabilityForm(payload)
        modalModel.close('ViewCalendarModal')
        modalModel.open('availabiltyModal')
    }

    const avialabiltyModalClosed = () => {
        let counsellorId = ''
        if (user.role == 'Counsellor') counsellorId = user.id
        let clinicId = ''
        if (user.role == 'Clinic Admin') {
            clinicId = user.id
        }
        if (counsellorId) {
            getAvailabilty(counsellorId, { counsellorId, clinicId })
        } else {
            search({ counsellorId, clinicId })
        }
    }


    return (
        <Layout>
            <div className="d-flex justify-content-between mb-3 appointmentadd flex-wrap">
                <h3 className="usershedding mb-2">
                    {languagesModel.translate('consultation_sessions', language)}
                </h3>
                <div className="d-flex flex-wrap">

                    <div className="">
                        <div className="dropdown w-100">
                            <button className={`btn btn-primary  dropdown-toggle mr-2 ${filters.consultation_type && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {filters.consultation_type ? filters.consultation_type : languagesModel.translate('mode_of_consultation', language)}
                            </button>
                            <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                <a className={`dropdown-item ${filters.consultation_type == '' && 'active'}`} onClick={() => search({ consultation_type: '' })}>{languagesModel.translate('all_text', language)}</a>
                                <a className={`dropdown-item ${filters.consultation_type == 'In-person' && 'active'}`} onClick={() => search({ consultation_type: 'In-person' })}>{languagesModel.translate('in-personConsultation', language)}</a>
                                <a className={`dropdown-item ${filters.consultation_type == 'Video' && 'active'}`} onClick={() => search({ consultation_type: 'Video', state: '', city: '', country: '' })}>{languagesModel.translate('video_consultation', language)}</a>
                            </div>
                        </div>
                    </div>

                    {user.role == 'Clinic Admin' ? <div className="dropdown mr-2">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {filters.counsellorId ? methodModel.find(counsellors, filters.counsellorId, 'id').fullName : 'counsellor'}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className={`dropdown-item ${filters.counsellorId == '' && 'active'}`} onClick={() => search({ counsellorId: '' })}>{languagesModel.translate('all_text', language)}</a>
                            {counsellors.map(itm => {
                                return <a className={`dropdown-item ${filters.counsellorId == itm.id && 'active'}`} key={itm.id} onClick={() => search({ counsellorId: itm.id })}>{itm.fullName}</a>
                            })}
                        </div>
                    </div> : <></>}
                    <div className="dropdown mr-2">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {filters.status ? statusModel.name(filters.status) : languagesModel.translate('status_heading', language)}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" onClick={() => statusChange('')}>All</a>
                            {statusModel.list.map(itm => {
                                return <a className={`dropdown-item ${filters.status == itm.id && 'active'}`} key={itm.id} onClick={() => statusChange(itm.id)}>{itm.value}</a>
                            })}
                        </div>
                    </div>
                    <div className="viewTypes">
                        <a onClick={tab} className="fa fa-list btn" title="List View"></a>
                        <a className="fa fa-calendar btn active" title="Calendar View"></a>
                    </div>
                </div>
            </div>

            <div className="calendarWrapper">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    ref={calendarRef}
                    initialView="dayGridMonth"
                    events={[
                        ...events,
                    ]}
                    // selectable={true}
                    dateClick={handleDateClick}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                />
            </div>

            <AddEditAppointment form={form} setform={setform} modalClosed={modalClosed} />
            <ViewCalendar form={catEvents} viewAppointment={viewAppointment} editAvailability={editAvailability} />
            <AddEditavailability form={availablityForm} setform={setAvailabilityForm} modalClosed={avialabiltyModalClosed} />
            <ViewAppointment form={viewData} />
        </Layout>

    );
};

export default CalendarPage;
