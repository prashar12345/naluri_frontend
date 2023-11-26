import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import Pagination from "react-pagination-js";
import loader from '../../methods/loader';
import AddEditAppointment from './AddEditAppointment';
import ViewAppointment from './ViewAppointment';
import { useHistory } from 'react-router';
import methodModel from '../../methods/methods';
import { Link } from 'react-router-dom';
import statusModel from '../../models/status.model';
import modalModel from '../../models/modal.model';
import CaseNoteModal from './CaseNoteModal';
import { ToastsStore } from 'react-toasts';
import bookingModel from '../../models/booking.model';
import ChangeCounsellors from '../Request/ChangeCounsellorsModal';
import MarkasComplete from './MarkasComplete';
import ViewCasenoteModal from '../Profiledetail/ViewCasenoteModal';
import languagesModel from '../../models/languages.model';

const Appointments = (p) => {

    const language = useSelector(state => state.language.data)
    const history = useHistory()
    const user = useSelector(state => state.user)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', counsellorId: '', status: '', startDate: '' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [form, setform] = useState({ start: '' })
    const [viewData, setViewData] = useState()
    const [viewCData, setViewCData] = useState()
    const [submitted, setSubmitted] = useState(false)
    const [counsellors, setConsellors] = useState([])
    const [startDate, setStartDate] = useState(new Date());
    const [caseForm, setCaseForm] = useState({
        note: '',
        appointmentId: '',
        userId: '',
        counsellorId: '',
        hoursOfConsultations: '',
        caseType: '',
        severityLevel: '',
        clientStatus: '',
        supportLetter: '',
        file: '',
    })

    const getCounsellors = () => {
        ApiClient.get('user/listing', { page: 1, count: 100, role: 'Counsellor', clinicId: user.id }).then(res => {
            if (res.success) {
                setConsellors(res.data)
            }
        })
    }

    const openCaseNote = (itm) => {
        if (user.role != 'Counsellor') return
        let date = new Date()
        let randomId = `${itm.id}_${date.getTime()}`
        let filters = { appointmentId: itm.id, userId: itm.userId.id, counsellorId: itm.counsellorId }

        setCaseForm({ ...filters, note: '', page: itm.page, randomId })
        modalModel.open('caseNoteModal')
    }

    useEffect(() => {
        if (user && user.loggedIn) {
            let id = methodModel.getPrams('id')
            if (id) view(id)
        }

    }, [])



    useEffect(() => {

        if (user && user.loggedIn) {
            let counsellorId = ''
            if (user.role == 'Counsellor') counsellorId = user.id
            let clinicId = ''
            if (user.role == 'Clinic Admin') {
                clinicId = user.id
            }
            setFilter({ ...filters, search: searchState.data, counsellorId, clinicId })
            getData({ search: searchState.data, page: 1, counsellorId, clinicId })
            getCounsellors()
        }
    }, [searchState])

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        ApiClient.get('counsellor/appointments', filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
    }

    const search = (p = {}) => {
        let filter = {
            page: 1,
            ...p
        }
        setFilter({ ...filters, page: 1, ...filter })
        getData(filter)
    }


    const clear = () => {
        let filter = {
            search: '',
            page: 1
        }
        setFilter({ ...filters, ...filter })
        getData(filter)
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

    const pageChange = (e) => {
        setFilter({ ...filters, page: e })
        getData({ page: e })
    }

    const modalClosed = (p, itm) => {
        if (p == 'view') {
            setViewCData(itm)
            modalModel.open('viewcasenoteModal')
        } else {
            setCaseForm({})
            clear()
        }

    }

    const openModal = (itm = {}) => {
        setSubmitted(false)
        setform({ start: '', end: '', consultation_type: 'In-person', ...itm, counsellors, calDate: new Date().getTime() })
        modalModel.open('appointmentModal')
    }

    const view = (id = '') => {
        loader(true)
        ApiClient.get('appointment', { id: id }).then(res => {
            if (res.success) {
                if (methodModel.getPrams('page') == 'reschedule') {
                    if (user.role == 'Clinic Admin' && user.id != res.data.clinicId) {
                        ToastsStore.error("Please login with authorized user")
                        history.push('/')
                        loader(false)
                        return
                    } else if (user.role == 'Counsellor' && user.id != res.data.counsellorId) {
                        ToastsStore.error("Please login with authorized user")
                        history.push('/')
                        loader(false)
                        return
                    } else if (user.role == 'user' && user.id != res.data.userId.id) {
                        ToastsStore.error("Please login with authorized user")
                        history.push('/')
                        loader(false)
                        return
                    }

                    reschedule(res.data)
                } if (methodModel.getPrams('page') == 'casenote') {
                    openCaseNote(res.data)
                } else if (!methodModel.getPrams('page')) {
                    setViewData(res.data)
                    document.getElementById("openviewappointmentModal").click()
                }
            }
            loader(false)
        })
    }

    const reschedule = (itm) => {
        let value = { clinicAddress: itm.clinicAddress, appointmentType: itm.appointment_type, appointmentId: itm.id, counsellorId: itm.counsellorId, start: itm.start, end: itm.end, userId: itm.userId.id, counsellors }
        if (user.role == 'Clinic Admin') {
            setform(value)
            modalModel.open('appointmentModal')
            return
        }

        loader(true)
        ApiClient.get('setting').then(res => {
            if (res.success) {
                let rescheduleTime = res.data.rescheduleTime
                let hr = 24
                if (rescheduleTime) hr = Number(rescheduleTime)
                let error = bookingModel.twenty4hrCheck(itm.start, hr)
                if (error) {
                    loader(false)
                    setform({ ...itm })
                    modalModel.open('userchangeCounsellors')
                    // ToastsStore.error("Please contact to Clinic Admin if you want to reschedule")
                    return
                }
                setform(value)
                modalModel.open('appointmentModal')
            }
            loader(false)
        })
    }

    const cancelBooking = (itm) => {
        history.push('/cancellation?id=' + itm.id)
    }

    const tab = () => {
        if (user.role == 'Clinic Admin') {
            history.push("/ca-appointments/calendar")
        } else {
            history.push("/appointments/calendar")
        }
    }

    const markCheck = (itm) => {
        let current = new Date()
        let end = itm.end
        end = datepipeModel.isotodate(end)

        let value = false
        if (current.getTime() > end.getTime()) value = true
        return value
    }

    const markComplete = (itm) => {
        setViewData(itm)
        modalModel.open("markasCompleteModal")
    }

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    return (
        <>
            <h3 className="usershedding mb-4">
                {languagesModel.translate('consultation_text', language)}
            </h3>
            <div className="d-flex justify-content-end mb-3 appointmentadd flex-wrap">
                <div className="d-flex">
                    <div className="mr-2 mb-2">
                        {/* <input type="date" className="form-control" value={datepipeModel.datetostring(filters.startDate)} onChange={e => search({ startDate: datepipeModel.datetoIso(e.target.value) })} />{filters.search ? <i className="fa fa-times crosscross" onClick={clear} aria-hidden="true" ></i> : <></>} */}
                        <DatePicker onKeyDown={e => e.preventDefault()} minDate={new Date()} selected={filters.startDate ? datepipeModel.isotodate(filters.startDate) : new Date()} onChange={e => { search({ startDate: datepipeModel.datetoIso(e) }) }} className="form-control" />
                    </div>

                    <div className=" mb-2">
                        <div className="dropdown w-100">
                            <button className={`btn btn-primary dropdown-toggle ${filters.consultation_type && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {filters.consultation_type ? filters.consultation_type : languagesModel.translate('mode_of_consultation', language)}
                            </button>
                            <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                <a className={`dropdown-item ${filters.consultation_type == '' && 'active'}`} onClick={() => search({ consultation_type: '' })}> {languagesModel.translate('all_text', language)}</a>
                                <a className={`dropdown-item ${filters.consultation_type == 'In-person' && 'active'}`} onClick={() => search({ consultation_type: 'In-person' })}>{languagesModel.translate('in-personConsultation', language)}</a>
                                <a className={`dropdown-item ${filters.consultation_type == 'Video' && 'active'}`} onClick={() => search({ consultation_type: 'Video', state: '', city: '', country: '' })}>{languagesModel.translate('video_consultation', language)}</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-start flex-wrap other-button">
                    {user.role == 'Clinic Admin' ? <div className="dropdown ml-2 mb-2">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {filters.counsellorId ? methodModel.find(counsellors, filters.counsellorId, 'id', 'fullName').fullName : languagesModel.translate('counsellor_newtext', language)}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className={`dropdown-item ${filters.counsellorId == '' && 'active'}`} onClick={() => search({ counsellorId: '' })}>{languagesModel.translate('all_text', language)}</a>
                            {counsellors.map(itm => {
                                return <a className={`dropdown-item ${filters.counsellorId == itm.id && 'active'}`} key={itm.id} onClick={() => search({ counsellorId: itm.id })}>{itm.fullName}</a>
                            })}
                        </div>
                    </div> : <></>}

                    <div className="dropdown ml-2">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {filters.status ? statusModel.name(filters.status) : languagesModel.translate('status_heading', language)}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className={`dropdown-item ${filters.status == '' && 'active'}`} onClick={() => statusChange('')}>{languagesModel.translate('all_text', language)}</a>
                            {statusModel.list.map(itm => {
                                return <a className={`dropdown-item ${filters.status == itm.id && 'active'}`} key={itm.id} onClick={() => statusChange(itm.id)}>{itm.value}</a>
                            })}
                        </div>
                    </div>
                    <div className="viewTypes ml-2 mb-2">
                        <a className="fa fa-list btn active" title="List View"></a>
                        <a onClick={tab} className="fa fa-calendar btn" title="Calendar View"></a>
                    </div>


                    {user.role == 'Clinic Admin' ? <div className="dropdown ml-2 mb-2">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className='fa fa-plus'></i>   <span className='ml-1 consult-btn'>  {languagesModel.translate('add_consultation_sessions', language)} </span>
                        </button>
                        {counsellors.length ? <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {counsellors.map(itm => {
                                return <a className={`dropdown-item ${filters.counsellorId == itm.id && 'active'}`} key={itm.id} onClick={() => openModal({ counsellorId: itm.id })}>{itm.fullName}</a>
                            })}
                        </div> : <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <span className={`dropdown-item `}>no counsellor here</span>
                        </div>}
                    </div> : <button className="btn btn-primary ml-2 mb-2" onClick={() => openModal()}>
                        <i className='fa fa-plus'></i>    <span className='ml-1 consult-btn'> {languagesModel.translate('add_consultation_sessions', language)}</span>
                    </button>}

                    <button className="btn btn-primary ml-2 mb-2" onClick={() => openModal({ modal: 'link' })}>
                        <i className='fa fa-paper-plane'></i>  <span className='ml-1 consult-btn'>{languagesModel.translate('send_consultation_sessions_link', language)}</span>
                    </button>
                </div>
            </div>
            <div className="table-responsive">
                {
                    data.length ? <table className="table mb-0">
                        <thead className="theadclss">
                            <tr className="tblclas">
                                {/* <th></th> */}
                                <th scope="col">{languagesModel.translate('user_name', language)}</th>
                                {user.role == 'Clinic Admin' ? <th scope="col">{languagesModel.translate('counsellor_name', language)}</th> : <></>}
                                <th scope="col">{languagesModel.translate('appointmentdate_heading', language)}</th>
                                <th scope="col">{languagesModel.translate('consultation_preference', language)}</th>
                                <th scope="col">{languagesModel.translate('health_clinic_text', language)} / {languagesModel.translate('zoom_link', language)}</th>
                                <th scope="col">{languagesModel.translate('status_heading', language)}</th>
                                {user.role == 'Counsellor' ? <th>{languagesModel.translate('case_note_text', language)}</th> : <></>}
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loaging && data && data.map((itm, i) => {
                                return <tr key={i}>
                                    <td>{itm.userId ? <Link to={`/profiledetail/${itm.userId.id}`} className="text-primary">{itm.userId.fullName}</Link> : <></>}</td>
                                    {user.role == 'Clinic Admin' ? <td>{itm.counsellorDetail ? <Link to={`/profiledetail/${itm.counsellorDetail.id}`} className="text-primary">{itm.counsellorDetail.fullName}</Link> : <></>}</td> : <></>}
                                    <td>{datepipeModel.date(itm.start)} | {datepipeModel.isotime(itm.start)}-{datepipeModel.isotime(itm.end)}</td>
                                    <td>{itm.consultation_type}</td>
                                    {itm.consultation_type == 'In-person' ? <td>{itm.counsellorDetail.healthClinicId ? translate2(itm.counsellorDetail.healthClinicId.nameTranslate, itm.counsellorDetail.healthClinicId.name) : ''}</td> : <td>
                                        {itm.status == 'Upcoming' && user.role == 'user' ? <a href={itm.join_url} target="_blank" className="btn btn-primary">{languagesModel.translate('zoom_link', language)}</a> : <></>}
                                        {itm.status == 'Upcoming' & user.role != 'user' ? <a href={itm.start_url} target="_blank" className="btn btn-primary">{languagesModel.translate('zoom_link', language)}</a> : <></>}
                                    </td>}
                                    <td>{statusModel.html(itm.status, language)}</td>

                                    {user.role == 'Counsellor' ? <td>
                                        {itm.caseNote ? <a onClick={() => openCaseNote({ ...itm, page: 'list' })} className="text-primary">{languagesModel.translate('view_case_note', language)}</a> : <></>}
                                        {!itm.caseNote ? <>
                                            <a className={`linkclass ${itm.caseNote ? '' : 'blinkingLink'}`} onClick={() => openCaseNote(itm)}>
                                                {languagesModel.translate('add_case_note', language)}
                                            </a>
                                        </> : <></>}
                                    </td> : <></>}

                                    <td>
                                        <a className="actionBtnicon mx-2" onClick={() => view(itm.id)} title="View">
                                            {/* <span className="material-symbols-outlined">visibility</span> */}
                                            <i className="fa fa-eye"></i>
                                        </a> |
                                        {itm.status == 'Upcoming' ? <><a className="actionBtnicon mx-2" onClick={() => reschedule(itm)} title="Reschedule">
                                            {/* <span className="material-symbols-outlined">edit_calendar</span> */}
                                            <i className="fa fa-calendar"></i>
                                        </a> |
                                        </> : <></>}

                                        {itm.status == 'Upcoming' ? <><a className="actionBtnicon mx-2" onClick={() => cancelBooking(itm)} title="Cancel">
                                            {/* <span className="material-symbols-outlined">cancel</span> */}
                                            <i className="fa fa-times"></i>
                                        </a> |
                                            {markCheck(itm) ? <><a className="actionBtnicon mx-2" onClick={() => markComplete(itm)} title="Mark as Complete">
                                                {/* <span className="material-symbols-outlined">check</span> */}
                                                <i className="fa fa-check" aria-hidden="true"></i>
                                            </a>
                                            </> : <></>}
                                        </> : <></>}

                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table> : <></>
                }

                {
                    loaging ? <div className="text-center py-4">
                        <img src="/assets/img/loader.gif" className="pageLoader" />
                    </div> : <></>
                }
            </div >

            {!loaging && total == 0 ? <div className="py-3 text-center"><img src="/assets/img/Nodata.jpg" alt="No Data img" className="no-data-img" /></div> : <></>}

            {
                !loaging && total > filters.count ? <div>
                    {/* <Pagination
                        activePage={filters.page}
                        itemsCountPerPage={filters.count}
                        totalItemsCount={total}
                        pageRangeDisplayed={5}
                        onChange={pageChange}
                    /> */}
                    <Pagination
                        currentPage={filters.page}
                        totalSize={total}
                        sizePerPage={filters.count}
                        changeCurrentPage={pageChange}
                    />
                </div> : <></>
            }

            <ViewAppointment form={viewData} />
            <AddEditAppointment form={form} submitted={submitted} setSubmitted={setSubmitted} setform={setform} modalClosed={modalClosed} />
            <CaseNoteModal form={caseForm} setform={setCaseForm} modalClosed={modalClosed} />
            <ViewCasenoteModal form={viewCData} />
            <ChangeCounsellors form={form} />
            <MarkasComplete form={viewData} modalClosed={modalClosed} />
        </>

    );
};

export default Appointments;
