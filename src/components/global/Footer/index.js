import React from 'react';
import './style.scss';
import { useSelector } from 'react-redux';
import languagesModel from '../../../models/languages.model';


const Footer = () => {
    const language = useSelector(state => state.language.data)
    return (
        <>
            <div className="bottomclass mb-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 border-top d-flex justify-content-between ">
                            <div>
                                <h3 className="textbt mt-4">{languagesModel.translate('home_footer', language)}</h3>
                            </div>
                            <div className="mt-3 iconclass">
                                <i className="fab fa-facebook-square mx-1 mr-3" aria-hidden="true"></i>
                                <i className="fab fa-linkedin mx-1 mr-3" aria-hidden="true"></i>
                                <i className="fab fa-twitter mx-1 mr-3"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
