import React, { } from 'react';
import Footer from '../Footer';
import Header from '../header';
const PageLayout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};
export default PageLayout;
