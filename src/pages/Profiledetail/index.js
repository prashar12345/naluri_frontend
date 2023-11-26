import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import './style.scss';
import CaseNote from './CaseNote';
import { useSelector } from 'react-redux';
import datepipeModel from '../../models/datepipemodel';
import Pagination from 'react-pagination-js';
import ViewCasenoteModal from './ViewCasenoteModal';
import modalModel from '../../models/modal.model';
import methodModel from '../../methods/methods';
import CaseNoteModal from '../Appointments/CaseNoteModal';
import languagesModel from '../../models/languages.model';
import { Link } from 'react-router-dom';
import ApiKey from '../../methods/ApiKey';
import { ToastsStore } from 'react-toasts';
import statusModel from '../../models/status.model';

const Profiledetail = (p) => {
    const history = useHistory()
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const { id, userId } = useParams()
    const [data, setData] = useState()
    const [viewData, setViewData] = useState()
    const [casenotes, setCaseNotes] = useState([])
    const [cfilters, setCfilter] = useState({ page: 1, count: 5 })
    const [ctotal, setCTotal] = useState(0)
    const [utotal, setUTotal] = useState(0)
    const [caseNoteFilter, setcaseNoteFilter] = useState({ page: 1, count: 10, status: '' })
    const [counsellors, setConsellors] = useState([])
    const [assessment, setAssessment] = useState([])
    const [assessmentFilter, setassessmentFilter] = useState({ page: 1, count: 5, })
    const [assessmentTotal, setAssessmentTotal] = useState(0)
    const [previousFilter, setPreviousFilter] = useState({ page: 1, count: 5, })
    const [upcommingFilter, setUpcommigFilter] = useState({ page: 1, count: 5, })
    const [previousTotal, setPreviousTotal] = useState(0)
    const [upcomingBooking, setupcomingBookings] = useState([])
    const [docLoader, setDocLoader] = useState(false)
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


    //prev state for storing res=> from api with completed status
    const [prevConsultation, setprevConsultation] = useState()


    const getDetail = (did) => {
        loader(true)
        // let healthClinicId = ''

        ApiClient.get(`user/detail`, { id: did, viewBy: user.role }).then(res => {
            if (res.success) {
                setData(res.data)
                upcomingBookings({}, res.data)
                getCaseNotes({}, res.data)
            }
            loader(false)
        })
    };





    //get  req to the Assessment end point 
    const prevAssessment = (p = {}) => {
        let param = {
            ...assessmentFilter,
            ...p,
            addedBy: userId ? userId : id
        }
        loader(true)
        ApiClient.get("assessments", param).then(res => {
            if (res.success) {
                setAssessment(res.data)
                setAssessmentTotal(res.total)
                loader(false)
            }
        })
    }

    const upcomingBookings = (p = {}, ud = data) => {

        console.log(ud.role, ud.id)
        let url = 'counsellor/appointments'
        let userId = ''
        let counsellorId = ''
        let clinicId = ''
        if (ud.role == 'Counsellor') {
            url = 'counsellor/appointments'
            counsellorId = ud.id
        }
        if (ud.role === 'user') userId = ud.id
        if (ud.role == 'Clinic Admin') clinicId = ud.id

        let filter = { ...upcommingFilter, status: 'Upcoming', userId, counsellorId, clinicId, count: 7, page: 1, ...p }
        console.log("filter", filter)
        setUpcommigFilter(filter)
        loader(true)
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setupcomingBookings(res.data)
                setUTotal(res.total)
            }
            loader(false)
        })
    }
    const previousConsultation = (p = {}, ud = data) => {
        let url = 'counsellor/appointments'
        let counsellorId = ''
        let clinicId = ''
        let userId = ''
        if (ud.role == 'Counsellor') {
            url = 'counsellor/appointments'
            counsellorId = ud.id
        }

        if (ud.role == 'Clinic Admin') clinicId = ud.id
        if (ud.role == 'user') {
            url = 'user/appointments'
            userId = ud.id
        }
        let filter = { ...previousFilter, status: 'Completed', userId, counsellorId, clinicId, ...p }
        loader(true)
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                setprevConsultation(res.data)
                setPreviousTotal(res.total)
            }
            loader(false)
        })
    }
    const openCaseNote = (itm) => {
        if (user.role != 'Counsellor') return
        let date = new Date()
        let randomId = `${itm ? itm.id : ''}_${date.getTime()}`
        let filters = { appointmentId: itm ? itm.id : '', userId: itm.userId.id, counsellorId: itm.counsellorId }
        setCaseForm({ ...filters, note: '', page: itm.page, randomId, isHideAdd: userId ? true : false })
        modalModel.open('caseNoteModal')
    }
    // const openViewHealthClinic = (item) => {
    //     let ClinicData = {}
    //     sethealthClinicData()
    // }
    const getCounsellors = () => {
        ApiClient.get('user/listing', { page: 1, count: 100, role: 'Counsellor' }).then(res => {
            if (res.success) {
                setConsellors(res.data)
            }
        })
    }

    const getAll = (aid = id) => {
        getDetail(aid)
    }

    const modalClosed = (p, itm) => {
        if (p === 'view') {
            modalModel.open('viewcasenoteModal')
            setViewData(itm)
        } if (p === 'casenote') {
            upcomingBookings()
        }
    }


    const view = (item = '') => {
        console.log("itm", item)
        setViewData({ ...item, page: 'profiledetail', isHideAdd: userId ? true : false })
        modalModel.open("viewcasenoteModal")
    }

    const back = () => {
        history.goBack()
    }

    const getCaseNotes = (p = {}, ud) => {
        let counsellorId = ''
        let userId = ''
        let clinicId = ''
        let udetail = ud ? ud : data

        console.log("udetail", udetail)
        if (udetail.role == 'Counsellor') counsellorId = udetail.id
        if (udetail.role == 'user') userId = udetail.id
        if (udetail.role == 'Clinic Admin') clinicId = udetail.id

        let filter = {
            ...cfilters,
            ...p,
            userId,
            counsellorId,
            clinicId
        }
        console.log("filter", filter)
        loader(true)
        ApiClient.get('case/notes', filter).then(res => {
            if (res.success) {
                setCaseNotes(res.data)
                setCTotal(res.total)
                loader(false)
            }
        })
    }

    const pageChange = (e, f = 'casenote') => {
        if (f == 'casenote') {
            setCfilter({ ...cfilters, page: e })
            getCaseNotes({ page: e })
        } else if (f == 'assessment') {
            setassessmentFilter({ ...assessmentFilter, page: e })
            prevAssessment({ page: e })
        } else if (f == 'previous') {
            setPreviousFilter({ ...previousFilter, page: e })
            previousConsultation({ page: e })
        } else if (f == 'upcoming') {
            setUpcommigFilter({ ...upcommingFilter, page: e })
            upcomingBookings({ page: e })
        }
    }

    const route = (id) => {
        history.push('/profiledetail/' + id)
    }


    const search = (p = {}) => {
        let filter = {
            page: 1,
            ...p
        }
        setcaseNoteFilter({ ...caseNoteFilter, page: 1, ...filter })
        getCaseNotes(filter)
    }

    useEffect(() => {
        getAll(userId ? userId : id)
        getCounsellors()
        prevAssessment()
        previousConsultation({}, userId ? userId : id)
    }, [id, userId])

    const addCasenote = () => {
        openCaseNote({ userId: data, counsellorId: user.id, appointmentDate: '', start: '', end: '', appointmentType: '' })
    }

    //upload doc 
    const uploaddocs = (e) => {
        setData({ ...data, baseImg: e.target.value })
        let files = e.target.files
        let resurl = []
        if (data.supportLetterFile) resurl = data.supportLetterFile
        for (let i = 0; i < files.length; i++) {
            uploadDoc(files.item(i), resurl)
        }
    }

    const uploadDoc = (file, resurl) => {
        setDocLoader(true)
        ApiClient.postFormData('upload/doc', { file: file }).then(res => {
            if (res.success) {
                let image = res.responseData[0].docName
                setTimeout(() => {
                    resurl.push(image)
                    setData({ ...data, supportLetterFile: resurl, baseImg: '' })
                }, 10 * resurl.length);
            } else {
                setData({ ...data, baseImg: '' })
            }
            setDocLoader(false)
            // loader(false)
        })
    }

    const updateDoc = () => {
        let payload = {
            id: data.id,
            supportLetterFile: data.supportLetterFile,
            supportLetter: data.supportLetter
        }
        ApiClient.put('user', payload).then(res => {
            if (res.success) {
                ToastsStore.success('Provided support letter updated')
            }
        })
    }


    const removeDoc = (index) => {
        let file = data.supportLetterFile
        file = file.filter((itm, i) => i != index)
        setData({ ...data, supportLetterFile: file })
    }

    return (
        <Layout>
            <div className="text-right risponsiveclss">
                <div>
                    <a to="/users" onClick={back}>  <i className="fa fa-arrow-left mr-4 mb-3" aria-hidden="true"></i></a>
                </div>

                <div className="d-flex justify-content-end  mb-2 ">
                    {data && data.role == 'user' && user.role == 'Counsellor' ? <button className="btn btn-primary mr-2" onClick={addCasenote}>{languagesModel.translate("add_case_note", language)}</button> : <></>}

                    <div className="dropdown ml-1 ">
                        <button className="outlinebtn dropdown-toggle risponsiveclss" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {caseNoteFilter.addedBy ? methodModel.find(counsellors, caseNoteFilter.addedBy, 'id', 'fullName').fullName : languagesModel.translate("added_by_text", language)}
                        </button>
                        <div className="dropdown-menu adddropbtn" aria-labelledby="dropdownMenuButton">
                            <a className={`dropdown-item ${caseNoteFilter.addedBy == '' && 'active'}`} onClick={() => search({ addedBy: '' })}>All</a>
                            {counsellors.map(itm => {
                                return <a className={`dropdown-item ${caseNoteFilter.addedBy == itm.id && 'active'}`} key={itm.id} onClick={() => search({ addedBy: itm.id })}>{itm.fullName}</a>
                            })}
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">

                <div className="sideclass col-md-4">

                    <h3 className="profileresulhead mt-3 ">
                        {languagesModel.translate('profile_details', language)}
                    </h3>

                    <div className="row border-bottom mt-4">
                        <div className="col-md-6 profileheddingcls">{languagesModel.translate("ic_no_heading", language)}</div>
                        <div className="col-md-6 profiledetailscls">{data && data.ic_number}</div>
                    </div>
                    <div className="row border-bottom mt-4">
                        <div className="col-md-6 profileheddingcls">{languagesModel.translate("phonenumber_heading", language)}</div>
                        <div className="col-md-6 profiledetailscls">{data && data.mobileNo}</div>
                    </div>
                    <div className="row border-bottom mt-4 mr-1">
                        <div className="col-md-6 profileheddingcls">{languagesModel.translate("email_text", language)}</div>
                        <div className="col-md-6 emailclss">{data && data.email}</div>
                    </div>
                    {
                        data && data.role != 'user' ? <div className="row border-bottom mt-4 mr-1">
                            <div className="col-md-6 profileheddingcls">{languagesModel.translate("healthclinic_text", language)}</div>
                            <div className="col-md-6 profiledetailscls">{data && data.healthClinicId && data.healthClinicId.name}</div>
                        </div> : <></>
                    }
                </div>


                <div className="col-md-8">
                    <div className="text-right">
                        <div>
                            <a to="/users" onClick={back}>  <i className="fa fa-arrow-left ondesktop mr-4 mb-3" aria-hidden="true"></i></a>
                        </div>

                    </div>

                    {user.role !== 'user' && <>
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                            <h3 className="profileresulhead mt-3">
                                {languagesModel.translate("case_notes", language)}
                            </h3>
                            <div className="d-flex">
                                {data && data.role == 'user' && user.role == 'Counsellor' ? <button className="btn btn-primary mr-2" onClick={addCasenote}>{languagesModel.translate("add_case_note", language)}</button> : <></>}

                                <div className="dropdown ml-1">
                                    <button className="outlinebtn dropdown-toggle ondesktop" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {caseNoteFilter.addedBy ? methodModel.find(counsellors, caseNoteFilter.addedBy, 'id', 'fullName').fullName : languagesModel.translate("added_by_text", language)}
                                    </button>
                                    <div className="dropdown-menu adddropbtn" aria-labelledby="dropdownMenuButton">
                                        <a className={`dropdown-item ${caseNoteFilter.addedBy == '' && 'active'}`} onClick={() => search({ addedBy: '' })}>All</a>
                                        {counsellors.map(itm => {
                                            return <a className={`dropdown-item ${caseNoteFilter.addedBy == itm.id && 'active'}`} key={itm.id} onClick={() => search({ addedBy: itm.id })}>{itm.fullName}</a>
                                        })}
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="bgtable ">
                            <div className="table-responsive">
                                <table className="table table-striped ">
                                    <thead className="theadclss">
                                        <tr className="tblclas">
                                            <th scope="col" >{languagesModel.translate("date_time_heading", language)}</th>
                                            <th scope="col">{languagesModel.translate("appointmentdate_heading", language)}</th>
                                            <th scope="col">{languagesModel.translate("added_by_text", language)}</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {casenotes && casenotes.map(itm => {
                                            return <tr key={itm.id}>
                                                <th scope="row">{datepipeModel.datetime(itm.createdAt)}</th>
                                                <td>{itm.appointmentId ? <>
                                                    {datepipeModel.date(itm.appointmentId.start)} | {datepipeModel.isotime(itm.appointmentId.start)}-{datepipeModel.isotime(itm.appointmentId.end)}
                                                </> : <></>}</td>
                                                <td><a onClick={e => route(itm.addedBy.id)} className="text-primary">{itm.addedBy && itm.addedBy.fullName}</a></td>
                                                <td>
                                                    {user.role === 'Counsellor' ? <a onClick={() => view(itm)} className="text-primary View_Case ">View Case Note</a> : <></>}
                                                </td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {ctotal > cfilters.count ? <div>
                                {/* <Pagination
                                    activePage={cfilters.page}
                                    itemsCountPerPage={cfilters.count}
                                    totalItemsCount={ctotal}
                                    pageRangeDisplayed={5}
                                    onChange={e => pageChange(e, 'Consultation')}
                                /> */}
                                <Pagination
                                    currentPage={cfilters.page}
                                    totalSize={ctotal}
                                    sizePerPage={cfilters.count}
                                    changeCurrentPage={e => pageChange(e, 'Consultation')}
                                />
                            </div> : <></>}
                        </div>
                    </>}


                    {data && data.role == 'user' ? <>

                        {/* <h3 className="Profilehedding">Provided support letter</h3> */}

                        {user.role == 'Counsellor' ? <div className='form-row'>
                            <div className='col-md-6 mb-3'>
                                <label>Has support letter been provided?</label>
                                <div>
                                    <label className='mr-2'><input type="radio" className='mr-2' name="doc" value="yes" checked={data && data.supportLetter == 'yes' ? true : false} onChange={e => { setData({ ...data, supportLetter: e.target.value }) }} /> Yes</label>
                                    <label className='mr-2'><input type="radio" className='mr-2' name="doc" value="no" checked={data && data.supportLetter == 'no' ? true : false} onChange={e => { setData({ ...data, supportLetter: e.target.value }) }} /> No</label>
                                </div>
                            </div>
                            <div className='col-md-6 mb-3'>
                                <label>Support Doc</label>
                                <div>
                                    <label className={`btn btn-primary ${docLoader ? 'disabled' : ''}`}>
                                        {docLoader ? 'Uploading...' : 'Upload Doc'}
                                        <input
                                            disabled={docLoader}
                                            id="bannerImage"
                                            type="file"
                                            className="d-none"
                                            // accept="image/*"
                                            value={data.baseImg ? data.baseImg : ''}
                                            onChange={(e) => uploaddocs(e)}
                                            multiple
                                        />
                                    </label>

                                    {data && data.supportLetterFile ? <div>
                                        {data.supportLetterFile.map((itm, i) => {
                                            return <span className="docFile" key={itm}>
                                                <a href={ApiKey.api + 'docs/' + itm} target="_blank"> <i className="fa fa-file"></i> {itm}</a>
                                                {user.role == 'Counsellor' ? <i className="fa fa-times" onClick={e => removeDoc(i)}></i> : <></>}
                                            </span>
                                        })}

                                    </div> : <></>}
                                </div>


                            </div>

                            <div className='col-md-12 text-right mb-3'>
                                <button className='btn btn-primary' onClick={e => updateDoc()}>Save</button>
                            </div>



                        </div> : <></>}




                        <h3 className="profileresulhead">
                            {languagesModel.translate("assessment_text", language)}
                        </h3>

                        <div className="bgtable mt-3 ">
                            <div className="table-responsive">
                                <table className="table table-striped ">
                                    <thead className="theadclss">
                                        <tr className="tblclas">
                                            <th scope="col" >{languagesModel.translate("date_time_heading", language)}</th>
                                            <th scope="col">{languagesModel.translate("overall_result", language)}</th>
                                            <th scope="col">{languagesModel.translate("type_text", language)}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            assessment && assessment.map((itm, i) => {
                                                return <tr key={i}>
                                                    {/* <th scope="row">911230-10-4532</th> */}
                                                    <td>{datepipeModel.datetime(itm.createdAt)}</td>
                                                    <td className="text-capitalize">
                                                        {itm.assessmentResults.map(ritm => {
                                                            return <span className={`high_risk mx-1 ${ritm.result == 'Normal' || ritm.result == 'Low' ? 'span_low_risk' : ''} ${ritm.result == 'Moderate' || ritm.result == 'Mild' ? 'span_Moderate_risk' : ''} ${ritm.result == 'Severe' || ritm.result == 'Extremely severe' || ritm.result == 'High' ? 'span_high_class' : ''}`}>{ritm.result}</span>
                                                        })}

                                                    </td>
                                                    <td className="text-capitalize">{itm.assessmentResults && itm.assessmentResults.map((ritm, i) => {
                                                        return `${ritm.type.name} ${i !== itm.assessmentResults.length - 1 ? ', ' : ''}`
                                                    })}</td>
                                                </tr>
                                            })
                                        }


                                    </tbody>
                                </table>
                            </div>
                        </div>


                        {assessmentTotal > assessmentFilter.count ? <div>
                            {/* <Pagination
                                activePage={assessmentFilter.page}
                                itemsCountPerPage={assessmentFilter.count}
                                totalItemsCount={assessmentTotal}
                                pageRangeDisplayed={5}
                                onChange={e => pageChange(e, 'assessment')}
                            /> */}
                            <Pagination
                                currentPage={assessmentFilter.page}
                                totalSize={assessmentTotal}
                                sizePerPage={assessmentFilter.count}
                                changeCurrentPage={e => pageChange(e, 'assessment')}
                            />
                        </div> : <></>}
                    </> : <></>}



                    <h3 className="profileresulhead mt-3">
                        {languagesModel.translate("dashboard_heading", language)}
                    </h3>
                    <div className="bgtable ">
                        <div>
                            <table className="table table-striped ">
                                <thead className="theadclss">
                                    <tr className="tblclas">
                                        <th scope="col" >{languagesModel.translate("date_time_heading", language)}</th>
                                        <th scope="col">{languagesModel.translate("preference_text", language)}</th>
                                        <th scope="col">{languagesModel.translate("counsellor_newtext", language)}</th>
                                        {user.role === 'Counsellor' ? <th scope="col">{languagesModel.translate("case_notes", language)}</th> : <></>}
                                        <th scope="col">{languagesModel.translate("status_heading", language)}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        upcomingBooking && upcomingBooking.map((itm, i) => {
                                            return <tr key={i}>
                                                <td>{datepipeModel.date(itm.start)} | {datepipeModel.isotime(itm.start)}-{datepipeModel.isotime(itm.end)}</td>
                                                <td>{itm.consultation_type}</td>
                                                <td><Link to={`/profiledetail/${itm.counsellorDetail && itm.counsellorDetail.id}`} className="text-primary" >{itm.counsellorDetail && itm.counsellorDetail.fullName}</Link></td>
                                                {user.role === 'Counsellor' ? <td>
                                                    {itm.caseNote ? <a onClick={() => openCaseNote({ ...itm, page: 'list' })} className="text-primary">View Case Note</a> : <></>}
                                                    {!itm.caseNote ? <>
                                                        <a className={`linkclass ${itm.caseNote ? '' : 'blinkingLink'}`} onClick={() => openCaseNote(itm)}>
                                                            {languagesModel.translate("add_case_note", language)}
                                                        </a>
                                                    </> : <></>}
                                                </td> : <></>}
                                                <td>{statusModel.html(itm.status)}</td>

                                            </tr>
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>

                    </div>
                    {utotal > upcommingFilter.count ? <div>
                        {/* <Pagination
                            activePage={upcommingFilter.page}
                            itemsCountPerPage={upcommingFilter.count}
                            totalItemsCount={utotal}
                            pageRangeDisplayed={5}
                            onChange={e => pageChange(e, 'upcoming')}
                        /> */}
                        <Pagination
                            currentPage={upcommingFilter.page}
                            totalSize={utotal}
                            sizePerPage={upcommingFilter.count}
                            changeCurrentPage={e => pageChange(e, 'upcoming')}
                        />
                    </div> : <></>}



                    <h3 className="profileresulhead mt-3">
                        {languagesModel.translate("previous_consultation", language)}
                    </h3>
                    <div className="bgtable ">

                        <div>
                            <table className="table table-striped ">
                                <thead className="theadclss">
                                    <tr className="tblclas">
                                        <th scope="col" >{languagesModel.translate("date_time_heading", language)}</th>
                                        <th scope="col">{languagesModel.translate("preference_text", language)}</th>
                                        <th scope="col">{languagesModel.translate("counsellor_newtext", language)}</th>
                                        {user.role === 'Counsellor' ? <th scope="col">{languagesModel.translate("case_notes", language)}</th> : <></>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        prevConsultation && prevConsultation.map(itm => {
                                            return <tr key={itm.id}>
                                                <td>{datepipeModel.date(itm.start)} | {datepipeModel.isotime(itm.start)}-{datepipeModel.isotime(itm.end)}</td>
                                                <td>{itm.consultation_type}</td>
                                                <td><Link to={`/profiledetail/${itm.counsellorDetail && itm.counsellorDetail.id}`} className="text-primary" >{itm.counsellorDetail && itm.counsellorDetail.fullName}</Link></td>
                                                {user.role === 'Counsellor' ? <td>
                                                    {itm.caseNote ? <a onClick={() => openCaseNote({ ...itm, page: 'list' })} className="text-primary">View Case Note</a> : <></>}
                                                    {!itm.caseNote ? <>
                                                        <a className={`linkclass ${itm.caseNote ? '' : 'blinkingLink'}`} onClick={() => openCaseNote(itm)}>
                                                            {languagesModel.translate("add_case_note", language)}
                                                        </a>
                                                    </> : <></>}
                                                </td> : <></>}


                                            </tr>
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>

                    </div>
                    {previousTotal > previousFilter.count ? <div>
                        {/* <Pagination
                            activePage={previousFilter.page}
                            itemsCountPerPage={previousFilter.count}
                            totalItemsCount={previousTotal}
                            pageRangeDisplayed={5}
                            onChange={e => pageChange(e, 'previous')}
                        /> */}
                        <Pagination
                            currentPage={previousFilter.page}
                            totalSize={previousTotal}
                            sizePerPage={previousFilter.count}
                            changeCurrentPage={e => pageChange(e, 'previous')}
                        />
                    </div> : <></>}
                </div>
            </div>

            <CaseNote form={viewData} />
            <ViewCasenoteModal form={viewData} modalClosed={modalClosed} />
            <CaseNoteModal form={caseForm} setform={setCaseForm} modalClosed={modalClosed} />
        </Layout>

    );
};

export default Profiledetail;
