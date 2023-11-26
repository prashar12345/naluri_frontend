import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SelectdateModal from './SelectdateModal';
import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import preferredTimeModel from '../../models/preferredTime.model';
import './style.scss';
import loader from '../../methods/loader';
import PageLayout from '../../components/global/PageLayout';
import { useHistory } from 'react-router';
import methodModel from '../../methods/methods';
import countryModel from '../../models/country.model';
import ProfiledataModal from './ProfiledataModal';
import FilterModal from './FilterModal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmbookingModal from './ConfirmbookingModal';
import modalModel from '../../models/modal.model';
import { ToastsStore } from 'react-toasts';
import languagesModel from '../../models/languages.model';
import availabilityModel from '../../models/availability.model';
import ReachOutModal from '../Request/ReachOutModal';



const Consultation = (p) => {
    const history = useHistory()
    const user = useSelector(state => state.user)
    const [data, setData] = useState([])
    const [loading, setLoader] = useState(false)
    const language = useSelector(state => state.language.data)
    const [slotForm, setSlotForm] = useState({ addedBy: '', scheduleDate: '', slotId: '', page: 1, count: 100 })
    const [appointmentTypes, setAppointmentTypes] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [filters, setFilters] = useState({ page: 1, count: 100, consultation_type: '', search: '', country: '', state: '', languages: '', start: '', startDate: '', expertise: '', city: '', start: '', appointmentType: '', timeZone: '' })
    const [slots, setSlote] = useState([])
    const [slotLoader, setSlotLoader] = useState(false)
    const [profileData, setProfileData] = useState({ id: '' })
    const [timezones, setTimezons] = useState([])
    const [appointmentModal, setAppointmentModal] = useState(false)
    const [consultationDropdown, setConsultationDropdown] = useState(false)
    const [includeDates, setIncludeDates] = useState([])


    const openProfiledata = (itm = '') => {
        page('Select a counsellor to book an appointment')
        let timeZone = '--'
        if (timezones.length) {
            let ext = timezones.find(titm => titm.id == itm.timeZone)
            if (ext) timeZone = 'GMT' + ext.utc_offset + ' (' + ext.name + ')'
        }
        setProfileData({ ...itm, extra: new Date().getTime(), timezonename: timeZone })
        modalModel.open('profiledataModal')
    }

    const Bookingfilter = () => {
        setFilters({ ...filters, extra: new Date().getTime() })
        modalModel.open('filterModal')
    }

    const getCounselor = (p = {}) => {
        let filter = { ...filters, ...p }
        filter.startDate = filter.start
        setLoader(true)
        setIncludeDates([])
        ApiClient.get('counsellors', { ...filter, start: '' }).then(res => {
            if (res.success) {
                if (res.data) {
                    setData(res.data)
                }
            }
            setLoader(false)
        })
    }

    const search = (p = {}) => {
        if (p.appointmentType) setPlaceholder()

        let filter = { ...filters, ...p }
        setFilters(filter)

        if (filter.start && !filter.appointmentType) {
            ToastsStore.error("Please Select Appointment Type")
            return
        }
        getCounselor(p)
        setSlote([])

    }
    const searchbar = (e) => {
        e.preventDefault()
        setFilters({ ...filters, page: 1 })
        getCounselor({ page: 1 })
        // getData({ page: 1 })
    }

    const searchChange = (e) => {
        setFilters({ ...filters, search: e })
        if (!e) {
            clear()
        }
    }


    const getState = (country) => {
        ApiClient.get('states', { countryCode: country }).then(res => {
            if (res.success) {
                setStates(res.data)
            }
        })
    }

    const getCity = (state) => {
        let filter = {
            countryCode: filters.country,
            stateCode: state
        }
        ApiClient.get('city', filter).then(res => {
            if (res.success) {
                setCities(res.data)
            }
        })
    }

    const countryChange = (p = '') => {
        setFilters({ ...filters, country: p, state: '', city: '' })
        getState(p);
    }

    const stateChange = (p) => {
        setFilters({ ...filters, state: p, city: '' })
        getCity(p);
    }

    const clear = () => {
        search({ page: 1, count: 100, consultation_type: '', search: '', country: '', state: '', languages: '', expertise: '', city: '', start: '', timeZone: '' })
    }

    const searchSlote = (e, item = {}) => {
        let filter = { addedBy: slotForm.addedBy, scheduleDate: datepipeModel.datetoIso(`${e}`) }
        setSlotForm({ ...slotForm, ...item, scheduleDate: filter.scheduleDate, slotId: '' })
        setSlotLoader(true)
        ApiClient.get('schedules', filter).then(res => {
            if (res.success) {
                if (res.data.length) {
                    let data = res.data[0]
                    setSlotForm({ ...slotForm, ...item, scheduleId: data.id, scheduleDate: filter.scheduleDate })
                    setSlote(data.slots)
                } else {
                    setSlote([])
                }
            }
            setSlotLoader(false)
        })
    }

    const modalClosed = () => {

    }

    const closeModal = () => {
        setAppointmentModal(false)
    }

    const getappointmentTypes = () => {
        // loader(true)
        ApiClient.get('appointment/types', { page: 1, count: 100 }).then(res => {
            if (res.success) {
                setAppointmentTypes(res.data)
            }
            loader(false)
        })
    }


    const setTime = (time) => {
        let value = ''
        let start = filters.start ? filters.start : new Date()
        let date = datepipeModel.datetostring(start)
        value = datepipeModel.datetoIsotime(`${date} ${time}`)
        setFilters({ ...filters, start: value, timeClicked: true })
    }

    const book = (itm, filt = {}) => {
        let end = ''


        let filter = {
            counsellorId: itm.id,
            start: filters.start,
            end: end,
            appointmentType: filters.appointmentType,
            consultation_type: filters.consultation_type,
            ...filt
        }

        if (filter.start) {
            let time = appointmentTypes.find(itm => itm.id == filter.appointmentType).time
            end = new Date(filter.start)
            end = end.setMinutes(end.getMinutes() + Number(time))
            filter.end = new Date(end).toISOString()
        }

        if (methodModel.getPrams('page')) {
            filter.page = methodModel.getPrams('page')
            filter.appointment = methodModel.getPrams('appointmentId')
            filter.userId = user.id
        }
        let prm = methodModel.setPrams(filter)
        history.push('booking' + prm)
    }

    const getTimeZones = () => {
        ApiClient.get('timezones').then(res => {
            if (res.success) {
                setTimezons(res.data)
            }
        })
    }

    useEffect(() => {
        getappointmentTypes()

        getTimeZones()
        setPlaceholder()
        let counsellorId = methodModel.getPrams('cId')
        if (counsellorId) {
            ApiClient.get('user/detail', { id: counsellorId }).then(res => {
                if (res.success) {
                    openProfiledata(res.data)
                }
            })
        }

        if (user.id) {
            // timeZone
            // // let filter = { ...filters, timeZone: user.timeZone ? user.timeZone : '' }
            // setFilters(filter)
            getCounselor()
            page('Land on Consultation Booking')
        } else {
            history.push('/login');
        }
    }, [])

    useEffect(() => {
        if (appointmentTypes.length) {
            let ext = appointmentTypes.find(itm => itm.time == "90")
            setFilters({ ...filters, appointmentType: ext ? ext.id : appointmentTypes[0].id })
        }
    }, [appointmentTypes])

    useEffect(() => {
        setPlaceholder()
    }, [language])

    const setPlaceholder = () => {
        setTimeout(() => {
            let el = document.getElementById("bookindatepicker")
            if (el) el.setAttribute('placeholder', 'DD/MM/YYYY')
        }, 1);
    }

    const count = () => {
        let keys = [
            'search',
            'consultation_type',
            // 'appointmentType',
            'start',
            'timeZone',
            'expertise',
            'languages',
        ]
        let value = 0
        keys.map(itm => {
            if (filters[itm]) value = value + 1
        })
        return value
    }

    const dateChange = (p) => {
        let time = '09:00:00'
        if (datepipeModel.datetostring(p) == datepipeModel.datetostring(new Date())) {
            let current = datepipeModel.datetoIsotime(new Date())
            let ext = preferredTimeModel.list.find(itm => preferredTimeModel.lesserCheck(current, itm.name))
            if (ext) time = ext.name
        }

        let date = datepipeModel.datetostring(p)
        let start = datepipeModel.datetoIsotime(`${date} ${time}`)
        setFilters({ ...filters, start: start, timeClicked: false })
    }

    const page = (page = '') => {
        if (user.id) ApiClient.dropoff(page, user)
    }


    return (
        <PageLayout>
            <a id="modalClosed" onClick={closeModal}></a>
            <a id="dropdownclose" onClick={e => setConsultationDropdown(false)}></a>
            <div className='container maincont'>

                <div className='row'>
                    <div className='col-md-12'>
                        <div className='bgconsultasion mb-2'>
                            <div className='d-flex justify-content-between flex-wrap'>
                                <div className='d'>
                                    <h3 className='Consultationtitail'>{languagesModel.translate('consultation_session', language)}</h3>
                                </div>
                                <div className='filter'>
                                    {/* <button className='filtercls' onClick={reachout}>{languagesModel.translate('reach_out_text', language)}</button> */}
                                    <button className='filtercls ml-2' onClick={() => Bookingfilter()} >
                                        <img src="/assets/img/filter.png" width="17" className="mr-2" />{languagesModel.translate('filters_text', language)}
                                        {count() ? <span className="count">{count()}</span> : <></>}
                                    </button>

                                    <button className='filtercls ml-2' onClick={e => clear()}>{languagesModel.translate('clear_text', language)}</button>
                                </div>
                            </div>

                            <p className='Chooseparatext'>{languagesModel.translate('consultation_para', language)}</p>

                            <div className='session_list serchbg'>

                                <div className='session_item d-flex'>
                                    <i className="fa fa-calendar iconiconcls mr-1 mt-3 pt-1 " aria-hidden="true" onClick={() => { document.getElementById("bookindatepicker").click() }} ></i>
                                    <div>
                                        <DatePicker
                                            minDate={new Date()}
                                            onKeyDown={e => e.preventDefault()}
                                            selected={filters.start ? datepipeModel.isotodate(filters.start) : ''}
                                            onChange={e => { dateChange(datepipeModel.datetoIso(e)) }}
                                            includeDates={includeDates.length ? includeDates : false}
                                            id="bookindatepicker"
                                            className="iconicontext mt-3"
                                        />
                                    </div>
                                    {filters.start ? <i className="fa fa-times iconiconcls text-danger mr-1 mt-3 pt-1 " aria-hidden="true" onClick={() => { setFilters({ ...filters, start: '' }) }} ></i> : <></>}
                                </div>

                                <div className='session_item'>
                                    <div className="dropdown mr-2 pretimeDropdown">
                                        <button className={`mt-3 iconicontext dropdown-toggle`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className='far fa-clock timeclock mr-1'></i> {filters.start && filters.timeClicked ? datepipeModel.isotime(filters.start) : languagesModel.translate('choose_time', language)}
                                        </button>

                                        <div className="dropdown-menu chosetimemain" aria-labelledby="dropdownMenuButton">
                                            <h3 className='timeslot'>{languagesModel.translate('time_slot', language)}</h3>
                                            {user && user.timeZone ? <p className='choosetimepara'>Your default timezone is {timezones && timezones.length ? 'GMT' + timezones.find(itm => itm.id == user.timeZone).utc_offset + ' (' + timezones.find(itm => itm.id == user.timeZone).name + ')' : <></>}</p> : <></>}

                                            <div className='d-flex flex-wrap'>

                                                {preferredTimeModel.timelist(filters.start).map(itm => {
                                                    if (data && data.length && data[0].schedule && data[0].schedule.length) {
                                                        if (availabilityModel.checkAvailability({ schedule: data[0].schedule[0], weeklyAvailablity: data[0].weeklyAvailablity }, itm.name)) {
                                                            return <div className={`chossedate mr-2 mt-3 ${datepipeModel.time(itm.name) == datepipeModel.isotime(filters.start) && 'active'}`} key={itm.id} onClick={() => setTime(itm.name)}>{datepipeModel.time(itm.name)}</div>
                                                        } else {
                                                            return <></>
                                                        }
                                                    } else {
                                                        return <div className={`chossedate mr-2 mt-3 ${datepipeModel.time(itm.name) == datepipeModel.isotime(filters.start) && 'active'}`} key={itm.id} onClick={() => setTime(itm.name)}>{datepipeModel.time(itm.name)}</div>
                                                    }
                                                })}

                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {filters.start && !filters.appointmentType ? <>
                                    <div className="col-md-3">
                                        <div className="dropdown mr-2">
                                            <button className={`mt-3 iconicontext ${filters.appointmentType && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fas fa-clock iconiconcls mr-1" aria-hidden="true"></i> {filters.appointmentType ? methodModel.singleItem(filters.appointmentType, appointmentTypes).appointmentType : 'Appointment Type'}
                                            </button>
                                            <div className="dropdown-menu consultationdrop " aria-labelledby="dropdownMenuButton">
                                                <a className={`dropdown-item ${filters.appointmentType == '' && 'active'}`} onClick={() => { search({ ...filters, appointmentType: '', start: '' }); setPlaceholder() }}>All</a>
                                                {appointmentTypes.map(itm => {
                                                    return <a className={`dropdown-item ${filters.appointmentType == itm.id && 'active'}`} onClick={() => { setFilters({ ...filters, appointmentType: itm.id }); setPlaceholder() }} key={itm.id}>{itm.appointmentType}</a>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </> : <div className='session_item'>
                                    <div className="dropdown w-100">
                                        <button className={` dropdown-toggle iconicontext mt-3`} onClick={e => setConsultationDropdown(!consultationDropdown)}>
                                            <i className="fas fa-comments iconiconcls mr-1" aria-hidden="true"></i> {filters.consultation_type ? filters.consultation_type : languagesModel.translate('consultation_preference', language)}
                                        </button>
                                        {consultationDropdown ? <>
                                            <div className={"dropdown-menu consultationdrop no-overflow show"}>
                                                <h3 className='ConsultationPreference'>{languagesModel.translate('consultation_preference', language)}</h3>
                                                <div className={`choosepreference ${filters.consultation_type == 'Video' && 'active'}`} onClick={() => setFilters({ ...filters, consultation_type: 'Video', state: '', city: '', country: '' })}>{languagesModel.translate('video_consultation', language)}</div>
                                                <div className={`choosepreference mt-2 ${filters.consultation_type == 'In-person' && 'active'}`} onClick={() => { countryChange(countryModel.list[0].isoCode); setFilters({ ...filters, consultation_type: 'In-person', country: countryModel.list[0].isoCode }) }}>{languagesModel.translate('in-person_consultation', language)}</div>

                                                {filters.consultation_type == 'In-person' ? <>
                                                    <div className="dropdown mb-2 mt-2">
                                                        <button className={`form-control consolname text-left ${filters.country && 'active'}`} type="button" id="dropdownMenuButton1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span className="text-truncate d-inline-block w-100 y-middle"> {filters.country ? methodModel.singleItem(filters.country, countryModel.list, 'isoCode').name : 'Select Country'}</span>
                                                        </button>
                                                        <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton1">
                                                            <a className={`dropdown-item ${filters.country == '' && 'active'}`} onClick={() => countryChange()}>All</a>
                                                            {countryModel.list.map(itm => {
                                                                return <a className={`dropdown-item ${filters.country == itm.isoCode && 'active'}`} onClick={() => countryChange(itm.isoCode)} key={itm.isoCode}>{itm.name}</a>
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="dropdown mb-2">
                                                        <button className={`form-control consolname text-left ${filters.state && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span className="text-truncate d-inline-block w-100 y-middle"> {filters.state ? methodModel.singleItem(filters.state, states, 'isoCode').name : languagesModel.translate('select_state', language)}</span>
                                                        </button>
                                                        <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                                            <a className={`dropdown-item ${filters.state == '' && 'active'}`} onClick={() => stateChange()}>{languagesModel.translate('all_text', language)}</a>
                                                            {states && states.map(itm => {
                                                                return <a className={`dropdown-item ${filters.state == itm.isoCode && 'active'}`} onClick={() => stateChange(itm.isoCode)} key={itm.isoCode}>{itm.name}</a>
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="dropdown">
                                                        <button className={`form-control consolname text-left ${filters.city && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <span className="text-truncate d-inline-block w-100 y-middle">  {filters.city ? filters.city : languagesModel.translate('select_city', language)}</span>
                                                        </button>
                                                        <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                                            <a className={`dropdown-item ${filters.city == '' && 'active'}`} onClick={() => setFilters({ ...filters, city: '' })}>{languagesModel.translate('all_text', language)}</a>
                                                            {cities && cities.map(itm => {
                                                                return <a className={`dropdown-item ${filters.city == itm.name && 'active'}`} onClick={() => setFilters({ ...filters, city: itm.name })} key={itm.name}>{itm.name}</a>
                                                            })}
                                                        </div>
                                                    </div>
                                                </> : <></>}


                                            </div>
                                        </> : <></>}

                                    </div>
                                </div>}

                                <div className='session_item text-right pr-0 p-2 ml-auto'>
                                    <button className='btn btn-primary search' onClick={e => search()}>{languagesModel.translate('search_text', language)}</button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='row'>
                    <div className="col-md-12 mb-4">
                        {loading ? <div className="py-3 text-center">
                            <img src="./assets/img/loader.gif" width="50" />
                        </div> : <div>
                            {/* <div className=' mainclsmt-5 pb-0' > */}
                            <div className='row'>
                                {data && data.map(itm => {
                                    return <div className="col-md-3 mt-3 profileimg" key={itm.id}>
                                        <div className='profilefirstdiv'>
                                            <img src={methodModel.userImg(itm.image, '/assets/img/noimage.png')} className='profileimg ' onClick={() => openProfiledata(itm)} />
                                        </div>
                                        <h3 className='namecls mt-2'>{itm.fullName}</h3>
                                    </div>
                                })}
                            </div>
                            {data.length == 0 && <div className="my-5 text-center">{languagesModel.translate('no_data', language)}</div>}
                        </div>
                        }

                    </div>
                </div>
            </div>

            <div className='py-3 text-center'>
                For any enquiries, please reach out to your Clinic Admin at <a href='mailto:hello@emesvipp.com'>hello@emesvipp.com</a> / <a href='tel:03-00000000'>03-00000000</a>
            </div>

            <ReachOutModal />
            {appointmentModal && <SelectdateModal slotLoader={slotLoader} form={slotForm} setform={setSlotForm} searchSlote={searchSlote} modalClosed={modalClosed} slots={slots} />}
            <ProfiledataModal form={profileData} appointmentTypes={appointmentTypes} filters={filters} setFilters={setFilters} book={book} />
            <ConfirmbookingModal form={profileData} filters={filters} book={book} />
            <SelectdateModal slotLoader={slotLoader} form={slotForm} setform={setSlotForm} searchSlote={searchSlote} modalClosed={modalClosed} slots={slots} />
            <FilterModal clear={clear} filters={filters} setFilters={setFilters} search={search} appointmentTypes={appointmentTypes} timezones={timezones} cities={cities} stateChange={stateChange} states={states} countryChange={countryChange} />
            {consultationDropdown && <div className="modal-backdrop fade show" onClick={e => setConsultationDropdown(false)}></div>}
        </PageLayout >
    );
};
export default Consultation;
