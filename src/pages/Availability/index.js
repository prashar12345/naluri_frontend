import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import './style.scss';
import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import Pagination from "react-pagination-js";
import { ToastsStore } from 'react-toasts';
import loader from '../../methods/loader';
import AddEditAvailability from './AddEditAvailability';
import ViewAvailability from './ViewAvailability';
import methodModel from '../../methods/methods';
import { Link } from 'react-router-dom';
import languagesModel from '../../models/languages.model';
import preferredTimeModel from '../../models/preferredTime.model';
import modalModel from '../../models/modal.model';

const Availability = (p) => {
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', addedBy: '' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [form, setform] = useState({ scheduleDate: '', start: '', end: '' })
    const [viewData, setViewData] = useState()
    const [tab, setTab] = useState('day')
    const [weekDetail, setWeekDetail] = useState([])

    useEffect(() => {
        if (user && user.loggedIn) {
            if (!user.addAvailability && user.role == 'Counsellor') {
                // history.push('/appointments')
            }
            let addedBy = user.id
            if (user.role == 'Clinic Admin') addedBy = methodModel.getPrams('counsellorId')
            setFilter({ ...filters, search: searchState.data, addedBy: addedBy })
            getData({ search: searchState.data, page: 1, addedBy: addedBy })
            getWeek()
        }
    }, [searchState])

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        ApiClient.get('schedules', filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
    }

    const getWeek = () => {
        let counsellorId = user.id
        if (user.role == 'Clinic Admin') counsellorId = methodModel.getPrams('counsellorId')
        let filter = { counsellorId: counsellorId }
        ApiClient.get('weekly/availability', filter).then(res => {
            if (res.success) {
                setWeekDetail(res.data)
            }
        })
    }

    const updateWeek = (e) => {
        e.preventDefault()
        setLoader(true)
        ApiClient.put('weekly/availability', { availablity: weekDetail }).then(res => {
            if (res.success) {
                ToastsStore.success("Availability Updated")
                // getWeek()
            }
            setLoader(false)
        })
    }

    const clear = () => {
        setFilter({ ...filters, search: '', page: 1 })
        getData({ search: '', page: 1 })
    }

    const deleteItem = (id) => {
        if (window.confirm("Do you want to delete this")) {
            loader(true)
            ApiClient.delete('soft/delete', { model: 'schedule', status: 'deactive', id: id }).then(res => {
                if (res.success) {
                    ToastsStore.success(res.message)
                    clear()
                }
                loader(false)
            })
        }
    }

    const pageChange = (e) => {
        setFilter({ ...filters, page: e })
        getData({ page: e })
    }

    const modalClosed = () => {
        clear()
    }

    const viewModal = (itm = '') => {
        setViewData({ ...itm })
        document.getElementById("openviewappointmentModal").click()
    }

    const openModal = (itm = '') => {
        setform({ scheduleDate: '', start: '', end: '', consultation_type: '' })
        if (itm.id) {
            let scheduleDate = datepipeModel.datetostring(itm.scheduleDate)
            let value = {
                id: itm.id,
                scheduleDate: scheduleDate ? scheduleDate : datepipeModel.datetostring(new Date()),
                start: itm.start,
                end: itm.end,
                slots: itm.slots,
                consultation_type: itm.consultation_type
            }

            value.start = datepipeModel.isototime(itm.start)
            value.end = datepipeModel.isototime(itm.end)
            setform({ ...value })
        }

        modalModel.open('availabiltyModal')
    }


    const weekChange = (itm, i, key, value) => {
        weekDetail[i] = { ...itm, end: '', [key]: value }
        setWeekDetail([...weekDetail])
        setTimeout(() => {
            document.getElementById('setWeekDetail').click()
        }, 100)
    }

    const endtimes = (start) => {
        let value = []
        if (start) {
            let ext = preferredTimeModel.find(start)
            if (ext) value = preferredTimeModel.list.filter(itm => itm.id > ext.id)
        }
        return value
    }

    return (

        <Layout>
            <a id="setWeekDetail" onClick={e => setWeekDetail(weekDetail)}></a>
            {user && user.role == 'Counsellor' ? <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <Link className="nav-link" to="/appointments">{languagesModel.translate('consultation_text', language)}</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link active" to="/appointments/availability">{languagesModel.translate('availability_text', language)}</Link>
                </li>
                {/* <li className="nav-item">
                    <Link className="nav-link" to="/appointments/cancel-request">{languagesModel.translate('cancellation_requests_text', language)}</Link>
                </li> */}
            </ul> : <></>}


            <ul className="nav nav-tabs mb-3" id="myTab" role="tablist">
                <li className="nav-item">
                    <a className={`nav-link ${tab == 'day' ? 'active' : ''}`} onClick={e => setTab('day')}>{languagesModel.translate('day_availability', language)}</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${tab == 'week' ? 'active' : ''}`} onClick={e => setTab('week')}>{languagesModel.translate('week_availability', language)}</a>
                </li>
            </ul>

            {tab == 'day' ? <>
                <div className="d-flex justify-content-between mb-3 appointmentadd">
                    <h3 className="usershedding mb-2">
                        {user.role == 'Clinic Admin' ? <>{methodModel.getPrams('name')}'s</> : <></>} {languagesModel.translate('availability_text', language)}
                    </h3>

                    <div>
                        {user.role == 'Counsellor' ? <button className="btn btn-primary" onClick={() => openModal()}>
                            {languagesModel.translate('add_availability', language)}
                        </button> : <></>}
                    </div>
                </div>
                <div className="table-responsive">
                    {
                        data.length ? <table className="table mb-0">

                            <thead className="theadclss">
                                <tr className="tblclas">
                                    <th scope="col">{languagesModel.translate('schedule_date', language)}</th>
                                    <th scope="col" className="text-capitalize">{languagesModel.translate('start_time', language)}</th>
                                    <th scope="col">{languagesModel.translate('end_text', language)}</th>
                                    <th scope="col">{languagesModel.translate('consultation_type', language)}</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr key={i}>
                                        <td>{datepipeModel.date(itm.scheduleDate)}</td>
                                        <td>{datepipeModel.isotime(itm.start)}</td>
                                        <td>{datepipeModel.isotime(itm.end)}</td>
                                        <td>{itm.consultation_type}</td>
                                        <td>
                                            <a className="linkclass mx-2" title="View" onClick={() => viewModal(itm)}><i className="fa fa-eye" aria-hidden="true"></i></a>|
                                            <a className="linkclass mx-2" title="Edit" onClick={() => openModal(itm)}><i className="fas fa-pen"></i></a>|
                                            <a className="linkclass mx-2" title="Delete" onClick={() => deleteItem(itm.id)}><i className="fa fa-trash" aria-hidden="true"></i></a>


                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table> : <></>
                    }

                    {loaging ? <div className="text-center py-4">
                        <img src="/assets/img/loader.gif" className="pageLoader" />
                    </div> : <></>}
                </div>

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
            </> : <></>}


            {tab == 'week' ? <>

                <form onSubmit={updateWeek}>
                    <div className="table-responsive">
                        {
                            weekDetail && weekDetail.length ? <table className="table mb-0">
                                <thead className="theadclss">
                                    <tr className="tblclas">
                                        <th>{languagesModel.translate('day_text', language)}</th>
                                        <th>{languagesModel.translate('start_time', language)}</th>
                                        <th>{languagesModel.translate('end_text', language)}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weekDetail && weekDetail.map((itm, i) => {
                                        return <tr key={i}>
                                            <td>{itm.day}</td>
                                            <td>
                                                <select className="form-control"
                                                    value={itm.start}
                                                    onChange={e => { weekChange(itm, i, 'start', e.target.value) }}
                                                    required
                                                >
                                                    <option value="">{languagesModel.translate('start_time', language)}</option>
                                                    {preferredTimeModel.list.map(itm => {
                                                        if (itm.id != 19)
                                                            return <option value={itm.name} key={itm.name}>{datepipeModel.time(itm.name)}</option>
                                                    })}
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className={`form-control ${itm.end ? '' : 'is-invalid'}`}
                                                    value={itm.end}
                                                    onChange={e => { weekChange(itm, i, 'end', e.target.value) }}
                                                    required
                                                >
                                                    <option disabled value="">{languagesModel.translate('end_time', language)}</option>
                                                    {endtimes(itm.start).map(itm => {
                                                        return <option value={itm.name} key={itm.name}>{datepipeModel.time(itm.name)}</option>
                                                    })}
                                                </select>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table> : <></>
                        }
                    </div>

                    <div className="text-right">
                        <button className="btn btn-primary" type="submit" disabled={loaging}>{loaging ? languagesModel.translate('Updating_button', language) : languagesModel.translate('update_button', language)}</button>
                    </div>
                </form>
            </> : <></>}

            <AddEditAvailability form={form} setform={setform} modalClosed={modalClosed} />
            <ViewAvailability form={viewData} />

        </Layout>

    );
};

export default Availability;
