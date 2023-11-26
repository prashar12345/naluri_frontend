import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import modalModel from "../../models/modal.model";
import DatePicker from "react-datepicker";
import datepipeModel from "../../models/datepipemodel";
import preferredTimeModel from "../../models/preferredTime.model";
import methodModel from "../../methods/methods";
import languagesModel from "../../models/languages.model";
import expertiseModel from "../../models/expertise.model";
import countryModel from "../../models/country.model";
import ApiClient from "../../methods/api/apiClient";


const FilterModal = ({ filters, clear, search, appointmentTypes, timezones }) => {
    const language = useSelector(state => state.language.data)
    const [filter, setFilter] = useState({ country: '', state: '', city: '', start: '', search: '' })
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const clearAll = () => {
        // modalModel.close('filterModal')
        // clear()
        setFilter({ ...filter, consultation_type: '', search: '', country: '', state: '', languages: '', expertise: '', city: '', start: '', timeZone: '' })
    }

    const getCity = (state) => {
        let f = {
            countryCode: filter.country,
            stateCode: state
        }
        ApiClient.get('city', f).then(res => {
            if (res.success) {
                setCities(res.data)
            }
        })
    }

    const getState = (code) => {
        ApiClient.get('states', { countryCode: code }).then(res => {
            if (res.success) {
                setStates(res.data)
            }
        })
    }

    const stateChange = (p) => {
        setFilter({ ...filter, state: p, city: '' })
        getCity(p);
    }

    const countryChange = (p = '') => {
        setFilter({ ...filter, country: p, state: '', city: '' })
        getState(p);
    }

    useEffect(() => {
        setFilter(filters)
        setPlaceholder()
        if (filters.state) getState(filters.country)
        if (filters.city) getCity(filters.state, filters.country)
    }, [filters])

    const setPlaceholder = () => {
        setTimeout(() => {
            let el = document.getElementById("bookindatepicker1")
            if (el) el.setAttribute('placeholder', 'DD/MM/YYYY')
        }, 1);
    }

    const submit = () => {
        modalModel.close('filterModal')
        search(filter)
    }

    const setTime = (time) => {
        let value = ''
        let start = filter.start ? filter.start : new Date()
        let date = datepipeModel.datetostring(start)
        value = datepipeModel.datetoIsotime(`${date} ${time}`)
        setFilter({ ...filter, start: value })
    }

    return <>
        <div className="modal fade" id="filterModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-md">
                <div className="modal-content">
                    <div className="modal-header ">
                        <div className="text-center w-100">
                            <h5 className="modal-title">{languagesModel.translate('filters_text', language)}</h5>
                        </div>

                        <button type="button" id="closefilterModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <h3 className="srchtxt mb-3">{languagesModel.translate('search_counsellor', language)}</h3>
                        <div className="filterSearch mb-3">
                            <input className="form-control consolname" type="text" placeholder={languagesModel.translate('counsellor_name', language)} value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} />
                            {filter.search ? <i className="fa fa-times text-danger clear" onClick={e => setFilter({ ...filter, search: '' })}></i> : <></>}
                        </div>

                        <h3 className="srchtxt mb-3">{languagesModel.translate('consultation_preference', language)}</h3>

                        <div className="d-flex mb-3">
                            <div className={`Whatsapp_Video mr-2 ${filter.consultation_type == 'Video' ? 'active' : ''}`} onClick={() => setFilter({ ...filter, consultation_type: 'Video', state: '', city: '', country: '' })}>
                                {languagesModel.translate('video_consultation', language)}
                            </div>

                            <div className={`Whatsapp_Video mr-2 ${filter.consultation_type == 'In-person' ? 'active' : ''}`} onClick={() => { countryChange(countryModel.list[0].isoCode); setFilter({ ...filter, consultation_type: 'In-person', country: countryModel.list[0].isoCode }); }}>
                                {languagesModel.translate('in-person_consultation', language)}
                            </div>
                        </div>

                        <div className="form-row">

                            {filter.consultation_type == 'In-person' || filter.consultation_type == '' ? <>
                                <div className='col-md-6 mb-3'>
                                    <h3 className="srchtxt">{languagesModel.translate('country_text', language)}</h3>
                                    <div className="dropdown">
                                        <button className={`form-control consolname text-left ${filter.country && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="text-truncate d-inline-block w-100 y-middle"> {filter.country ? methodModel.singleItem(filter.country, countryModel.list, 'isoCode').name : languagesModel.translate('select_country', language)}</span>
                                        </button>
                                        <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                            <a className={`dropdown-item ${filter.country == '' && 'active'}`} onClick={() => countryChange()}>{languagesModel.translate('all_text', language)}</a>
                                            {countryModel.list.map(itm => {
                                                return <a className={`dropdown-item ${filter.country == itm.isoCode && 'active'}`} onClick={() => countryChange(itm.isoCode)} key={itm.isoCode}>{itm.name}</a>
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <h3 className="srchtxt">{languagesModel.translate('state_text', language)}</h3>
                                    <div className="dropdown">
                                        <button className={`form-control consolname text-left ${filter.state && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="text-truncate d-inline-block w-100 y-middle"> {filter.state ? methodModel.find(states, filter.state, 'isoCode', 'name').name : languagesModel.translate('select_state', language)}</span>
                                        </button>
                                        <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                            <a className={`dropdown-item ${filter.state == '' && 'active'}`} onClick={() => stateChange()}>{languagesModel.translate('all_text', language)}</a>
                                            {states && states.map(itm => {
                                                return <a className={`dropdown-item ${filter.state == itm.isoCode && 'active'}`} onClick={() => stateChange(itm.isoCode)} key={itm.isoCode}>{itm.name}</a>
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6 mb-3'>
                                    <h3 className="srchtxt">{languagesModel.translate('city_text', language)}</h3>
                                    <div className="dropdown">
                                        <button className={`form-control consolname text-left ${filter.city && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="text-truncate d-inline-block w-100 y-middle">  {filter.city ? filter.city : languagesModel.translate('select_city', language)}</span>
                                        </button>
                                        <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                            <a className={`dropdown-item ${filter.city == '' && 'active'}`} onClick={() => setFilter({ ...filter, city: '' })}>{languagesModel.translate('all_text', language)}</a>
                                            {cities && cities.map(itm => {
                                                return <a className={`dropdown-item ${filter.city == itm.name && 'active'}`} onClick={() => setFilter({ ...filter, city: itm.name })} key={itm.name}>{itm.name}</a>
                                            })}
                                        </div>
                                    </div>
                                </div>

                            </> : <></>}


                            <div className="col-md-6 mb-3">
                                <h3 className="srchtxt">{languagesModel.translate('languages_text', language)}</h3>
                                <div className="dropdown">
                                    <button className={`form-control consolname text-left ${filter.languages && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {filter.languages ? filter.languages : languagesModel.translate('select_language', language)}
                                    </button>
                                    <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                        <a className={`dropdown-item ${filter.languages == '' && 'active'}`} onClick={() => setFilter({ ...filter, languages: '' })}>{languagesModel.translate('all_text', language)}</a>
                                        {languagesModel.list.map(itm => {
                                            return <a className={`dropdown-item ${filter.languages == itm && 'active'}`} onClick={() => setFilter({ ...filter, languages: itm })} key={itm}>{itm}</a>
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <h3 className="srchtxt">{languagesModel.translate('expertise_text', language)}</h3>
                                <div className="dropdown">
                                    <button className={`form-control consolname text-left ${filter.expertise && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="text-truncate d-inline-block w-100 y-middle">{filter.expertise ? filter.expertise : languagesModel.translate('select_expertise', language)}</span>
                                    </button>
                                    <div className="dropdown-menu consultationdrop" aria-labelledby="dropdownMenuButton">
                                        <a className={`dropdown-item ${filter.expertise == '' && 'active'}`} onClick={() => setFilter({ ...filter, expertise: '' })}>{languagesModel.translate('all_text', language)}</a>
                                        {expertiseModel.list.map(itm => {
                                            return <a className={`dropdown-item ${filter.expertise == itm && 'active'}`} onClick={() => setFilter({ ...filter, expertise: itm })} key={itm}>{itm}</a>
                                        })}
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-6 mb-3">
                                <h3 className="srchtxt">{languagesModel.translate('time_zone_text', language)}</h3>
                                <div className="dropdown mr-2">
                                    <button className={`form-control consolname text-left  ${filter.timeZone && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {filter.timeZone ? methodModel.singleItem(filter.timeZone, timezones, 'id') && `GMT${methodModel.singleItem(filter.timeZone, timezones, 'id').utc_offset}` : languagesModel.translate('select_time_zone', language)}
                                    </button>
                                    <div className="dropdown-menu consultationdrop " aria-labelledby="dropdownMenuButton">
                                        <a className={`dropdown-item ${filter.timeZone == '' && 'active'}`} onClick={() => setFilter({ ...filter, timeZone: '' })}>Timezone</a>
                                        {timezones.map(itm => {
                                            return <a className={`dropdown-item ${filter.timeZone == itm.id && 'active'}`} onClick={() => setFilter({ ...filter, timeZone: itm.id })} key={itm.id}>GMT{itm.utc_offset}</a>
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-3">
                                <h3 className="srchtxt">{languagesModel.translate('appointment_type_text', language)}</h3>
                                <div className="dropdown">
                                    <button className={`form-control consolname text-left ${filter.appointmentType && 'active'}`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {filter.appointmentType ? methodModel.singleItem(filter.appointmentType, appointmentTypes).appointmentType : languagesModel.translate('select_appointment_type', language)}
                                    </button>
                                    <div className="dropdown-menu consultationdrop " aria-labelledby="dropdownMenuButton">
                                        {/* <a className={`dropdown-item ${filter.appointmentType == '' && 'active'}`} onClick={() => setFilter({ ...filter, appointmentType: '', start: '' })}>All</a> */}
                                        {appointmentTypes.map(itm => {
                                            return <a className={`dropdown-item ${filter.appointmentType == itm.id && 'active'}`} onClick={() => { setFilter({ ...filter, appointmentType: itm.id }); setPlaceholder() }} key={itm.id}>{itm.appointmentType}</a>
                                        })}
                                    </div>
                                </div>
                            </div>

                            {filter.appointmentType ? <>
                                <div className="col-md-6 mb-3">
                                    <h3 className="srchtxt">{languagesModel.translate('date_text', language)}</h3>
                                    <DatePicker minDate={new Date()} onKeyDown={e => e.preventDefault()} selected={filter.start ? datepipeModel.isotodate(filter.start) : ''} onChange={e => { setFilter({ ...filter, start: datepipeModel.datetoIso(e) }) }} id="bookindatepicker1" className="form-control consolname" />
                                </div>

                                {filter.start ? <div className="col-md-12 mb-3">
                                    <h3 className="srchtxt">{languagesModel.translate('time_slot', language)}</h3>
                                    <div className="d-flex flex-wrap">
                                        {preferredTimeModel.timelist(filter.start).map(itm => {
                                            return <div className={`timeclses m-1 ${datepipeModel.time(itm.name) == datepipeModel.isotime(filter.start) && 'active'}`} key={itm.id} onClick={() => setTime(itm.name)}>{datepipeModel.time(itm.name)}</div>
                                        })}
                                    </div>
                                </div> : <></>}

                            </> : <></>}
                        </div>









                    </div>

                    <div className="modal-footer d-flex justify-content-between">
                        <button type="button" className="Clear_all" onClick={clearAll}>{languagesModel.translate('clear_all', language)}</button>
                        <button type="submit" className="btn btn-primary Show_btn" onClick={e => submit()}>{languagesModel.translate('show_button', language)}</button>
                    </div>

                </div>
            </div>
        </div>

    </>
}

export default FilterModal