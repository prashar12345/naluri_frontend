import React, { useEffect, useState } from 'react'
import ApiClient from '../../methods/api/apiClient'
import { useSelector } from 'react-redux';
import Layout from '../../components/global/layout';
import Pagination from 'react-pagination-js';
import datepipeModel from '../../models/datepipemodel';
import { Link } from 'react-router-dom';
import languagesModel from '../../models/languages.model';

const Audittrail = () => {
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [auditdata, setauditData] = useState()
    const [total, setTotal] = useState(0)
    const [filters, setFilter] = useState({ page: 1, count: 10, search: '', role: '' })
    const [loading, setLoader] = useState(true)
    useEffect(() => {
        getaudittrailData()
    }, [])
    //API call
    function getaudittrailData(p = {}) {
        setLoader(true)
        let url = 'audit/trails'
        let counsellorId = ''
        let clinicId = ''
        if (user.role == 'Counsellor') counsellorId = user.id
        if (user.role == 'Clinic Admin') clinicId = user.id
        let param = {
            clinicId: clinicId,
            counsellorId: counsellorId
        }
        ApiClient.get(url, param).then(res => {
            setauditData(res.data)
            setTotal(res.total)
        })
        setLoader(false)
    }
    const pageChange = (e) => {
        setFilter({ ...filters, page: e })
        getaudittrailData({ page: e })
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

            <div className="d-flex justify-content-between mb-3 flex-wrap">
                <h3 className="usershedding mb-0">
                    {languagesModel.translate('audit_trail_text', language)}
                </h3>



            </div>
            {auditdata && auditdata.length ? <div className="table-responsive">
                <table className="table mb-0">
                    <thead className="theadclss">
                        <tr className="tblclas">
                            {user.role != 'Counsellor' ? <th scope="col">{languagesModel.translate('counsellor_newtext', language)}</th> : <></>}
                            <th scope="col">{languagesModel.translate('updated_at', language)}</th>
                            <th scope="col">{languagesModel.translate('updated_text', language)}</th>
                            {/* data[0].counsellorId.fullName */}
                        </tr>
                    </thead >
                    <tbody className="datacls">
                        {!loading && auditdata && auditdata.map((itm, i) => {
                            return <tr key={i} >
                                {user.role != 'Counsellor' ? <td><Link to={`/profiledetail/${itm.counsellorId.id}`} className="text-primary">{itm.counsellorId.fullName}</Link></td> : <></>}
                                <td>{datepipeModel.datetime(itm.updatedAt)}</td>
                                <td>{itm.updatedText}</td>
                            </tr>
                        })}
                    </tbody>
                </table>

                {loading ? <div className="text-center py-4">
                    <img src="./assets/img/loader.gif" className="pageLoader" />
                </div> : <></>}
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
                        activePage={filters.page}
                        itemsCountPerPage={filters.count}
                        totalItemsCount={total}
                        pageRangeDisplayed={5}
                        onChange={pageChange}
                    />
                </div> : <></>
            }

            {/* <ViewAssessment form={form} /> */}
        </Layout>
    )
}

export default Audittrail
