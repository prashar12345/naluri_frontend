import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import PageLayout from '../../components/global/PageLayout';
import { useHistory } from 'react-router';
import ApiClient from '../../methods/api/apiClient';
import methodModel from '../../methods/methods';
import datepipeModel from '../../models/datepipemodel';
import loader from '../../methods/loader';
import { ToastsStore } from 'react-toasts';
import languagesModel from '../../models/languages.model';

const Cancellation = (p) => {
    const history = useHistory()
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [detail, setDetail] = useState()
    const [form, setForm] = useState({ appointmentId: '', agree: false, cancelReason: '' })

    const getAppointment = (id) => {
        loader(true)
        ApiClient.get('appointment', { id: id }).then(res => {
            if (res.success) {
                setDetail(res.data)
            }
            loader(false)
        })
    }

    const submit = (e) => {
        e.preventDefault()
        let url = 'cancel/appointment'
        if (user.role == 'Counsellor') url = 'cancel/appointment/request'

        loader(true)
        ApiClient.put(url, form).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                if (user.role == 'user') history.push('/requests')
                if (user.role == 'Counsellor') history.push('/appointments')
                if (user.role == 'Clinic Admin') {
                    history.push('/ca-appointments')
                }
            }
            loader(false)
        })
    }

    const back = () => {
        history.goBack()
    }

    useEffect(() => {
        let id = methodModel.getPrams('id')
        getAppointment(id)
        setForm({ ...form, appointmentId: id })
    }, [])

    return (
        <PageLayout>
            <div className="container">
                <h3 className="mb-3 usershedding">{languagesModel.translate('booking_cancellation', language)}</h3>
                <h5 className="mb-3 sub-userheading">{languagesModel.translate('booking_detail', language)}</h5>
                <div className='overflow-auto'>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{languagesModel.translate('schedule_date', language)}</th>
                                <th>{languagesModel.translate('start_button', language)}</th>
                                <th>{languagesModel.translate('end_text', language)}</th>
                                <th>{languagesModel.translate('status_heading', language)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{detail && datepipeModel.date(detail.start)}</td>
                                <td>{detail && datepipeModel.isotime(detail.start)}</td>
                                <td>{detail && datepipeModel.isotime(detail.end)}</td>
                                <td>{detail && detail.status}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <div className='row'>
                    <div className='col-md-6 '>
                        <h5 className="Detailclas mb-3 mt-4">{languagesModel.translate('user_detail', language)}</h5>
                        <div className='UserDetail_stylecls'>
                            <div className='inneruser_details'>
                                <div className='details_items'>
                                    <img src={methodModel.userImg(detail && detail.userId.image)} className='100 proimg ml-0' />
                                </div>
                                <div className='details_items'>
                                    <h3 className='fullNamecls'>{detail && detail.userId.fullName}</h3>
                                    <h3 className='fontstylecls'>{detail && detail.userId.email}</h3>
                                    <h3 className='fontstylecls'>{detail && detail.userId.dialCode + detail.userId.mobileNo}</h3>
                                    <h3 className='ic_numberclss'> <span className='spancls'>{languagesModel.translate('icnumber_text', language)}:</span>  {detail && detail.userId.ic_number}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-6'>
                        <h5 className=" Detailclas mb-3 mt-4">{languagesModel.translate('counsellor_detail', language)}</h5>
                        <div className='UserDetail_stylecls'>
                            <div className='inneruser_details'>
                                <div className='details_items'>
                                    <img src={methodModel.userImg(detail && detail.counsellor.image)} className='100 proimg ml-0' />
                                    {/* <h3 className='ic_numberclss ml-3 mt-2'>{detail && detail.counsellor.ic_number}</h3> */}

                                </div>
                                <div className='details_items'>
                                    <h3 className='fullNamecls'>{detail && detail.counsellor.fullName}</h3>
                                    <h3 className='fontstylecls'>{detail && detail.counsellor.email}</h3>
                                    <h3 className='fontstylecls'>{detail && detail.counsellor.dialCode + detail.counsellor.mobileNo}</h3>
                                    <h3 className='ic_numberclss'> <span className='spancls'>{languagesModel.translate('icnumber_text', language)}:</span>  {detail && detail.counsellor.ic_number}</h3>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <h5 className="Detailclas mb-3  mt-4">{languagesModel.translate('why_you_want_to_cancel', language)}</h5>
                    <textarea className="form-control mb-3" value={form.cancelReason} onChange={e => setForm({ ...form, cancelReason: e.target.value })} placeholder={languagesModel.translate('reason_text', language)} required></textarea>
                    <div className="mb-3">
                        <label>
                            <input type="checkbox" className="mr-2" value={form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} required />
                            {languagesModel.translate('cancellation_policy', language)}</label>
                    </div>

                    <div className="text-right mb-3">
                        <button className="btn btn-secondary mr-2" onClick={back}> {languagesModel.translate('back_button', language)}</button>
                        <button className="btn btn-primary">{languagesModel.translate('cancellation_confirm', language)}</button>
                    </div>
                </form>
            </div>

        </PageLayout>
    );
};
export default Cancellation;
