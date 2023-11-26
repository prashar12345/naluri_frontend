import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import ApiClient from '../../methods/api/apiClient';
import languagesModel from '../../models/languages.model';
import PageLayout from '../../components/global/PageLayout';
import methodModel from '../../methods/methods';
import { Link } from 'react-router-dom';


const BlogCategories = (p) => {
    let user = useSelector(state => state.user)
    const language = useSelector(state => state.language.data)
    const [filters, setFilter] = useState({ page: 1, count: 5, search: '' })
    const [data, setData] = useState([])
    const [loader, setLoader] = useState(false)
    const [total, setTotal] = useState(0)
    const [form, setform] = useState({})
    const searchState = useSelector((state) => state.search);



    const getData = (p = {}) => {
        setLoader(true)
        let filter = { ...filters, ...p }
        ApiClient.get('blog/categories', filter).then(res => {
            if (res.success) {
                setData(res.data)
                setTotal(res.total)
            }
            setLoader(false)
        })
    }

    useEffect(() => {
        getData()
        if (user) {
            // page('Resources')
        }

    }, [])

    const page = (page = '') => {
        if (user.id) ApiClient.dropoff(page, user)
    }

    const translate2 = (translate, en) => {
        return languagesModel.translate2(translate, language.code, en)
    }

    const eventClick = (p = 'content', contentCategory = '') => {
        if (!user.id) return
        ApiClient.post('save/data', { event: p, contentCategory: contentCategory }).then(res => {

        })
    }

    return (

        <PageLayout>
            <div className='text-center mb-4'>
                <h3 className='blogshedding'>{languagesModel.translate('blogs_text', language)}</h3>
            </div>


            {loader ? <>
                <div className='container'>

                    <div className='row'>
                        <div className='col-md-3'>
                            <div className=' mt-2 d-flex shine shineCard'>

                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className=' mt-2 d-flex shine shineCard'>

                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className=' mt-2 d-flex shine shineCard'>

                            </div>
                        </div>
                        <div className='col-md-3 '>
                            <div className=' mt-2 d-flex shine shineCard'>

                            </div>
                        </div>
                    </div>
                </div>

            </> : <>

                <div className='container calclss'>
                    <div className='row'>
                        {data && data.map(itm => {
                            return <div className='col-md-3' key={itm.id}>
                                <Link className='textstyle' onClick={e => eventClick('content', itm.name)} to={`/bloglisting/${itm.id}?cat=${translate2(itm.nameTranslate, itm.name)}`} ><div style={{ backgroundImage: `url(${methodModel.noImg(itm.image)})` }} className='categoryimg mt-2 d-flex '>
                                    <h3 className='categorytext m-auto px-3 text-capitalize'>{translate2(itm.nameTranslate, itm.name)}</h3>
                                </div></Link>
                            </div>
                        })}
                    </div>
                </div>
            </>}
            {/* loader */}
        </PageLayout >

    );
};

export default BlogCategories;
