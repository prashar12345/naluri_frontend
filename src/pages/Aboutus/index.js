import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import PageLayout from '../../components/global/PageLayout';
import ApiClient from '../../methods/api/apiClient';
import languagesModel from '../../models/languages.model';

const Aboutus = (p) => {
    const [detail, setDetail] = useState()
    const [loader, setLoader] = useState(false)
    const language = useSelector(state => state.language.data)

    const getData = () => {
        setLoader(true)
        ApiClient.get('content', { slug: 'about-us' }).then(res => {
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

                <div className='row m-0'>
                    <div className='col-md-12'>
                        <div className='aboutusimgdiv'>
                            {loader ? <div className="shine shineCard"></div> : <img src="/assets/img/men.jpg" className='aboutusimg w-100' />}
                        </div>
                    </div>
                    <div className='container'>
                        <div className='row'>


                            <div className='col-md-12'>
                                <div className=''>
                                    {loader ? <></> : <h3 className="aboutheddingcls text-center mt-4">{detail && translate2(detail.titleTranslate, detail.title)}</h3>}
                                    <div className='aboupara'>

                                        {loader ? <>
                                            <div className="shine mb-3"></div>
                                            <div className="shine mb-3"></div>
                                            <div className="shine mb-3"></div>
                                            <div className="shine mb-3"></div>
                                            <div className="shine mb-3"></div>
                                            <div className="shine mb-3"></div>
                                            <div className="shine mb-3"></div>
                                        </> : <>

                                        </>}

                                    </div>
                                </div>
                            </div>
                            <div className='col-md-12 mt-3'>
                                {loader ? <>
                                    <div className="shine mb-3"></div>
                                    <div className="shine mb-3"></div>
                                    <div className="shine mb-3"></div>
                                    <div className="shine mb-3"></div>
                                    <div className="shine mb-3"></div>
                                    <div className="shine mb-3"></div>
                                    <div className="shine mb-3"></div>
                                    <div className="shine mb-3"></div>
                                    <div className="shine mb-3"></div>
                                </> : <>
                                    <p className='aboutuspaira' dangerouslySetInnerHTML={{ __html: detail && translate2(detail.descriptionTranslate, detail.description) }}></p>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default Aboutus;
