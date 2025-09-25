/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetListLalin } from '@/api/lalin';
import { Button, DatePicker, DatePickerProps } from 'antd';
import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);


function DashboardContent() {
    const [selectedDate, setSelectedDate] = useState("");
    const [newDate, setNewDate] = useState("");
    const { data: lalin } = useGetListLalin({ date: newDate, page: 1, limit: 1000 });

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setSelectedDate(dateString as string);
    };

    const totalsByPayment = lalin?.data?.rows?.rows?.reduce((acc: any, item: any) => {
        const payments = ["eMandiri", "eBri", "eBni", "eBca", "eNobu", "eDKI", "eMega", "eFlo"];
        payments.forEach(p => {
            if (!acc[p]) acc[p] = 0;
            acc[p] += item[p] || 0;
        });
        return acc;
    }, {}) || {};

    const chartDataPayment = {
        labels: Object.keys(totalsByPayment).map(p => p.replace(/^e/, '').toUpperCase()),
        datasets: [
            {
                label: 'Jumlah Lalin',
                data: Object.values(totalsByPayment),
                backgroundColor: '#4A5057',
            },
        ],
    };

    const totalsByGerbang = lalin?.data?.rows?.rows?.reduce((acc: any, item: any) => {
        const key = `Gerbang ${item.IdGerbang}`;
        if (!acc[key]) acc[key] = 0;
        acc[key] += item.Tunai + item.DinasOpr + item.DinasMitra + item.DinasKary +
            item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu +
            item.eDKI + item.eMega + item.eFlo;
        return acc;
    }, {}) || {};

    const chartDataGerbang = {
        labels: Object.keys(totalsByGerbang),
        datasets: [
            {
                label: 'Jumlah Lalin per Gerbang',
                data: Object.values(totalsByGerbang),
                backgroundColor: '#4A5057',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
        },
    };

    const totalsByShift = lalin?.data?.rows?.rows?.reduce((acc: any, item: any) => {
        const total = item.Tunai + item.DinasOpr + item.DinasMitra + item.DinasKary +
            item.eMandiri + item.eBri + item.eBni + item.eBca + item.eNobu +
            item.eDKI + item.eMega + item.eFlo;

        if (!acc[item.Shift]) acc[item.Shift] = 0;
        acc[item.Shift] += total;
        return acc;
    }, {}) || {};

    const chartDataDoughnut = {
        labels: Object.keys(totalsByShift).map(s => `Shift ${s}`),
        datasets: [
            {
                label: 'Total Transaksi per Shift',
                data: Object.values(totalsByShift),
                backgroundColor: [
                    '#3E3736',
                    '#B0AAA5',
                    '#DADBE8'
                ],
            },
        ],
    };

    const chartOptionsDoughnut = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const },
            title: {
                display: true,
                text: 'Total Transaksi per Shift',
            },
        },
    };

    const onClikFilter = () => {
        setNewDate(selectedDate);
    }

    const onClikReset = () => {
        setNewDate("");
        setSelectedDate("");
    }

    return (
        <div>
            <h1 className='text-xl pb-6 font-bold'>Dashboard</h1>

            <div className='flex gap-4 pb-4 mb-4 border-b border-gray-200'>
                <DatePicker onChange={onChange} value={selectedDate ? dayjs(selectedDate) : null} className='w-[250px]' />
                <Button type="primary" onClick={onClikFilter}>Filter</Button>
                <Button type="default" onClick={onClikReset}>Reset</Button>
            </div>

            <div className='flex gap-4 justify-between mr-44'>

                <div className="" style={{ height: '400px', width: '700px' }}>
                    <Bar data={chartDataPayment} options={chartOptions} />
                </div>

                <div className="" style={{ height: '200px' }}>
                    <Doughnut data={chartDataDoughnut} options={chartOptionsDoughnut} />
                </div>
            </div>

            <div className='flex gap-4 justify-between mr-44'>


                <div style={{ height: '300px', width: '500px' }}>
                    <Bar data={chartDataGerbang} options={chartOptions} />
                </div>

                <div className="" style={{ height: '200px' }}>
                    <Doughnut data={chartDataDoughnut} options={chartOptionsDoughnut} />
                </div>
            </div>
        </div >
    );
}

export default DashboardContent;
