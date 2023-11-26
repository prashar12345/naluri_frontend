import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ApiClient from '../../methods/api/apiClient';
import './style.scss';
import { useHistory, useParams } from 'react-router-dom';
import PageLayout from '../../components/global/PageLayout';
import methodModel from '../../methods/methods';
import { Link } from 'react-router-dom';
import languagesModel from '../../models/languages.model';

const BlogDetail = (p) => {
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [data, setData] = useState([])
    const [similarblog, setsimilarblog] = useState([])
    const [total, setTotal] = useState(0)
    const [loader, setLoader] = useState(true)
    let { id } = useParams();
    const history = useHistory()

    const getData = (p = {}) => {
        setLoader(true)
        let filter = { id }
        ApiClient.get('blog', filter).then(res => {
            if (res.success) {
                setData(res.data)

                setTotal(res.total)
            }
            setLoader(false)
        })
    }

    const similarBlog = (p = {}) => {
        setLoader(true)
        let filter = { id }
        ApiClient.get('similar/blog', filter).then(res => {
            if (res.success) {
                setsimilarblog(res.data)

                setTotal(res.total)
            }
            setLoader(false)
        })
    }

    const back = () => {
        history.goBack()
    }

    useEffect(() => {
        getData()
        similarBlog()
        if (user && user.loggedIn) {
        }
    }, [id])

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    return (<PageLayout>
        {loader ? <>
            <div className='aboutusmain'>
                <div className='aboutusimgdiv shine shineCard'>
                </div>
                <div className='container mt-3'>
                    <div className="shine mb-3"></div>
                    <div className="shine mb-3"></div>
                    <div className="shine mb-3"></div>
                    <div className="shine mb-3"></div>
                    <div className="shine mb-3"></div>
                </div>
            </div>
        </> : <>
            <div className='aboutusmain mb-5'>
                <div className='text-right backdiv'>
                    <a onClick={back} className="fa fa-arrow-left blogback" aria-hidden="true"> </a>
                </div>

                {/* {data && data.map(itm => {
                    return <div className='text-right backdiv' key={itm.id}>
                        <Link to={`/bloglisting/${itm.id}?cat=${translate2(itm.nameTranslate, itm.name)}`} class="fa fa-arrow-left blogback" aria-hidden="true"></Link>
                    </div>
                })} */}

                <div className='aboutusimgdiv'>
                    <img src={methodModel.noImg(data && data.image)} className='aboutusimg w-100' />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className=''>
                            <div className='col-md-12'>
                                <h3 className="blogdetailhedding mt-4 mb-4">{data && translate2(data.titleTranslate, data.title)}</h3>
                                <div className='blogdetailpaira mb-5'>
                                    <p className='blogdetailpaira mt-3' dangerouslySetInnerHTML={{ __html: data && translate2(data.descTranslate, data.description) }}>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            {/* similar blogs */}


            <div className='text-center mb-4 mt-5'>
                <h3 className='related_articles'>{languagesModel.translate('related_articles', language)}</h3>
                <i className="fa fa-arrow-down" aria-hidden="true"></i>
            </div>

            <div className='container calclss'>
                <div className='row'>
                    {similarblog && similarblog.map(itm => {
                        return <div className='col-md-3' key={itm.id}>
                            <Link className='textstyle' to={`/blogdetail/${itm.id}`}>
                                <div style={{ backgroundImage: `url(${methodModel.noImg(itm.image)})` }} className='w-100 blogimg'>
                                    {/* <h3 className='categorytext m-auto pl-3 text-capitalize'>{translate2(data.titleTranslate, data.title)}</h3> */}
                                </div>


                            </Link>
                            <Link to={`/blogdetail/${itm.id}`} className='seemorcls'>
                                <div className='blogtext mt-2 mb-5'>
                                    <h3 className='blogpaira text-truncate text-capitalize'>{translate2(itm.titleTranslate, itm.title)} </h3>
                                </div>
                            </Link>
                        </div>

                    })}
                    {/* <div className='col-md-3' key="">
                        <div className='blogcard'>
                            <img src="/assets/img/blogdetail.jpg" className='w-100 blogimg' />
                        </div>


                        <Link to="" className='seemorcls'>
                            <div className='blogtext mt-2 mb-5'>
                                <h3 className='blogpaira text-truncate text-capitalize'>
                                    18 Best B2B Website Examples & How to Design a Great B2B Website
                                </h3>
                            </div>
                        </Link>
                    </div>
                    <div className='col-md-3' key="">
                        <div className='blogcard'>
                            <img src="/assets/img/faqq.png" className='w-100 blogimg' />
                        </div>


                        <Link to="" className='seemorcls'>
                            <div className='blogtext mt-2 mb-5'>
                                <h3 className='blogpaira text-truncate text-capitalize'>
                                    18 Best B2B Website Examples & How to Design a Great B2B Website
                                </h3>
                            </div>
                        </Link>
                    </div>
                    <div className='col-md-3' key="">
                        <div className='blogcard'>
                            <img src="/assets/img/Hospital marketing trends.webp" className='w-100 blogimg' />
                        </div>


                        <Link to="" className='seemorcls'>
                            <div className='blogtext mt-2 mb-5'>
                                <h3 className='blogpaira text-truncate text-capitalize'>
                                    18 Best B2B Website Examples & How to Design a Great B2B Website
                                </h3>
                            </div>
                        </Link>
                    </div> */}



                </div>
                {!loader && total == 0 ? <div className="py-3 text-center"><img src="/assets/img/Nodata.jpg" alt="No Data img" className="no-data-img" /></div> : <></>}
            </div>

        </>}
    </PageLayout>
    );
};
export default BlogDetail;
