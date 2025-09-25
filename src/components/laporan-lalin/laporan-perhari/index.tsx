import { Button, DatePicker, DatePickerProps, Input, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import dayjs from 'dayjs';
import "dayjs/locale/id";
import Tunai from '../components/tunai';
import Etoll from '../components/e-toll';
import Flo from '../components/flo';
import KTP from '../components/kartu-pegawai';
import Keseluruhan from '../components/keseluruhan';
import ETollTunaiFlo from '../components/e-toll-tunai-flo';

dayjs.locale("id");

function LaporanPerhari() {
    const [selectedDate, setSelectedDate] = useState("");
    const [search, setSearch] = useState("");

    const [selectedDateTemp, setSelectedDateTemp] = useState("");
    const [searchTemp, setSearchTemp] = useState("");

    const onChange: DatePickerProps['onChange'] = (_, dateString) => {
        setSelectedDateTemp(dateString as string);
    };

    const handleFilter = () => {
        setSelectedDate(selectedDateTemp);
        setSearch(searchTemp);
    };

    const handleReset = () => {
        setSelectedDate("");
        setSearch("");
        setSelectedDateTemp("");
        setSearchTemp("");
    };

    return (
        <div>
            <h1 className='text-xl pb-6 font-bold'>Laporan Lalin Perhari</h1>

            <div className="flex gap-4 border-b pb-4 mb-4 border-gray-200">
                <Input
                    placeholder="Search"
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                    value={searchTemp}
                    onChange={(e) => setSearchTemp(e.target.value)}
                />
                <DatePicker
                    value={selectedDateTemp ? dayjs(selectedDateTemp) : null}
                    onChange={onChange}
                />

                <Button type="primary" onClick={handleFilter}>
                    Filter
                </Button>
                <Button type="default" onClick={handleReset}>
                    Reset
                </Button>
            </div>

            <Tabs
                defaultActiveKey="1"
                type="card"
                items={[
                    {
                        key: "1",
                        label: "Total Tunai",
                        children: <Tunai selectedDate={selectedDate} search={search} />,
                    },
                    {
                        key: "2",
                        label: "Total E-toll",
                        children: <Etoll selectedDate={selectedDate} search={search} />,
                    },
                    {
                        key: "3",
                        label: "Total Flo",
                        children: <Flo selectedDate={selectedDate} search={search} />,
                    },
                    {
                        key: "4",
                        label: "Total KTP",
                        children: <KTP selectedDate={selectedDate} search={search} />,
                    },
                    {
                        key: "5",
                        label: "Total KESELURUHAN",
                        children: <Keseluruhan selectedDate={selectedDate} search={search} />,
                    },
                    {
                        key: "6",
                        label: "Total E-Toll+Tunai+Flo",
                        children: (
                            <ETollTunaiFlo selectedDate={selectedDate} search={search} />
                        ),
                    },
                ]}
            />
        </div>
    );
}

export default LaporanPerhari;
