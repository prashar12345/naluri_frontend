import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import Pagination from "react-pagination-js";
import './style.scss';
import datepipeModel from '../../models/datepipemodel';
import { useHistory } from 'react-router';
import loader from '../../methods/loader';
import ViewAppointment from '../Appointments/ViewAppointment';
import methodModel from '../../methods/methods';
import bookingModel from '../../models/booking.model';
import modalModel from '../../models/modal.model';
import statusModel from '../../models/status.model';
import ChangeCounsellors from './ChangeCounsellorsModal';
import languagesModel from '../../models/languages.model';
import AddEditAppointment from '../Appointments/AddEditAppointment';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/global/PageLayout';

const Request = (p) => {
    const history = useHistory()
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const modalState = useSelector(state => state.modal)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', role: '' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [viewData, setviewData] = useState()
    const [cform, setcform] = useState()
    const [rescheduleForm, setRescheduleForm] = useState({ counsellorId: '' })

    useEffect(() => {
    }, [modalState])

    useEffect(() => {
        if (user && user.loggedIn) {
            let id = methodModel.getPrams('id')
            if (id) view(id)

            setFilter({ ...filters, search: searchState.data, addedBy: user.id })
            getData({ search: searchState.data, page: 1, addedBy: user.id })
        }
    }, [searchState])

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        ApiClient.get('user/appointments', filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
    }


    const clear = () => {
        setFilter({ ...filters, search: '', page: 1 })
        getData({ search: '', page: 1 })
    }

    const pageChange = (e) => {
        setFilter({ ...filters, page: e })
        getData({ page: e })
    }

    const modalClosed = () => {
        clear()
    }

    const reschedule = (itm) => {
        let hr = 24
        let error = bookingModel.twenty4hrCheck(itm.start, hr)
        if (error) {
            loader(false)
            ChangeCounsellor(itm)
            return
        }

        let value = { clinicAddress: itm.clinicAddress, appointmentType: itm.appointment_type, appointmentId: itm.id, counsellorId: itm.counsellorId, start: itm.start, end: itm.end, userId: itm.userId.id, user: itm.userId, consultation_type: itm.consultation_type, clinicId: itm.clinicId.id, timeClicked: false }
        setRescheduleForm(value)

        // modalModel.open('rescheduleConfirm')
        modalModel.open('appointmentModal')
    }

    const no = () => {
        modalModel.close('rescheduleConfirm')
        setRescheduleForm({ ...rescheduleForm, timeClicked: false })
        modalModel.open('appointmentModal')
    }

    const yes = () => {
        modalModel.close('rescheduleConfirm')
        ChangeCounsellor(rescheduleForm)

        // let prms = {
        //     appointmentId: rescheduleForm.appointmentId,
        //     counsellorId: rescheduleForm.counsellorId,
        //     end: rescheduleForm.end,
        //     start: rescheduleForm.start,
        //     page: 'user-reschedule'
        // }
        // let prmsurl = methodModel.setPrams(prms)
        // history.push('consultation' + prmsurl)
    }

    const cancelBooking = (itm) => {
        history.push('cancellation?id=' + itm.id)
    }

    const view = (id = '') => {
        loader(true)
        ApiClient.get('appointment', { id: id }).then(res => {
            if (res.success) {
                if (methodModel.getPrams('page') == 'reschedule') {
                    reschedule(res.data)
                } else {
                    setviewData(res.data)
                    document.getElementById("openviewappointmentModal").click()
                }
            }
            loader(false)
        })
    }
    const search = (p = {}) => {
        let filter = { page: 1, ...p }
        setFilter({ ...filters, ...filter })
        getData(filter)
    }

    const statusChange = (status, consultation_type) => {
        let filter = {
            search: '',
            status: status,
            consultation_type: consultation_type,
            page: 1
        }
        setFilter({ ...filters, ...filter })
        getData(filter)
    }

    const ChangeCounsellor = (itm = '') => {
        setcform(itm)
        document.getElementById('openchangeCounsellors').click()
    }

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    return (
        <>
            <PageLayout>

                {/* <Layout> */}
                <div className='container'>


                    <div className="mb-0">
                        <h3 className="usershedding mb-3 mr-3">
                            {languagesModel.translate('consultation_text', language)}
                        </h3>
                    </div>
                    <div className=" mainreqest d-flex justify-content-end mb-2">

                        <div className="mar-b10 mr-2">
                            <input type="date" className="form-control chosedateclss" value={datepipeModel.datetostring(filters.startDate)} onChange={e => search({ startDate: datepipeModel.datetoIso(e.target.value) })} />{filters.search ? <i className="fa fa-times crosscross" onClick={clear} aria-hidden="true" ></i> : <></>}
                        </div>

                        <div className="mar-b10">
                            <div className="dropdown w-100">
                                <button className={`btn btn-primary  dropdown-toggle mr-2 ${filters.consultation_type && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {filters.consultation_type ? filters.consultation_type : languagesModel.translate('mode_of_consultation', language)}
                                </button>
                                <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                    <a className={`dropdown-item ${filters.consultation_type == '' && 'active'}`} onClick={() => search({ consultation_type: '' })}> {languagesModel.translate('all_text', language)}</a>
                                    <a className={`dropdown-item ${filters.consultation_type == 'In-person' && 'active'}`} onClick={() => search({ consultation_type: 'In-person' })}>{languagesModel.translate('in-person_consultation', language)}</a>
                                    <a className={`dropdown-item ${filters.consultation_type == 'Video' && 'active'}`} onClick={() => search({ consultation_type: 'Video', state: '', city: '', country: '' })}>{languagesModel.translate('video_consultation', language)}</a>
                                </div>
                            </div>
                        </div>


                        <div className="mar-b10">
                            <div className="dropdown statusDropdown">
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
                        </div>
                    </div>
                    <div className="table-responsive">
                        {data.length ? <table className="table mb-0">
                            <thead className="theadclss">
                                <tr className="tblclas">

                                    <th scope="col">{languagesModel.translate('counsellor_name', language)}</th>
                                    <th scope="col">{languagesModel.translate('appointmentdate_heading', language)}</th>
                                    <th scope="col">{languagesModel.translate('consultation_type', language)}</th>
                                    <th scope="col">{languagesModel.translate('status_heading', language)}</th>
                                    <th scope="col">{languagesModel.translate('health_clinic_text', language)} / {languagesModel.translate('zoom_link', language)}</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr key={i}>
                                        <td> {itm.counsellorDetail ? <Link to={`/profiledetail/${itm.counsellorDetail.id}`} className="text-primary">{itm.counsellorDetail.fullName}</Link> : <></>}</td>
                                        <td>{datepipeModel.date(itm.start)} | {datepipeModel.isotime(itm.start)}-{datepipeModel.isotime(itm.end)}</td>
                                        <td>
                                            {itm.consultation_type}
                                        </td>
                                        <td>
                                            {statusModel.html(itm.status, language)}
                                        </td>
                                        {itm.consultation_type == 'In-person' ? <td>{itm.counsellorDetail.healthClinicId ? translate2(itm.counsellorDetail.healthClinicId.nameTranslate, itm.counsellorDetail.healthClinicId.name) : ''}</td> : <td>
                                            {itm.status == 'Upcoming' && user.role == 'user' ? <a href={itm.join_url} target="_blank" className="btn btn-primary">{languagesModel.translate('zoom_link', language)}</a> : <></>}
                                            {itm.status == 'Upcoming' & user.role != 'user' ? <a href={itm.start_url} target="_blank" className="btn btn-primary">{languagesModel.translate('zoom_link', language)}</a> : <></>}
                                        </td>}

                                        <td>
                                            <a className="linkclass mx-2" onClick={() => view(itm.id)} title="View">
                                                <i className="fa fa-eye"></i>

                                            </a>

                                            {itm.status == 'Upcoming' ? <>
                                                |
                                                <a className="linkclass mx-2" onClick={() => reschedule(itm)} title="Reschedule">
                                                    <i className="fa fa-calendar"></i>
                                                </a>|
                                                <a className="linkclass mx-2" onClick={() => cancelBooking(itm)} title="Cancel">
                                                    <i className="fa fa-times"></i>
                                                </a>

                                                {/* |<a className="linkclass mx-2" onClick={() => ChangeCounsellor(itm)} title="Change Counsellors">
                                            <i className="fa fa-paper-plane" aria-hidden="true"></i></a> */}

                                            </> : <></>}
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table> : <></>}

                        {loaging ? <div className="text-center py-4">
                            <img src="./assets/img/loader.gif" className="pageLoader" />
                        </div> : <></>}
                    </div>

                    {!loaging && total == 0 ? <div className="py-3 text-center"><img src="./assets/img/Nodata.jpg" alt="No Data img" className="no-data-img" /></div> : <></>}

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


                    <div className="modal fade" id="rescheduleConfirm" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle">{languagesModel.translate('reschedule_text', language)}</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {languagesModel.translate('do_you_want', language)}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={no}>  {languagesModel.translate('no_text', language)}</button>
                                    <button type="button" className="btn btn-primary" onClick={yes}> {languagesModel.translate('yes_text', language)}</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className='text-center mb-3'>
                        For any inquiries, please reach out to your clinic admin at <a href='mailto:hello@emesvipp.com'>hello@emesvipp.com</a> or at <a href='tel:03-00000000'>03-00000000</a>
                    </div>
                </div>
                <ViewAppointment form={viewData} />
                <AddEditAppointment setform={setRescheduleForm} form={rescheduleForm} modalClosed={modalClosed} />
                {/* {rescheduleModal ? <RescheduleAppointment setform={setRescheduleForm} form={rescheduleForm} modalClosed={modalClosed} /> : <></>} */}
                <ChangeCounsellors form={cform} setform={setcform} />
                {/* </Layout > */}
            </PageLayout>
        </>
    );
};
export default Request;
