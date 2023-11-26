import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ToastsStore } from 'react-toasts';
import PageLayout from '../../components/global/PageLayout';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import methodModel from '../../methods/methods';
import datepipeModel from '../../models/datepipemodel';
import './style.scss';

const Counselorsearch = (p) => {
    const today = new Date()
    const history = useHistory()
    const user = useSelector(state => state.user)
    const [data, setData] = useState([])
    const [slotes, setSlote] = useState([])
    const [countries, setCountry] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [filters, setFilters] = useState({ page: 1, count: 100, consultationType: 'whatsapp', country: '', state: '' })
    const [sloteFilter, setSloteFilters] = useState({ page: 1, count: 100, scheduleDate: datepipeModel.datetoIso(today), addedBy: '' })

    useEffect(() => {
        if (user && user.loggedIn) {
            getCounselor()
            getCountry()
        }
    }, [])

    const getCounselor = (p = {}) => {
        let filter = { ...filters, ...p }
        loader(true)
        ApiClient.get('counsellors', filter).then(res => {
            if (res.success) {
                if (res.data.length) {
                    setData(res.data)
                }
            }
            loader(false)
        })
    }

    const search = (p = {}) => {
        setFilters({ ...filters, ...p })
        setSloteFilters({ ...sloteFilter, addedBy: '', scheduleDate: datepipeModel.datetoIso(today) })
        getCounselor(p)
        setSlote([])
    }

    const getAvailability = (p = {}) => {
        let filter = { ...sloteFilter, ...p }
        loader(true)
        ApiClient.get('schedules', filter).then(res => {
            if (res.success) {
                if (res.data.length) {
                    setSlote(res.data[0].slots)
                } else {
                    setSlote([])
                }
            }
            loader(false)
        })
    }

    const getSlote = (id) => {
        setSloteFilters({ ...sloteFilter, addedBy: id })
        getAvailability({ addedBy: id })
    }

    const sloteDate = (value) => {
        setSloteFilters({ ...sloteFilter, scheduleDate: datepipeModel.datetoIso(`${value}`) })
        getAvailability({ scheduleDate: datepipeModel.datetoIso(`${value}`) })
    }

    const slotClick = (itm) => {
        let data = {
            scheduleId: itm.scheduleId,
            slotId: itm.id
        }

        loader(true)
        ApiClient.post('appointment/request', data).then(res => {
            if (res.success) {
                ToastsStore.success(res.message)
                history.push('/requests')
            }
            loader(false)
        })
    }


    const getCountry = () => {
        ApiClient.get('countries').then(res => {
            if (res.success) {
                setCountry(res.data)
            }
        })
    }

    const getState = (code) => {
        let value = methodModel.singleAddress(countries, code)
        ApiClient.get('states', { countryCode: value }).then(res => {
            if (res.success) {
                setStates(res.data)
            }
        })
    }

    const getCity = (code, country) => {
        let filter = {
            countryCode: methodModel.singleAddress(countries, country ? country : filters.country),
            stateCode: methodModel.singleAddress(states, code)
        }
        ApiClient.get('city', filter).then(res => {
            if (res.success) {
                setCities(res.data)
            }
        })
    }

    const clearSlotFilter = () => {
        setData([])
        setSloteFilters({ ...sloteFilter, addedBy: '' })
        setSlote([])
    }




    return (
        <PageLayout>
            <div className='container py-3'>
                <h3 className='bookhedding'>Book Consultation Session</h3>
                <p className='mb-3 parachoose'>choose a date and time that fit your schedule</p>
                <h5 className='Consultationhedding mb-3'>Your Consultation Preference</h5>

                <div className='form-row'>
                    <div className='col-md-6 mb-3'>
                        <h3 className={filters.consultationType === 'whatsapp' ? 'videoConsultation active' : 'videoConsultation'} onClick={() => search({ consultationType: 'whatsapp' })}>Video Consultation Via Whatsapp</h3>
                    </div>
                    <div className='col-md-6 mb-3'>
                        <h3 className={filters.consultationType === 'face2face' ? 'videoConsultation active' : 'videoConsultation'} onClick={() => search({ consultationType: 'face2face' })}> Consultation</h3>
                    </div>


                    <div className='col-md-6 mb-3'>
                        <select
                            className="form-control"
                            value={filters && filters.country}
                            onChange={e => { setFilters({ ...filters, country: e.target.value, state: '', city: '' }); getState(e.target.value); clearSlotFilter() }}
                            required
                        >
                            <option value="">Select Country</option>
                            {countries && countries.map(itm => {
                                return <option value={itm.name} key={itm.isoCode}>{itm.name}</option>
                            })}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <select
                            className="form-control"
                            value={filters && filters.state}
                            onChange={e => { setFilters({ ...filters, state: e.target.value, city: '' }); getCity(e.target.value); clearSlotFilter() }}
                            required
                        >
                            <option value="">Select State</option>
                            {states && states.map(itm => {
                                return <option value={itm.name} key={itm.isoCode}>{itm.name}</option>
                            })}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <select
                            className="form-control"
                            value={filters && filters.city}
                            onChange={e => { setFilters({ ...filters, city: e.target.value }); clearSlotFilter() }}
                            required
                        >
                            <option value="">Select City</option>
                            {cities && cities.map(itm => {
                                return <option value={itm.name} key={itm.isoCode}>{itm.name}</option>
                            })}
                        </select>
                    </div>

                    <div className="col-md-12 text-right">
                        <button className="btn btn-primary" onClick={() => search()}>Search</button>
                    </div>
                </div>

                <hr className="my-4" />
                <h5 className="bookhedding mb-3">Choose Your Counsellor</h5>
                <div className='form-row'>
                    {data && data.map(itm => {
                        return <div className='col-md-6 mb-3' key={itm.id}>
                            <div className={sloteFilter.addedBy === itm.id ? 'videoConsultation active' : 'videoConsultation'} onClick={() => getSlote(itm.id)}>
                                {itm.fullName}
                            </div>
                        </div>
                    })}
                </div>

                <hr className="my-4" />


                {sloteFilter.addedBy ? <>
                    <div className='d-flex justify-content-between mb-3'>
                        <h5 className="bookhedding my-auto">Available Slots</h5>
                        <input type="date" value={datepipeModel.datetostring(sloteFilter.scheduleDate)}
                            onChange={e => sloteDate(e.target.value)} min={datepipeModel.datetostring(today)} className='form-control sloteDate' />
                    </div>

                    <div className='form-row'>
                        {slotes && slotes.map(itm => {
                            return <div className='col-md-6 mb-3' key={itm.id}>
                                <div onClick={() => slotClick(itm)} className={filters.counselorId === itm.id ? 'videoConsultation active' : 'videoConsultation'}>
                                    {datepipeModel.time(datepipeModel.isototime(itm.start))}-{datepipeModel.time(datepipeModel.isototime(itm.end))}
                                </div>
                            </div>
                        })}
                    </div>
                </> : <></>}


            </div>
        </PageLayout >
    );
};

export default Counselorsearch;
