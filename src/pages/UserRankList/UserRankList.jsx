import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Tabs, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import styles from './UserRankList.module.scss';
import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import Grid from '~/components/Grid/Grid';
import ModalUserRank from '~/components/Modal/ModalUserRank/ModalUserRank';
import ModalUserRankNew from '~/components/Modal/ModalUserRankNew/ModalUserRankNew';

const cx = classNames.bind(styles);

export default function UserRankList() {
    const { confirm } = Modal;
    const location = useLocation();
    const [ranksDeleted, setRanksDeleted] = useState([]);
    const [ranksUndeleted, setRanksUndeleted] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(false);

    const [id, setId] = useState('');
    const [open, setOpen] = useState(false);
    const [openNew, setOpenNew] = useState(false);

    const fecthData = async () => {
        setLoading(true);
        try {
            const res_undeleted = await axiosClient.get('rank/undeleted/');
            setRanksUndeleted(res_undeleted.data.ranks_undeleted);

            const res_deleted = await axiosClient.get('rank/deleted/');
            setRanksDeleted(res_deleted.data.ranks_deleted);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fecthData();
    }, [location]);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await axiosClient.put('rank/delete/' + id);
            if (res) {
                toast.success('Xóa thành công');
                fecthData();
            }
        } finally {
            setLoading(false);
        }
    };
    const handleRestore = async (id) => {
        setLoading(true);

        try {
            const res = await axiosClient.put('rank/restore/' + id);
            if (res) {
                toast.success('Khôi phục thành công');
                fecthData();
            }
        } finally {
            setLoading(false);
        }
    };
    const showDeleteConfirm = (id) => {
        confirm({
            title: 'XÓA THỨ HẠNG',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn xóa thứ hạng?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Trở lại',
            onOk() {
                handleDelete(id);
            },
            onCancel() {},
        });
    };
    const showRestoreConfirm = (id) => {
        confirm({
            title: 'KHÔI PHỤC THỨ HẠNG',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn khôi phục thứ hạn?',
            okText: 'Khôi phục',
            okType: 'primary',
            cancelText: 'Trở lại',
            onOk() {
                handleRestore(id);
            },
            onCancel() {},
        });
    };

    const columns_undeleted = [
        {
            field: 'ranks',
            headerClassName: 'super-app-theme--header',
            align: 'center',
            headerAlign: 'center',
            headerName: 'Hình ảnh',
            width: 125,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <div className={cx('rank-list-item')}>
                        <img src={params.row.icon} className={cx('rank-list-img')} alt="img" />
                    </div>
                );
            },
        },
        {
            field: 'namevi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Việt',
            width: 250,
        },
        {
            field: 'nameen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Anh',
            width: 250,
        },
        {
            field: 'minValue',
            align: 'right',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Chi tiêu tối thiểu',
            width: 221,
            renderCell: (params) => {
                return <>{NumberWithCommas(Number(params.row.minValue))}</>;
            },
        },
        {
            field: 'maxValue',
            align: 'right',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Chi tiêu tối đa',
            width: 221,
            renderCell: (params) => {
                return <>{NumberWithCommas(Number(params.row.maxValue))}</>;
            },
        },
        {
            field: 'action',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 200,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <>
                        <button
                            className={cx('rank-list-edit-1')}
                            onClick={() => {
                                setOpen(true);
                                setId(params.row._id);
                            }}
                        >
                            Chỉnh sửa
                        </button>

                        <button
                            className={cx('rank-list-delete-button')}
                            onClick={() => showDeleteConfirm(params.row._id)}
                        >
                            Xóa
                        </button>
                    </>
                );
            },
        },
    ];

    const columns_deleted = [
        {
            field: 'ranks',
            headerClassName: 'super-app-theme--header',
            align: 'center',
            headerAlign: 'center',
            headerName: 'Hình ảnh',
            width: 125,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <div className={cx('rank-list-item')}>
                        <img src={params.row.icon} className={cx('rank-list-img')} alt="img" />
                    </div>
                );
            },
        },
        {
            field: 'namevi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Việt',
            width: 250,
        },
        {
            field: 'nameen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Anh',
            width: 250,
        },
        {
            field: 'rank_min',
            align: 'right',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Chi tiêu tối thiểu',
            width: 220,
            renderCell: (params) => {
                return <>{NumberWithCommas(Number(params.row.minValue))}</>;
            },
        },
        {
            field: 'maxValue',
            align: 'right',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Chi tiêu tối đa',
            width: 221,
            renderCell: (params) => {
                return <>{NumberWithCommas(Number(params.row.maxValue))}</>;
            },
        },
        {
            field: 'action',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 201,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <>
                        <button
                            className={cx('rank-list-edit-1')}
                            onClick={() => {
                                setOpen(true);
                                setId(params.row._id);
                            }}
                        >
                            Chỉnh sửa
                        </button>

                        <button
                            className={cx('rank-list-restore-button')}
                            onClick={() => showRestoreConfirm(params.row._id)}
                        >
                            Khôi phục
                        </button>
                    </>
                );
            },
        },
    ];

    const items = [
        {
            key: '1',
            label: `Thứ hạng`,
            children: ``,
        },
        {
            key: '2',
            label: `Đã xóa`,
            children: ``,
        },
    ];

    const tabItemClick = (key) => {
        // console.log('tab click', key);
        if (key === '1') {
            setKey(false);
        } else if (key === '2') {
            setKey(true);
        }
    };
    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    return (
        <>
            <div className={cx('rank-list')}>
                <Spin spinning={loading}>
                    <label className={cx('label')}>DANH SÁCH THỨ HẠNG</label>
                    <div style={{ height: 10 }}></div>
                    <Button
                        customClass={styles}
                        onClick={() => {
                            setOpenNew(true);
                        }}
                    >
                        Thêm thứ hạng
                    </Button>

                    <div className={cx('grid')}>
                        <Tabs type="card" defaultActiveKey="1" items={items} onChange={tabItemClick} />
                        {key === false ? (
                            <Grid
                                headers={columns_undeleted}
                                datas={ranksUndeleted}
                                rowHeight={63}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        ) : (
                            <Grid
                                headers={columns_deleted}
                                datas={ranksDeleted}
                                rowHeight={63}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        )}
                    </div>
                </Spin>
            </div>
            {id !== '' && (
                <ModalUserRank
                    open={open}
                    onClose={() => setOpen(false)}
                    id={id}
                    onResetId={() => {
                        setId('');
                    }}
                ></ModalUserRank>
            )}
            <ModalUserRankNew open={openNew} onClose={() => setOpenNew(false)}></ModalUserRankNew>
        </>
    );
}
