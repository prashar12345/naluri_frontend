import React, { useEffect } from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';
import Sidebar from '../sidebar';
import Header from '../header';

import { useSelector } from 'react-redux';
import Footer from '../Footer';
const Layout = ({ children }) => {
  let user = useSelector(state => state.user)
  const history = useHistory();


  useEffect(() => {
    if (user && !user.loggedIn) {
      history.push('/login');
    }
  }, [user, history])


  return (
    <>
      <Header />
      {user.role == 'user' ? <>
        {children}
        <Footer />
      </> : <>
        <div className="main-wrapper d-flex">
          <div className="main-sidebar d-none d-md-block">
            {/* <div className="sidebar-brand p-3 text-center">
            <img src="/assets/img/nalurilogo.png" className="logocls"></img>
          </div> */}
            <Sidebar />

          </div>
          <main className="main">
            <div className="mainarea">{children}</div>
          </main>
        </div>
      </>}

    </>
  );
};
export default Layout;
