import datepipeModel from "./datepipemodel"
import React from "react"

const list = [
    { key: 'caseType', value: 'Type of case', pipe: '' },
    { key: 'severityLevel', value: 'Level of severity', pipe: '' },
    { key: 'clientStatus', value: 'Client status', pipe: '' },
    { key: `counsellorId`, value: `Counsellor's Name`, includes: ['fullName'], pipe: '' },
    { key: `counsellorId`, value: `Counsellor's Mobile`, includes: ['mobileNo'], pipe: '' }
]

const cols = [
    {
        name: `Type of case`,
        html: (itm) => {
            return <>{itm.caseType}</>
        }
    },
    {
        name: `Level of severity`,
        html: (itm) => {
            return <>{itm.severityLevel}</>
        }
    },
    {
        name: `Client status`,
        html: (itm) => {
            return <>{itm.clientStatus}</>
        }
    },
    {
        name: `Counsellor's Name`,
        html: (itm) => {
            return <>{itm.counsellorId ? itm.counsellorId.fullName : <></>}</>
        }
    },
    {
        name: `Counsellor's Mobile`,
        html: (itm) => {
            return <>{itm.counsellorId ? itm.counsellorId.mdialCode + itm.counsellorId.mobileNo : <></>}</>
        }
    },
    {
        name: `IC No. or Passport No.`,
        html: (itm) => {
            return <>{itm.userId ? itm.userId.ic_number : <></>}</>
        }
    },
    {
        name: `User's Mobile`,
        html: (itm) => {
            return <>{itm.userId ? itm.userId.mdialCode + itm.userId.mobileNo : <></>}</>
        }
    }, {
        name: `Support Letter`,
        html: (itm) => {
            return <>{itm.userId ? itm.userId.supportLetter : <></>}</>
        }
    }, {
        name: `Duration`,
        html: (itm) => {
            return <>{itm.appointmentId ? <>{datepipeModel.isotime(itm.appointmentId.start)} - {datepipeModel.isotime(itm.appointmentId.end)}</> : <>
                {datepipeModel.isotime(itm.start)} - {datepipeModel.isotime(itm.end)}
            </>}</>
        }
    },
]

const find = (key) => {
    let value = list.find(itm => itm.id == key)
    return value
}

const colView = (col, item) => {
    let value = item[col.key]

    if (col.includes && value) {
        col.includes.map(itm => {
            value = value[itm]
        })
    }

    if (col.pipe == 'date') {
        value = value ? `${datepipeModel.date(value)}` : ''
    }
    else if (col.pipe == 'dateNtime') {
        value = value ? `${datepipeModel.date(value)} | ${datepipeModel.time(value)}` : ''
    }
    else if (col.pipe == 'mobile') {
        value = value ? `${item[col && col.codeKey]} ${value}` : ''
    }
    return value
}

const caseTableModel = { list, find, colView, cols }
export default caseTableModel