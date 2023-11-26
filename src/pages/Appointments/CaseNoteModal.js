import React, { useEffect, useState } from 'react';
import Pagination from 'react-pagination-js';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ToastsStore } from 'react-toasts';
import ApiClient from '../../methods/api/apiClient';
import ApiKey from '../../methods/ApiKey';
import loader from '../../methods/loader';
import datepipeModel from '../../models/datepipemodel';
import modalModel from '../../models/modal.model';
import languagesModel from '../../models/languages.model';
import preferredTimeModel from '../../models/preferredTime.model';
import CustomField from '../../components/fields/CustomField';
import casenoteModel from '../../models/casenote.model'

const CaseNoteModal = ({ form, setform, modalClosed }) => {
    const history = useHistory()
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [filters, setFlilter] = useState({ appointmentId: '', userId: '', counsellorId: '', count: 7, page: 1 })
    const [dfilters, setDFlilter] = useState({ appointmentId: '', userId: '', counsellorId: '', count: 7, page: 1 })
    const [casenotes, setCasenotes] = useState([])
    const [loading, setLoader] = useState(false)
    const [total, setToal] = useState(0)
    const [id, setId] = useState()
    const [docLoader, setDocLoader] = useState(false)
    const [tab, settab] = useState('list')
    const [draftext, setDraft] = useState(false)
    const [appointmentTypes, setAppointmentTypes] = useState([])
    const [appointment, setAppointment] = useState()
    const [fields, setFields] = useState([])
    //form submmit handle
    const formSubmit = (e) => {
        e.preventDefault()

        // if (form.file && form.file.length) {

        // } else {
        //     ToastsStore.error("Please Upload Docs")
        //     return
        // }

        postCaseNote({ toast: true, isDraft: false })
    }

    const postCaseNote = (pp = {}) => {
        let p = { isDraft: true, ...pp }
        if (form.page == 'list') {
            return
        }
        let clinicId = ''
        if (user.role == 'Counsellor') clinicId = user.clinicId
        if (user.role == 'Clinic Admin') clinicId = user.id
        let method = 'post'
        let url = 'draft/note'
        let value = {
            appointmentDate: form.appointmentDate,
            start: form.start,
            end: form.end,
            userId: form.userId,
            counsellorId: form.counsellorId,
            appointmentId: form.appointmentId,
            note: form.note,
            hoursOfConsultations: form.hoursOfConsultations,
            caseType: form.caseType,
            severityLevel: form.severityLevel,
            clientStatus: form.clientStatus,
            supportLetter: form.supportLetter,
            file: form.file,
            clinicId,
            consultation_type: form.consultation_type,
            randomId: form.randomId,
            custom: form.custom,
            appointment_type: form.appointment_type,
            ...p
        }


        if (value.start && value.appointmentDate && value.appointment_type) {
            let time = appointmentTypes.find(itm => itm.id == value.appointment_type).time
            let start = new Date(`${value.appointmentDate} ${value.start}`)
            let end = new Date(`${value.appointmentDate} ${value.start}`)
            end = end.setMinutes(end.getMinutes() + Number(time))
            end = new Date(end)

            // value.end = end
            value.start = datepipeModel.datetoIsotime(start)
            value.end = datepipeModel.datetoIsotime(end)
            console.log("start", start)
            console.log("end", end)
            console.log("time", time)
            console.log("value.start", value.start)
            console.log("value.end", value.end)
        } else {
            delete value.start
            delete value.end
            delete value.appointmentDate
        }


        if (p.toast) {
            method = 'put'
            value.id = id
        }

        if (p.toast) loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                setDraft(true)
                setTimeout(() => {
                    setDraft(false)
                }, 1500)
                setId(res.id)
                if (p.toast) {
                    ToastsStore.success(res.message)
                    modalClosed('casenote')
                    modalModel.close('caseNoteModal')
                }
            }
            loader(false)
        })
    }

    const getFields = () => {
        ApiClient.get('custom/fields', { page: 1, count: 100 }).then(res => {
            if (res.success) {
                setFields(res.data)
            }
        })
    }


    //upload doc 
    const uploaddocs = (e) => {
        setform({ ...form, baseImg: e.target.value })
        let files = e.target.files
        let resurl = []
        if (form.file) resurl = form.file
        for (let i = 0; i < files.length; i++) {
            uploadDoc(files.item(i), resurl)
        }
    }

    const uploadDoc = (file, resurl) => {
        setDocLoader(true)
        ApiClient.postFormData('upload/doc', { file: file }).then(res => {
            if (res.success) {
                let image = res.responseData[0].docName
                setTimeout(() => {
                    resurl.push(image)
                    setform({ ...form, file: resurl, baseImg: '' })
                    postCaseNote({ file: resurl, baseImg: '' })
                }, 10 * resurl.length);
            } else {
                setform({ ...form, baseImg: '' })
            }
            setDocLoader(false)
            // loader(false)
        })
    }

    const removeDoc = (index) => {
        let file = form.file
        file = file.filter((itm, i) => i != index)
        setform({ ...form, file })
    }

    const add = () => {
        settab('add')
        setform({ ...form, page: 'add' })
    }

    const view = (itm) => {
        modalModel.close('caseNoteModal')
        modalClosed('view', itm)
    }

    const edit = (itm) => {
        let value = {
            id: itm.id,
            appointmentDate: datepipeModel.datetostring(itm.start),
            start: itm.start,
            end: itm.end,
            userId: itm.userId.id,
            counsellorId: itm.counsellorId.id,
            appointmentId: itm.appointmentId,
            note: itm.note,
            caseType: itm.caseType,
            severityLevel: itm.severityLevel,
            clientStatus: itm.clientStatus,
            supportLetter: itm.supportLetter,
            consultation_type: itm.consultation_type,
            file: itm.file,
            randomId: itm.randomId
        }
        setform(value)
    }

    const route = (id) => {
        modalModel.close('caseNoteModal')
        modalModel.close('viewcasenoteModal')
        let url = '/profiledetail/'
        if (form.isHideAdd) url = '/userdetail/'
        history.push(url + id)
    }


    const getCaseNotes = (itm, t = tab) => {
        let filter = { ...filters, ...itm }
        let url = 'case/notes'
        if (t == 'draft') url = 'draft/note'
        setLoader(true)
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                let rdata = res.data
                setCasenotes(rdata)
                setToal(res.total)
                setLoader(false)
            }
        })
    }

    const pageChange = (e) => {
        setFlilter({ ...filters, page: e })
        getCaseNotes({ page: e })
    }

    const tabChange = (p) => {
        settab(p)
        setform({ ...form, page: 'list' })
        getCaseNotes({ page: 1 }, p)
    }

    const getappointmentTypes = () => {
        // loader(true)
        ApiClient.get('appointment/types', { page: 1, count: 100 }).then(res => {
            if (res.success) {
                setAppointmentTypes(res.data)
            }
            loader(false)
        })
    }

    const getAppointmentDetail = (id) => {
        ApiClient.get('appointment', { id: id }).then(res => {
            if (res.success) {
                setAppointment(res.data)
                setform({ ...form, appointment_type: res.data.appointment_type })
            }
        })
    }

    useEffect(() => {
        getFields()
        if (form.appointmentId) getAppointmentDetail(form.appointmentId)
    }, [form.appointmentId])

    useEffect(() => {
        let filter = { appointmentId: form.appointmentId, userId: form.userId, counsellorId: form.counsellorId, page: 1 }
        setFlilter({ ...filters, ...filter })
        setDFlilter({ ...dfilters, ...filter })
        getCaseNotes(filter)
        getappointmentTypes()
        if (form && form.page == 'list') {
            settab('list')
        } else {
            settab('add')
        }
    }, [form.appointmentId, form.userId, form.counsellorId, form.randomId])

    return <>
        <div className="modal fade" id="caseNoteModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-lg">
                <div className="modal-content ">
                    <div className="modal-header">

                        <h5 className="modal-title">{languagesModel.translate('case_note_text', language)}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" title='Close'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form onSubmit={formSubmit}>
                        <div className='modal-body'>
                            <div className="form-row">
                                <div className="col-md-12 mb-3">
                                    <ul className="nav nav-tabs">
                                        {form && form.page === 'list' ? <>
                                            <li className="nav-item">
                                                <a className={`nav-link ${tab == 'list' ? 'active' : ''}`} onClick={e => tabChange('list')}>{languagesModel.translate('case_notes', language)}</a>
                                            </li>
                                        </> : <>
                                            <li className="nav-item">
                                                <a className={`nav-link ${tab == 'add' ? 'active' : ''}`} onClick={e => add()}>{languagesModel.translate('add_case_note', language)}</a>
                                            </li>
                                        </>}

                                        {!form.isHideAdd && user.role == 'Counsellor' ? <li className="nav-item">
                                            <a className={`nav-link ${tab == 'draft' ? 'active' : ''}`} onClick={e => tabChange('draft')}>{languagesModel.translate('in_draft', language)}</a>
                                        </li> : <></>}
                                    </ul>

                                    {!loading && casenotes.length && form.page === 'list' ? <div className="table-responsive">
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>{languagesModel.translate('date_time_heading', language)}</th>
                                                    <th>{languagesModel.translate('users_text', language)}</th>
                                                    <th>{languagesModel.translate('added_by_text', language)}</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {casenotes && casenotes.map(itm => {
                                                    return <tr key={itm.id}>
                                                        <td>{datepipeModel.date(itm.createdAt)} | {datepipeModel.time(itm.createdAt)}</td>
                                                        <td><a onClick={e => route(itm.userId.id)} className="text-primary">{itm.userId && itm.userId.fullName}</a></td>
                                                        <td><a onClick={e => route(itm.addedBy.id)} className="text-primary">{itm.addedBy && itm.addedBy.fullName}</a></td>
                                                        <td>
                                                            {tab == 'draft' ? <a className="text-primary" onClick={e => edit(itm)}>{languagesModel.translate('edit_text', language)}</a> : <a className="text-primary" onClick={e => view(itm)}>{languagesModel.translate('view_case_note', language)}</a>}

                                                        </td>
                                                    </tr>
                                                })}

                                            </tbody>
                                        </table>
                                    </div> : <></>
                                    }

                                    {loading && form.page === 'list' ? <div className="text-center py-4">
                                        <img src="/assets/img/loader.gif" className="pageLoader" />
                                    </div> : <></>}
                                    {!loading && total == 0 && form.page === 'list' ? <div className="py-3 text-center"><img src="/assets/img/Nodata.jpg" alt="No Data img" className="no-data-img" /></div> : <></>}

                                    {
                                        !loading && total > filters.count && form.page === 'list' ? <div>
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


                                {form && form.page != 'list' ? <>

                                    {!form.appointmentId ? <>
                                        <div className="col-md-6 mb-3">
                                            <label className="required">Appointment Date</label>
                                            <input type="date" className='form-control' value={form.appointmentDate} onChange={e => { setform({ ...form, appointmentDate: e.target.value, start: '' }); postCaseNote({ appointmentDate: e.target.value, start: '' }) }} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="required">Appointment Time</label>
                                            <select className='form-control' value={form.start} onChange={e => { setform({ ...form, start: e.target.value }); postCaseNote({ start: e.target.value }) }} required>
                                                <option value="">{languagesModel.translate('select_option', language)}</option>
                                                {preferredTimeModel.timelist(form.appointmentDate).map(itm => {
                                                    return <option value={itm.name} key={itm.name}>{itm.name}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="required">Appointment Type</label>
                                            <select className='form-control' value={form.appointment_type} onChange={e => { setform({ ...form, appointment_type: e.target.value }); postCaseNote({ appointment_type: e.target.value }) }} required>
                                                <option value="">{languagesModel.translate('select_option', language)}</option>
                                                {appointmentTypes.map(itm => {
                                                    return <option value={itm.id} key={itm.id}>{itm.appointmentType}</option>
                                                })}
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="required">Mode of counselling session</label>
                                            <select className="form-control" value={form.consultation_type} onChange={e => { setform({ ...form, consultation_type: e.target.value }); postCaseNote({ consultation_type: e.target.value }) }} required>
                                                <option value="">{languagesModel.translate('select_option', language)}</option>
                                                <option value="Whatsapp">{languagesModel.translate('whatsapp_consultation', language)}</option>
                                                <option value="In-person">{languagesModel.translate('in-person_consultation', language)}</option>
                                                <option value="Video">{languagesModel.translate('video_consultation', language)}</option>
                                            </select>
                                        </div>

                                    </> : <>
                                        <div className="col-md-6 mb-3">
                                            <label className="semiheding">{languagesModel.translate('appointmentdate_heading', language)}:</label>
                                            <p className="mb-0">{appointment && datepipeModel.date(appointment.start)}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="semiheding">{languagesModel.translate('duration_text', language)}:</label>
                                            <p className="mb-0">{appointment && datepipeModel.isotime(appointment.start)} - {appointment && datepipeModel.isotime(appointment.end)}</p>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="semiheding">{languagesModel.translate('consultation_type', language)}:</label>
                                            <p className="mb-0">{appointment && appointment.consultation_type}</p>
                                        </div>
                                    </>}


                                    <div className="col-md-6 mb-3">
                                        <label className="required">Type of case</label>
                                        <select className="form-control" value={form.caseType} onChange={e => { setform({ ...form, caseType: e.target.value }); postCaseNote({ caseType: e.target.value }) }} required>
                                            <option value="">{languagesModel.translate('select_option', language)}</option>
                                            <option value="clinical">{languagesModel.translate('clinical_text', language)}</option>
                                            <option value="non-clinical">{languagesModel.translate('non-clinical', language)}</option>
                                        </select>
                                    </div>


                                    <div className="col-md-6 mb-3">
                                        <label className="required">Level of severity</label>
                                        <select className="form-control" value={form.severityLevel} onChange={e => { setform({ ...form, severityLevel: e.target.value }); postCaseNote({ severityLevel: e.target.value }) }} required>
                                            <option value="">{languagesModel.translate('select_option', language)}</option>
                                            <option value="high">{languagesModel.translate('high_text', language)}</option>
                                            <option value="medium">{languagesModel.translate('medium_text', language)}</option>
                                            <option value="low">{languagesModel.translate('low_text', language)}</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="required">{languagesModel.translate('client_status', language)}</label>
                                        <select className="form-control" value={form.clientStatus} onChange={e => { setform({ ...form, clientStatus: e.target.value }); postCaseNote({ clientStatus: e.target.value }) }} required>
                                            <option value="">{languagesModel.translate('select_option', language)}</option>
                                            {casenoteModel.clientStatus.map(itm => {
                                                return <option value={itm.id} key={itm.id}>{itm.name}</option>
                                            })}
                                        </select>
                                    </div>


                                    {fields && fields.map(itm => {
                                        return <div className="col-md-6 mb-3" key={itm.id}>
                                            <label className={`text-capitalize ${itm.required ? 'required' : ''} `}>{itm.label}</label>
                                            <CustomField
                                                type={itm.fieldType}
                                                value={form && form.custom && form.custom[itm.id]}
                                                name={'custom_' + itm.id}
                                                options={itm.options}
                                                onChange={e => {
                                                    setform({ ...form, custom: { ...form.custom, [itm.id]: e } });
                                                    postCaseNote({ custom: { ...form.custom, [itm.id]: e } })
                                                }}
                                                required={itm.required}
                                            />
                                        </div>
                                    })}

                                    {/* <div className="col-md-12 mb-3">
                                        <label className="required">{languagesModel.translate('case_note_text', language)}</label>
                                        <textarea className="form-control" value={form.note} onChange={e => { setform({ ...form, note: e.target.value }); postCaseNote({ note: e.target.value }) }} required />
                                    </div> */}

                                    <div className="col-md-12">
                                        <label className="">{languagesModel.translate('upload_the_document_for_keeping', language)}</label>
                                        <div>
                                            <label className={`btn btn-primary ${docLoader ? 'disabled' : ''}`}>
                                                {docLoader ? 'Uploading...' : 'Upload Doc'}
                                                <input
                                                    disabled={docLoader}
                                                    id="bannerImage"
                                                    type="file"
                                                    className="d-none"
                                                    // accept="image/*"
                                                    value={form.baseImg ? form.baseImg : ''}
                                                    onChange={(e) => uploaddocs(e)}
                                                    multiple
                                                />
                                            </label>

                                            {form && form.file ? <div>
                                                {form.file.map((itm, i) => {
                                                    return <span className="docFile" key={itm}>
                                                        <a href={ApiKey.api + 'docs/' + itm} target="_blank"> <i className="fa fa-file"></i> {itm}</a>
                                                        <i className="fa fa-times" onClick={e => removeDoc(i)}></i>
                                                    </span>
                                                })}

                                            </div> : <></>}
                                        </div>

                                        {draftext ? <div className='text-success text-right'>
                                            <i className='fa fa-check'></i> Saved as Draft
                                        </div> : <></>}

                                    </div>


                                </> : <></>}



                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            {form && form.page != 'list' && user.role == 'Counsellor' ? <button className="btn btn-primary" disabled={docLoader} type="submit">{form.id ? languagesModel.translate('updated_text', language) : languagesModel.translate('add_text', language)}</button> : <>
                                {!form.isHideAdd && user.role == 'Counsellor' ? <button className="btn btn-primary" onClick={add} type="button">{languagesModel.translate('add_case_note', language)}</button> : <></>}
                            </>}

                        </div>
                    </form>
                </div>
            </div>
        </div >
    </>
}

export default CaseNoteModal