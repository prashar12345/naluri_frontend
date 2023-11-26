import React, { } from "react";
import { useSelector } from "react-redux";
import datepipeModel from "../../models/datepipemodel";
import languagesModel from '../../models/languages.model';

const ViewAvailability = ({ form }) => {
    const language = useSelector(state => state.language.data)

    return <>
        <a id="openviewappointmentModal" data-toggle="modal" data-target="#viewappointmentModal"></a>
        <div className="modal fade" id="viewappointmentModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{languagesModel.translate('view_availability', language)}</h5>
                        <button type="button" id="closeviewappointmentModal" className="close" data-dismiss="modal" aria-label="Close" title="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-row">
                            <div className="col-md-12 mb-3">
                                <label className="viewhedding">{languagesModel.translate('schedule_date', language)}</label>
                                <p className="mb-0">{form && form.scheduleDate && datepipeModel.date(form.scheduleDate)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="viewhedding">{languagesModel.translate('start_button', language)}</label>
                                <p className="mb-0">{form && form.start && datepipeModel.isotime(form.start)}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="viewhedding">{languagesModel.translate('end_text', language)}</label>
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
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ViewAvailability