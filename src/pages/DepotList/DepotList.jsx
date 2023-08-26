import classNames from 'classnames/bind';
import styles from './DepotList.module.scss';
import { useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useState, useEffect } from 'react';
import * as moment from 'moment';

import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import Grid from '~/components/Grid/Grid';
import ModalDepotImport from '~/components/Modal/ModalDepotImport/ModalDepotImport';

const cx = classNames.bind(styles);

export default function DepotList() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const [depots, setDepots] = useState([]);
    const [depotSelect, setDepotSelect] = useState({});
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState('');

    const fecthData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('depot/');
            setDepots(res.data.depots);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fecthData();
    }, [location]);

    const columns = [
        {
            field: '_id',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mã phiếu',
            width: 350,
        },
        {
            field: 'importUser',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Người tạo',
            width: 350,
            renderCell: (param) => {
                return param.row.importUser.username;
            },
        },
        {
            field: 'createdAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày tạo',
            width: 300,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY, hh:mm');
            },
        },
        {
            field: 'action',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 270,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <button
                        className={cx('new-list-edit')}
                        onClick={() => {
                            setDepotSelect(params.row);
                            setStatus('update');
                            setOpen(true);
                        }}
                    >
                        Chi tiết
                    </button>
                );
            },
        },
    ];

    return (
        <>
            <div className={cx('new-list')}>
                <Spin spinning={loading}>
                    <label className={cx('label')}>DANH SÁCH PHIẾU NHẬP</label>
                    <div style={{ height: 10 }}></div>

                    <Button
                        customClass={styles}
                        onClick={() => {
                            setStatus('create');
                            setOpen(true);
                            setDepotSelect({});
                        }}
                    >
                        Nhập kho
                    </Button>

                    <div className={cx('grid')}>
                        <Grid headers={columns} datas={depots} rowHeight={63} pagesize={10} hideToolbar={false} />
                    </div>
                </Spin>
            </div>
            <ModalDepotImport
                depot={depotSelect}
                status={status}
                open={open}
                onClose={() => {
                    setOpen(false);
                    fecthData();
                }}
            />
        </>
    );
}
