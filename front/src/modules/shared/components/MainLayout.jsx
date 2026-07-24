import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark transition-colors duration-300">
            <Sidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isMobileOpen={isMobileOpen} 
                setIsMobileOpen={setIsMobileOpen} 
            />
            
            <div className={`flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'lg:ltr:pl-20 lg:rtl:pr-20' : 'lg:ltr:pl-64 lg:rtl:pr-64'}`}>
                <Navbar 
                    isCollapsed={isCollapsed} 
                    setIsCollapsed={setIsCollapsed} 
                    isMobileOpen={isMobileOpen} 
                    setIsMobileOpen={setIsMobileOpen} 
                />
                
                {/* 
                  Mobile Layout Logic:
                  Responsive padding on main element - no overflow
                */}
                <main className="p-6 lg:p-12 pt-6 lg:pt-8 flex-grow">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

