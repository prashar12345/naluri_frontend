import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import Pagination from "react-pagination-js";
import './style.scss';
import { Link } from 'react-router-dom';
import AddEditUser from './AddEditUser';
import modalModel from '../../models/modal.model';
import ChangeCounsellor from './ChangeCounsellor';
import languagesModel from '../../models/languages.model';


const Users = (p) => {
    const language = useSelector(state => state.language.data)
    let user = useSelector(state => state.user)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', role: 'user' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [form, setform] = useState({ role: 'user', firstName: '', lastName: '', email: '', ic_number: '', password: '', mobileNo: '', dialCode: '+60', supportLetter: '' })
    const [submitted, setSubmitted] = useState(false)
    const [emailErr, setEmailErr] = useState('')
    const [icErr, setIcErr] = useState('')

    useEffect(() => {
        if (user && user.loggedIn) {
            let filterdata = { search: searchState.data, page: 1, counsellorId: user.id }
            if (user.role == 'Clinic Admin') {
                filterdata = { search: searchState.data, page: 1, clinicId: user.id }
            }
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

    const modalClosed = () => {
        clear()
    }

    const openModal = (itm = {}) => {
        setSubmitted(false)
        setEmailErr('')
        setIcErr('')
        let counsellorId = ''
        if (itm.counsellorId) counsellorId = itm.counsellorId.id
        setform({ role: 'user', firstName: '', lastName: '', email: '', ic_number: '', password: '', mobileNo: '', dialCode: '+60', supportLetter: '', ...itm, counsellorId })
        if (itm.id) {
        }
        document.getElementById("openuserModal").click()
    }

    const changeCounsellor = (itm = {}) => {
        let counsellorId = ''
        if (itm.counsellorId) counsellorId = itm.counsellorId.id
        let data = { role: 'user', firstName: '', lastName: '', email: '', ic_number: '', password: '', mobileNo: '', dialCode: '+60', ...itm, counsellorId }
        setform(data)
        modalModel.open("changeCounsellorModal")
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between mb-3 searchstyle">
                <h3 className="usershedding">
                    {languagesModel.translate('all_users_text', language)}
                </h3>

                <div className="d-flex">
                    <form className="search-form" onSubmit={search}>
                        <input type="text" id="form1" className="form-control" value={filters.search} placeholder={`${languagesModel.translate('search_text', language)}*`} onChange={e => searchChange(e.target.value)} />
                        {filters.search ? <i className="fa fa-times cross" onClick={clear} aria-hidden="true" ></i> : <></>}
                        <i className="fas fa-search" onClick={() => search()}></i>
                    </form>
                    <button className="btn btn-primary ml-2" onClick={() => openModal({ role: 'user' })}>{languagesModel.translate('add_user', language)}</button>
                </div>
            </div>

            {user.role == 'Counsellor' ? <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <a className="nav-link active">{languagesModel.translate('my_users_text', language)}</a>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/users/all">{languagesModel.translate('all_users_text', language)}</Link>
                </li>
            </ul> : <></>}


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
                        </tr>
                    </thead>
                    <tbody>
                        {!loaging && data && data.map((itm, i) => {
                            return <tr key={i}>
                                <td><Link to={`/profiledetail/${itm.id}`} className="text-primary">{itm.ic_number}</Link></td>
                                <td>{itm.dialCode + itm.mobileNo}</td>
                                <td className="text-nowrap">{datepipeModel.date(itm.createdAt)} | {datepipeModel.time(itm.createdAt)}</td>
                                <td className="text-nowrap">{itm.fullName}</td>
                                <td className="text-nowrap">{itm.email}</td>
                                {user.role == 'Clinic Admin' && <td className="text-nowrap">
                                    {itm.counsellorId.fullName}
                                </td>}
                                <td className="text-nowrap">
                                    <Link className="linkclass mx-2" title="View" to={'/profiledetail/' + itm.id}>
                                        <i className="fa fa-eye"></i>
                                    </Link>
                                    |<a className="linkclass mx-2" onClick={() => openModal(itm)} title="Edit"><i className="fa fa-pen"></i></a>
                                    {user.role == 'Clinic Admin' && <> |
                                        <a className="linkclass mx-2" onClick={() => changeCounsellor(itm)} title="Change Counsellor"><i className="fa fa-user"></i></a></>}

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


            <AddEditUser form={form} submitted={submitted} emailErr={emailErr} setIcErr={setIcErr} icErr={icErr} setEmailErr={setEmailErr} setSubmitted={setSubmitted} setform={setform} modalClosed={modalClosed} />
            {modalModel.modal('changeCounsellorModal') ? <ChangeCounsellor form={form} setform={setform} modalClosed={modalClosed} /> : <></>}
        </Layout>
    );
};
export default Users;
