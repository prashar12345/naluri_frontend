import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import Pagination from "react-pagination-js";
import './style.scss';
import { ToastsStore } from 'react-toasts';
import loader from '../../methods/loader';
import datepipeModel from '../../models/datepipemodel';
import ViewModal from './View';

const UserRequest = (p) => {
    let user = useSelector(state => state.user)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', role: '', status: 'pending' })
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
        ApiClient.get('counsellor/appointments', filter).then(res => {
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

    const deleteItem = (id) => {
        if (window.confirm("Do you want to delete this")) {
            loader(true)
            ApiClient.delete('soft/delete', { model: 'users', status: 'deactive', id: id }).then(res => {
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

    const search = (e) => {
        e.preventDefault()
        setFilter({ ...filters, page: 1 })
        getData({ page: 1 })
    }

    const searchChange = (e) => {
        setFilter({ ...filters, search: e })
        if (!e) {
            clear()
        }
    }

    const view = (itm) => {
        setViewData(itm)
        document.getElementById("openviewModal").click()
    }

    const accept = (itm) => {
        loader(true)
        ApiClient.put('acceptreject/request?id=' + itm.id + '&status=accepted').then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                clear()
            }
            loader(false)
        })
    }

    const reject = (itm) => {
        if (window.confirm("Do want reject this request")) {
            loader(true)
            ApiClient.put('acceptreject/request?id=' + itm.id + '&status=rejected').then(res => {
                if (res.success) {
                    ToastsStore.success(res.message)
                    clear()
                }
                loader(false)
            })
        }
    }

    return (
        <Layout>
            <div className=" mainreqest d-flex justify-content-between">

                <div className="mb-0">
                    <h3 className="usershedding mb-0">
                        Requests
                    </h3>
                </div>
                <div className=" mb-3">
                    <form className="form-outline d-flex" onSubmit={search}>
                        <input type="text" id="form12" className="form-control" placeholder='Search' onChange={e => searchChange(e.target.value)} />
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>

                </div>
            </div>
            <div className="table-responsive">
                {
                    data.length ? <table className="table mb-0">
                        <thead className="theadclss">
                            <tr className="tblclas">
                                <th scope="col" >schedule Date</th>
                                <th scope="col">Status</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loaging && data && data.map((itm, i) => {
                                return <tr key={i}>
                                    <td>{datepipeModel.date(itm.scheduleId.scheduleDate)}</td>
                                    <td>
                                        <span className="badge badge-light"> {itm.status}</span>
                                    </td>

                                    <td>
                                        <a className="linkclass mx-2" onClick={() => view(itm)}><i className="fa fa-eye" aria-hidden="true" title='View'></i></a>|
                                        <a className="linkclass mx-2" onClick={() => accept(itm)}><i className="fa fa-check" aria-hidden="true" title='Accept'></i></a>|
                                        <a className="linkclass mx-2" onClick={() => reject(itm)}><i className="fa fa-times" aria-hidden="true" title='Reject'></i></a>
                                        {/* <Link className="linkclass mx-1" to={'//' + itm.id}><i className="fa fa-undo" aria-hidden="true" title='Refresh'></i></Link> |
                                    <Link className="linkclass mx-1" to={'//' + itm.id}><i className="fas fa-times-circle" title='Reject'></i></Link> */}
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

            <ViewModal form={viewData} />
        </Layout>
    );
};
export default UserRequest;
