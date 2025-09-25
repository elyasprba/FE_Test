/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button, Form, Input, Modal, Table, TablePaginationConfig, Tooltip } from 'antd'
import React, { useState } from 'react'
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { useDeleteGerbang, useGetListGerbanng, usePostGerbang, usePutGerbang } from '@/api/gerbang';
import { useMessageGlobal } from '../../utils/message-provider';


const dummyData = [
    {
        "IdCabang": 11,
        "NamaCabang": "Cawang",
    },
    {
        "IdCabang": 11,
        "NamaCabang": "Cawang",
    },
    {
        "IdCabang": 12,
        "NamaCabang": "Cilacap",
    },
    {
        "IdCabang": 12,
        "NamaCabang": "Cilacap",
    },
    {
        "IdCabang": 13,
        "NamaCabang": "Gombong",
    },
    {
        "IdCabang": 14,
        "NamaCabang": "Kebumen",
    },
    {
        "IdCabang": 15,
        "NamaCabang": "Jogja Solo",
    },
    {
        "IdCabang": 15,
        "NamaCabang": "Jogja Solo",
    },
    {
        "IdCabang": 16,
        "NamaCabang": "Solo Timur",
    },
    {
        "IdCabang": 17,
        "NamaCabang": "Semarang",
    }
]

