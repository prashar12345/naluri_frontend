import React, { } from "react";
import ApiClient from '../../methods/api/apiClient';
import loader from "../../methods/loader";
import ApiKey from "../../methods/ApiKey";
import methodModel from "../../methods/methods";
import languagesModel from '../../models/languages.model';
import { useSelector } from "react-redux";
const ViewAssessment = ({ form }) => {
    const language = useSelector(state => state.language.data)

    const download = () => {

        loader(true)
        ApiClient.get('assessment/result', { id: form.id }).then(res => {

            if (res.success) {
                let url = ApiKey.api + res.path
                setTimeout(() => {
                    window.open(url, '_blank');
                }, 1000)

            }
            loader(false)
        })
    }

    const riskImg = (risk) => {
        return methodModel.riskImg(risk)
    }

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    return <>
        <a id="openviewAsseessmentModal" data-toggle="modal" data-target="#viewAsseessmentModal"></a>
        <div className="modal fade" id="viewAsseessmentModal" role="dialog" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{languagesModel.translate('view_assessment', language)}</h5>
                        <button type="button" id="closeViewAsseessmentModal" className="close" data-dismiss="modal" aria-label="Close" title="close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {form && form.assessmentResults && form.assessmentResults.map(itm => {
                            return <div className="p-3 shadow mb-3">
                                <div className="resultSection">
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <img src={riskImg(itm.result)} className="w-100" />
                                        </div>
                                        <div className="col-md-8">
                                            <h3 className="text-primary">{translate2(itm.result_translate, itm.result)} {languagesModel.translate('risk_text', language)}</h3>
                                            <p>{languagesModel.translate('of_dispression_anxiety_and_stress_symptoms', language)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    {itm.categoryWiseResult && itm.categoryWiseResult.map(citm => {
                                        return <div className="col-md-4 mb-3" key={citm.lable}>
                                            <div className="DepressionScore text-center">
                                                <h3 className="Depression pb-2 text-capitalize">{translate2(citm.lable_translate, citm.lable)}</h3>
                                                <h5 className="text-capitalize">
                                                    {translate2(citm.level_translate, citm.level_risk)}
                                                </h5>
                                                <h3 className="textcls text-capitalize">{languagesModel.translate('risk_text', language)}</h3>
                                            </div>
                                        </div>
                                    })}

                                    <div className="col-md-12">
                                        <div className="bg-light p-2 rounded mb-3">{languagesModel.translate('dashboard__answer', language)}</div>
                                        <h5>{languagesModel.translate('text_over_the_last_two_weeks', language)}</h5>
                                        <div className="overflow-auto">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>{languagesModel.translate('items_text', language)}</th>
                                                        <th>{languagesModel.translate('answers_text', language)}</th>
                                                        <th>{languagesModel.translate('scores_text', language)}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {form && form.assesment.map(qitm => {
                                                        if (qitm.questionId.type == itm.type.id)
                                                            return <tr key={qitm.questionId.id}>
                                                                <td>
                                                                    {languagesModel.translate(`question_${qitm.questionId.id}`, language, qitm.questionId.question)}
                                                                    {/* {itm.questionId && itm.questionId.question} */}
                                                                </td>
                                                                <td>
                                                                    {languagesModel.translate(`option_q${qitm.questionId.id}_o${qitm.answer}`, language, qitm.answerId)}

                                                                </td>
                                                                <td>{qitm.weightage}</td>
                                                            </tr>
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        })}



                    </div>


                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">{languagesModel.translate('close_btutton', language)}</button>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={download}>{languagesModel.translate('download_result_button', language)}</button>
                    </div>

                </div>
            </div>
        </div>
    </>
}

export default ViewAssessment