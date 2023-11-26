import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import datepipeModel from '../../models/datepipemodel';
import Pagination from "react-pagination-js";
import './style.scss';
import loader from '../../methods/loader';

import { useHistory } from 'react-router-dom';
import ViewAssessment from './ViewAssessment';
import ApiKey from '../../methods/ApiKey';
import languagesModel from '../../models/languages.model';
import PageLayout from '../../components/global/PageLayout';

const Assessments = (p) => {
    const history = useHistory()
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const searchState = useSelector((state) => state.search);
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', role: '' })
    const [data, setData] = useState([])
    const [form, setForm] = useState()
    const [types, setTypes] = useState([])
    const [total, setTotal] = useState(0)
    const [loaging, setLoader] = useState(true)

    useEffect(() => {
        if (user && user.loggedIn) {
            setFilter({ ...filters, search: searchState.data, addedBy: user.id })
            getData({ search: searchState.data, page: 1, addedBy: user.id })
            getType()
        }
    }, [searchState])

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        ApiClient.get('assessments', filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
    }

    const getType = () => {
        let search = ''
        // loader(true)
        ApiClient.get('category/types', { page: 1, count: 100, search }).then(res => {
            if (res.success) {
                setTypes(res.data)
            }
            // loader(false)
        })
    }

    const pageChange = (e) => {
        setFilter({ ...filters, page: e })
        getData({ page: e })
    }

    const viewModal = (itm) => {
        loader(true)
        ApiClient.get('assessment', { id: itm.id }).then(res => {
            if (res.success) {
                setForm(res.data)
                document.getElementById("openviewAsseessmentModal").click()
            }
            loader(false)
        })
    }

    const retake = (type) => {
        history.push('/assessment?type=' + type)
    }

    const download = (id) => {
        loader(true)
        ApiClient.get('assessment/result', { id: id, lang: language.code }).then(res => {
            if (res.success) {
                let url = ApiKey.api + res.path
                setTimeout(() => {
                    window.open(url, '_blank');
                }, 1500)
            }
            loader(false)
        })
    }

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    return (
        <PageLayout>
            {/* <Layout> */}

            {/* <div className="input-group mb-3">
                <form className="form-outline d-flex" onSubmit={search}>
                    <input type="text" id="form1" className="form-control" placeholder='Search' onChange={e => searchChange(e.target.value)} />
                    <button type="submit" className="btn btn-primary">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </div> */}
            <div className='container'>

                <div className="d-flex justify-content-between mb-3 flex-wrap">
                    <h3 className="usershedding mb-0">
                        {languagesModel.translate('assessments_text', language)}
                    </h3>
                    <article className="d-flex">
                        <div className="dropdown addDropdown mr-2">
                            <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {languagesModel.translate('retake_assessment', language)}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {types && types.map(itm => {
                                    return <a className="dropdown-item" key={itm.id} onClick={() => retake(itm.name)}>{languagesModel.translate2(itm.translate, language.code, itm.name)}</a>
                                })}

                            </div>
                        </div>

                    </article>
                </div>

                <div className="table-responsive">
                    {
                        data.length ? <table className="table mb-0">
                            <thead className="theadclss">
                                <tr className="tblclas">
                                    <th scope="col">{languagesModel.translate('result_text', language)}</th>
                                    {/* <th scope="col">{languagesModel.translate('type_text', language)}</th> */}
                                    <th scope="col">{languagesModel.translate('date_time_heading', language)}</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead >
                            <tbody className="datacls">
                                {!loaging && data && data.map((itm, i) => {
                                    return <tr key={i} >
                                        <td>{itm.assessmentResults && itm.assessmentResults.map(ritm => {
                                            return translate2(ritm.result_translate, ritm.result)
                                        })}</td>
                                        {/* <td>{languagesModel.translate2(itm.type.translate, language.code, itm.type.name)}</td> */}
                                        <td>{datepipeModel.date(itm.createdAt)} | {datepipeModel.time(itm.createdAt)}</td>
                                        <td>
                                            <a className="linkclass mx-2" onClick={() => viewModal(itm)} title="View"><i className="fa fa-eye"></i></a>|
                                            <a className="linkclass mx-2" onClick={() => download(itm.id)} title="Download"><i className="fa fa-download"></i></a>
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

                {!loaging && total == 0 ? <div className="py-3 text-center"><img src="./assets/img/Nodata.jpg" alt="No Data img" className="noImg" /></div> : <></>}

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
            </div>

            <ViewAssessment form={form} />
            {/* </Layout> */}
        </PageLayout>
    );
};
export default Assessments;
