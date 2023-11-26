import React, { useEffect, useState } from "react";
import PageLayout from "../../components/global/PageLayout";
import "./style.scss"
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import { ToastsStore } from 'react-toasts';
import methodModel from "../../methods/methods";
import OTPModal from "../Signup/OTOModal";
import { login_success } from "../../actions/user";
import languagesModel from "../../models/languages.model";
import datepipeModel from "../../models/datepipemodel";

const AddAssessment = () => {
    const history = useHistory()
    const language = useSelector(state => state.language.data)
    const dispatch = useDispatch()
    const userState = useSelector(state => state.user)
    const [typeCount, setTypeCout] = useState(1)
    const [questions, setQuestions] = useState([])
    const [nextDisable, setNextDisable] = useState(true)
    const [answeredQuestions, setAnasweredQuestion] = useState([])
    const [questionIndex, setQuestionIndex] = useState(0)
    const [type, setType] = useState()
    const [activeTypes, setActiveTypes] = useState([])
    const [step, setStep] = useState('assessment')
    const [user, setUser] = useState()
    const [form, setForm] = useState({ confirmPassword: '', password: '', firstName: '', lastName: '', email: '', ic_number: '', dialCode: '+60', nationality: '', mobileNo: '', role: 'user', })
    const [loginForm, setLoginForm] = useState({ password: '', role: 'user', dialCode: '+60' })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [emailErr, setEmailErr] = useState(false)
    const [otpForm, setOtpForm] = useState({ otp: '', id: '' })
    const [icErr, setIcErr] = useState('')

    const formValidation = [
        { key: 'confirmPassword', minLength: 8, confirmMatch: ['confirmPassword', 'password'] },
        { key: 'password', password: true },
        { key: 'ic_number', minLength: 6 },
        { key: 'mobileNo', minLength: 9 },
    ]
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false, currentPassword: false });

    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }

    const start = () => {
        setStep('assessment')
        setQuestionIndex(0)
    }

    const checkEmail = (e) => {
        setEmailErr('')
        setLoading(true)
        ApiClient.get('check/email', { email: e }, '', true).then(res => {
            if (!res.success) {
                if (res.error.message === 'Email already taken') {
                    setEmailErr(res.error.message)
                }
            }
            setLoading(false)
        })
    }

    const hendleSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true)
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid || icErr || emailErr) return

        if (!form.agree) return

        loader(true)
        ApiClient.post('register', form).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                setOtpForm({ ...otpForm, id: res.data.id })
                document.getElementById("openOTPModal").click()
            }
            loader(false)
        })
    };

    const checkIc = (e) => {
        setIcErr('')
        setLoading(true)
        ApiClient.get('check/icnumber', { ic_number: e }, '', true).then(res => {
            if (!res.success) {
                setIcErr(res.error.message)
            }
            setLoading(false)
        })
    }

    const getQuestions = (f = {}) => {
        loader(true)

        let filter = { page: 1, count: 100, ...f }
        ApiClient.get('questions', filter).then(res => {
            if (res.success) {
                setQuestions(res.data.map(itm => {
                    itm.answerId = ''
                    itm.weightage = ''
                    return itm
                }))
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            loader(false)
        })
    }




    const answere = (opt, qi) => {
        questions[qi].answerId = opt.option
        questions[qi].answer = opt.id
        questions[qi].weightage = opt.weightage
        setQuestions(questions)
        setNextDisable(submitDisable(questions))
    }

    const addAssessment = (usr = '', aq = '') => {
        let date = new Date()
        let time = datepipeModel.time(date.toISOString())
        // return
        loader(true)
        ApiClient.post('assessment', { assessments: aq ? aq : answeredQuestions, time, date: date.toISOString() }).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                let uUser = usr ? usr : user
                let uData = { ...uUser, assessmentFilled: true }
                dispatch(login_success(uData))
                history.push('/userdashboard')
                page('Complete Assessment')
            }
            loader(false)
        })
    }

    const submit = (e) => {
        e.preventDefault()
        setTypeCout(typeCount + 1)
        setNextDisable(true)
        let index = type.index
        let aq = answeredQuestions
        if (type && type.aStatus != 'done') {
            let assessments = questions.map(itm => {
                return {
                    questionId: itm.id,
                    answerId: itm.answerId,
                    weightage: itm.weightage,
                    answer: itm.answer
                }
            })
            aq = [...answeredQuestions, { type: type.id, assessment: assessments }]
            setAnasweredQuestion(aq)
        }

        if (activeTypes[index + 1]) {
            setType({ ...type, index: index + 1, aStatus: '' })
            selectType(activeTypes[index + 1])
        } else {
            setType({ ...type, index, aStatus: 'done' })
            if (user && !user.loggedIn) {
                setStep('register')
                return
            }
            addAssessment('', aq)
        }
    }

    const handleLogin = (e) => {
        e.preventDefault()
        loader(true)
        ApiClient.post('user/signin', loginForm).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                localStorage.setItem("token", res.data.access_token)
                dispatch(login_success(res.data))
                addAssessment(res.data)
            }
            loader(false)
        })
    }

    const ModalClosed = (u) => {
        let uda = { ...u, loggedIn: true }
        setUser(uda)
        addAssessment(uda)
    }


    const selectType = (itm) => {
        // setStep('start')
        setQuestionIndex(0)
        getQuestions({ type: itm.id })
        setType(itm)
    }

    useEffect(() => {
        if (methodModel.getPrams('inviteId')) {
            setForm({ ...form, email: methodModel.getPrams('email'), inviteId: methodModel.getPrams('inviteId'), role: 'Counsellor' })
        }
    }, [form])

    useEffect(() => {
        setUser(userState)
    }, [userState])

    useEffect(() => {
        const getType = () => {
            let search = ''
            if (methodModel.getPrams('type')) search = methodModel.getPrams('type')
            loader(true)
            ApiClient.get('category/types', { page: 1, count: 100, search }).then(res => {
                if (res.success) {
                    if (res.data.length) {
                        let arr = res.data.filter(itm => itm.showStatus)

                        if (arr.length) {
                            selectType({ ...arr[0], index: 0 })
                            setActiveTypes(arr)
                        } else {
                            let ext = res.data.find(itm => itm.name.includes('dass'))
                            let type = ext ? ext : res.data[0]
                            selectType({ ...type, index: 0 })
                            setActiveTypes([type])
                        }

                    } else {
                        loader(false)
                    }
                } else {
                    loader(false)
                }
            })
        }
        getType()
        if (userState.id) {
            page('Start Assessment')
        }
    }, [])

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    const submitDisable = (que = questions) => {
        let value = false
        que.map(itm => {
            if (!itm.answerId || !itm.answer) value = true
        })
        return value
    }

    const page = (page = '') => {
        if (userState) ApiClient.dropoff(page, userState)
    }

    return <>
        <PageLayout>
            {step === 'start' && <div className="container asssesmentcontainer mb-5">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="asshedding">{languagesModel.translate('assessment_title', language)}</h3>
                        {/* <p className="asspara text-capitalize">{type && translate2(type.translate, type.name)}</p> */}
                        <p className="asspara">{type && translate2(type.descriptionTranslation, type.description)}</p>
                        {/* <p className="asspara">{languagesModel.translate('assessment_description2', language)}</p> */}
                        <div className="mainquestion d-flex justify-content-between">
                            <div className=" qestiondiv text-center ml-0">
                                <h3 className='assnumb mt-4'>{questions.length}</h3>
                                <p>{languagesModel.translate('questions_text', language)}</p>
                            </div>
                            <div className="qestiondiv text-center ">
                                <h3 className='assnumb mt-4'><i className="fa fa-check-square"></i></h3>
                                <p>{languagesModel.translate('multiplechoice_text', language)}</p>
                            </div>
                            <div className="qestiondiv text-center pt-3">
                                {languagesModel.translate('lessthan_text', language)}
                                <h3 className='assnumb mt-1'>5</h3>
                                <p>min</p>
                            </div>
                        </div>

                        {questions && !questions.length && <p className="text-danger my-3">{languagesModel.translate('there_are_no_questions_for', language)} {type && type.name} </p>}

                        {questions && questions.length ? <div className="text-center">
                            <button className=" startbtn mt-4 form-control" onClick={() => start()}>{languagesModel.translate('start_button', language)}</button>
                            <h3 className="asspara mt-3">{languagesModel.translate('assessment_footer', language)}<a className="text-primary" href="/privacy" target="_blank">{languagesModel.translate('privacy_text', language)}</a> and <a className="text-primary" href="/terms" target="_blank">{languagesModel.translate('termsconditions_text', language)}</a></h3>
                        </div> : <></>}
                    </div>
                </div>
            </div>}
            {step === 'assessment' && <div className="container mb-5">
                <form onSubmit={submit}>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            {/* <p className="asspara mb-2"><span className="text-capitalize">({type && translate2(type.translate, type.name)})</span></p> */}
                            <p className="asspara mb-2">{type && translate2(type.descriptionTranslation, type.description)}</p>
                            <h3 className="asshedding mb-3 text-primary">{languagesModel.translate('during_weeks', language)}</h3>
                        </div>

                        {questions && questions.map((question, i) => {
                            return <div className="col-md-12" key={i}>
                                <div className="geendivclss mb-3">
                                    <h3 className="asshedding text-primary text-center mb-3">{languagesModel.translate(`question_${question.id}`, language, question.question)}</h3>

                                    <div className="form-row">
                                        {question && question.options && question.options.map(itm => {
                                            return <div className="col-md-3 col-sm-6 col-xs-6 mb-3 text-center" key={itm.id} title={itm.answerId}>
                                                <label className="mb-0">
                                                    <input type="radio" value={itm.id} name={`question${i}`} onChange={e => { answere(itm, i) }} required />
                                                    <p className="assparaqus">{languagesModel.translate(`option_q${question.id}_o${itm.id}`, language, itm.option)}</p>
                                                </label>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        })
                        }

                        <div className="col-md-12 text-center">
                            <button className={`btn btn-primary submitBtn ${nextDisable ? 'disabled' : ''}`} disabled={nextDisable}>{activeTypes.length == typeCount ? languagesModel.translate('submit_button', language) : languagesModel.translate('next_text', language)}</button>
                        </div>
                    </div>
                </form>
            </div>

            }

            {step === 'ask' && <div className="col-md-12 text-center">
                <h3 className="assmenthedding mb-3 text-primary">{languagesModel.translate(`already_have_an_account`, language)}</h3>
                <div className="">
                    <button type="button" className={step === 'login' ? 'btn btn-primary m-1' : 'btn btn-outline-primary m-1'} onClick={() => setStep('login')}>Yes</button>
                    <button type="button" className={step === 'register' ? 'btn btn-primary m-1' : 'btn btn-outline-primary m-1'} onClick={() => setStep('register')}>No</button>
                </div>
            </div>}

            {step === 'login' && <div className="col-md-12 loginWrapper">
                <h3 className="assmenthedding mb-3 text-primary">{languagesModel.translate(`login_an_account_to_view_your_result`, language)}</h3>
                <p>{languagesModel.translate(`to_save_and_download`, language)}</p>
                <p>{languagesModel.translate(`create_account_account`, language)}<a className="text-primary" onClick={e => setStep('register')}>{languagesModel.translate(`register_here`, language)}</a></p>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <div className="phoneInput">
                            <input
                                type="text"
                                className="form-control" placeholder='+60'
                                maxLength={4}
                                value={loginForm.dialCode}
                                onChange={e => setLoginForm({ ...loginForm, dialCode: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                className="form-control" placeholder={`${languagesModel.translate('mobile_number', language)}*`}
                                value={loginForm.mobileNo}
                                onChange={e => setLoginForm({ ...loginForm, mobileNo: methodModel.isNumber(e) })}
                                maxLength={10}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control mb-0 bginput" placeholder={`${languagesModel.translate('password_text', language)}*`}
                            value={loginForm && loginForm.password}
                            maxLength={20}
                            onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                        />
                    </div>


                    <div className="text-center">
                        <button type="submit" className="btn btn-primary loginclass mb-4">
                            Login
                        </button>
                    </div>
                </form>

            </div>}

            {step === 'register' ? <div className="col-md-12 registerWrapper">

                <h3 className="assmenthedding mb-3 text-primary">{languagesModel.translate('create_an_result', language)}</h3>
                <p>{languagesModel.translate('to_save_download', language)}.</p>
                <p>{languagesModel.translate(`already_have_an_account`, language)} <a className="text-primary" onClick={e => setStep('login')}>{languagesModel.translate('log_in_here', language)}</a></p>
                <form onSubmit={hendleSubmit}>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control mb-0 bginput" placeholder={`${languagesModel.translate('first_name', language)}*`}
                            value={form && form.firstName}
                            onChange={e => setForm({ ...form, firstName: e.target.value })}
                            required
                        />
                    </div>


                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control mb-0 bginput" placeholder={`${languagesModel.translate('last_name', language)}*`}
                            value={form && form.lastName}
                            onChange={e => setForm({ ...form, lastName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control mb-0 bginput" placeholder={`${languagesModel.translate('email_text', language)}*`}
                            value={form && form.email}
                            disabled={form && form.inviteId}
                            onChange={e => { setForm({ ...form, email: e.target.value }); checkEmail(e.target.value) }}
                        />
                        {emailErr ? <div className="invalid-feedback d-block">{emailErr}</div> : <></>}
                    </div>

                    <div className="mb-3">
                        <div className="phoneInput">
                            <input
                                type="text"
                                className="form-control mb-0 bginput" placeholder='+60'
                                value={form && form.dialCode}
                                maxLength={4}
                                onChange={e => setForm({ ...form, dialCode: e.target.value })}
                                required
                            />

                            <input
                                type="text"
                                className="form-control mb-0 bginput" placeholder={`${languagesModel.translate('mobileno_text', language)}*`}
                                value={form && form.mobileNo}
                                maxLength={12}
                                onChange={e => setForm({ ...form, mobileNo: methodModel.isNumber(e) })}
                                required
                            />
                        </div>

                        {submitted && getError('mobileNo').invalid ? <div className="invalid-feedback d-block">Min Length is 9</div> : <></>}
                    </div>

                    <div className="mb-3">
                        <select className="form-control mb-0 bginput"
                            value={form && form.nationality}
                            onChange={e => { setForm({ ...form, nationality: e.target.value, ic_number: '' }); }}
                            disabled={form.id ? true : false}
                            required
                        >
                            <option value="">{languagesModel.translate('nationality_text', language)}*</option>
                            <option value="Malaysian">{languagesModel.translate('nationality_text', language)}</option>
                            <option value="Non-Malaysian">{languagesModel.translate('non-malaysian', language)}</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control mb-0 bginput" placeholder={`${languagesModel.translate('ic_number', language)}*`}
                            value={form && form.ic_number}
                            maxLength={form.nationality === 'Malaysian' ? 12 : 16}
                            onChange={e => { setForm({ ...form, ic_number: e.target.value }); checkIc(e.target.value) }}
                            required
                        />
                        {submitted && !icErr && getError('ic_number').invalid ? <div className="invalid-feedback d-block">Min Length is 6</div> : <></>}
                        {icErr ? <div className="invalid-feedback d-block">{icErr}</div> : <></>}
                    </div>

                    <div className="mb-3">

                        <div className="inputWrapper">
                            <input
                                type={eyes.password ? 'text' : 'password'}
                                className="form-control mb-0 bginput"
                                value={form.password}
                                maxLength={20}
                                placeholder={`${languagesModel.translate('password_text', language)}*`}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                            <i className={eyes.password ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, password: !eyes.password })}></i>
                        </div>
                        {submitted && getError('password').invalid ? <div className="invalid-feedback d-block">Input Password and Submit [ 8-20 characters which contain at least one numeric digit, one uppercase, one lowercase letter and  a special character</div> : <></>}
                    </div>

                    <div className="mb-3">
                        <div className="inputWrapper">
                            <input
                                type={eyes.confirmPassword ? 'text' : 'password'}
                                className="form-control mb-0 bginput"
                                value={form.confirmPassword}
                                maxLength={20}
                                placeholder={`${languagesModel.translate('comfirm_password', language)}*`}
                                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                required
                            />
                            <i className={eyes.confirmPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} onClick={() => setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })}></i>
                        </div>
                        {submitted && getError('confirmPassword').err.confirmMatch ? <div className="invalid-feedback d-block">{languagesModel.translate(`not_matched`, language)}</div> : <></>}
                    </div>

                    <div className="mb-3">
                        <label className="ml-1 mb-0"> <input type="checkbox" value={form && form.agree} onChange={e => setForm({ ...form, agree: e.target.checked })} className="mr-2" />{languagesModel.translate(`i_agree_to_the`, language)}<a className="text-primary" href="/privacy" target="_blank">{languagesModel.translate('privacy_text', language)}</a> and <a className="text-primary" href="/terms" target="_blank">{languagesModel.translate('termsconditions_text', language)}</a></label>
                        {submitted && !form.agree ? <div className="invalid-feedback d-block">{languagesModel.translate(`privacy_policy_text`, language)}.</div> : <></>}
                    </div>




                    <div className="text-center">
                        <button type="submit" disabled={loading} className="btn btn-primary loginclass mb-4">
                            {languagesModel.translate(`register_text`, language)}
                        </button>
                    </div>
                </form>

                <OTPModal form={otpForm} setform={setOtpForm} page="assessment" closed={ModalClosed} />
            </div> : <></>}

        </PageLayout>
    </>
}

export default AddAssessment;