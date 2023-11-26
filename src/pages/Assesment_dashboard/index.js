
import React, { useEffect, useState } from "react";
import PageLayout from "../../components/global/PageLayout";
import "./style.scss"
import loader from "../../methods/loader";
import ApiClient from "../../methods/api/apiClient";
import { useSelector } from 'react-redux';
import datepipeModel from "../../models/datepipemodel";
import { Link } from "react-router-dom";


const AssessmentDashboard = () => {
    const user = useSelector(state => state.user)
    const [assessmentData, setAssessmentData] = useState()

    //on page render these all function will be called 
    useEffect(() => {
        getAssessmentdata()
    }, [])

    //fun() for getting assessment data from database
    const getAssessmentdata = () => {
        loader(true)
        ApiClient.get('assessments', { page: 1, count: 10, addedBy: user.id }).then(res => {
            if (res.success) {
                if (res.data.length) {
                    setAssessmentData(res.data)
                }
            }
            loader(false)
        })
    }

    return <>
        <PageLayout>

            <div className="container">
                <div className="d-flex align-items-center justify-content-between mb-3 top-bar">
                    <div className="username">
                        Assessments
                    </div>
                    <div className="download border-color">
                        <button className="btn btn-link">Retake assessment</button>
                    </div>
                </div>


                {
                    assessmentData && assessmentData.map((itm, i) => {
                        if (i == 0) {
                            return <div className="recent-result mb-4  bg-blue">
                                <div className="d-flex align-items-end justify-content-between bottom-border pb-4 mb-4">
                                    <div className="result">

                                        <h2>Recent Result</h2>
                                        <small>{datepipeModel.datetime(itm.createdAt)}</small>

                                    </div>
                                    <div className="download">
                                        <button className="btn btn-link"><i className="fa fa-download mr-2"></i> Download Result</button>
                                    </div>
                                </div>
                                <div className="save-result">
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <p>Recently, you seem to be experiencing <a href="javascript:;">{itm.result} Levels</a> of depression, anxiety and stress</p>
                                        </div>
                                        <div className="col-lg-7">
                                            <div className="row">
                                                {itm.categoryWiseResult.map(val => {
                                                    return <div className="col-lg-4">
                                                        <div className="boxes box-color1">
                                                            <p className="mb-4">{val.lable}</p>
                                                            <h2>{val.level_risk}<br></br>
                                                                <small>Risk</small></h2>
                                                        </div>
                                                    </div>
                                                })}


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        }
                    })
                }
                <div className="recent-result mb-4  bg-white border">
                    <div className="result mb-4">
                        <h2>Other Assessment</h2>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="assesment">
                                <h2>PHQ-9 Assessment</h2>
                                <div className="desc">
                                    <p className="mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                    <div className="download">
                                        <button className="btn btn-link">Take assessment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="assesment bg-change">
                                <h2>GAD-7 Assessment</h2>
                                <div className="desc">
                                    <p className="mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                    <div className="download">
                                        <button className="btn btn-link">Take assessment</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="past mb-4">
                    <div className="head">
                        <h2>Past Results</h2>
                    </div>


                    {
                        assessmentData && assessmentData.map(itm => {
                            return <div className="recent-result mb-4">
                                <div className="d-flex align-items-end justify-content-between bottom-border pb-4 mb-4">
                                    <div className="result">
                                        <h2>{datepipeModel.datetime(itm.createdAt)}</h2>
                                    </div>
                                    <div className="download">
                                        <button className="btn btn-link"><i className="fa fa-download mr-2"></i> Download Result</button>
                                    </div>
                                </div>
                                <div className="save-result">
                                    <div className="row">
                                        <div className="col-lg-5">
                                            <p className="mb-4">You seem to be experiencing
                                                <a href="javascript:;">{itm.result} Levels</a> of depression, anxiety and stress</p>
                                        </div>
                                        <div className="col-lg-7">
                                            <div className="row">
                                                {itm.categoryWiseResult.map(val => {
                                                    return <div className="col-lg-4 ">
                                                        <div className="boxes box-color1">
                                                            <p>{val.lable}</p>
                                                            <h2 className="text-size-scss">{val.level_risk}<br></br>
                                                                <small>Risk</small></h2>
                                                        </div>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                    }

                </div>

            </div>







        </PageLayout>
    </>
}

export default AssessmentDashboard