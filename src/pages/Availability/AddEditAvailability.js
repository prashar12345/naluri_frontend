import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import datepipeModel from "../../models/datepipemodel";
import preferredTimeModel from "../../models/preferredTime.model";
import languagesModel from '../../models/languages.model';
import modalModel from "../../models/modal.model";


const AddEditavailability = ({ form, setform, modalClosed }) => {
    const [loading, setLoading] = useState(false)
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const formValidation = [
        { key: 'mobileNo', minLength: 9 },
        { key: 'ic_number', minLength: 6 },
    ]

    const handleSubmit = (e) => {
        e.preventDefault()
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid) return
        let method = 'post'
        let url = 'schedule'

        let value = {
            id: form.id,
            scheduleDate: form.scheduleDate,
            start: form.start,
            end: form.end,
            consultation_type: form.consultation_type
        }
        value.start = datepipeModel.datetoIsotime(`${value.scheduleDate} ${value.start}`)
        value.end = datepipeModel.datetoIsotime(`${value.scheduleDate} ${value.end}`)

        if (value.id) {
            method = 'put'
        } else {
            delete value.id
        }

        setLoading(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                let message = `Avaialabity ${value.id ? 'updated' : 'added'} successfully`
                ToastsStore.success(message)
                modalModel.close('availabiltyModal')
                modalClosed()
            }
            setLoading(false)
        })
    }


    const endtimes = () => {
        let value = []
        if (form.start) {
            let id = preferredTimeModel.find(form.start).id
            value = preferredTimeModel.list.filter(itm => itm.id > id)
        }
        return value
    }

    return <>
        <div className="modal fade" id="availabiltyModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{form && form.id ? languagesModel.translate('edit_text', language) : languagesModel.translate('add_text', language)} {languagesModel.translate('availability_text', language)}</h5>
                        <button type="button" id="closeappointmentModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label className="viewhedding">{languagesModel.translate('schedule_date', language)}</label>
                                    <input
                                        type="date"
                                        placeholder="dd-mm-yyyy"
                                        min={datepipeModel.datetostring(new Date())}
                                        className="form-control"
                                        value={form.scheduleDate}
                                        onChange={e => setform({ ...form, scheduleDate: e.target.value })}
                                        required
                                        disabled={form.id ? true : false}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="viewhedding">{languagesModel.translate('mode_of_consultation', language)}</label>
                                    <select className="form-control"
                                        value={form.consultation_type}
                                        onChange={e => setform({ ...form, consultation_type: e.target.value })}
                                        required

                                    >
                                        <option value="">{languagesModel.translate('select_mode_of_consultation', language)}</option>
                                        <option value="In-person">{languagesModel.translate('in-person_consultation', language)}</option>
                                        <option value="Video">{languagesModel.translate('video_consultation', language)}</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="viewhedding">{languagesModel.translate('start_time', language)}</label>
                                    <select className="form-control"
                                        value={form.start}
                                        onChange={e => setform({ ...form, start: e.target.value, end: '' })}
                                        required
                                    >
                                        <option>{languagesModel.translate('start_time', language)}</option>
                                        {preferredTimeModel.timelist(form.scheduleDate).map(itm => {
                                            if (itm.id != 19)
                                                return <option value={itm.name} key={itm.name}>{datepipeModel.time(itm.name)}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="viewhedding">{languagesModel.translate('end_time', language)}</label>
                                    <select className="form-control"
                                        value={form.end}
                                        onChange={e => { setform({ ...form, end: e.target.value }); }}
                                        required
                                    >
                                        <option>{languagesModel.translate('end_time', language)}</option>
                                        {endtimes().map(itm => {
                                            return <option value={itm.name} key={itm.name}>{datepipeModel.time(itm.name)}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Loading...' : languagesModel.translate('save_btn', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default AddEditavailability