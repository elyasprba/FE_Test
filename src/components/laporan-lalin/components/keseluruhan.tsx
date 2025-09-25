/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetListLalin } from '@/api/lalin';
import { Table } from 'antd';
import dayjs from 'dayjs';
import React from 'react'

const columns: any = [
    { title: "No.", dataIndex: "no", key: "no" },
    { title: "Ruas", dataIndex: "ruas", key: "ruas" },
    { title: "Gerbang", dataIndex: "gerbang", key: "gerbang" },
    { title: "Gardu", dataIndex: "gardu", key: "gardu" },
    { title: "Hari", dataIndex: "hari", key: "hari" },
    { title: "Tanggal", dataIndex: "tanggal", key: "tanggal" },
    { title: "Metode Pembayaran", dataIndex: "metode", key: "metode", align: "center" },
    { title: "Gol I", dataIndex: "gol1", key: "gol1" },
    { title: "Gol II", dataIndex: "gol2", key: "gol2" },
    { title: "Gol III", dataIndex: "gol3", key: "gol3" },
    { title: "Gol IV", dataIndex: "gol4", key: "gol4" },
    { title: "Gol V", dataIndex: "gol5", key: "gol5" },
    { title: "Total Lalin", dataIndex: "total", key: "total" },
];

function Keseluruhan({ selectedDate, search }: { selectedDate: string, search: string }) {
    const { data: listLalin } = useGetListLalin({ date: selectedDate, page: 1, limit: 1000 });

    const transformedData = (() => {
        if (!listLalin?.data?.rows?.rows) return [];

        const grouped: Record<string, any> = {};

        listLalin.data.rows.rows.forEach((item: any) => {
            const total =
                (item.Tunai || 0) +
                (item.DinasOpr || 0) +
                (item.DinasMitra || 0) +
                (item.DinasKary || 0) +
                (item.eMandiri || 0) +
                (item.eBri || 0) +
                (item.eBni || 0) +
                (item.eBca || 0) +
                (item.eNobu || 0) +
                (item.eDKI || 0) +
                (item.eMega || 0) +
                (item.eFlo || 0);

            const key = `${item.IdCabang}-${item.IdGerbang}-${item.IdGardu}-${item.Tanggal}`;

            if (!grouped[key]) {
                grouped[key] = {
                    key,
                    ruas: `Ruas ${item.IdCabang}`,
                    gerbang: `Gerbang ${item.IdGerbang}`,
                    gardu: item.IdGardu,
                    hari: dayjs(item.Tanggal).format("dddd"),
                    tanggal: dayjs(item.Tanggal).format("DD-MM-YYYY"),
                    metode: "Keseluruhan",
                    gol1: 0,
                    gol2: 0,
                    gol3: 0,
                    gol4: 0,
                    gol5: 0,
                    total: 0,
                };
            }

            if (item.Golongan === 1) grouped[key].gol1 += total;
            if (item.Golongan === 2) grouped[key].gol2 += total;
            if (item.Golongan === 3) grouped[key].gol3 += total;
            if (item.Golongan === 4) grouped[key].gol4 += total;
            if (item.Golongan === 5) grouped[key].gol5 += total;

            grouped[key].total += total;
        });

        let result = Object.values(grouped).map((row: any, index) => ({
            ...row,
            no: index + 1,
        }));

        if (search) {
            const query = search.toLowerCase();
            result = result.filter(
                (row: any) =>
                    row.ruas.toLowerCase().includes(query) ||
                    row.gerbang.toLowerCase().includes(query) ||
                    row.gardu.toString().includes(query) ||
                    row.hari.toLowerCase().includes(query) ||
                    row.tanggal.includes(query)
            );
        }

        return result;
    })();

    return (
        <div>
            <Table
                dataSource={transformedData}
                columns={columns}
                rowKey="key"
                summary={(pageData) => {
                    const totalsByRuas: Record<
                        string,
                        { gol1: number; gol2: number; gol3: number; gol4: number; gol5: number; total: number }
                    > = {};

                    pageData.forEach((item: any) => {
                        if (!totalsByRuas[item.ruas]) {
                            totalsByRuas[item.ruas] = { gol1: 0, gol2: 0, gol3: 0, gol4: 0, gol5: 0, total: 0 };
                        }
                        totalsByRuas[item.ruas].gol1 += item.gol1;
                        totalsByRuas[item.ruas].gol2 += item.gol2;
                        totalsByRuas[item.ruas].gol3 += item.gol3;
                        totalsByRuas[item.ruas].gol4 += item.gol4;
                        totalsByRuas[item.ruas].gol5 += item.gol5;
                        totalsByRuas[item.ruas].total += item.total;
                    });

                    // Hitung total semua ruas (grand total)
                    const grandTotal = Object.values(totalsByRuas).reduce(
                        (acc, val) => {
                            acc.gol1 += val.gol1;
                            acc.gol2 += val.gol2;
                            acc.gol3 += val.gol3;
                            acc.gol4 += val.gol4;
                            acc.gol5 += val.gol5;
                            acc.total += val.total;
                            return acc;
                        },
                        { gol1: 0, gol2: 0, gol3: 0, gol4: 0, gol5: 0, total: 0 }
                    );

                    return (
                        <>
                            {Object.entries(totalsByRuas).map(([ruas, val]) => (
                                <Table.Summary.Row key={ruas} className="bg-gray-100">
                                    <Table.Summary.Cell index={0} colSpan={7} className="text-center">
                                        <b>Total Lalin {ruas}</b>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7}>{val.gol1}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={8}>{val.gol2}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={9}>{val.gol3}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={10}>{val.gol4}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={11}>{val.gol5}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={12}>
                                        <b>{val.total}</b>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            ))}

                            {/* Row terakhir untuk total keseluruhan */}
                            <Table.Summary.Row className="bg-gray-300">
                                <Table.Summary.Cell index={0} colSpan={7} className="text-center">
                                    <b>Total Lalin Keseluruhan</b>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={7}>{grandTotal.gol1}</Table.Summary.Cell>
                                <Table.Summary.Cell index={8}>{grandTotal.gol2}</Table.Summary.Cell>
                                <Table.Summary.Cell index={9}>{grandTotal.gol3}</Table.Summary.Cell>
                                <Table.Summary.Cell index={10}>{grandTotal.gol4}</Table.Summary.Cell>
                                <Table.Summary.Cell index={11}>{grandTotal.gol5}</Table.Summary.Cell>
                                <Table.Summary.Cell index={12}>
                                    <b>{grandTotal.total}</b>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            />
        </div>
    )
}

export default Keseluruhan;
