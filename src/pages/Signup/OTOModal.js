import React, { } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { ToastsStore } from 'react-toasts';
import { login_success } from '../../actions/user';
import ApiClient from '../../methods/api/apiClient';
import methodModel from '../../methods/methods';

const OTPModal = ({ form, setform, page = '', closed }) => {
    const history = useHistory()
    const dispatch = useDispatch()
    const handleSubmit = (e) => {
        e.preventDefault()
        ApiClient.post('verify/otp', form).then(res => {
            if (res.success) {
                document.getElementById("closeotpModal").click()
                ToastsStore.success(res.message)
                dispatch(login_success(res.data))
                localStorage.setItem("token", res.data.access_token)
                ApiClient.dropoff('Complete login/create an account', res.data)
                if (page !== 'assessment') {
                    history.push('/dashboard');
                } else {
                    closed(res.data)
                }
            }
        })

    }

    const resendOtp = () => {
        ApiClient.post('resend/otp', { id: form.id }).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
            }
        })
    }


    return <>
        <a id="openOTPModal" data-toggle="modal" data-target="#otpModal"></a>
        <div className="modal fade" id="otpModal" data-backdrop="static" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">OTP</h5>
                        <button type="button" id="closeotpModal" className="close d-none" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="col-md-12">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter OTP"
                                        value={form.otp}
                                        maxLength={6}
                                        onChange={e => setform({ ...form, otp: methodModel.isNumber(e) })}
                                        required
                                    />

                                    <div className="mt-2 text-center">
                                        <a className="text-primary" onClick={() => resendOtp()}>Resend OTP</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            {/* <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button> */}
                            <button type="submit" className="btn btn-primary">Verify</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default OTPModal