import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import modalModel from "../../models/modal.model";
import languagesModel from '../../models/languages.model';

const ChangeCounsellor = ({ form, setform, modalClosed }) => {
    const [loading, setLoading] = useState(false)
    const language = useSelector(state => state.language.data)
    const [counsellors, setCounsellor] = useState([])
    const user = useSelector(state => state.user)

    const handleSubmit = (e) => {
        e.preventDefault()
        let method = 'put'
        let url = 'change/counsellor'
        let value = { userId: form.id, counsellorId: form.counsellorId }

        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                ToastsStore.success("Counsellor Changed Successfully")
                modalModel.close("changeCounsellorModal")
                modalClosed()
            }
            loader(false)
        })
    }

    const getCounsellors = () => {
        let clinicId = ''
        if (user.role == 'Clinic Admin') {
            clinicId = user.id
        }
        setLoading(true)
        ApiClient.get('user/listing', { page: 1, count: 100, role: 'Counsellor', clinicId }).then(res => {
            if (res.success) {
                setCounsellor(res.data)
            }
            setLoading(false)
        })
    }

    useEffect(() => {
        getCounsellors()
    }, [])

    return <>
        <div className="modal fade" id="changeCounsellorModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{languagesModel.translate('change_counsellor', language)}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" title="close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('counsellor_newtext', language)}</label>
                                    <select className="form-control"
                                        value={form && form.counsellorId}
                                        onChange={e => { setform({ ...form, counsellorId: e.target.value }) }}
                                        required
                                    >
                                        <option value="">{languagesModel.translate('select_option', language)}</option>
                                        {counsellors && counsellors.map(itm => {
                                            return <option value={itm.id} key={itm.id}>{itm.fullName}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>{languagesModel.translate('submit_button', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default ChangeCounsellor