import React, { useState } from "react";
import datepipeModel from "../../models/datepipemodel";

const ViewAvailability = ({ form }) => {

    return <>
        <a id="openviewappointmentModal" data-toggle="modal" data-target="#viewappointmentModal"></a>
        <div className="modal fade" id="viewappointmentModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">View Availability</h5>
                        <button type="button" id="closeviewappointmentModal" className="close" data-dismiss="modal" aria-label="Close" title="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="col-md-12 mb-3">
                                <label>Schedule date</label>
                                <p className="mb-0">{form && form.scheduleDate && datepipeModel.date(form.scheduleDate)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Start</label>
                                <p className="mb-0">{form && form.start && datepipeModel.isotime(form.start)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>End</label>
                                <p className="mb-0">{form && form.end && datepipeModel.isotime(form.end)}</p>
                            </div>
                            {/* <div className="col-md-12">
                                <label>Slots</label>
                                {form && form.slots && form.slots.map(itm => {
                                    return <div className="form-row shadow mx-0 p-2 mb-3" key={itm.id}>
                                        <div className="col-6">
                                            <label>Start</label>
                                            <p className="mb-0">{datepipeModel.isotime(itm.start)}</p>
                                        </div>
                                        <div className="col-6">
                                            <label>End</label>
                                            <p className="mb-0">{datepipeModel.isotime(itm.end)}</p>
                                        </div>
                                    </div>
                                })}

                            </div> */}
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

export default ViewAvailability