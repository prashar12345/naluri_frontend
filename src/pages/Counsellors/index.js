import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import Pagination from "react-pagination-js";
import './style.scss';
import AddEditUser from './AddEditUser';
import InviteModal from './inviteModal';
import { Link, useHistory } from 'react-router-dom';
import modalModel from '../../models/modal.model';
import languagesModel from '../../models/languages.model';

const Counsellors = (p) => {
    const history = useHistory()
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const searchState = useSelector((state) => state.search);
    const modalState = useSelector(state => state.modal)
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', role: 'Counsellor' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [form, setform] = useState({ role: 'user', firstName: '', lastName: '', email: '', ic_number: '', password: '', mobileNo: '', dialCode: '+91', nationality: '' })
    const [submitted, setSubmitted] = useState(false)
    const [inviteForm, setInviteForm] = useState({ email: '' })
    const [emailErr, setEmailErr] = useState('')
    const [icErr, setIcErr] = useState('')
    const [modal, setModal] = useState(false)

    useEffect(() => {
        if (user && user.loggedIn) {
            if (user.role == 'Clinic Admin') {
                setFilter({ ...filters, search: searchState.data, clinicId: user.id })
                getData({ search: searchState.data, page: 1, clinicId: user.id })
            } else {
                setFilter({ ...filters, search: searchState.data, clinicId: user.clinicId, csa: user.id })
                getData({ search: searchState.data, page: 1, clinicId: user.clinicId, csa: user.id })
            }

        }
    }, [searchState])

    useEffect(() => {
        if (modalState.value == 'hide') {
            setModal(false)
        }
    }, [modalState])

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

    const modalClosed = () => {
        clear()
    }


    const openModal = (itm = {}) => {
        setSubmitted(false)
        setEmailErr('')
        setIcErr('')

        if (itm) {
            // singleDetail(itm.id)
            let atypes = []
            if (itm.appointmentTypes) {
                atypes = itm.appointmentTypes.map(aitm => {
                    return aitm.appointmentType.id
                })
            }
            setform({
                role: 'user', firstName: '', lastName: '', email: '', ic_number: '', password: '', mobileNo: '', dialCode: '+60', nationality: '', ...itm, healthClinicId: itm.healthClinicId && itm.healthClinicId.id,
                appointmentTypes: atypes
            })
        }

        setModal(true)
        modalModel.open('userModal')
        // document.getElementById("openuserModal").click()
    }

    const invite = () => {
        document.getElementById("openInviteModal").click()
        setInviteForm({ email: '', role: 'Counsellor' })
        setSubmitted(false)
        setEmailErr('')
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

    const viewAvailability = (itm) => {
        history.push('/counsellors/availability?counsellorId=' + itm.id + '&name=' + itm.fullName)
    }


    //change status of Counsellors
    const chnageState = (item) => {
        let parm = {
            model: 'users',
            status: item.status == "active" ? 'deactive' : 'active',
            id: item.id
        }
        ApiClient.put("change/status", parm).then(res => {
            if (res.success) {
                getData()
            }
        })
    }


    return (
        <Layout>
            <div className="input-group mb-3">
                <form className="search-form" onSubmit={search}>
                    <input type="text" id="form1" className="form-control" value={filters.search} placeholder={`${languagesModel.translate('search_text', language)}*`} onChange={e => searchChange(e.target.value)} />
                    {filters.search ? <i class="fa fa-times cross" aria-hidden="true" onClick={() => clear()}></i> : <></>}
                    <i className="fas fa-search" onClick={() => search()}></i>
                </form>

            </div>
            <div className="d-flex justify-content-between mb-3 flex-wrap">
                <h3 className="usershedding mb-0">
                    {languagesModel.translate('all_counsellors', language)}
                </h3>

                <article className="d-flex">
                    {user && user.role == 'Clinic Admin' ? <button className="btn btn-primary mr-2" onClick={() => invite()}>
                        {languagesModel.translate('invite_counsellor_button', language)}
                    </button> : <></>}
                </article>


            </div>
            <div className="table-responsive">
                {
                    data.length ? <table className="table mb-0">
                        <thead className="theadclss">
                            <tr className="tblclas">
                                <th scope="col" > {languagesModel.translate('ic_no_heading', language)}</th>
                                <th scope="col">{languagesModel.translate('phonenumber_heading', language)}</th>
                                <th scope="col">{languagesModel.translate('date_time_heading', language)}</th>
                                <th scope="col">{languagesModel.translate('name_text', language)}</th>
                                <th scope="col">{languagesModel.translate('role_text', language)}</th>
                                <th scope="col">{languagesModel.translate('status_heading', language)}</th>
                                <th scope="col">{languagesModel.translate('email_text', language)}</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loaging && data && data.map((itm, i) => {
                                return <tr key={i}>
                                    <td><Link to={`/profiledetail/${itm.id}`} className="text-primary">{itm.ic_number}</Link></td>
                                    <td>{itm.mobileNo}</td>
                                    <td>{datepipeModel.date(itm.createdAt)} | {datepipeModel.time(itm.createdAt)}</td>
                                    <td>{itm.fullName}</td>
                                    <td>{itm.role}</td>
                                    <td>{itm.status === 'active' ? <span className="badge badge-primary cursor-pointer" onClick={(e) => { chnageState(itm) }}>Active</span> : <span className="badge badge-danger cursor-pointer" onClick={(e) => { chnageState(itm) }}>Inactive</span>}</td>
                                    <td>{itm.email}</td>
                                    <td>
                                        <Link className="linkclass mx-2" to={'/profiledetail/' + itm.id} title="View ">
                                            <i className="fa fa-eye" ></i>
                                        </Link>|
                                        <a className="linkclass mx-2" onClick={() => openModal(itm)} title="Edit Appointment Type">
                                            <i className="fa fa-pen" aria-hidden="true"></i>
                                        </a>

                                        {itm.role == 'Counsellor' ? <>
                                            {/* |<a className="linkclass mx-2" onClick={() => viewAppointment(itm)} title="View Consultation Sessions">
                                            <i className="fa fa-calendar"></i>
                                        </a> */}
                                            |<a className="linkclass mx-2" onClick={() => viewAvailability(itm)} title="View Availability">
                                                <i className="far fa-calendar"></i>
                                            </a>
                                        </> : <></>}

                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                        : <></>
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

            {modal ? <AddEditUser form={form} submitted={submitted} emailErr={emailErr} setIcErr={setIcErr} icErr={icErr} setEmailErr={setEmailErr} setSubmitted={setSubmitted} setform={setform} modalClosed={modalClosed} /> : <></>}
            <InviteModal form={inviteForm} setform={setInviteForm} submitted={submitted} emailErr={emailErr} setEmailErr={setEmailErr} setSubmitted={setSubmitted} modalClosed={modalClosed} />
        </Layout>
    )

}
export default Counsellors;
