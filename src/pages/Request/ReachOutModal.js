import React from "react";
import { useSelector } from "react-redux";
import languagesModel from '../../models/languages.model';

const ReachOutModal = ({ form, setform }) => {
    const language = useSelector(state => state.language.data)

    return <>
        <div className="modal fade" id="reachoutModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"> {languagesModel.translate('reach_out_text', language)}</h5>
                        <button type="button" id="closeviewappointmentModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {languagesModel.translate('please_contact', language)} <a href={`mailto:hello@emesvipp.com`}>hello@emesvipp.com</a> / <a href={`tel:03-00000000`}>03-00000000</a>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ReachOutModal