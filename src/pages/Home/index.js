import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import PageLayout from "../../components/global/PageLayout";
import "./style.scss"
import { useSelector } from 'react-redux';
import languagesModel from '../../models/languages.model';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ApiClient from '../../methods/api/apiClient';
import ApiKey from '../../methods/ApiKey';

const Home = () => {
    const user = useSelector(state => state.user)
    const [sliderCardData, setSliderData] = useState()
    const [blogs, setBlogs] = useState([])
    const [catIndex, setCatIndex] = useState(0)
    const language = useSelector(state => state.language.data)
    var settings = {
        dots: false,
        arrow: true,
        infinite: false,
        centerMode: false,
        variableWidth: true
    };
    useEffect(() => {
        sliderData()
        if (user.id) {
            page('Land on Homepage')
        }

        console.log("language", language)
    }, [])
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

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    const eventClick = (p = 'content', contentCategory = '') => {
        if (!user.id) return
        ApiClient.post('save/data', { event: p, contentCategory: contentCategory }).then(res => {

        })
    }

    const page = (page = '') => {
        if (user.id) ApiClient.dropoff(page, user)
    }

    return <>
        <PageLayout>
            <div className="">
                <div className="container">
                    <div className="row">

                        <div className="col-md-5 text-right ">
                            <div className='text-center '>
                                <img src="/assets/img/Frame.png" className="homeimgtop" alt="img" />
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className='homemain_div ml-4 '>
                                <img src="/assets/img/fulllogo.png" className='fulllogoimg' alt="img" />
                                <p className="paraclass mt-3">{languagesModel.translate('welcome_description', language)}</p>
                                {!user.loggedIn || user.role === 'user' ? <Link to="/assessment" className="homebtn btn btn-primary">{languagesModel.translate('Let’sbegin_button', language)}</Link> : <></>}
                                {user && !user.loggedIn && <p className="paraclass mt-4">{languagesModel.translate('welcomebottom_text', language)}<Link to="/login" className="logclass">{languagesModel.translate('login_link', language)}</Link>
                                </p>}
                                {/* <button className='begin_Assessmentbtn'>Let’s begin</button>
                                <p className='botomclass mt-3'>if you have been here before, click here to<span className='loginspancls ml-1'>Login</span> </p> */}
                            </div>
                        </div>


                        <div className='col-md-12'>
                            {
                                user.role === 'user' ? <div className='homemainclss mt-4'>
                                    <div className='row  mx-0'>
                                        <div className='col-md-5 pl-0 mb-0 mt-5'>
                                            <img src="/assets/img/homeleftimg.png" className='homeleftimg mt-5' alt="img" />
                                        </div>
                                        <div className='col-md-7 mt-5 '>
                                            <div className='inrdiv'>
                                                <h3 className='Evaluate_text'>{languagesModel.translate('homepage_hedding', language)}</h3>
                                                <p className='Evaluate_paira'>{languagesModel.translate('homepage_paira', language)}</p>
                                            </div>

                                            <div className='mentalhealth_list'>
                                                <div className='mentalhealth_item'>
                                                    <div className='bodarcls pt-2'>
                                                        <span className='Lessthan'>{languagesModel.translate('lessthan_text', language)}</span>
                                                        <h3 className='numcls'>5</h3>
                                                        <span className='Lessthan'>{languagesModel.translate('mins_text', language)}</span>
                                                    </div>
                                                </div>
                                                <div className='mentalhealth_item'>
                                                    <div className='bodarcls'>
                                                        <img src="/assets/img/recommend_FILL0.png" alt="img" className='numcls mt-3' />
                                                        <div className='Lessthan'> {languagesModel.translate('receive_suggestions', language)}<br></br>{languagesModel.translate('suggestions_text', language)}</div>
                                                    </div>
                                                </div>
                                                <div className='mentalhealth_item'>
                                                    <div className='bodarcls'>
                                                        <img src="/assets/img/schedule_FILL0_wght.png" alt="img" className='numcls mt-3' />
                                                        <div className='Lessthan'>{languagesModel.translate('retake_anytime', language)}</div>
                                                    </div>
                                                </div>
                                                <div className='mentalhealth_item'>
                                                    <div className='bodarcls'>
                                                        <img src="/assets/img/save_FILL0_wght.png" alt="img" className='numcls mt-3 ' />
                                                        <div className='Lessthan'>{languagesModel.translate('save_and_share', language)}</div>
                                                    </div>


                                                </div>
                                            </div>

                                            <div className='Assessmentbtnmaincls'>
                                                <Link to="/assessment" className='Start_Assessmentbtn mt-4 mb-4'>{languagesModel.translate('startassessment_btn', language)}</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div> : <></>
                            }



                            <div className='homeseconddiv mt-5'>
                                <div className='row'>
                                    <div className='col-md-5'>
                                        <img src="/assets/img/homesecondimg.png" className='homeleftimg' alt="img" />
                                    </div>
                                    <div className='col-md-7 mt-5 '>
                                        <div className='inrdiv '>
                                            <h3 className='Evaluate_text'>{languagesModel.translate('self_equipped', language)}</h3>
                                            <p className='Evaluate_paira'>{languagesModel.translate('self_equipped_paira', language)}</p>
                                        </div>


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
                                                    return <div className="px-1 d-blog">
                                                        <Link to={`blogdetail/${blog.id}`} key={blog.id} onClick={e => eventClick('content', sliderCardData[catIndex].name)}>
                                                            <div className='homeimg'>
                                                                <img src={`${ApiKey.api}images/blogs/${blog.image}`} alt="img" />
                                                                <div className='imgbotmtext'>{translate2(blog.titleTranslate, blog.title)}</div>
                                                            </div>
                                                        </Link>
                                                    </div>

                                                })
                                            }
                                        </Slider>
                                        <div className='Assessmentbtnmaincls'>
                                            <Link to="/blogcategories" className='Explore_Assessmentbtn mt-3 mb-3'>{languagesModel.translate('explore_library', language)}</Link>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className='homethreediv mt-5'>
                                <div className='row'>
                                    <div className='col-md-5'>
                                        <img src="/assets/img/homeimgthree.png" className='homeleftimg' alt="img" />
                                    </div>
                                    <div className='col-md-7 mt-5 '>
                                        <div className='inrdiv'>
                                            <h3 className='Evaluate_text'> {languagesModel.translate('talk_to_professionals', language)}</h3>
                                            <p className='Evaluate_paira'>{languagesModel.translate('professionals_paira', language)}</p>

                                        </div>

                                        <div className='row mb-4'>
                                            <div className='col-12 col-sm'>
                                                <img src={language && language.code == 'bm' ? '/assets/img/map-ml.png' : "/assets/img/Frame 758530696.png"} alt="img" className='Evaluate_img' />
                                            </div>
                                            <div className='col-12 col-sm'>
                                                <img src={language && language.code == 'bm' ? '/assets/img/assessment-ml.png' : "/assets/img/Frame 758530697.png"} alt="img" className='Evaluate_img pr-3' />
                                            </div>

                                        </div>
                                        {/* <button className='Complete_Assessmentbtn'>{languagesModel.translate('professionals_paira_two', language)}</button> */}
                                    </div>

                                </div>


                            </div>

                        </div>


                    </div>
                </div>
            </div>




        </PageLayout>
    </>
}

export default Home