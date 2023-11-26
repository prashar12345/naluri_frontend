import React, { useEffect, useState } from 'react';
import PageLayout from "../../components/global/PageLayout";
import { useSelector } from 'react-redux';
import loader from '../../methods/loader';
import ApiClient from '../../methods/api/apiClient';
import languagesModel from '../../models/languages.model';
import './style.scss';



const Faq = (p) => {
    const user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    // const [total, setTotal] = useState(0)
    const [faqData, setFaqData] = useState(0)
    const [loading, setloadind] = useState(false)

    const getData = (p = {}) => {
        setloadind(true)
        ApiClient.get('faqs').then(res => {
            if (res.success) {
                setFaqData(res.data)
                // setTotal(res.total)

            }
            setloadind(false)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }


    return (
        <PageLayout>

            <div className='faqbgimg d-flex'>
                <div className='container my-auto'>
                    <div className='row '>
                        <div className='col-md-12 faqdivclss '>
                            <div className='row'>
                                <div className='col-md-12'>

                                    <div className="accordion">
                                        <h3 className='Confirm_faq mb-3'>{languagesModel.translate('faq_text', language)}</h3>
                                        {
                                            loading ? <div>
                                                <div className="shine m-3 p-3"></div>
                                                <div className="shine m-3 p-3"></div>
                                                <div className="shine m-3 p-3"></div>
                                                <div className="shine m-3 p-3"></div>
                                            </div> : <>{faqData && faqData.map((itm, i) => {
                                                return <details key={i}>
                                                    <p className=''>{translate2(itm.answereTranslate, itm.answer)}</p>
                                                    <summary>
                                                        <h3 className='questioncls'>{translate2(itm.questionTranslate, itm.question)}<i className="fa fa-angle-down faqdrop" aria-hidden="true"></i></h3>
                                                    </summary>
                                                </details>
                                            })}

                                                {faqData.length ? <></> : <>No Data Exist</>}
                                            </>
                                        }

                                        {/* <details>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.!</p>
                                            <summary>
                                                <h3 className='questioncls'>Lorem Ipsum is simply dummy text of the printing and typesetting industry? </h3>
                                            </summary>
                                        </details>
                                        <details>
                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.!</p>
                                            <summary>
                                                <h3 className='questioncls'>Lorem Ipsum is simply dummy text of the printing and typesetting industry? </h3>
                                            </summary>
                                        </details> */}
                                    </div>
                                </div>

                            </div>


                        </div>
                    </div>
                </div>

            </div>

        </PageLayout >


    );
};

export default Faq;
