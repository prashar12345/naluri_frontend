const list = [
    { isoCode: 'MY', name: 'Malaysia' },
    { isoCode: 'ID', name: 'Indonesia' },
    { isoCode: 'SG', name: 'Singapore' },
    { isoCode: 'TH', name: 'Thailand' },
    { isoCode: 'PH', name: 'Philippines' },
    { isoCode: 'HK', name: 'Hong Kong S.A.R.' }
]

const find = (isoCode) => {
    return list.find(itm => itm.isoCode === isoCode)
}

const name = (code) => {
    let ext = list.find(itm => itm.isoCode === code)
    let value = ext ? ext.name : code
    return value
}

const countryModel = { list, find, name }
export default countryModel