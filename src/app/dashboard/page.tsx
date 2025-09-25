"use client";

import Sidebar from '@/components/sidebar';
import Image from 'next/image';
import React, { useState } from 'react';
import { RightOutlined, LeftOutlined, UserOutlined, ControlOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps } from 'antd';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import DashboardContent from '@/components/dashboard';
import MasterGerbang from '@/components/master-gerbang';
import LaporanPerhari from '@/components/laporan-lalin/laporan-perhari';


const Dashboard: React.FC = () => {
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string>("dashboard");

    const onClickMenu: MenuProps["onClick"] = (e) => {
        setSelectedKey(e.key);
    };


    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const items: MenuProps["items"] = [
        { key: 'account', label: 'Account' },
        { key: 'logout', label: 'Logout' },
    ];

    const handleUserMenuClick: MenuProps["onClick"] = (e) => {
        if (e.key === 'logout') {
            Cookies.remove('token');
            router.push('/');
        } else if (e.key === 'account') {
            console.log('Account clicked');
        }
    };

    return (
        <div>
            <div className="flex-1 flex flex-col">
                <div className="w-full flex bg-[#194887] items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-16">
                        <Image src="/assets/logojmtmputih.webp" alt="dashboard" width={175} height={500} />
                        <div onClick={toggleCollapsed} className='cursor-pointer'>
                            {collapsed ? <LeftOutlined style={{ color: '#fff' }} /> : <RightOutlined style={{ color: '#fff' }} />}
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <Dropdown menu={{ items, onClick: handleUserMenuClick }} placement="bottomRight" arrow>
                            <Avatar size="default" icon={<UserOutlined style={{ color: '#fff' }} />} className="cursor-pointer" />
                        </Dropdown>
                        <ControlOutlined style={{ color: '#fff', fontSize: 25 }} />
                    </div>
                </div>
            </div>

            <div className="flex">
                <div
                    className={`transition-all duration-300 ${collapsed ? "w-20" : "w-75"
                        }`}
                >
                    <Sidebar collapsed={collapsed} onClick={onClickMenu} />
                </div>

                <div className="flex-1 p-4 bg-gray-300 min-h-screen transition-all duration-300">
                    {selectedKey === "dashboard" && (
                        <div className="bg-white p-6 rounded shadow">
                            <DashboardContent />
                        </div>
                    )}

                    {selectedKey === "laporan-perhari" && (
                        <div className="bg-white p-6 rounded shadow">
                            <LaporanPerhari />
                        </div>
                    )}

                    {selectedKey === "laporan-perminggu" && (
                        <div className="bg-white p-6 rounded shadow">
                            <h1>Laporan Mingguan</h1>
                        </div>
                    )}

                    {selectedKey === "laporan-perbulan" && (
                        <div className="bg-white p-6 rounded shadow">
                            <h1>Laporan Bulanan</h1>
                        </div>
                    )}

                    {selectedKey === "master-gerbang" && (
                        <div className="bg-white p-6 rounded shadow">
                            <MasterGerbang />
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default Dashboard;
