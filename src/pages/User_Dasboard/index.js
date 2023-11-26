
import React from "react";
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import "./style.scss"
import languagesModel from '../../models/languages.model';
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import ApiKey from '../../methods/ApiKey';
import Layout from "../../components/global/layout";
import Footer from "../../components/global/Footer";
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import PageLayout from "../../components/global/PageLayout";

const UserDashboard = () => {
    var settings = {
        dots: false,
        arrow: true,
        infinite: false,
        // slidesToScroll: 3,
        // slidesToShow: 3,
        centerMode: false,
        variableWidth: true
    };

    const [sliderCardData, setSliderData] = useState()
    const [blogs, setBlogs] = useState([])
    const [catIndex, setCatIndex] = useState(0)

    const language = useSelector(state => state.language.data)
    const user = useSelector(state => state.user)
    const [assessment, setAssessment] = useState()

    const download = (id = '', type) => {
        loader(true)
        ApiClient.get('assessment/result', {
            id: assessment.id, lang: language.code, type: type
        }).then(res => {
            if (res.success) {
                page('Download Assessment Result')
                let url = ApiKey.api + res.path
                setTimeout(() => {
                    window.open(url, '_blank');
                }, 2000)

            }
            loader(false)
        })
    }

    const sliderData = () => {
        ApiClient.get('blog/slider').then(res => {
            if (res.success) {
                if (res.data.length) {
                    setSliderData(res.data)
                    setBlogs(res.data[0].blog)
                }
            }
        })
    }

    const catClick = (i) => {
        // blogIndex(i)
        eventClick('content', sliderCardData[i].name)
        setCatIndex(i)
        setBlogs(sliderCardData[i].blog)
    }

    //on page render these all function will be called 
    useEffect(() => {
        //fun() for getting assessment data from database
        const getAssessmentdata = () => {
            loader(true)
            ApiClient.get('assessments', { page: 1, count: 10, addedBy: user.id }).then(res => {
                if (res.success) {
                    if (res.data.length) {
                        setAssessment(res.data[0])
                    }
                }
                loader(false)
            })
        }
        getAssessmentdata()
        sliderData()

        if (user.id) {
            page('View Result Page')
        }
    }, [])


    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    const checkHieghLevel = () => {
        let value = false
        if (assessment && assessment.assessmentResults && assessment.assessmentResults) {
            assessment.assessmentResults.map(itm => {
                if (itm.result === 'High' || itm.result === 'Moderate' || itm.result === 'Severe' || itm.result === 'Extremely severe') value = true
            })
        }
        return value
    }

    const eventClick = (p = 'content', contentCategory = '') => {
        ApiClient.post('save/data', { event: p, contentCategory }).then(res => {

        })
    }

    const page = (page = '') => {
        if (user.id) ApiClient.dropoff(page, user)
    }

    return <>
        <PageLayout>
            {/* <Layout> */}
            <div className="container maincontainer">
                <div className="row">
                    <div className="col-md-12">

                        {assessment && assessment.assessmentResults && assessment.assessmentResults.map(itm => {
                            return <>
                                <div className="mb-3">
                                    <div className=" text-center">
                                        <p className="dashtoptext mb-2 text-uppercase">{translate2(itm.type.translate, itm.type.name)}</p>
                                        <p className="dashtoptext mb-3">{languagesModel.translate('userdashboard_text', language)} <span className="highlevels text-capitalize">{translate2(itm && itm.result_translate, itm && itm.result)} </span></p>
                                        {/* <p className="dashtoptext mb-0">{languagesModel.translate('userdashboard_text_one', language)}  {languagesModel.translate('of_depression', language)},</p>
                                        <p className="dashtoptext " >{languagesModel.translate('anxiety_and_stress', language)}.</p> */}
                                    </div>

                                    <div className="row">
                                        {itm.categoryWiseResult.map(citm => {
                                            return <div className={`${itm.categoryWiseResult.length == 1 ? 'col-lg-12' : 'col-lg-4'}`} key={citm.id}>
                                                <div className={`boxes ${citm.level_risk === 'Moderate' || citm.level_risk === 'Mild' ? 'box-color2' : ''} ${citm.level_risk === 'Severe' || citm.level_risk === 'Extremely severe' || citm.level_risk === 'High' ? 'box-color3' : ''} ${citm.level_risk === 'Normal' || citm.level_risk === 'Low' ? 'box-color1' : ''}`}>
                                                    <p className="mb-4 text-uppercase">
                                                        {/* {itm.lable} */}
                                                        {translate2(citm.lable_translate, citm.lable)}
                                                    </p>
                                                    <h2 className='text-capitalize'>
                                                        {/* {itm.level_risk} */}
                                                        {translate2(citm.level_translate, citm.level_risk)}
                                                        <br></br>
                                                        <small>{languagesModel.translate('risk_text', language)}</small></h2>
                                                </div>
                                            </div>
                                        })}
                                    </div>

                                    {/* <div className="dashgray mt-4">
                                        <h3 className="dahhedding">{languagesModel.translate('dash_rulttext', language)}</h3>
                                        {itm.result === languagesModel.translate('low_text', language) || itm.result === 'Normal' ? <p>{languagesModel.translate('normal_result', language)}</p> : <></>}
                                        {itm.result === 'Moderate' || itm.result === 'Mild' ? <p>{languagesModel.translate('mild_result', language)}</p> : <></>}
                                        {itm.result === 'High' || itm.result === 'Severe' || itm.result === 'Extremely severe' ? <p>{languagesModel.translate('severe_result', language)}</p> : <></>}
                                    </div> */}

                                    <div className="text-center mt-3">
                                        <button className="dashbtnsave" onClick={e => download(assessment.id, itm.type.id)}>{languagesModel.translate('save_your_result', language)}</button>
                                    </div>

                                </div>

                            </>
                        })}



                        {/* phq */}

                        <div className=" col-md-12 mb-4">
                            <div className="recent-result past-result bg-white  mb-4 border border-rounded">
                                <div className="result mb-4">
                                    <h2>{languagesModel.translate('Other_assessments', language)}</h2>
                                </div>

                                <div className='row '>
                                    <div className='col-md-6'>
                                        <div className='PHQ-9_Assessment '>
                                            <h3 className='hedingcl'>{languagesModel.translate('phq-9_assessment', language)}</h3>
                                            <p className='asspairacls'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                            <button className='take_assessment_button'>{languagesModel.translate('take_assessment', language)}</button>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='GAD-7_Assessment'>
                                            <h3 className='hedingcl'>{languagesModel.translate('gad-7_assessment', language)}</h3>
                                            <p className='asspairacls'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                                            <button className='take_assessment_button'>{languagesModel.translate('take_assessment', language)}</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* end phq */}

                        <div className="dashgray mt-4">
                            <h3 className="dahhedding">{languagesModel.translate('dash_rulttext', language)}</h3>
                            <p>{languagesModel.translate('normal_result', language)}</p>
                            {/* <p>{languagesModel.translate('mild_result', language)}</p>
                            <p>{languagesModel.translate('severe_result', language)}</p> */}
                        </div>

                        <div className="text-left mt-3">
                            <p className="mt-3 suggestionstext ">{languagesModel.translate('dashboard__suggestions_hedding', language)}</p>
                        </div>

                        {checkHieghLevel() ? <div className="Exploreclass mt-3 text-center">
                            <h3 className="dahhedding">{languagesModel.translate('healthcare_professional_hedding', language)}</h3>
                            <p className="pairafont">{languagesModel.translate('our_counselor_ready_text', language)}</p>

                            <div className="">
                                <a onClick={e => { eventClick('whatsapp'); page('Select reach out through whatsapp button') }} href='https://api.whatsapp.com/send?phone=601130115658&text=I%20just%20completed%20my%20mental%20health%20assessment%20on%20e-MeSVIPP%20portal%20and%20my%20mental%20health%20is%20shown%20to%20be%20high.%20I%20want%20to%20speak%20to%20a%20licensed%20counsellor%20to%20receive%20support' target="_new" className='reachoutbtn'>{languagesModel.translate('talk_now_text', language)}</a>
                            </div>
                        </div> : <></>}


                        <div className="dashgray lass mt-4">
                            <h3 className="selfhedding mb-4">{languagesModel.translate('self-help_text', language)}</h3>
                            {/* <div className="tipsclss mt-3" onClick={e => eventClick()}>
                                <div className="row hghjghjg">
                                    <div className="col-md-8 ">
                                        <p className="tipsclass mt-3 ml-5">{languagesModel.translate('stressed_out_text', language)}</p>

                                    </div>
                                    <div className="col-md-4 ">
                                        <div className="dasbordivcls ml-4">
                                            <img src="/assets/img/Lifesavers Stethoscope.png" className="100% " />
                                        </div>


                                    </div>
                                </div>

                            </div>
                            <div className="tipsclss mt-3" onClick={e => eventClick()}>
                                <div className="row hghjghjg">
                                    <div className="col-md-8">
                                        <p className="tipsclass mt-3 ml-5">{languagesModel.translate('unlock_positivity_text', language)}</p>
                                    </div>
                                    <div className="col-md-4 ">
                                        <div className="dasbordivcls">
                                            <img src="/assets/img/Lifesavers Serum Bag.png" className="100% " />
                                        </div>

                                    </div>
                                </div>
                            </div> */}

                            <div className=''>
                                <div className="mb-3">
                                    <Slider {...settings}>
                                        {
                                            sliderCardData && sliderCardData.map((itm, i) => {
                                                return <div className="px-2">
                                                    <a onClick={e => catClick(i)} className={`Depressionutoon ${catIndex == i ? 'active' : ''}`}>{translate2(itm.nameTranslate, itm.name)}</a>
                                                </div>
                                            })
                                        }
                                    </Slider>
                                </div>

                                <Slider {...settings}>
                                    {
                                        blogs && blogs.map(blog => {
                                            return <div className="px-1 d-blog" onClick={e => eventClick('content', sliderCardData[catIndex].name)}>
                                                <Link to={`blogdetail/${blog.id}`} key={blog.id}>
                                                    <div className='homeimg'>
                                                        <img src={`${ApiKey.api}/images/blogs/${blog.image}`} alt="img" />
                                                        <div className='imgbotmtext text-truncate'>{translate2(blog.titleTranslate, blog.title)}</div>
                                                    </div>
                                                </Link>
                                            </div>

                                        })
                                    }
                                </Slider>
                                <div className='Assessmentbtnmaincls'>
                                    <Link to="/blogcategories" className='Explore_Assessmentbtn mt-3'>{languagesModel.translate('explore_library', language)}</Link>
                                </div>
                            </div>
                        </div>




                    </div>

                </div>

            </div>


            {/* end design */}



            {/* </Layout> */}
        </PageLayout>
        {/* <Footer></Footer> */}
    </>
}

export default UserDashboard