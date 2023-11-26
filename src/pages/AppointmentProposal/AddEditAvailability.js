import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import datepipeModel from "../../models/datepipemodel";
import preferredTimeModel from "../../models/preferredTime.model";
import slotTimeModel from "../../models/slotTime.model";


const AddEditavailability = ({ form, setform, modalClosed, setSubmitted, submitted }) => {
    const [loading, setLoading] = useState(false)
    const user = useSelector(state => state.user)

    const formValidation = [
        { key: 'mobileNo', minLength: 9 },
        { key: 'ic_number', minLength: 6 },
    ]

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid) return
        let method = 'post'
        let url = 'schedule'

        let value = {
            id: form.id,
            scheduleDate: form.scheduleDate,
            start: form.start,
            end: form.end,
        }
        value.start = datepipeModel.datetoIsotime(`${value.scheduleDate} ${value.start}`)
        value.end = datepipeModel.datetoIsotime(`${value.scheduleDate} ${value.end}`)

        if (value.id) {
            method = 'put'
        } else {
            delete value.id
        }

        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                document.getElementById('closeappointmentModal').click()
                modalClosed()
            }
            loader(false)
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
        <a id="openappointmentModal" data-toggle="modal" data-target="#appointmentModal"></a>
        <div className="modal fade" id="appointmentModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{form && form.id ? 'Edit' : 'Add'} Availability</h5>
                        <button type="button" id="closeappointmentModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-md-12 mb-3">
                                    <label className="viewhedding">Schedule date</label>
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
                                    <label className="viewhedding">Start Time</label>
                                    <select className="form-control"
                                        value={form.start}
                                        onChange={e => setform({ ...form, start: e.target.value, end: '' })}
                                        required
                                    >
                                        <option>Select Option</option>
                                        {preferredTimeModel.list.map(itm => {
                                            if (itm.id != 19)
                                                return <option value={itm.name} key={itm.name}>{datepipeModel.time(itm.name)}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="viewhedding">End Time</label>
                                    <select className="form-control"
                                        value={form.end}
                                        onChange={e => { setform({ ...form, end: e.target.value }); }}
                                        required
                                    >
                                        <option>Select Option</option>
                                        {endtimes().map(itm => {
                                            return <option value={itm.name} key={itm.name}>{datepipeModel.time(itm.name)}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default AddEditavailability