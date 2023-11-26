import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import Pagination from "react-pagination-js";
import './style.scss';
import { Link } from 'react-router-dom';
import AddEditUser from './AddEditUser';


const Paymentplans = (p) => {
    let user = useSelector(state => state.user)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', role: 'user' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [form, setform] = useState({ role: 'user', firstName: '', lastName: '', email: '', ic_number: '', password: '', mobileNo: '', dialCode: '+60' })
    const [submitted, setSubmitted] = useState(false)
    const [emailErr, setEmailErr] = useState('')
    const [icErr, setIcErr] = useState('')

    useEffect(() => {
        if (user && user.loggedIn) {
            setFilter({ ...filters, search: searchState.data, clinicId: user.clinicId, counsellorId: user.id })
            getData({ search: searchState.data, page: 1, clinicId: user.clinicId, counsellorId: user.id })
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

    const modalClosed = () => {
        clear()
    }

    const openModal = (itm = {}) => {
        setSubmitted(false)
        setEmailErr('')
        setIcErr('')
        setform({ role: 'user', firstName: '', lastName: '', email: '', ic_number: '', password: '', mobileNo: '', dialCode: '+60', ...itm })
        if (itm.id) {
            // setform({ ...form, ...itm })
        }
        document.getElementById("openuserModal").click()
    }


    return (
        <Layout>

            <div className="d-flex justify-content-between mb-3 searchstyle">
                <h3 className="usershedding">
                    Payment Plans
                </h3>

                <div className="d-flex ">
                    <form className="form-outline d-flex mr-2" onSubmit={search}>
                        <input type="text" id="form1" className="form-control" placeholder='Search' onChange={e => searchChange(e.target.value)} />
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-search"></i>
                        </button>
                    </form>

                    <button className="btn btn-primary" onClick={() => openModal({ role: 'user' })}>Add Plans</button>
                </div>
            </div>
            <div className="table-responsive">
                {
                    data.length ? <table className="table mb-0">
                        <thead className="theadclss">
                            <tr className="tblclas">
                                <th scope="col" >IC/Passport Number</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Date & Time</th>
                                <th scope="col">Name</th>
                                <th scope="col">Role</th>
                                <th scope="col">Email</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loaging && data && data.map((itm, i) => {
                                return <tr key={i}>
                                    <td>{itm.ic_number}</td>
                                    <td>{itm.dialCode + itm.mobileNo}</td>
                                    <td>{datepipeModel.date(itm.createdAt)} | {datepipeModel.time(itm.createdAt)}</td>
                                    <td>{itm.fullName}</td>
                                    <td>{itm.role}</td>
                                    <td>{itm.email}</td>
                                    <td>
                                        <Link className="linkclass mx-2" title="View" to={'/profiledetail/' + itm.id}>
                                            <i className="fa fa-eye"></i>
                                        </Link> |
                                        <a className="linkclass mx-2" onClick={() => openModal(itm)} title="Edit"><i className="fa fa-pen"></i></a>
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


            <AddEditUser form={form} submitted={submitted} emailErr={emailErr} setIcErr={setIcErr} icErr={icErr} setEmailErr={setEmailErr} setSubmitted={setSubmitted} setform={setform} modalClosed={modalClosed} />
        </Layout>
    );
};
export default Paymentplans;
