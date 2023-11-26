import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import ApiKey from '../../methods/ApiKey';
import loader from '../../methods/loader';
import methodModel from '../../methods/methods';
import datepipeModel from '../../models/datepipemodel';
import Pagination from "react-pagination-js";
import { Link } from 'react-router-dom';
import './style.scss';
import languagesModel from '../../models/languages.model';
import CaseNoteModal from '../Appointments/CaseNoteModal';
import modalModel from '../../models/modal.model';
import ViewCasenoteModal from '../Profiledetail/ViewCasenoteModal';
import ViewAppointment from '../Appointments/ViewAppointment';
import { ToastsStore } from 'react-toasts';
import AddEditAppointment from '../Appointments/AddEditAppointment';
import bookingModel from '../../models/booking.model';
import MarkasComplete from '../Appointments/MarkasComplete';
import ChangeCounsellors from '../Request/ChangeCounsellorsModal';
import statusModel from '../../models/status.model';
import Slider from "react-slick";
import Footer from '../../components/global/Footer';
import PageLayout from '../../components/global/PageLayout';


const Dashboard = (p) => {

  var settings = {
    dots: false,
    arrow: true,
    infinite: false,
    // slidesToScroll: 1,
    // slidesToShow: 1,
    centerMode: false,
    variableWidth: true
  };

  const [sliderCardData, setSliderData] = useState()
  const [blogs, setBlogs] = useState([])
  const [catIndex, setCatIndex] = useState(0)

  const [submitted, setSubmitted] = useState(false)
  const history = useHistory()
  const user = useSelector(state => state.user)
  const language = useSelector(state => state.language.data)
  const [assessment, setAssessment] = useState()
  const [assessments, setAssessments] = useState([])
  const [appointmentData, setAppointmentData] = useState([])
  const [appointmentTotal, setAppointmentTotal] = useState(0)
  const [caseNoteData, setcaseNoteData] = useState([])
  const [caseNoteTotal, setcaseNoteTotal] = useState(0)
  const [appointmentFilter, setAppointmentFilter] = useState({ page: 1, count: 10, status: 'Upcoming' })
  const [caseNoteFilter, setcaseNoteFilter] = useState({ page: 1, count: 10, status: '' })
  const [notCasenote, setNotCasenote] = useState(0)
  const [upcomingLoader, setUpcomingLoader] = useState(false)
  const [casenoteLoader, setCasenoteLoader] = useState(false)
  const [url, seturl] = useState("")
  const [viewData, setViewData] = useState()
  const [counsellors, setConsellors] = useState([])
  const [form, setform] = useState({ start: '' })
  const [viewAppointment, setViewAppointment] = useState()
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

  const modalClosed = (p, itm) => {
    if (p == 'view') {
      setViewData(itm)
      modalModel.open('viewcasenoteModal')
    } else {
      clear()

    }
  }

  const sliderData = () => {
    ApiClient.get('blog/slider').then(res => {
      if (res.success) {
        if (res.data.length) {
          setSliderData(res.data)
          setBlogs(res.data[0].blog)
        }
      }
    })
  }

  const catClick = (i) => {
    // blogIndex(i)
    eventClick('content', sliderCardData[i].name)
    setCatIndex(i)
    setBlogs(sliderCardData[i].blog)
  }


  const clear = () => {
    let filter = {
      search: '',
      page: 1
    }
    upcomingBookings(filter)
  }


  const getAssessment = () => {
    // loader(true)
    ApiClient.get('assessments', { page: 1, count: 3, addedBy: user.id }).then(res => {
      if (res.success) {
        if (res.data.length) {
          setAssessment(res.data[0])
          setAssessments(res.data)
        }
      }
      // loader(false)
    })
  }

  const page = (page = '') => {
    if (user.id) ApiClient.dropoff(page, user)
  }


  const download = (id, type) => {
    loader(true)
    ApiClient.get('assessment/result', { id: id ? id : assessment.id, lang: language.code, type: type }).then(res => {
      if (res.success) {
        page('Download Assessment Result')
        let url = ApiKey.api + res.path
        setTimeout(() => {
          window.open(url, '_blank');
        }, 2000)

      }
      loader(false)
    })
  }

  const caseNoteCount = () => {
    ApiClient.get('case/note/count', { counsellorId: user.id }).then(res => {
      if (res.success) {
        setNotCasenote(res.casNotesNeedToAdd)
      }
    })
  }

  useEffect(() => {
    if (user && user.loggedIn) {
      getAssessment()
      upcomingBookings()
      getcaseNote()
      urlsetting()
      caseNoteCount()
      getCounsellors()
      sliderData()
    }
  }, [])

  const getcaseNote = (p = {}) => {
    let url = 'case/notes'
    let counsellorId = ''
    let clinicId = ''
    if (user.role == 'Counsellor') {
      // url = 'counsellor/appointments'
      counsellorId = user.id
    }
    if (user.role == 'Clinic Admin') clinicId = user.id
    let filter = { ...caseNoteFilter, counsellorId, clinicId, ...p }
    setCasenoteLoader(true)
    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        setcaseNoteData(res.data)
        setcaseNoteTotal(res.total)
      }
      setCasenoteLoader(false)
    })
  }
  //reschedule function
  const resched = (itm) => {
    let value = { appointmentId: itm.id, counsellorId: itm.counsellorId, start: itm.start, end: itm.end, user: itm.userId, userId: itm.userId.id, counsellors }
    if (user.role == 'Clinic Admin') {
      setform(value)
      modalModel.open('appointmentModal')
      modalModel.close('viewappointmentModal')
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
          modalModel.close('viewappointmentModal')
          return
        }

        let value = { appointmentId: itm.id, counsellorId: itm.counsellorId, start: itm.start, end: itm.end, userId: itm.userId.id, counsellors }
        setform(value)
        modalModel.open('appointmentModal')
        modalModel.close('viewappointmentModal')
      }
      loader(false)
    })
  }
  const getCounsellors = () => {
    ApiClient.get('user/listing', { page: 1, count: 100, role: 'Counsellor', clinicId: user.id }).then(res => {
      if (res.success) {
        setConsellors(res.data)
      }
    })
  }

  const upcomingBookings = (p = {}) => {
    let url = 'counsellor/appointments'
    let counsellorId = ''
    if (user.role == 'Counsellor') {
      url = 'counsellor/appointments'
      counsellorId = user.id
    }
    let clinicId = ''
    let addedBy = ''
    if (user.role == 'Clinic Admin') clinicId = user.id
    if (user.role == 'user') {
      url = 'user/appointments'
      addedBy = user.id
    }

    let filter = { ...appointmentFilter, addedBy, counsellorId, clinicId, ...p }
    setUpcomingLoader(true)
    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        setAppointmentData(res.data)
        setAppointmentTotal(res.total)
      }
      setUpcomingLoader(false)
    })
  }

  const pageChange = (e) => {
    setAppointmentFilter({ ...appointmentFilter, page: e })
    upcomingBookings({ page: e })
  }
  const caseNotepageChange = (e) => {
    setcaseNoteFilter({ ...caseNoteFilter, page: e })
    getcaseNote({ page: e })
  }

  //changing url based on the role
  const urlsetting = () => {
    let url = ''
    if (user.role == 'Counsellor') {
      url = 'appointments'
    }
    if (user.role == 'Clinic Admin') {
      url = 'ca-appointments'
    }
    if (url != '') {
      seturl(url)
    }
  }

  const vcaseNote = (id = '') => {
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

        } if (methodModel.getPrams('page') == 'casenote') {
          openCaseNote(res.data)
        } else if (!methodModel.getPrams('page')) {
          setViewAppointment({ ...res.data, page: "dashboard" })
          document.getElementById("openviewappointmentModal").click()
        }
      }
      loader(false)
    })
  }

  const reschedule = (itm) => {
    console.log("itm", itm)
    let value = { appointmentType: itm.appointment_type, consultation_type: itm.consultation_type, appointmentId: itm.id, counsellorId: itm.counsellorId, start: itm.start, end: itm.end, userId: itm.userId.id, counsellors }
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

        if (user.role == 'user') hr = 24
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
  const search = (p = {}) => {
    let filter = {
      page: 1,
      ...p
    }
    setcaseNoteFilter({ ...caseNoteFilter, page: 1, ...filter })
    getcaseNote(filter)
  }
  const cancelBooking = (itm) => {
    history.push('/cancellation?id=' + itm.id)
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
  const openCaseNote = (itm) => {
    if (user.role != 'Counsellor') return
    let date = new Date()
    let randomId = `${itm.id}_${date.getTime()}`
    let filters = { appointmentId: itm.id, userId: itm.userId.id, counsellorId: itm.counsellorId }
    setCaseForm({ ...filters, note: '', page: itm.page, randomId })
    modalModel.open('caseNoteModal')
  }

  const view = (item = '') => {
    setViewData(item)
    modalModel.open('viewcasenoteModal')
  }

  const translate2 = (translate, en) => {
    return languagesModel.translate2(translate, language.code, en)
  }

  const translate = (key) => {
    return languagesModel.translate(key, language)
  }

  const checkHieghLevel = () => {
    let value = false
    if (assessment && assessment.assessmentResults && assessment.assessmentResults) {
      assessment.assessmentResults.map(itm => {
        if (itm.result === 'High' || itm.result === 'Moderate' || itm.result === 'Severe' || itm.result === 'Extremely severe') value = true
      })
    }
    return value
  }

  const eventClick = (p = 'content', contentCategory = '') => {
    ApiClient.post('save/data', { event: p, contentCategory: contentCategory }).then(res => {

    })
  }


  return (
    <>

      <Layout>
        <div className='main-body'>
          <div className="container">
            <h3 className='Morningcls mb-4 text-capitalize'>{languagesModel.translate('hi_text', language)}, {user && user.fullName}</h3>
            {notCasenote && user.role != 'user' ? <Link to={url} className="banner-link">
              <div className="bgtoster mb-4 cursor-pointer">
                {/* <i className="fa fa-bell-o ml-3 mr-2" aria-hidden="true"></i> */}
                <h3 className="tosterclss pl-3">{translate('you_have_text')} {notCasenote} {translate('new_consultation__text')}</h3>
              </div></Link> : <></>
            }

            <div className="mb-4">
              {
                appointmentData.length ? <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                  <h5 className="mb-3">{languagesModel.translate('dashboard_heading', language)}
                    {/* Your Consultation Sessions */}
                  </h5>
                  {user.role != 'user' ? <>
                    <Link to='appointments/calendar' className="btn btn-outline-primary rounded-pill px-4">
                      {languagesModel.translate('calendar_view_text', language)}
                    </Link>
                  </> : <></>}

                </div> : <></>
              }

              {!upcomingLoader ? <>
                <div className="table-responsive">
                  {
                    appointmentData.length ? <table className="table mb-3">
                      <thead className="theadclss">
                        <tr className="tblclas">
                          <th scope="col"></th>
                          <th scope="col">
                            {user.role !== 'user' ? languagesModel.translate('user_name', language) : languagesModel.translate('counsellor_name', language)}
                          </th>
                          {user.role == 'Clinic Admin' ? <th scope="col">{languagesModel.translate('counsellor_name', language)}</th> : <></>}
                          <th scope="col">{languagesModel.translate('appointmentdate_heading', language)}</th>
                          <th scope="col">{languagesModel.translate('consultation_preference', language)}</th>
                          <th scope="col">{languagesModel.translate('health_clinic_text', language)} / {languagesModel.translate('zoom_link', language)}</th>
                          <th scope="col">{languagesModel.translate('status_heading', language)}</th>
                          {user.role === 'Counsellor' ? <th>{languagesModel.translate('case_note_text', language)}</th> : <></>}

                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointmentData && appointmentData.map((itm, i) => {
                          return <tr key={i}>
                            <td>
                              {!itm.caseNote ? <span className='greendot'></span> : <></>}
                            </td>
                            <td>
                              {user.role === 'user' ? <>
                                {itm.counsellorDetail ? <Link to={`/profiledetail/${itm.counsellorDetail.id}`} className="text-primary">{itm.counsellorDetail.fullName}</Link> : <></>}
                              </> : <>
                                {itm.userId ? <Link to={`/profiledetail/${itm.userId.id}`} className="text-primary">{itm.userId.fullName}</Link> : <></>}
                              </>}

                            </td>
                            {user.role == 'Clinic Admin' ? <td>{itm.counsellorDetail ? <Link to={`/profiledetail/${itm.counsellorDetail.id}`} className="text-primary">{itm.counsellorDetail.fullName}</Link> : <></>}</td> : <></>}
                            <td>
                              {datepipeModel.date(itm.start)} | {datepipeModel.isotime(itm.start)}-{datepipeModel.isotime(itm.end)}

                            </td>
                            <td>{itm.consultation_type}</td>
                            {itm.consultation_type == 'In-person' ? <td>{itm.counsellorDetail.healthClinicId ? translate2(itm.counsellorDetail.healthClinicId.nameTranslate, itm.counsellorDetail.healthClinicId.name) : ''}</td> : <td>
                              {itm.status == 'Upcoming' && user.role == 'user' ? <a href={itm.join_url} target="_blank" className="btn btn-primary">{languagesModel.translate('zoom_link', language)}</a> : <></>}
                              {itm.status == 'Upcoming' & user.role != 'user' ? <a href={itm.start_url} target="_blank" className="btn btn-primary">{languagesModel.translate('zoom_link', language)}</a> : <></>}
                            </td>}
                            <td>{statusModel.html(itm.status, language)}</td>
                            {user.role === 'Counsellor' ? <td>
                              {itm.caseNote ? <a onClick={() => openCaseNote({ ...itm, page: 'list' })} className="text-primary">{languagesModel.translate('view_case_note', language)}</a> : <></>}
                              {!itm.caseNote ? <>
                                <a className={`linkclass ${itm.caseNote ? '' : 'blinkingLink'}`} onClick={() => openCaseNote(itm)}>
                                  {languagesModel.translate('add_case_note', language)}
                                </a>
                              </> : <></>}
                            </td> : <></>}

                            <td>
                              <a className="actionBtnicon mx-2" onClick={() => vcaseNote(itm.id)} title="View">
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
                </div>
                {appointmentTotal > appointmentFilter.count ? <div className="text-left">

                  <Pagination
                    currentPage={appointmentFilter.page}
                    totalSize={appointmentTotal}
                    sizePerPage={appointmentFilter.count}
                    changeCurrentPage={pageChange}
                  />
                </div> : <></>
                }


                {/* {!appointmentData.length && <div className="text-center"><img src="./assets/img/Nodata.jpg" alt="No Data img" className="no-data-img" /></div>} */}
              </> : <>
                <div className="text-center py-4">
                  <img src="/assets/img/loader.gif" className="pageLoader" />
                </div>
              </>}
            </div>

            {user.role != 'user' ? <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-3">{languagesModel.translate('case_notes', language)}</h5>
                <div className="dropdown ml-2">
                  {caseNoteTotal ? <button className=" dropdown-toggle btn btn-outline-primary  rounded-pill  px-4 " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {caseNoteFilter.addedBy ? methodModel.find(counsellors, caseNoteFilter.addedBy, 'id', 'fullName').fullName : languagesModel.translate('added_by_text', language)}
                  </button> : <></>}

                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className={`dropdown-item ${caseNoteFilter.addedBy == '' && 'active'}`} onClick={() => search({ addedBy: '' })}>All</a>
                    {counsellors.map(itm => {
                      return <a className={`dropdown-item ${caseNoteFilter.addedBy == itm.id && 'active'}`} key={itm.id} onClick={() => search({ addedBy: itm.id })}>{itm.fullName}</a>
                    })}
                  </div>
                </div>
              </div>

              {!casenoteLoader ? <>
                <div className="table-responsive">
                  {caseNoteData.length ? <table className="table mb-3">
                    <thead className="theadclss">
                      <tr className="tblclas">
                        <th scope="col">{languagesModel.translate('date_text', language)}</th>
                        <th scope="col">{languagesModel.translate('users_text', language)}</th>
                        <th scope="col">{languagesModel.translate('added_by_text', language)}</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {caseNoteData && caseNoteData.map((itm, i) => {
                        return <tr key={i}>
                          <td>{datepipeModel.datetime(itm.createdAt)}</td>
                          <td><Link to={`/profiledetail/${itm.userId.id}`} className="text-primary">{itm.userId.fullName}</Link></td>
                          <td><Link to={`/profiledetail/${itm.addedBy.id}`} className="text-primary">{itm.addedBy.fullName}</Link></td>
                          <td>
                            {user.role == 'Counsellor' ? <a className="actionBtnicon mx-2" onClick={() => view(itm)} title="View">
                              <i className="fa fa-eye"></i>
                            </a> : <></>}
                          </td>
                        </tr>
                      })}
                    </tbody>
                  </table> : <></>}
                </div>

                {!caseNoteData.length && <div className="text-center"><img src="./assets/img/Nodata.jpg" alt="No Data img" className="no-data-img" /></div>}

                {caseNoteTotal > caseNoteFilter.count ? <div className="text-left">

                  <Pagination
                    currentPage={caseNoteFilter.page}
                    totalSize={caseNoteTotal}
                    sizePerPage={caseNoteFilter.count}
                    changeCurrentPage={caseNotepageChange}
                  />
                </div> : <></>}
              </> : <>
                <div className="text-center py-4">
                  <img src="/assets/img/loader.gif" className="pageLoader" />
                </div>
              </>}



            </div> : <></>}



            <div className="row">
              {user && user.role == 'user' ? <>
                {assessment && user.assessmentFilled ? <>
                  <div className="col-md-12">

                    <div className="recent-result mb-4">
                      <div className="d-flex align-items-end justify-content-between mb-5">
                        <div className="result">
                          <h2>{languagesModel.translate('recent_result', language)}</h2>
                          <small>{datepipeModel.date(assessment.createdAt)} | {datepipeModel.time(assessment.createdAt)}</small>
                        </div>
                      </div>

                      {assessment.assessmentResults && assessment.assessmentResults.map(aitm => {
                        return <>
                          <div className="save-result mb-3 bluecls">
                            <div className="row">
                              <div className="col-lg-5">

                                <p className="mb-2 text-uppercase">{translate2(aitm.type.translate, aitm.type.name)}</p>
                                <p className="mb-4">{languagesModel.translate('dashboard_title', language)} <span className="text-blue">{translate2(aitm.result_translate, aitm.result)}</span> {languagesModel.translate('level_newtext', language)} {languagesModel.translate('of_text', language)} <span className="text-capitalize">{aitm.categoryWiseResult.map((citm, i) => {
                                  if (i == aitm.categoryWiseResult.length - 1 && i != 0) {
                                    return `& ${translate2(citm.lable_translate, citm.lable)}`
                                  } else {
                                    return `${translate2(citm.lable_translate, citm.lable)}${i != aitm.categoryWiseResult.length - 1 ? ',' : ''} `
                                  }
                                })}</span>
                                </p>
                                <div className="">
                                  <button className="saveyourbtn" onClick={e => download(assessment.id, aitm.type.id)}><i className='fa fa-download mr-1'></i> {languagesModel.translate('download_result_button', language)}</button>
                                </div>

                              </div>
                              <div className="col-lg-7">
                                <div className="row">
                                  {aitm.categoryWiseResult && aitm.categoryWiseResult.map(itm => {
                                    return <div className={`${aitm.categoryWiseResult.length == 1 ? 'col-lg-12' : 'col-lg-4'}`} key={itm.lable}>
                                      <div className={`boxes ${itm.level_risk == 'Moderate' || itm.level_risk == 'Mild' ? 'box-color2' : ''} ${itm.level_risk == 'Severe' || itm.level_risk == 'Extremely severe' || itm.level_risk == 'High' ? 'box-color3' : ''} ${itm.level_risk == 'Normal' || itm.level_risk == 'Low' ? 'box-color1' : ''}`}>
                                        <p className="mb-4 text-uppercase">{translate2(itm.lable_translate, itm.lable)}</p>
                                        <h2 className="text-capitalize dashcardtex">
                                          {translate2(itm.level_translate, itm.level_risk)}
                                          {/* {itm.level_risk} */}
                                          <br></br>
                                          <small>{languagesModel.translate('risk_text', language)}</small></h2>
                                      </div>
                                    </div>
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      })}
                    </div>

                  </div>
                </> : <></>}

                <div className="col-md-12 mt-4">
                  {checkHieghLevel() ? <>
                    <div className="recent-result healthcare mb-4">
                      <div className="healthcare-width">
                        <div className="result mb-4">
                          <h2>{languagesModel.translate('healthcare_professional_hedding', language)}</h2>
                          <small>{languagesModel.translate('counsellor_ready_text', language)}</small>
                        </div>
                        <div className="">
                          <a onClick={e => { eventClick('whatsapp'); page('Select reach out through whatsapp button') }} href='https://api.whatsapp.com/send?phone=601130115658&text=I%20just%20completed%20my%20mental%20health%20assessment%20on%20e-MeSVIPP%20portal%20and%20my%20mental%20health%20is%20shown%20to%20be%20high.%20I%20want%20to%20speak%20to%20a%20licensed%20counsellor%20to%20receive%20support' target="_new" className='reachoutbtn'>{languagesModel.translate('through_Whatsapp_button', language)}</a>
                        </div>
                      </div>
                      <div className="chat-img">
                        <img src="/assets/img/chat-blue.png" className="chat-blue" alt="" />
                        <img src="/assets/img/chat-orange.png" className="chat-orange" alt="" />
                      </div>
                    </div>
                  </> : <></>}

                  {assessment && user.assessmentFilled ? <>
                    <div className="recent-result past-result bg-white  mb-4">
                      <div className="result mb-4">
                        <h2>{languagesModel.translate('past_results', language)}</h2>
                      </div>
                      <div className="row">
                        {assessments && assessments.map(aitm => {
                          return <div className="col-lg-6" key={aitm.id}>
                            <div className="past-box">
                              <p className="text-uppercase">{
                                aitm.assessmentResults && aitm.assessmentResults.map(itm => {
                                  return itm.categoryWiseResult.map((citm, i) => {
                                    if (i == itm.categoryWiseResult.length - 1 && i != 0) {
                                      return `& ${translate2(citm.lable_translate, citm.lable)}`
                                    } else {
                                      return `${translate2(citm.lable_translate, citm.lable)}, `
                                    }
                                  })
                                })
                              }</p>
                              <span>{datepipeModel.date(aitm.createdAt)} | {datepipeModel.isotime(aitm.createdAt)}</span>
                              <div className="download-icon" onClick={e => download(aitm.id)}>
                                <i className="fa fa-download"></i>
                              </div>
                            </div>
                          </div>
                        })}
                      </div>
                    </div>
                  </> : <></>}

                  <div className="recent-result promote bg-white mb-4">
                    <div className="result mb-4">
                      <h2>{languagesModel.translate('here_are_some_resources_to_promote_your_mental_wellbeing', language)}</h2>
                    </div>


                    <div className='blogsliderContainer'>
                      <div className="mb-3">
                        <Slider {...settings}>
                          {
                            sliderCardData && sliderCardData.map((itm, i) => {
                              return <div className="px-2">
                                <a onClick={e => catClick(i)} className={`Depressionutoon ${catIndex == i ? 'active' : ''}`}>{translate2(itm.nameTranslate, itm.name)}</a>
                              </div>
                            })
                          }
                        </Slider>
                      </div>

                      <Slider {...settings}>
                        {
                          blogs && blogs.map(blog => {
                            return <div className="px-1 d-blog" onClick={e => eventClick('content', sliderCardData[catIndex].name)}>
                              <Link to={`blogdetail/${blog.id}`} key={blog.id}>
                                <div className='homeimg'>
                                  <img src={`${ApiKey.api}/images/blogs/${blog.image}`} alt="img" />
                                  <div className='imgbotmtext'>{translate2(blog.titleTranslate, blog.title)}</div>
                                </div>
                              </Link>
                            </div>

                          })
                        }
                      </Slider>
                      <div className='Assessmentbtnmaincls'>
                        <Link to="/blogcategories" className='Explore_Assessmentbtn mt-3 mb-3'>{languagesModel.translate('explore_library', language)}</Link>
                      </div>
                    </div>



                    {/* <div className="emoji">
                    <div className="emoji-list">
                      <img src="/assets/img/Visual1.png" alt="" />
                      <p>{languagesModel.translate('family_text', language)} <br></br>
                        {languagesModel.translate('issue_text', language)} </p>
                    </div>
                    <div className="emoji-list">
                      <img src="/assets/img/Visual2.png" alt="" />
                      <p>{languagesModel.translate('financial_text', language)}<br></br> {languagesModel.translate('stress_text', language)}</p>
                    </div>
                    <div className="emoji-list">
                      <img src="/assets/img/Visual3.png" alt="" />
                      <p>{languagesModel.translate('Work_text', language)}<br></br>
                        {languagesModel.translate('stress_text', language)}</p>
                    </div>
                    <div className="emoji-list">
                      <img src="/assets/img/Visual4.png" alt="" />
                      <p>{languagesModel.translate('physical_text', language)}<br></br>  {languagesModel.translate('health_text', language)}</p>
                    </div>
                    <div className="emoji-list">
                      <img src="/assets/img/Visual5.png" alt="" />
                      <p>{languagesModel.translate('family_text', language)}<br></br> {languagesModel.translate('issue_text', language)}</p>
                    </div>
                    <div className="emoji-list">
                      <img src="/assets/img/Visual1.png" alt="" />
                      <p>{languagesModel.translate('family_text', language)}<br></br>
                        {languagesModel.translate('issue_text', language)}</p>
                    </div>
                    <div className="emoji-list">
                      <img src="/assets/img/Visual2.png" alt="" />
                      <p>{languagesModel.translate('financial_text', language)} <br></br>{languagesModel.translate('stress_text', language)}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="promote-box" onClick={e => eventClick('content')}>
                        <p>{languagesModel.translate('6_tips_to_cope_with_anxiety', language)}</p>
                        <img src="/assets/img/Lifesavers Bust.png" alt="" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="promote-box" onClick={e => eventClick('content')}>
                        <p>{languagesModel.translate('tips_to_unlock_positivity', language)}</p>
                        <img src="/assets/img/Lifesavers Electrocardiogram.png" alt="" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="promote-box" onClick={e => eventClick('content')}>
                        <p>{languagesModel.translate('sings_you_are_too_stressed_out', language)}</p>
                        <img src="/assets/img/Lifesavers Serum Bag.png" alt="" />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="promote-box" onClick={e => eventClick('content')}>
                        <p>{languagesModel.translate('sings_you_are_too_stressed_out', language)}</p>
                        <img src="/assets/img/Lifesavers Stomach.png" alt="" />
                      </div>
                    </div>
                  </div> */}

                  </div>


                </div>

              </> : <></>}

            </div>

          </div >
        </div>
        <AddEditAppointment form={form} submitted={submitted} setSubmitted={setSubmitted} setform={setform} modalClosed={modalClosed} />
        <ViewAppointment form={viewAppointment} setform={setViewAppointment} reschedule={resched} />
        <CaseNoteModal form={caseForm} setform={setCaseForm} modalClosed={modalClosed} />
        <ViewCasenoteModal form={viewData} />
        <MarkasComplete form={viewData} modalClosed={modalClosed} />
        <ChangeCounsellors form={form} />

      </Layout >

    </>


  );
};

export default Dashboard;
