import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import ApiClient from '../../methods/api/apiClient';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../components/global/PageLayout';
import methodModel from '../../methods/methods';
import languagesModel from '../../models/languages.model';

const Bloglisting = (p) => {
    const language = useSelector(state => state.language.data)
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [category, setCategory] = useState('')
    const [loader, setLoader] = useState(true)
    let { cat } = useParams();


    const getData = (p = {}) => {

        setLoader(true)
        let filter = { category: cat }
        ApiClient.get('blogs', filter).then(res => {
            if (res.success) {
                setData(res.data)
                if (res.data.length) {
                    setCategory(res.data[0].category)
                }
                setTotal(res.total)
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
            <div className='text-center mb-4'>
                <h3 className='bloghedding text-capitalize '>{category && translate2(category.nameTranslate, category.name)}</h3>
            </div>

            {loader ? <>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-3 '>
                            <div className='blogcard shine shineCard'>

                            </div>
                            <div className='blogtext mt-4 mb-5 shine shineCard'>

                            </div>
                        </div>

                        <div className='col-md-3'>
                            <div className='blogcard shine  shineCard'>

                            </div>
                            <div className='blogtext mt-4 mb-5 shine shineCard'>

                            </div>
                        </div>

                        <div className='col-md-3'>
                            <div className='blogcard shine shineCard'>

                            </div>
                            <div className='blogtext mt-4 mb-5 shine shineCard'>

                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className='blogcard shine shineCard'>

                            </div>
                            <div className='blogtext mt-4 mb-5 shine shineCard'>

                            </div>
                        </div>
                    </div>
                </div>
            </> : <>

                <div className='container calclss'>
                    <div className='row'>

                        {data && data.map(itm => {
                            return <div className='col-md-3' key={itm.id}>
                                {/* <div className='blogcard'>
                                <img src="/assets/img/mental-health.jpg" className='w-100 blogimg' />
                            </div> */}

                                <Link className='textstyle' to={`/blogdetail/${itm.id}`}>
                                    <div style={{ backgroundImage: `url(${methodModel.noImg(itm.image)})` }} className='w-100 blogimg'>
                                        {/* <h3 className='categorytext m-auto pl-3 text-capitalize'>{itm.name}</h3> */}
                                    </div>


                                </Link>
                                <Link to={`/blogdetail/${itm.id}`} className='seemorcls'>
                                    <div className='blogtext mt-2 mb-5'>
                                        <h3 className='blogpaira text-truncate text-capitalize'>{translate2(itm.titleTranslate, itm.title)} </h3>
                                    </div>
                                </Link>
                            </div>
                        })}

                    </div>
                    {!loader && total == 0 ? <div className="py-3 text-center"><img src="/assets/img/Nodata.jpg" alt="No Data img" className="no-data-img" /></div> : <></>}
                </div>
            </>}
        </PageLayout>
    );
};

export default Bloglisting;
