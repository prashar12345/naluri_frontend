import React, { } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import slotTimeModel from "../../models/slotTime.model";
import languagesModel from '../../models/languages.model';

const AddEditModal = ({ form, setForm, modalClosed }) => {
    const language = useSelector(state => state.language.data)
    const onSubmit = (e) => {
        e.preventDefault()
        let url = 'appointment/type'
        let method = 'post'
        let value = { id: form.id, appointmentType: form.appointmentType, time: form.time }
        if (value.id) {
            method = 'put'
        } else {
            delete value.id
        }
        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                modalClosed()
                document.getElementById("closeaddEditModal").click()
            }
            loader(false)

        })
    }

    return <>
        <a id="openaddEditModal" data-toggle="modal" data-target="#addEditModal"></a>
        <div className="modal fade" id="addEditModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{form && form.id ? languagesModel.translate('edit_text', language) : languagesModel.translate('add_text', language)} {languagesModel.translate('appointment_type', language)}</h5>
                        <button type="button" id="closeaddEditModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" title="close">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('appointment_type', language)}<span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form && form.appointmentType}
                                        onChange={e => setForm({ ...form, appointmentType: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('time_text', language)}<span className="text-danger">*</span></label>
                                    <select
                                        className="form-control"
                                        value={form && form.time}
                                        onChange={e => setForm({ ...form, time: e.target.value })}
                                        required
                                    >
                                        <option value="">{languagesModel.translate('select_option', language)}</option>
                                        {slotTimeModel.list.map(itm => {
                                            return <option value={itm.id} key={itm.id}>{itm.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button type="submit" className="btn btn-primary">{form && form.id ? languagesModel.translate('update_button', language) : languagesModel.translate('add_text', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default AddEditModal