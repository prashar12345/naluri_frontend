import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import Pagination from "react-pagination-js";
import './style.scss';
import { Link } from 'react-router-dom';
import languagesModel from '../../models/languages.model';
import { ToastsStore } from 'react-toasts';


const AllUsers = (p) => {
    const language = useSelector(state => state.language.data)
    let user = useSelector(state => state.user)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', role: 'user', type: 'counsellor' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)

    useEffect(() => {
        if (user && user.loggedIn) {
            let filterdata = { search: searchState.data, page: 1 }
            setFilter({ ...filters, ...filterdata })
            getData(filterdata)
        }
    }, [searchState])

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        ApiClient.get('user/listing', filter).then(res => {
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

    const search = (e) => {
        if (e) e.preventDefault()
        setFilter({ ...filters, page: 1 })
        getData({ page: 1 })
    }

    const searchChange = (e) => {
        setFilter({ ...filters, search: e })
        if (!e) {
            clear()
        }
    }
    const addtoMyUser = (item) => {
        ApiClient.post('counsellor/user', { userId: item.id }).then(res => {
            if (res.success) {
                let filterdata = { search: searchState.data, page: 1 }
                ToastsStore.success("user has been added")
                getData(filterdata)
            }
        })
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between mb-3 searchstyle">
                <h3 className="usershedding">
                    {languagesModel.translate('all_users_text', language)}
                </h3>

                {/* <div className="d-flex"> */}
                <form className="search-form" onSubmit={search}>
                    <input type="text" id="form1" className="form-control" value={filters.search} placeholder={`${languagesModel.translate('search_text', language)}*`} onChange={e => searchChange(e.target.value)} />
                    <i className="fas fa-search" onClick={() => search()}></i>
                    {filters.search ? <i className="fa fa-times cross" onClick={clear}></i> : <></>}
                </form>
                {/* </div> */}
            </div>

            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <Link className="nav-link" to="/users">  {languagesModel.translate('my_users_text', language)}</Link>
                </li>
                <li className="nav-item">
                    <span className="nav-link active" href="#">{languagesModel.translate('all_users_text', language)}</span>
                </li>
            </ul>


            <div className="table-responsive">
                {data.length ? <table className="table mb-0">
                    <thead className="theadclss">
                        <tr className="tblclas">
                            <th scope="col" >{languagesModel.translate('ic_no_heading', language)}</th>
                            <th scope="col">{languagesModel.translate('phonenumber_heading', language)}</th>
                            <th scope="col">{languagesModel.translate('date_time_heading', language)}</th>
                            <th scope="col">{languagesModel.translate('name_text', language)}</th>
                            <th scope="col">{languagesModel.translate('email_text', language)}</th>
                            {user.role == 'Clinic Admin' && <th>{languagesModel.translate('counsellor_newtext', language)}</th>}

                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loaging && data && data.map((itm, i) => {
                            return <tr key={i}>
                                <td><Link to={`/userdetail/${itm.id}`} className="text-primary">{itm.ic_number}</Link></td>
                                <td className="text-nowrap">{itm.dialCode + itm.mobileNo}</td>
                                <td className="text-nowrap">{datepipeModel.date(itm.createdAt)} | {datepipeModel.time(itm.createdAt)}</td>
                                <td className="text-nowrap">{itm.fullName}</td>
                                <td className="text-nowrap">{itm.email}</td>
                                {user.role == 'Clinic Admin' && <td className="text-nowrap">
                                    {itm.counsellorId ? itm.counsellorId.fullName : ''}
                                </td>}
                                <td>
                                    <Link className="linkclass mx-2" title="View" to={'/userdetail/' + itm.id}>
                                        <i className="fa fa-eye"></i>
                                    </Link>
                                </td>
                                <td>
                                    {
                                        itm.myUser ? <button className="btn btn-primary">{languagesModel.translate('user_added', language)}</button> : <button className="btn btn-primary" onClick={e => addtoMyUser(itm)}>{languagesModel.translate('add_my_user', language)}</button>
                                    }
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table> : <></>}

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
        </Layout>
    );
};
export default AllUsers;
