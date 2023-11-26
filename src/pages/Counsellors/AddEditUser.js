import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastsStore } from "react-toasts";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import languagesModel from '../../models/languages.model';

const AddEditUser = ({ form, setform, modalClosed, setSubmitted, emailErr, icErr }) => {
    const language = useSelector(state => state.language.data)
    const user = useSelector(state => state.user)
    const [appointmentTypes, setAppointmentTypes] = useState([])

    const [healthclinicDetails, sethealthclinicsDetails] = useState()

    console.log(healthclinicDetails, "healthclinicDetails");
    const formValidation = [
        { key: 'mobileNo', minLength: 9 },
        { key: 'ic_number', minLength: 6 },
    ]

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid || emailErr || icErr) return
        let method = 'post'
        let url = 'add/user'

        let clinicId = user.id

        let value = {
            id: form.id,
            appointmentTypes: form.appointmentTypes,
            healthClinicId: form.healthClinicId,

        }
        if (value.id) {
            method = 'put'
            url = 'user'
            delete value.password
        } else {
            delete value.id
        }

        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                document.getElementById('closeuserModal').click()
                modalClosed()
            }

            loader(false)
        })
    }

    const GetHealthclinicDetails = () => {
        ApiClient.get('health/clinic', { id: user.healthClinicId }).then(res => {
            sethealthclinicsDetails(res.data)
        })
    }
    const getAppointmentTypes = () => {
        loader(true)
        let filter = { page: 1, count: 100 }
        ApiClient.get('appointment/types', filter).then(res => {
            if (res.success) {
                setAppointmentTypes(res.data)
            }
            loader(false)
        })
    }

    const singleAppointment = (id = '') => {
        let value = ''
        if (appointmentTypes.length) {
            let ext = appointmentTypes.find(itm => itm.id == id)
            value = ext ? ext.appointmentType : ''
        }
        return value
    }

    const removeAppointmentTypes = (index) => {
        let exp = form.appointmentTypes
        exp.splice(index, 1);
        setform({ ...form, appointmentTypes: exp })
    }

    const addAppointmentType = (itm) => {
        let appointTypes = []
        if (form.appointmentTypes) appointTypes = form.appointmentTypes
        let value = [...appointTypes, itm.id]
        setform({ ...form, appointmentTypes: value })
    }




    useEffect(() => {
        getAppointmentTypes()
        GetHealthclinicDetails()
    }, [])

    return <>
        <div className="modal fade" id="userModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{languagesModel.translate('edit_counsellor', language)}</h5>
                        <button type="button" id="closeuserModal" className="close" data-dismiss="modal" aria-label="Close" title="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-row">
                                {form.role == 'Counsellor' ? <div className="col-md-6 mb-3">
                                    <label>{languagesModel.translate('appointment_type', language)}</label>

                                    {form && form.appointmentTypes && form.appointmentTypes.length == appointmentTypes.length ? <></> : <>
                                        <div className="dropdown mb-3">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" id="appointmentMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                {languagesModel.translate('add_appointment_type', language)}
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="appointmentMenuButton">
                                                {appointmentTypes.map(itm => {
                                                    if (form && !form.appointmentTypes || !form.appointmentTypes.find(aitm => aitm == itm.id)) {
                                                        return <a className="dropdown-item" onClick={() => { addAppointmentType(itm) }} key={itm.id}>
                                                            {itm.appointmentType}</a>
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    </>}

                                    <div>
                                        {form && form.appointmentTypes && form.appointmentTypes.map((itm, i) => {
                                            return <span className="badge badge-primary m-2" key={i}>
                                                {singleAppointment(itm)}<i className="fa fa-times text-danger ml-2" onClick={() => removeAppointmentTypes(i)}></i></span>
                                        })}
                                    </div>
                                </div> : <></>}

                            </div>

                        </div>


                        <div className="col-md-6 mb-3">
                            <label>  {languagesModel.translate('health_clinic_text', language)}</label>
                            <select
                                className="form-control text-capitalize"
                                value={form && form.healthClinicId}
                                onChange={e => setform({ ...form, healthClinicId: e.target.value })}
                                required
                            >
                                <option value="">{languagesModel.translate('select_option', language)}</option>
                                {
                                    healthclinicDetails && <option className="text-capitalize" value={healthclinicDetails.id} >{healthclinicDetails.name}</option>
                                }
                            </select>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                            <button type="submit" className="btn btn-primary">{languagesModel.translate('save_btn', language)}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default AddEditUser