import React, { useState } from "react";
import { useSelector } from "react-redux";
import datepipeModel from "../../models/datepipemodel";
import modalModel from "../../models/modal.model";
import statusModel from "../../models/status.model";

const ViewCalendar = ({ form, viewAppointment, editAvailability }) => {
    const language = useSelector(state => state.language.data)

    const addAppointment = () => {
        modalModel.close('ViewCalendarModal')
        modalModel.open('appointmentModal')
    }

    const viewAppoint = (id) => {
        modalModel.close('ViewCalendarModal')
        viewAppointment(id)
    }

    return <>
        <div className="modal fade modal-md" id="ViewCalendarModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-md-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">View Calendar</h5>
                        <button type="button" id="closeviewappointmentModal" className="close" data-dismiss="modal" aria-label="Close" title="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <h5 className="mb-2">Availability</h5>
                        <p>{form && form.availablity && form.availablity.start ? <>
                            {datepipeModel.isotime(form.availablity.start)}-{datepipeModel.isotime(form.availablity.end)}
                        </> : form && form.weeklyAvailablity && form.weeklyAvailablity.start ? <>
                            {datepipeModel.time(form.weeklyAvailablity.start)}-{datepipeModel.time(form.weeklyAvailablity.end)}
                        </> : <></>}
                            <i className="fa fa-pen ml-2 text-primary cursor-pointer" title="Edit" onClick={e => editAvailability()}></i>
                        </p>


                        <div className="d-flex mb-2">
                            <h5 className="mb-0">Consultation Sessions</h5>
                            <a className="font-weight-bold text-primary ml-auto" onClick={addAppointment}>Add Appointment</a>
                        </div>

                        <div className="bookings form-row">
                            {form && form.events && form.events.length ? <>
                                {form.events.map(itm => {
                                    return <div className="col-md-4 mb-3" key={itm.id} onClick={e => viewAppoint(itm.id)}>
                                        <div className="bookingitem">
                                            <div className="mb-1"> {datepipeModel.isotime(itm.start)}-{datepipeModel.isotime(itm.end)}</div>
                                            {statusModel.html(itm.status, language)}
                                        </div>
                                    </div>
                                })}
                            </> : <>
                                <div className="col-md-6 mb-3">No Consultation Sessions</div>
                            </>}

                        </div>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ViewCalendar