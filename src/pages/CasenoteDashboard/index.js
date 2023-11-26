import React, { useEffect, useState } from 'react'
import ApiClient from '../../methods/api/apiClient'
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import Pagination from 'react-pagination-js';
import datepipeModel from '../../models/datepipemodel';
import { Link } from 'react-router-dom';
import ViewCasenoteModal from '../Profiledetail/ViewCasenoteModal';
import languagesModel from '../../models/languages.model';
import modalModel from '../../models/modal.model';
import caseTableModel from '../../models/caseTable.model';
import './style.scss'
import casenoteModel from '../../models/casenote.model';
import ApiKey from '../../methods/ApiKey';

const CasenoteDashboard = () => {
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [data, setData] = useState()
    const [cols, setCols] = useState([])
    const [viewData, setViewData] = useState()
    const [total, setTotal] = useState(0)
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', role: '' })
    const [loading, setLoader] = useState(true)
    const [tablecols, setTablecols] = useState([])

    useEffect(() => {
        getFields()
        getaudittrailData()
    }, [])

    //API call
    const getaudittrailData = (p = {}) => {
        let url = 'case/notes'
        let counsellorId = ''
        let clinicId = ''
        if (user.role == 'Counsellor') counsellorId = user.id
        if (user.role == 'Clinic Admin') clinicId = user.id
        let param = {
            clinicId: clinicId,
            counsellorId: counsellorId,
            ...filters,
            ...p
        }

        setLoader(true)
        ApiClient.get(url, param).then(res => {
            setData(res.data)
            setTotal(res.total)
            setLoader(false)
        })

    }

    const pageChange = (e) => {
        setFilter({ ...filters, page: e })
        getaudittrailData({ page: e })
    }

    const view = (item = '') => {
        setViewData({ ...item, page: 'profiledetail' })
        modalModel.open("viewcasenoteModal")
    }

    const modalClosed = () => {

    }

    const removeCol = (index) => {
        let exp = cols
        exp.splice(index, 1);
        setCols([...exp])
    }

    const uTableCols = () => {
        let exp = []
        if (cols) exp = cols
        let value = []
        tablecols.map(itm => {
            if (itm != exp.find(it => it.name == itm.name)) {
                value.push(itm)
            }
        })
        return value
    }

    const addCol = (itm) => {
        setCols([...cols, itm])
    }

    const search = (e) => {
        if (e) e.preventDefault()
        setFilter({ ...filters, page: 1 })
        getaudittrailData({ page: 1 })
    }

    const clear = () => {
        let filter = {
            ...filters,
            page: 1,
            count: 10,
            search: '',
            role: '',
            consultation_type: '',
            caseType: '',
            severityLevel: '',
            clientStatus: ''
        }
        setFilter(filter)
        getaudittrailData(filter)
    }

    const searchChange = (e) => {
        setFilter({ ...filters, search: e })
        if (!e) {
            clear()
        }
    }

    const filter = (p = {}) => {
        let filter = { ...filters, search: '', page: 1, ...p }
        setFilter(filter)
        getaudittrailData(filter)
    }

    const [downloadLoader, setDownloadLoader] = useState(false)
    const download = () => {
        setDownloadLoader(true)
        ApiClient.get('case/notes/csv', { ...filters }).then(res => {
            let url = ApiKey.api + res.path
            setTimeout(() => {
                window.open(url, '_blank');
            }, 1500)
            setDownloadLoader(false)
        })
    }


    const getFields = () => {
        ApiClient.get('custom/fields', { page: 1, count: 100 }).then(res => {
            if (res.success) {

                let cols = caseTableModel.cols
                if (res.data.length) {
                    cols = [...cols, ...res.data.map(citm => {
                        return {
                            name: citm.label,
                            html: (itm) => {
                                return <>{itm.custom && itm.custom[citm.id] ? itm.custom[citm.id] : <></>}</>
                            }
                        }
                    })]
                }
                // console.log("cols", cols)
                setTablecols(cols)
            }
        })
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between mb-3 flex-wrap">
                <h3 className="usershedding mb-0">
                    Case Note
                </h3>
            </div>

            <div className='mb-3 caseFilters'>
                <form className="search-form" onSubmit={search}>
                    <input type="text" id="form1" className="form-control" value={filters.search} placeholder={`${languagesModel.translate('search_text', language)}`} onChange={e => searchChange(e.target.value)} />
                    <i className="fas fa-search" onClick={() => search()}></i>
                    {filters.search ? <i className="fa fa-times cross" onClick={clear}></i> : <></>}
                </form>

                <select className="form-control" value={filters.consultation_type} onChange={e => { filter({ consultation_type: e.target.value }) }} required>
                    <option value="">Mode of counselling session</option>
                    <option value="Whatsapp">{languagesModel.translate('whatsapp_consultation', language)}</option>
                    <option value="In-person">{languagesModel.translate('in-person_consultation', language)}</option>
                    <option value="Video">{languagesModel.translate('video_consultation', language)}</option>
                </select>

                <select className="form-control" value={filters.caseType} onChange={e => { filter({ caseType: e.target.value }) }}>
                    <option value="">Type of case</option>
                    <option value="clinical">{languagesModel.translate('clinical_text', language)}</option>
                    <option value="non-clinical">{languagesModel.translate('non-clinical', language)}</option>
                </select>

                <select className="form-control" value={filters.severityLevel} onChange={e => { filter({ severityLevel: e.target.value }) }}>
                    <option value="">Level of severity</option>
                    <option value="high">{languagesModel.translate('high_text', language)}</option>
                    <option value="medium">{languagesModel.translate('medium_text', language)}</option>
                    <option value="low">{languagesModel.translate('low_text', language)}</option>
                </select>

                <select className="form-control" value={filters.clientStatus} onChange={e => { filter({ clientStatus: e.target.value }) }}>
                    <option value="">{languagesModel.translate('client_status', language)}</option>
                    {casenoteModel.clientStatus.map(itm => {
                        return <option value={itm.id} key={itm.id}>{itm.name}</option>
                    })}
                </select>

                <button className='btn btn-secondary' onClick={clear}>Clear</button>

                {uTableCols().length && user.role == 'Counsellor' ? <div className="dropdown addDropdown">
                    <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuColumns" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {languagesModel.translate('add_columns', language)}
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuColumns">
                        {uTableCols().map(itm => {
                            return <a className="dropdown-item text-nowrap" onClick={() => addCol(itm)} key={itm.name}>{itm.name}</a>
                        })}
                    </div>
                </div> : <></>}
                <button className='btn btn-primary' disabled={downloadLoader} onClick={download}>{languagesModel.translate('download_result_button', language)} {downloadLoader ? <i className='fa fa-circle-notch fa-spin ml-1'></i> : <></>}</button>


            </div>
            {data && data.length ? <div className="table-responsive mb-3">
                <table className="table mb-0">
                    <thead className="theadclss">
                        <tr className="tblclas">
                            {user.role == 'Counsellor' ? <th>Case Note</th> : <></>}
                            <th>{languagesModel.translate('users_text', language)}</th>
                            <th>{languagesModel.translate('added_on', language)}</th>
                            <th>{languagesModel.translate('updated_by', language)}</th>
                            <th>{languagesModel.translate('appointment_type', language)}</th>
                            <th>{languagesModel.translate('Mode_counselling_session', language)}</th>
                            {cols && cols.map((itm, i) => {
                                return <th key={i} className="nowrap">{itm.name}
                                    <i className="fa fa-times cursor-pointer ml-2 text-danger" onClick={() => removeCol(i)}></i>
                                </th>
                            })}
                        </tr>
                    </thead >
                    <tbody className="datacls mb-3">
                        {!loading && data && data.map((itm, i) => {
                            return <tr key={i} >
                                {user.role == 'Counsellor' ? <td>
                                    {user.role === 'Counsellor' ? <a onClick={() => view(itm)} className="text-primary View_Case ">{languagesModel.translate('view_case_note', language)}</a> : <></>}
                                </td> : <></>}

                                <td><Link to={`/profiledetail/${itm.userId && itm.userId.id}`} className="text-primary">{itm.userId && itm.userId.fullName}</Link></td>
                                <td>{itm.appointmentId ? <>{datepipeModel.date(itm.appointmentId.start)} | {datepipeModel.isotime(itm.appointmentId.start)} - {datepipeModel.isotime(itm.appointmentId.end)}</> : itm.start ? <>
                                    {datepipeModel.date(itm.start)} | {datepipeModel.isotime(itm.start)} - {datepipeModel.isotime(itm.end)}
                                </> : <></>}</td>
                                <td><Link to={`/profiledetail/${itm.addedBy && itm.addedBy.id}`} className="text-primary">{itm.addedBy && itm.addedBy.fullName}</Link></td>
                                <td>{itm.appointment_type ? itm.appointment_type.appointmentType : '--'}</td>
                                <td>{itm.appointmentId ? itm.appointmentId.consultation_type : itm.consultation_type}</td>
                                {cols && cols.map((citm, i) => {
                                    return <td key={i}>{citm.html(itm)}</td>
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>


            </div> : <></>}

            {loading ? <div className="text-center py-4">
                <img src="/assets/img/loader.gif" className="pageLoader" />
            </div> : <></>}
            {!loading && total == 0 ? <div className="py-3 text-center"><img src="/assets/img/Nodata.jpg" alt="No Data img" className="no-data-img" /></div> : <></>}

            {
                !loading && total > filters.count ? <div>
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


            <ViewCasenoteModal form={viewData} modalClosed={modalClosed} />
        </Layout>
    )
}

export default CasenoteDashboard
