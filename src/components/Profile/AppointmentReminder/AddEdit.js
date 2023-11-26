import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ToastsStore } from "react-toasts";
import ApiClient from '../../../methods/api/apiClient';
import loader from '../../../methods/loader';
import rescheduleTimeModel from '../../../models/rescheduleTime.model';
import languagesModel from '../../../models/languages.model';


const AddEdit = ({ form, setForm, modalClosed }) => {
    const language = useSelector(state => state.language.data)
    const user = useSelector(state => state.user)



    const handleSubmit = (e) => {
        e.preventDefault()

        let value = {
            id: form.id,
            clinicId: user.id,
            hours: form.hours
        }
        let method = 'post'
        if (value.id) {
            method = 'put'
        } else {
            delete value.id
        }

        loader(true)
        ApiClient.allApi('reminder/time', value, method).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                document.getElementById('closeEditModal').click()
                modalClosed()
            }
            loader(false)
        })
    }


    useEffect(() => {
        if (user && user.loggedIn) {
        }
    }, [])

    return <>
        <a id="openEditModal" data-toggle="modal" data-target="#editModal"></a>
        <div className="modal fade" id="editModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{form && form.id ? languagesModel.translate('edit_text', language) : languagesModel.translate('add_text', language)} {languagesModel.translate('reminder_text', language)}</h5>
                        <button type="button" id="closeEditModal" className="close" data-dismiss="modal" aria-label="Close" title='Close'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-row roleForm">
                                <div className="col-md-12 mb-3">
                                    <label className="lableclss">{languagesModel.translate('hours_text', language)} </label>
                                    {/* <input type="number" className="form-control" value={form && form.hours ? form.hours : ''} onChange={e => setForm({ ...form, hours: e.target.value })} required /> */}
                                    <select className='form-control' value={form && form.hours ? form.hours : ''} onChange={e => setForm({ ...form, hours: e.target.value })} required>
                                        <option value="" >{languagesModel.translate('select_option', language)}</option>
                                        {rescheduleTimeModel.list.map(itm => {
                                            return <option value={itm.hr}>{itm.value}</option>
                                        })}

                                    </select>

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button type="submit" className="btn btn-primary">{form && form.id ? languagesModel.translate('update_button', language) : languagesModel.translate('Create_text', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default AddEdit