import React, { useEffect, useState } from 'react';
import './style.scss';
import { useSelector } from 'react-redux';
import PageLayout from '../../components/global/PageLayout';
import ApiClient from '../../methods/api/apiClient';
import languagesModel from '../../models/languages.model';


const Terms = (p) => {
    const language = useSelector(state => state.language.data)
    const [detail, setDetail] = useState()
    const [loader, setLoader] = useState()

    const getData = () => {
        setLoader(true)
        ApiClient.get('content', { slug: 'terms-conditions' }).then(res => {
            if (res.success) {
                setDetail(res.data)
            }
            setLoader(false)
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
            <div className='aboutusmain'>
                <div className='container'>
                    {loader ? <>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="shine shineCard"></div>
                            </div>
                            <div className="col-md-6">
                                <div className="shine mb-3"></div>
                                <div className="shine mb-3"></div>
                                <div className="shine mb-3"></div>
                                <div className="shine mb-3"></div>
                                <div className="shine mb-3"></div>
                                <div className="shine mb-3"></div>
                                <div className="shine mb-3"></div>
                            </div>
                        </div>
                        <div className="shine mb-3"></div>
                        <div className="shine mb-3"></div>
                        <div className="shine mb-3"></div>
                        <div className="shine mb-3"></div>
                        <div className="shine mb-3"></div>
                        <div className="shine mb-3"></div>
                        <div className="shine mb-3"></div>
                    </> : <>
                        <h3 className="mt-4 text-center text-primary">{detail && translate2(detail.titleTranslate, detail.title)}</h3>
                        <p className='aboutuspaira mt-3' dangerouslySetInnerHTML={{ __html: detail && translate2(detail.descriptionTranslate, detail.description) }}></p>
                    </>}

                </div>

            </div>
        </PageLayout>
    );
};

export default Terms;
