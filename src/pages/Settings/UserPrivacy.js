import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ToastsStore } from 'react-toasts';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';

const UserPrivacy = p => {
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector(state => state.user)
    const [form, setForm] = useState({ showEmail: false, showIcNumber: false, showMobile: false })

    const gallaryData = () => {
        loader(true)
        ApiClient.get(`user`, { id: user.id }).then(res => {
            if (res.success) {
                setForm(res.data)
            }
            loader(false)

        })
    };

    const handleSubmit = e => {
        e.preventDefault();
        let value = { id: form.id, showEmail: form.showEmail, showIcNumber: form.showIcNumber, showMobile: form.showMobile }
        loader(true)
        ApiClient.put('user', value).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
            }
            loader(false)
        })
    };

    useEffect(
        () => {
            if (user && user.loggedIn) {
                gallaryData();
            }
        },
        []
        // here '[]' is used for, loop se bachne k liye
    );

    return (
        <>
            <div className="form-row py-3">
                <div className="col-md-4 mb-3">
                    <label className="mb-0">
                        <input type="checkbox" checked={form.showEmail} onChange={e => setForm({ ...form, showEmail: e.target.checked })} className="mr-2" /> Show Email
                    </label>
                </div>
                <div className="col-md-4 mb-3">
                    <label className="mb-0">
                        <input type="checkbox" checked={form.showIcNumber} onChange={e => setForm({ ...form, showIcNumber: e.target.checked })} className="mr-2" /> Show IC/Passport Number
                    </label>
                </div>
                <div className="col-md-4 mb-3">
                    <label className="mb-0">
                        <input type="checkbox" checked={form.showMobile} onChange={e => setForm({ ...form, showMobile: e.target.checked })} className="mr-2" /> Show Mobile
                    </label>
                </div>
                <div className="col-md-12 text-right">
                    <button className="btn btn-primary" onClick={handleSubmit}>Update</button>
                </div>
            </div>
        </>
    );
};

export default UserPrivacy;
