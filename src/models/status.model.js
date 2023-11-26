import React from "react"
import languagesModel from "./languages.model"

const list = [
    { id: 'Upcoming', value: 'Upcoming' },
    { id: 'Cancelled', value: 'Cancelled' },
    { id: 'Completed', value: 'Completed' },
    { id: 'Under Approval', value: 'Pending Rescheduling Approval' },
    { id: 'Reschedule', value: 'Reschedule approved' },
    { id: 'Pending', value: 'Pending Appointment Approval' },
    { id: 'Cancel Request', value: 'Pending Cancellation' },
]

const name = (key) => {
    let value = list.find(itm => itm.id === key)
    value = value ? value.value : key
    return value
}



const html = (key, language = '') => {
    let value = list.find(itm => itm.id === key)
    let html = <><span className="status">
        <span className="material-symbols-outlined">calendar_month</span> {languagesModel.translate(key, language, key)}
    </span>
    </>

    if (value) {
        if (key === 'Upcoming') html = <span className="status status-blue">
            <span className="material-symbols-outlined">event_upcoming</span> {languagesModel.translate(value.id, language, value.value)}
        </span>

        if (key === 'Reschedule') html = <span className="status status-blue">
            <span className="material-symbols-outlined">edit_calendar</span> {languagesModel.translate(value.id, language, value.value)}
        </span>

        if (key === 'Pending' || key === 'Under Approval' || key === 'Cancel Request' || key === 'pending') html = <span className="status status-yellow">
            <span className="material-symbols-outlined">pending</span> {languagesModel.translate(value.id, language, value.value)}
        </span>

        if (key === 'Cancelled') html = <span className="status status-blue">
            <span className="material-symbols-outlined">cancel</span> {languagesModel.translate(value.id, language, value.value)}
        </span>

        if (key === 'Cancelled') html = <span className="status status-red">
            <span className="material-symbols-outlined">cancel</span> {languagesModel.translate(value.id, language, value.value)}
        </span>

        if (key === 'Completed') html = <span className="status status-green">
            <span className="material-symbols-outlined"> check_circle</span> {languagesModel.translate(value.id, language, value.value)}
        </span>
    }

    return html
}

const statusModel = { list, name, html }
export default statusModel