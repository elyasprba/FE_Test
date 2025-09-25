"use client";

import React from 'react';
import { Menu, MenuProps } from 'antd';
import {
    AppstoreOutlined,
    BarChartOutlined,
    SettingOutlined,
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: 'dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    {
        key: 'laporan-lalin',
        label: 'Laporan Lalin',
        icon: <BarChartOutlined />,
        children: [
            { key: 'laporan-perhari', label: 'Laporan Perhari' },
            { key: 'laporan-perminggu', label: 'Laporan Perminggu' },
            { key: 'laporan-perbulan', label: 'Laporan Perbulan' },
        ],
    },
    { key: 'master-gerbang', icon: <SettingOutlined />, label: 'Master Gerbang' },

];

interface SidebarProps {
    collapsed: boolean;
    onClick?: MenuProps["onClick"];
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onClick }) => {
    return (
        <div style={{ width: 300 }}>
            <Menu
                defaultSelectedKeys={['dashboard']}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                items={items}
                onClick={onClick}
                style={{
                    fontSize: '15px',
                }}
                className='font-medium'
            />
        </div>
    );
};

export default Sidebar;
