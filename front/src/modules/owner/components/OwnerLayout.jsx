import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OwnerSidebar from './OwnerSidebar';
import Navbar from '../../shared/components/Navbar';

const OwnerLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark transition-colors duration-300">
            <OwnerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            
            <div className={`flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ltr:pl-20 lg:rtl:pr-20' : 'lg:ltr:pl-64 lg:rtl:pr-64'}`}>
                <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                
                <main className="p-6 lg:p-12 pt-40 lg:pt-8 flex-grow">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;
