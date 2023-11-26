import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';

import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import Pagination from "react-pagination-js";
import './style.scss';
import { ToastsStore } from 'react-toasts';
import ViewModal from './ViewModal';
import { Link } from 'react-router-dom';
import languagesModel from '../../models/languages.model';
import statusModel from '../../models/status.model';

const RescheduleRequest = (p) => {
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', addedBy: '', status: '' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [viewData, setViewData] = useState()

    useEffect(() => {
        if (user && user.loggedIn) {
            setFilter({ ...filters, search: searchState.data, addedBy: user.id })
            getData({ search: searchState.data, page: 1, addedBy: user.id })
        }
    }, [searchState])

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        ApiClient.get('reschedule/requests', filter).then(res => {
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


    const view = (item = '') => {
        setViewData(item)
        document.getElementById("openviewModal").click()
    }

    const statusChange = (id, status) => {
        ApiClient.put("reschedule/request", { rescheduleId: id, status }).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                clear()
            }
        })
    }


    return (

        <>
            <div className="d-flex justify-content-between mb-3 appointmentadd">
                <h3 className="usershedding mb-0">
                    {languagesModel.translate('reschedule_booking', language)}
                </h3>

                <div>
                </div>

            </div>
            <div className="table-responsive">
                {
                    data.length ? <table className="table mb-0">
                        <thead className="theadclss">
                            <tr className="tblclas">
                                <th scope="col"> {languagesModel.translate('ic_no_heading', language)}</th>
                                <th scope="col">Appointment date & time</th>
                                <th scope="col">Rescheduled date & time</th>
                                <th scope="col">Requested submitted date & time</th>
                                <th scope="col">{languagesModel.translate('phonenumber_heading', language)}</th>
                                <th scope="col">{languagesModel.translate('status_heading', language)}</th>

                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loaging && data && data.map((itm, i) => {
                                return <tr key={i}>
                                    <td><Link to={`/profiledetail/${itm.userId.id}`}>{itm.userId.ic_number}</Link></td>
                                    <td>{itm.appointmentId ? <>{datepipeModel.date(itm.appointmentId.start)} | {datepipeModel.isotime(itm.appointmentId.start)}-{datepipeModel.isotime(itm.appointmentId.end)}</> : <></>}</td>
                                    <td>{datepipeModel.date(itm.start)} | {datepipeModel.isotime(itm.start)}-{datepipeModel.isotime(itm.end)}</td>
                                    <td>{datepipeModel.date(itm.createdAt)} | {datepipeModel.time(itm.createdAt)}</td>
                                    <td>{itm.userId.dialCode + itm.userId.mobileNo}</td>
                                    {/* <td>
                                        <span className="badge badge-light">{itm.status}</span>
                                    </td> */}

                                    <td>{statusModel.html(itm.status)}</td>

                                    <td>
                                        <a className="linkclass mx-2" onClick={() => view(itm)} title="View">
                                            <i className="fa fa-eye"></i>
                                        </a>

                                        {itm.status == 'pending' ? <>
                                            |<a className="linkclass mx-2" onClick={() => statusChange(itm.id, 'approved')} title="Approved">
                                                <i className="fa fa-check"></i>

                                            </a>|
                                            <a className="linkclass mx-2" onClick={() => statusChange(itm.id, 'rejected')} title="Rejected">
                                                <i className="fa fa-times"></i>
                                            </a>
                                        </> : <></>}


                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table> : <></>
                }

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

            <ViewModal form={viewData} />
        </>

    );
};

export default RescheduleRequest;
