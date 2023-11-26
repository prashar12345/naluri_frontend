import ApiKey from "./ApiKey"

const userImg = (img, dimg = '/assets/img/person.jpg') => {
    let value = dimg
    if (img) value = ApiKey.api + 'images/users/' + img
    return value
}

const noImg = (img) => {
    let value = '/assets/img/Image_not_available.png'
    if (img) value = ApiKey.api + 'images/blogs/' + img
    return value
}

const riskImg = (risk = '') => {
    let value = '/assets/img/lowRisk.png'
    if (risk && risk.toLowerCase().includes('moderate')) {
        value = '/assets/img/moderateRisk.png'
    } else if (risk && risk.toLowerCase().includes('high')) {
        value = '/assets/img/highRisk.png'
    } else if (risk && risk.toLowerCase().includes('low')) {
        value = '/assets/img/lowRisk.png'
    }
    return value
}

const getPrams = (p) => {
    const params = new URLSearchParams(window.location.search)
    return params.get(p)
}

const setPrams = (urldata = {}) => {
    let prms = '';
    let objArr = Object.keys(urldata);
    objArr.map((itm, i) => {
        if (i === 0) {
            prms = `?${itm}=${urldata[itm] ? urldata[itm] : ''}`
        } else if (urldata[itm]) {
            prms += `&${itm}=${urldata[itm]}`
        }
    })
    return prms
}


const isNumber = (e) => {
    let key = e.target;
    let maxlength = key.maxLength ? key.maxLength : 1;

    let max = Number(key.max ? key.max : key.value);
    if (Number(key.value) > max) key.value = max;

    // let min = key.min;
    // if (min && Number(key.value)<Number(min)) key.value = min;

    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
    key.value = key.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

    return key.value
}

const emailRequiredFor = (role) => {
    let value = false
    if (role === 'Clinic Admin' || role === 'Counsellor' || role === 'Owner' || role === 'admin') value = true
    return value
}

const isRatio = (e) => {
    let key = e.target;
    let maxlength = key.maxLength ? key.maxLength : 1;

    let max = Number(key.max ? key.max : key.value);
    if (Number(key.value) > max) key.value = max;

    // let min = key.min;
    // if (min && Number(key.value)<Number(min)) key.value = min;

    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
    key.value = key.value.replace(/[^0-9.>]/g, '').replace(/(\..*?)\..*/g, '$1');

    return key.value
}

const passwordMatch = (val) => {
    let value = false
    value = val.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*({:;,.></?"'})+=_-])[a-zA-Z0-9~`!@#$%^&*({:;,.></?"'})+=_-]{8,20}$/)
    return value
}

const emailMatch = (val) => {
    let value = false
    value = val.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    return value
}

const dialMatch = (val) => {
    let value = false
    value = val.match(/^(?=.*[0-9])(?=.*[+])[0-9+]{2,5}$/)
    return value
}

const find = (arr, value, key = 'key', showKey = '') => {
    let ext = arr.find(itm => itm[key] === value)
    if (showKey && !ext) {
        ext = { [showKey]: '' }
    }
    return ext
}


/* ###################### Form Methods #########################  */

// get Single field error
const getError = (key, fvalue, formValidation) => {
    let ext = find(formValidation, key)
    if (!ext) return false
    let res = matchError(ext, fvalue)
    return res
}

// match errors for fields
const matchError = (ext, fValue) => {
    let kValue = fValue[ext.key]
    let value = { minLength: false, maxLength: false, confirmMatch: false }
    if (ext.minLength && kValue) {
        if (kValue.length < ext.minLength) value.minLength = true
    }
    if (ext.maxLength && kValue) {
        if (kValue.length > ext.maxLength) value.maxLength = true
    }

    if (ext.email && kValue) {
        if (!emailMatch(kValue)) value.email = true
    }

    if (ext.dialCode && kValue) {
        if (dialMatch(kValue)) {
            kValue.indexOf("+");
            if (kValue.indexOf("+") !== 0) {
                value.dialCode = true
            }

        } else {
            value.dialCode = true
        }
    }

    if (ext.password && kValue) {
        if (!passwordMatch(kValue)) value.password = true
    }

    if (ext.confirmMatch && kValue) {
        if (fValue[ext.confirmMatch[0]] !== fValue[ext.confirmMatch[1]]) value.confirmMatch = true
    }

    let invalid = false
    let vArr = Object.keys(value)
    vArr.map(itm => {
        if (value[itm]) invalid = true
    })

    let res = { invalid: invalid, err: value }
    return res
}

// get form error (All Fields)
const getFormError = (formValidation, fvalue, formName = 'another') => {
    let invalid = false
    formValidation.map(ext => {
        if (matchError(ext, fvalue).invalid) {
            let el = document.getElementById(`${formName}-${ext.key}`)
            if (el) el.focus()
            invalid = true
        }
    })
    return invalid
}

/* ###################### Form Methods end #########################  */

const singleItem = (id, arr, key = 'id') => {
    let ext = arr.find(itm => itm[key] === id)
    return ext
}

const singleAddress = (list = [], keyv) => {
    let value = ''
    let ext = list.find(itm => itm.name === keyv)
    if (ext) value = ext.isoCode
    return value
}

const methodModel = { userImg, isNumber, isRatio, find, getError, getFormError, getPrams, passwordMatch, riskImg, emailRequiredFor, singleAddress, setPrams, singleItem, noImg }
export default methodModel