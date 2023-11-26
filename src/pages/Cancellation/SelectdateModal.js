import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ToastsStore } from "react-toasts";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import datepipeModel from "../../models/datepipemodel";
import languagesModel from '../../models/languages.model';


const SelectdateModal = ({ modalClosed, form, setform, searchSlote, slotLoader, slots }) => {
    const [loading, setLoading] = useState(false)
    const language = useSelector(state => state.language.data)
    const formValidation = []
    const history = useHistory()
    const user = useSelector(state => state.user)

    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }

    const formSubmit = (e) => {
        e.preventDefault()
        if (user && !user.loggedIn) {
            ToastsStore.error("Please Login First")
            return
        }
        if (form && !form.slotId) {
            ToastsStore.error("Please Select a slot")
            return
        }

        // return
        let data = {
            scheduleId: form.scheduleId,
            slotId: form.slotId
        }

        loader(true)
        ApiClient.post('appointment/request', data).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                document.getElementById("closeselectdateModal").click()
                history.push('/requests')
            }
            loader(false)
        })
    }



    return <>
        <a id="openselectdateModal" data-toggle="modal" data-target="#selectdateModal"></a>
        <div className="modal fade" id="selectdateModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{languagesModel.translate('availability_text', language)}</h5>
                        <button type="button" id="closeselectdateModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={formSubmit}>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('select_state', language)}</label>
                                    <input type="date" className="form-control" min={datepipeModel.datetostring(new Date())} value={datepipeModel.datetostring(form && form.scheduleDate)} onChange={e => { searchSlote(e.target.value) }} required />
                                </div>
                                <div className="col-md-12">
                                    {slotLoader ? <>
                                        <div className="text-center py-3">
                                            <img src="/assets/img/loader.gif" width="50" />
                                        </div>
                                    </> : <>
                                        <div className="form-row">
                                            {form && form.scheduleId && slots && slots.map(itm => {

                                                if (!itm.isBooked)
                                                    return <div className="col-md-6 mb-3" key={itm.id}>
                                                        <article className={form && form.slotId == itm.id ? "p-2 shadow rounded text-center text-white bg-primary" : "p-2 shadow rounded text-center"} onClick={() => setform({ ...form, slotId: itm.id })}>{datepipeModel.time(datepipeModel.isototime(itm.start))}-{datepipeModel.time(datepipeModel.isototime(itm.end))}</article>
                                                    </div>
                                            })}

                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>


                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>{languagesModel.translate('book_text', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </>
}

export default SelectdateModal