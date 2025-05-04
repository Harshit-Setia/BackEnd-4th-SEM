import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from './Components';

function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default Layout;