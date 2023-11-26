
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import languagesModel from '../../models/languages.model';

const CaseNote = ({ }) => {
    const language = useSelector(state => state.language.data)
    const user = useSelector(state => state.user)
    const [users, setUsers] = useState()
    useEffect(() => {

    }, [])


    return <>
        <a id="openviewModal" data-toggle="modal" data-target="#viewModal"></a>
        <div className="modal fade" id="viewModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content ">
                    <div className='modal-body '>
                        <button type="button" id="closeviewModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="row">

                            <div className="sideclass col-md-4">
                                <h3 className="Profilehedding mt-3 ">
                                    {languagesModel.translate('profile_details', language)}
                                </h3>

                                <div className="row border-bottom mt-4">
                                    <div className="col-md-6 sidefont"> {languagesModel.translate('ic_no_heading', language)}</div>
                                    <div className="col-md-6 rightfont">931212-09-0909</div>
                                </div>
                                <div className="row border-bottom mt-4">
                                    <div className="col-md-6 sidefont">{languagesModel.translate('phonenumber_heading', language)}</div>
                                    <div className="col-md-6 rightfont">0123456789</div>
                                </div>
                                <div className="row border-bottom mt-4 mr-1">
                                    <div className="col-md-6 sidefont">{languagesModel.translate('email_text', language)}</div>
                                    <div className="col-md-6 rightfont">suzainal@example.com</div>
                                </div>
                            </div>

                            <div className="col-md-8 pl-5">
                                <h3 className="Profilehedding ml-3">
                                    {languagesModel.translate('new_case_note', language)}
                                </h3>

                                <input type="text" id="fname" name="firstname" placeholder="Title" className='form-control mb-2' />
                                <textarea id="textarea" name="text" rows="4" cols="50" placeholder='Body' className='form-control txarescls' ></textarea>

                                <div className='text-right mt-3'>
                                    <button className='btn btn-outline-primary buttonclass mr-2' data-dismiss="modal"> {languagesModel.translate('cancel_button', language)}</button>
                                    <button className='btn btn-secondary buttonSave '> {languagesModel.translate('save_btn', language)}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>

}

export default CaseNote