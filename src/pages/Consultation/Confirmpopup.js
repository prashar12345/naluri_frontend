import React, { useState } from "react";
import { useSelector } from "react-redux";




const Confirmpopup = ({ form }) => {
    const user = useSelector(state => state.user)




    return <>
        <a id="openConfirmpopupModal" data-toggle="modal" data-target="#confirmpopupModal"></a>
        <div className="modal fade" id="ConfirmpopupModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-center">Filter</h5>
                        <button type="button" id="ConfirmpopupModal" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <h3 className="srchtxt mb-3">Search Counsellor</h3>
                        <input className="consolname mb-4" type="text" placeholder="Counsellor name" />

                        <h3 className="srchtxt mb-3 ">Consultation Preference</h3>

                        <div className="d-flex">
                            <div className="Whatsapp_Video mr-2">
                                Whatsapp Video Consultation
                            </div>

                            <div className="Whatsapp_Video">
                                Whatsapp Video Consultation
                            </div>
                        </div>

                        <h3 className="srchtxt mt-4">Date</h3>
                        <div className="">
                            <p>November 2022</p>
                            <div className=""></div>

                        </div>


                        <h3 className="srchtxt mt-4">Time Slot</h3>
                        <div className="d-flex">
                            <div className="timeclses mr-2">9:00 AM</div>
                            <div className="timeclses mr-2">9:00 AM</div>
                            <div className="timeclses mr-2">9:00 AM</div>
                            <div className="timeclses mr-2">9:00 AM</div>
                            <div className="timeclses ">9:00 AM</div>
                        </div>

                        <div className="d-flex mt-2">
                            <div className="timeclses mr-2">9:00 AM</div>
                            <div className="timeclses mr-2">9:00 AM</div>
                            <div className="timeclses mr-2">9:00 AM</div>
                            <div className="timeclses mr-2">9:00 AM</div>
                            <div className="timeclses ">9:00 AM</div>
                        </div>


                    </div>



                    <div className="modal-footer d-flex justify-content-between">
                        <button type="button" className="Clear_all" data-dismiss="modal">Clear all</button>
                        <button type="submit" className="btn btn-primary Show_btn" >Show</button>
                    </div>

                </div>
            </div>
        </div>

    </>
}

export default Confirmpopup