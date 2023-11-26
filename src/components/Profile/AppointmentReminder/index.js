import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../../methods/api/apiClient';
import Pagination from "react-pagination-js";
import './style.scss';
import { ToastsStore } from 'react-toasts';
import loader from '../../../methods/loader';
import { useHistory } from 'react-router-dom';
import ViewModal from './ViewModal';
import AddEdit from './AddEdit';
import languagesModel from '../../../models/languages.model';



const AppointmentReminder = (p) => {
    const history = useHistory()
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, hours: '' })
    const [data, setData] = useState([])
    const [form, setForm] = useState()
    const [types, setTypes] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)



    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        ApiClient.get('reminder/times', filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
    }



    const openModal = (itm = '') => {

        setForm({ hours: '', })
        if (itm) {
            setForm({ ...form, ...itm, hours: itm.hours })
        }
        document.getElementById("openEditModal").click()
    }

    const clear = () => {
        setFilter({ ...filters, search: '', page: 1 })
        getData({ search: '', page: 1 })
    }

    const deleteItem = (id) => {
        if (window.confirm("Do you want to delete this")) {
            loader(true)
            ApiClient.delete('reminder/time', { model: 'hours', status: 'id', id: id }).then(res => {
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

    const viewModal = (itm) => {
        setForm(itm)
        document.getElementById("openViewModal").click()

    }

    const modalClosed = () => {
        setFilter({ ...filters, page: 1 })
        getData()
    }

    const retake = (type) => {
        history.push('/assessment?type=' + type)
    }

    useEffect(() => {
        if (user && user.loggedIn) {
            setFilter({ ...filters, search: searchState.data, clinicId: user.id })
            getData({ search: searchState.data, page: 1, clinicId: user.id })
            // getTime()
        }
    }, [searchState])


    return (
        <>
            <div className="d-flex justify-content-between mb-3 flex-wrap mt-3">
                <h3 className="usershedding mb-0">
                    {languagesModel.translate('appointment_reminder', language)}
                </h3>

                <article className="d-flex">
                    <div className="dropdown addDropdown mr-2">
                        <button className="btn btn-primary" onClick={() => openModal()}> {languagesModel.translate('add_appointment_reminder', language)}</button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {types && types.map(itm => {
                                return <a className="dropdown-item" key={itm.id} onClick={() => retake(itm.id)}>{itm.id
                                }</a>
                            })}

                        </div>
                    </div>
                </article>
            </div>
            <div className="table-responsive">
                <table className="table mb-0">
                    <thead className="theadclss">
                        <tr className="tblclas">
                            {/* <th scope="col">Id</th> */}
                            <th scope="col">Hours</th>
                            <th></th>
                        </tr>
                    </thead >
                    <tbody className="datacls">
                        {!loaging && data && data.map((itm, i) => {
                            return <tr key={i} >
                                <td>{itm.hours}</td>
                                <td>
                                    <a className="linkclass mx-2" onClick={() => viewModal(itm)} title="View"><i className="fa fa-eye"></i></a>|
                                    <a className="linkclass mx-2" onClick={() => openModal(itm)}><i title="Edit" className="fas fa-pen"></i></a>
                                    |<a className="linkclass mx-2" onClick={() => deleteItem(itm.id)}><i title="Delete" className="fa fa-trash" aria-hidden="true"></i></a>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>

                {loaging ? <div className="text-center py-4">
                    <img src="./assets/img/loader.gif" className="pageLoader" />
                </div> : <></>}
            </div>

            {!loaging && total == 0 ? <div className="py-3 text-center">No Data</div> : <></>}

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
            <ViewModal form={form} />
            <AddEdit form={form} setForm={setForm} modalClosed={modalClosed} />
        </>
    );
};
export default AppointmentReminder;
