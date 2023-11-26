import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import './style.scss';
import ApiClient from '../../methods/api/apiClient';
import Pagination from "react-pagination-js";
import './style.scss';
import AddEditModal from './AddEdit';
import loader from '../../methods/loader';
import { ToastsStore } from 'react-toasts';
import languagesModel from '../../models/languages.model';

const AppointmentType = (p) => {
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', addedBy: '', status: '' })
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)
    const [form, setForm] = useState()

    useEffect(() => {
        if (user && user.loggedIn) {
            setFilter({ ...filters, search: searchState.data, addedBy: user.id })
            getData({ search: searchState.data, page: 1, addedBy: user.id })
        }
    }, [searchState])

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        ApiClient.get('appointment/types', filter).then(res => {
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


    const openModal = (item = {}) => {
        let value = { appointmentType: '', time: '' }
        setForm({ ...value, ...item })
        document.getElementById("openaddEditModal").click()
    }

    const modalClosed = () => {
        clear()
    }

    const deleteItem = (id) => {
        if (window.confirm("Do you want to delete this")) {
            loader(true)
            ApiClient.delete('appointment/type', { id: id }).then(res => {
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
            {/* <div className="input-group mb-3">
                <form className="form-outline d-flex" onSubmit={search}>
                    <input type="text" id="form1" className="form-control" placeholder='Search' onChange={e => searchChange(e.target.value)} />
                    <button type="submit" className="btn btn-primary">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </div> */}
            <div className="d-flex justify-content-between mb-3 appointmentadd">
                <h3 className="usershedding mb-0">
                    {languagesModel.translate('appointment_type', language)}
                </h3>
                <div>
                    <button className="btn btn-primary" onClick={() => openModal()}>{languagesModel.translate('add_appointment_type', language)}</button>
                </div>

            </div>
            <div className="table-responsive">
                {
                    data.length ? <table className="table mb-0">
                        <thead className="theadclss">
                            <tr className="tblclas">
                                <th scope="col">{languagesModel.translate('appointment_type', language)}</th>
                                <th scope="col"></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loaging && data && data.map((itm, i) => {
                                return <tr key={i}>
                                    <td className="text-capitalize">{itm.appointmentType}</td>
                                    {/* <td>{slotTimeModel.name(itm.time)}</td> */}
                                    <td>
                                        <a className="linkclass mx-2"><i className="fa fa-pen" onClick={() => openModal(itm)} title="Edit"></i></a>|
                                        <a className="linkclass mx-2"><i className="fa fa-trash" onClick={() => deleteItem(itm.id)} title="Delete"></i></a>
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

            <AddEditModal form={form} setForm={setForm} modalClosed={modalClosed} />
        </Layout>

    );
};

export default AppointmentType;
