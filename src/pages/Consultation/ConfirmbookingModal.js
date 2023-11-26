import React, { } from "react";
import { useSelector } from "react-redux";
import datepipeModel from "../../models/datepipemodel";
import modalModel from "../../models/modal.model";
import languagesModel from '../../models/languages.model';



const ConfirmbookingModal = ({ form, filters, book }) => {
    const language = useSelector(state => state.language.data)

    const yes = () => {
        modalModel.close('confirmbookingModal')
        book(form)
    }

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    return <>
        <div className="modal fade" id="confirmbookingModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body confrmbookbody">
                        <h3 className="srchtxt mb-3">{languagesModel.translate('booking_confirm_title', language)}</h3>
                        <p className="srchtxtpara  mb-3 ">{languagesModel.translate('booking_confirm_detail', language)}</p>

                        <div className="d-flex">
                            <div className="text-center mainconfbokdiv">
                                <p className="Location pb-0">{languagesModel.translate('location_text', language)}</p>
                                <h3 className="Padang_Rengas px-2 text-capitalize">{form && form.healthClinicId && translate2(form.healthClinicId.nameTranslate, form.healthClinicId.name)}</h3>
                                <p className="Perak">{form && form.healthClinicId && form.healthClinicId.country}</p>
                            </div>

                            <div className="text-center mainconfbokdiv_second">
                                <p className="datetimediv">{languagesModel.translate('date_time_heading', language)}</p>
                                <h3 className="monthdiv">{filters && filters.start ? datepipeModel.date(filters.start) : 'Date'}</h3>
                                <p className="booktimediv">{filters && filters.start ? datepipeModel.isotime(filters.start) : 'Time'}</p>

                            </div>

                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <button type="submit" className="btn btn-primary showyes_btn ml-2 mt-4" onClick={e => yes()}>{languagesModel.translate('yes_text', language)}</button>
                            </div>
                            <div className="col-md-6 ">
                                <button type="button" className="showno_btn ml-5 mt-4" data-dismiss="modal">{languagesModel.translate('no_text', language)}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
}

export default ConfirmbookingModal