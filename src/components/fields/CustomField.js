import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import languagesModel from '../../models/languages.model';
import './style.scss'

const CustomField = ({ type, value, onChange, options, required = false, name = "customRadio" }) => {
    const language = useSelector(state => state.language.data)

    const checkboxChange = (e) => {
        // onChange(e.target.value)
        let arr = value ? value : []
        if (e.target.checked) {
            arr.push(e.target.value)
        } else {
            arr = arr.filter(itm => itm != e.target.value)
        }

        onChange(arr)
    }

    const isChecked = (id) => {
        let checked = false
        if (value && value.length) {
            let ext = value.find(itm => itm == id)
            if (ext) checked = true
        }

        return checked
    }

    const checkRequired = () => {
        let v = false
        if (required) v = true
        if (value && value.length) v = false
        return v
    }

    return <>
        {type == 'text' ? <input type="text" className="form-control" value={value} onChange={e => onChange(e.target.value)} required={required} /> : <></>}
        {type == 'number' ? <input type="number" className="form-control" value={value} onChange={e => onChange(e.target.value)} required={required} /> : <></>}
        {type == 'textarea' ? <textarea type="text" className="form-control" value={value} onChange={e => onChange(e.target.value)} required={required} /> : <></>}
        {type == 'select' ? <select className="form-control" value={value} onChange={e => onChange(e.target.value)} required={required}>
            <option value="">{languagesModel.translate('select_option', language)}</option>
            {options && options.map(oitm => {
                return <option value={oitm.id ? oitm.id : oitm.name} key={oitm.id ? oitm.id : oitm.name}>{oitm.name}</option>
            })}
        </select> : <></>}
        {type == 'radio' ? <>
            <div className='customRadio'>
                {options && options.map(itm => {
                    return <label key={itm.id ? itm.id : itm.name}>
                        <input type="radio" className='mr-1' name={name} value={itm.name} checked={value == itm.name ? true : false} onChange={e => onChange(e.target.value)} required={required} /> {itm.name}
                    </label>
                })}
            </div>
        </> : <></>
        }

        {type == 'checkbox' ? <>
            <div className='customRadio'>
                {options && options.map(itm => {
                    return <label key={itm.id ? itm.id : itm.name}>
                        <input type="checkbox" className='mr-1' name={name} value={itm.name} checked={isChecked(itm.id ? itm.id : itm.name) ? true : false} onChange={e => checkboxChange(e)} required={checkRequired()} /> {itm.name}
                    </label>
                })}
            </div>
        </> : <></>
        }
    </>
}

export default CustomField