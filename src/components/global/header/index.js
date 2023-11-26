import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './style.scss';
import Sidebar from '../sidebar';

import { useDispatch, useSelector } from 'react-redux';
import methodModel from '../../../methods/methods';
import { search_success } from '../../../actions/search';
import { logout } from '../../../actions/user';
import modalModel from '../../../models/modal.model';
import { modal_success } from '../../../actions/modal';
import ApiClient from "../../../methods/api/apiClient"
import { language_success } from '../../../actions/language';
import languagesModel from '../../../models/languages.model';
import Logo from '../Logo';


const Header = () => {
  const dispatch = useDispatch()
  const [isOpen1, setIsOpen1] = useState(false);
  const [languages, setLanguages] = useState([]);
  const toggle1 = () => setIsOpen1(!isOpen1);
  const history = useHistory();

  const searchState = useSelector((state) => state.search);

  const Logout = () => {
    page('Land on Login/Create an account')
    dispatch(logout())
    history.push('/login');
  };

  const user = useSelector((state) => state.user);
  const language = useSelector((state) => state.language.data);

  const setLanuage = (ext) => {
    if (ext) localStorage.setItem('languagedata', JSON.stringify(ext))
    dispatch(language_success(ext ? ext : ''))
  }

  const getLanguage = () => {
    let lan = localStorage.getItem('language')
    ApiClient.get('languages', { page: 1, count: 100 }).then(res => {
      if (res.success) {
        setLanguages(res.data)
        if (res.data.length) {
          let ext = res.data.find(itm => itm.code === 'bm')
          if (!lan) setLanuage(ext)
          localStorage.setItem('language', 'true')
        }
      }
    })
  }

  const modalClosedJs = () => {
    let data = modalModel.modalData()
    dispatch(modal_success(data))
  }

  useEffect(
    () => {
      if (searchState.data) {
        dispatch(search_success(''))
      }
      getLanguage()
      modalModel.close('other')
    },
    []
  );

  const page = (page = '') => {
    if (user.id) ApiClient.dropoff(page, user)
  }

  return (
    <>
      <a id="modalClicked" onClick={modalClosedJs}></a>
      <nav
        className={
          isOpen1
            ? 'navbar navbar-expand-lg main-navbar min-sidebar'
            : 'navbar navbar-expand-lg main-navbar hederstyle'
        }
      >

        <Link to="/" className="nav-link">
          <Logo className='frontlogo' />
        </Link>
        <button className="navbar-toggler nevbar-light" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i className="fa fa-list listicon" aria-hidden="true"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">

          <ul className="navbar-nav w-100 flex-row justify-content-between align-items-center flex-wrap">

            <a
              onClick={toggle1}
              className={
                isOpen1
                  ? 'btn d-inline-block text-primary d-md-none active'
                  : 'btn d-inline-block text-primary d-md-none'
              }
            >
              <i className="fas fa-bars" />
            </a>

            <div className="nav-item ml-auto mr-2">
              {/* <Link to="/contactus" className="nav-link w-100 reach_btn">
                {languagesModel.translate('get_help_text', language)}
              </Link> */}
            </div>

            {user.role === 'user' ? <div className="nav-item menucomoncls">
              <Link to="/consultation" className="nav-link w-100 mr-2">
                {languagesModel.translate('book_consultation', language)}
              </Link>
            </div> : <></>}

            {user.role === 'user' ? <div className="nav-item menucomoncls">
              <Link to="/requests" className="nav-link w-100 mr-2">
                {languagesModel.translate('consultation_text', language)}
              </Link>
            </div> : <></>}



            {user.role === 'user' ? <>
              <div className={`nav-item Resourcesmenu menucomoncls`} >
                <Link to="/assessments" className="nav-link mr-2">{languagesModel.translate('assessments_text', language)}
                </Link>
              </div>

              <li className="dropdown menucomoncls">

                <Link
                  to="/"
                  data-toggle="dropdown"
                  className="nav-link dropdown-toggle nav-link-user "
                >
                  <div className={`nav-item Resourcesmenu menucomoncls ${user.role == 'user' ? '' : ''}`} >
                    <Link to="/blogcategories" className="nav-link mr-2">{languagesModel.translate('resources_text', language)}
                    </Link>
                  </div>

                </Link>
                <div className="dropdown-menu dropdown-menu-right position-absolute">

                  <Link to="/aboutus" className="dropdown-item has-icon">
                    {languagesModel.translate('about_us_text', language)}
                  </Link>
                  <Link to="/contactus" className="dropdown-item has-icon">
                    {languagesModel.translate('contact_us', language)}
                  </Link>

                  <Link to="/faq" className="dropdown-item has-icon">
                    {languagesModel.translate('faq_text', language)}
                  </Link>
                  <Link to="/blogcategories" className="dropdown-item has-icon">
                    {languagesModel.translate('resources_text', language)}
                  </Link>
                  <Link to="/contactus" className="dropdown-item has-icon">
                    {languagesModel.translate('get_help_text', language)}
                  </Link>



                </div>


              </li>
            </> : <></>}



            {/* end */}

            {/* <div className="nav-item Aboutmenu menucomoncls">
              <Link to="/aboutus" className="nav-link mr-2">{languagesModel.translate('about_us_text', language)}
             
              </Link>
            </div>


            <div className="nav-item Aboutmenu menucomoncls">
              <Link to="/contactus" className="nav-link mr-2">{languagesModel.translate('contact_us', language)}
          
              </Link>
            </div>

            <div className="nav-item menu2 menucomoncls">
              <Link to="/faq" className="nav-link mr-2">{languagesModel.translate('faq_text', language)}
              </Link>
            </div> */}




            {user && !user.loggedIn ? <>
              <div className="nav-item login_menu menucomoncls mr-2">
                <Link to="/login" className="nav-link">
                  {languagesModel.translate('login_menu', language)}
                </Link>
              </div>

            </> : <></>}


            {user && user.loggedIn ? <>

              <li className="dropdown menucomoncls">
                <Link
                  to="/"
                  data-toggle="dropdown"
                  className="nav-link dropdown-toggle nav-link-user "
                >
                  <img alt="image" src={methodModel.userImg(user.image)} className="rounded-circle mr-1" />{user && user.firstName}

                </Link>
                <div className="dropdown-menu dropdown-menu-right position-absolute">

                  <Link to="/dashboard" className="dropdown-item has-icon">
                    <i className="fa fa-tasks " aria-hidden="true" /> {languagesModel.translate('dashboard_text', language)}
                  </Link>
                  <Link to="/profile" className="dropdown-item has-icon">
                    <i className="far fa-user" />  {languagesModel.translate('profile_menu', language)}
                  </Link>

                  <Link to="/settings" className="dropdown-item has-icon">
                    <i className="fas fa-cog" />  {languagesModel.translate('settings_menu', language)}
                  </Link>

                  <a onClick={() => Logout()} className="dropdown-item has-icon">
                    <i className="fas fa-sign-out-alt mr-1" />{languagesModel.translate('logout_menu', language)}
                  </a>
                </div>


              </li> </> : <></>}

            <div className="dropdown nav-item  languageDropdown menucomoncls">
              <a className="nav-link dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                {language ? language.code.toUpperCase() : 'Language'}
              </a>
              <div className="dropdown-menu languagedrop">
                {languages && languages.map(itm => {
                  return <a className={`dropdown-item ${language && language.id === itm.id ? 'active' : ''}`} onClick={e => { setLanuage(itm) }} key={itm.id}>{itm.name}</a>
                })}
              </div>
            </div>
          </ul>
        </div>



        {
          isOpen1 ? (
            <div className="w-100 mobi-dropdown">
              <Sidebar />
            </div>
          ) : (
            <></>
          )
        }
      </nav >
    </>
  );
};

export default Header;