function MasterGerbang() {
    const [form] = Form.useForm();
    const message = useMessageGlobal();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [search, setSearch] = useState("");

    const [isModalTambah, setIsModalTambah] = useState(false);
    const [isModalView, setIsModalView] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [selectedGerbang, setSelectedGerbang] = useState<any>(null);


    const { data: gerbangList, refetch } = useGetListGerbanng({ page, limit, search });
    const { mutate: tambahGerbang } = usePostGerbang();
    const { mutate: deleteGerbang } = useDeleteGerbang();
    const { mutate: editGerbang } = usePutGerbang();

    const handleTableChange = (pagination: TablePaginationConfig) => {
        if (pagination.current) setPage(pagination.current);
        if (pagination.pageSize) setLimit(pagination.pageSize);
    };


    const handleOk = async () => {
        const values = await form.validateFields();

        const selectedCabang = dummyData.find(
            c => c.NamaCabang.toLowerCase() === values.NamaCabang.trim().toLowerCase()
        );

        if (!selectedCabang) {
            message.error("Ruas tidak ditemukan");
            return;
        }

        const payload: any = {
            id: gerbangList?.data?.rows?.rows?.[gerbangList?.data?.rows?.rows.length - 1].id + 1 || 1,
            IdCabang: selectedCabang.IdCabang,
            NamaCabang: selectedCabang.NamaCabang,
            NamaGerbang: values.NamaGerbang,
        };

        tambahGerbang(payload, {
            onSuccess: () => {
                message.success("Data berhasil ditambahkan");
                setIsModalTambah(false);
                form.resetFields();
                refetch();
            },
        });

    };

    const handleDelete = (record: any) => {

        const payload: any = {
            id: record.id,
            IdCabang: record.IdCabang
        }

        deleteGerbang(payload, {
            onSuccess: () => {
                message.success("Data berhasil dihapus");
                refetch();
            }
        })
    }

    const handleEditGerbang = async () => {
        const values = await form.validateFields();

        const selectedCabang = dummyData.find(
            c => c.NamaCabang.toLowerCase() === values.NamaCabang.trim().toLowerCase()
        );

        if (!selectedCabang) {
            message.error("Ruas tidak ditemukan");
            return;
        }

        const payload: any = {
            id: selectedGerbang.id,
            IdCabang: selectedCabang.IdCabang,
            NamaCabang: selectedCabang.NamaCabang,
            NamaGerbang: values.NamaGerbang,
        };

        editGerbang(payload, {
            onSuccess: () => {
                message.success("Data berhasil diubah");
                setIsModalEdit(false);
                setSelectedGerbang(null);
                form.resetFields();
                refetch();
            },
        });
    }

    const columns = [
        {
            title: 'No',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Ruas',
            dataIndex: 'IdCabang',
            key: 'IdCabang',
            render: (value: number) => <div>Ruas {value}</div>
        },
        {
            title: 'Gerbang',
            dataIndex: 'NamaGerbang',
            key: 'NamaGerbang',
        },
        {
            title: 'Aksi',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => (
                <div className='flex gap-4'>
                    <div className='cursor-pointer' style={{ fontSize: '18px' }}
                        onClick={() => {
                            setIsModalEdit(true)
                            setSelectedGerbang(record)
                            form.setFieldsValue(record)
                        }}
                    >

                        <Tooltip placement="bottom" title="Edit">
                            <EditOutlined />
                        </Tooltip>
                    </div>
                    <div className='cursor-pointer'
                        style={{ fontSize: '18px' }}
                        onClick={() => {
                            setIsModalView(true)
                            form.setFieldsValue(record)
                            console.log(record);
                        }}>
                        <Tooltip placement="bottom" title="Detail">
                            <EyeOutlined />
                        </Tooltip>
                    </div>
                    <div className='cursor-pointer' style={{ fontSize: '18px' }} onClick={() => handleDelete(record)}
                    >
                        <Tooltip placement="bottom" title="Hapus">
                            <DeleteOutlined />
                        </Tooltip>
                    </div>
                </div>
            )

        },
    ];

    return (
        <div>
            <h1 className='text-xl pb-6 font-bold'>Master Data Gerbang</h1>

            <div className='flex justify-between mb-4 border-b pb-4 border-gray-200'>
                <Input
                    placeholder="Search Gerbang"
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Button icon={<PlusSquareOutlined />} onClick={() => setIsModalTambah(true)}>
                    Tambah
                </Button>
            </div>

            <Table
                rowKey={(record: { IdCabang: number; id: number }) => `${record.IdCabang}-${record.id}`}
                dataSource={gerbangList?.data?.rows?.rows}
                columns={columns}
                pagination={{
                    current: gerbangList?.data?.current_page,
                    pageSize: limit,
                    total: gerbangList?.data?.total_pages * limit,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                }}
                onChange={handleTableChange}
            />

            <Modal
                title="Tambah Gerbang"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalTambah}
                centered
                onOk={handleOk}
                onCancel={() => {
                    setIsModalTambah(false);
                    form.resetFields();
                }}
                okText="Simpan"
                cancelText="Batal"
                className='min-w-xl'
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="bg-white"
                >
                    <div className='flex gap-4'>
                        <Form.Item
                            label="Ruas"
                            name="NamaCabang"
                            rules={[{ required: true, message: "Ruas tidak boleh kosong!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Silahkan masukan ruas" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Gerbang"
                            name="NamaGerbang"
                            rules={[{ required: true, message: "Gerbang tidak boleh kosong!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Silahkan masukan gerbang" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                </Form>
            </Modal>

            <Modal
                title="Detail Gerbang"
                open={isModalView}
                centered
                onOk={() => setIsModalView(false)}
                className="min-w-xl"
                onCancel={() => setIsModalView(false)}
                footer={[
                    <Button key="submit" type="primary" onClick={() => setIsModalView(false)}>
                        Oke
                    </Button>
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="bg-white"
                    disabled
                >
                    <div className='flex gap-4'>
                        <Form.Item
                            label="Ruas"
                            name="NamaCabang"
                            rules={[{ required: true, message: "Ruas tidak boleh kosong!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Silahkan masukan ruas" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Gerbang"
                            name="NamaGerbang"
                            rules={[{ required: true, message: "Gerbang tidak boleh kosong!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Silahkan masukan gerbang" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                </Form>
            </Modal>

            <Modal
                title="Edit Gerbang"
                open={isModalEdit}
                centered
                onOk={handleEditGerbang}
                className="min-w-xl"
                onCancel={() => setIsModalEdit(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="bg-white"
                >
                    <div className='flex gap-4'>
                        <Form.Item
                            label="Ruas"
                            name="NamaCabang"
                            rules={[{ required: true, message: "Ruas tidak boleh kosong!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Silahkan masukan ruas" style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Gerbang"
                            name="NamaGerbang"
                            rules={[{ required: true, message: "Gerbang tidak boleh kosong!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Silahkan masukan gerbang" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default MasterGerbang;
