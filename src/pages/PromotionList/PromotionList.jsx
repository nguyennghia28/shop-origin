import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Spin, Tabs } from 'antd';

import styles from './PromotionList.module.scss';
import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import { toast } from 'react-toastify';
import Grid from '~/components/Grid/Grid';

import * as moment from 'moment';
import ModalPromotion from '~/components/Modal/ModalPromotion/ModalPromotion';
import ModalPromotionNew from '~/components/Modal/ModalPromotionNew/ModalPromotionNew';

const cx = classNames.bind(styles);

export default function PromotionList() {
    const location = useLocation();

    const { confirm } = Modal;
    const [promotionsDeleted, setPromotionsDeleted] = useState([]);
    const [promotionsUneleted, setPromotionsUneleted] = useState([]);
    const [promotionsSpecial, setPromotionsSpecial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(1);

    const [id, setId] = useState('');
    const [open, setOpen] = useState(false);
    const [openNew, setOpenNew] = useState(false);

    const fecthData = async () => {
        setLoading(true);
        try {
            const res_deleted = await axiosClient.get('promotion/deleted/');
            setPromotionsDeleted(res_deleted.data.promotions_deleted);

            const res_undeleted = await axiosClient.get('promotion/undeleted/');
            setPromotionsUneleted(res_undeleted.data.promotions_undeleted);

            const res_special = await axiosClient.get('promotion/special/');

            const res_ranks = await axiosClient.get('rank/');
            for (let i = 0; i < res_special.data.promotions_special.length; i++) {
                for (let j = 0; j < res_ranks.data.rank.length; j++) {
                    if (res_special.data.promotions_special[i].forRank === res_ranks.data.rank[j]._id) {
                        res_special.data.promotions_special[i].namevi = res_ranks.data.rank[j].namevi;
                    }
                }
            }
            setPromotionsSpecial(res_special.data.promotions_special);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fecthData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await axiosClient.put('promotion/delete/' + id);
            if (res) {
                toast.success('Xóa thành công');
                fecthData();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReStore = async (id) => {
        setLoading(true);
        try {
            const res = await axiosClient.put('promotion/restore/' + id);

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
            title: 'XÓA KHUYẾN MÃI',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn xóa khuyến mãi?',
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
            title: 'KHÔI PHỤC KHUYẾN MÃI',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn khôi phục khuyển mãi?',
            okText: 'Khôi phục',
            okType: 'primary',
            cancelText: 'Trở lại',
            onOk() {
                handleReStore(id);
            },
            onCancel() {},
        });
    };

    const columns_deleted = [
        {
            field: 'titlevi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Việt',
            width: 220,
        },
        {
            field: 'titleen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Anh',
            width: 220,
        },
        {
            field: 'code',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mã khuyến mãi',
            width: 260,
        },
        {
            field: 'value',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá trị',
            width: 100,
            type: 'number',
            renderCell: (params) => {
                return <div className={cx('promotion-list-item')}>{params.row.value}%</div>;
            },
        },

        {
            field: 'startDate',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày bắt đầu',
            width: 160,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'endDate',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày kết thúc',
            width: 160,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'action',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 150,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <>
                        <ul>
                            <li>
                                <button
                                    className={cx('promotion-list-edit')}
                                    onClick={() => {
                                        setId(params.row._id);
                                        setOpen(true);
                                    }}
                                >
                                    Chỉnh sửa
                                </button>
                            </li>

                            <li>
                                <button
                                    className={cx('promotion-list-restore-button')}
                                    onClick={() => showRestoreConfirm(params.row._id)}
                                >
                                    Khôi phục
                                </button>
                            </li>
                        </ul>
                    </>
                );
            },
        },
    ];

    const columns_undeleted = [
        {
            field: 'titlevi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Việt',
            width: 220,
        },
        {
            field: 'titleen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Anh',
            width: 220,
        },
        {
            field: 'code',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mã khuyến mãi',
            width: 260,
        },
        {
            field: 'value',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá trị',
            width: 100,
            type: 'number',
            renderCell: (params) => {
                return <div className={cx('promotion-list-item')}>{params.row.value}%</div>;
            },
        },

        {
            field: 'startDate',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày bắt đầu',
            width: 160,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'endDate',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày kết thúc',
            width: 160,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },

        {
            field: 'action',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 150,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                var showSend = true;

                if (
                    new Date().getTime() > new Date(params.row.endDate).getTime() ||
                    new Date().getTime() < new Date(params.row.startDate).getTime()
                ) {
                    showSend = false;
                }
                return (
                    <>
                        <ul>
                            <li>
                                {showSend && (
                                    <button
                                        className={cx('promotion-list-restore-button')}
                                        onClick={() => {
                                            showSendEmailConfirm(params.row._id);
                                        }}
                                    >
                                        Gửi
                                    </button>
                                )}
                            </li>
                            {!showSend && (
                                <>
                                    <li>
                                        <button
                                            className={cx('promotion-list-edit')}
                                            onClick={() => {
                                                setId(params.row._id);
                                                setOpen(true);
                                            }}
                                        >
                                            Chỉnh sửa
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            className={cx('promotion-list-delete-button')}
                                            onClick={() => showDeleteConfirm(params.row._id)}
                                        >
                                            Xóa
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </>
                );
            },
        },
    ];

    const columns_special = [
        {
            field: 'namevi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Dành cho hạng',
            width: 170,
        },
        {
            field: 'titlevi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Việt',
            width: 300,
        },
        {
            field: 'titleen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Anh',
            width: 300,
        },
        {
            field: 'code',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mã khuyến mãi',
            width: 250,
        },
        {
            field: 'value',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá trị',
            width: 100,
            type: 'number',
            renderCell: (params) => {
                return <div className={cx('promotion-list-item')}>{params.row.value}%</div>;
            },
        },
        {
            field: 'action',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 150,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <>
                        <ul>
                            <li>
                                <button
                                    className={cx('promotion-list-edit')}
                                    onClick={() => {
                                        setId(params.row._id);
                                        setOpen(true);
                                    }}
                                >
                                    Chỉnh sửa
                                </button>
                            </li>
                        </ul>
                    </>
                );
            },
        },
    ];

    const items = [
        {
            key: '1',
            label: `Khuyến mãi`,
            children: ``,
        },
        {
            key: '2',
            label: `Đã xóa`,
            children: ``,
        },
        {
            key: '3',
            label: `Khuyến mãi cố định`,
            children: ``,
        },
    ];

    const tabItemClick = (key) => {
        if (key === '1') {
            setKey(1);
        } else if (key === '2') {
            setKey(2);
        } else if (key === '3') {
            setKey(3);
        }
    };

    const showSendEmailConfirm = (id) => {
        confirm({
            title: 'GỬI KHUYẾN MÃI',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn gửi khuyển mãi?',
            okText: 'Gửi',
            okType: 'primary',
            cancelText: 'Trở lại',
            onOk() {
                handleSendEmail(id);
            },
            onCancel() {},
        });
    };

    const handleSendEmail = async (promotionId) => {
        try {
            const res = await axiosClient.post('promotion/sendEmailToUser', {
                rankId: '',
                promotionId: promotionId,
            });
            if (res) {
                toast.success('Gửi email thông báo khuyến mãi thành công');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className={cx('promotion-list')}>
                <Spin spinning={loading}>
                    <label className={cx('label')}>DANH SÁCH KHUYẾN MÃI</label>
                    <div style={{ height: 10 }}></div>
                    {/* <Link to="/newpromotion"> */}
                    <Button
                        customClass={styles}
                        onClick={() => {
                            setOpenNew(true);
                        }}
                    >
                        Thêm khuyến mãi
                    </Button>
                    {/* </Link> */}
                    <div className={cx('grid')}>
                        <Tabs type="card" defaultActiveKey="1" items={items} onChange={tabItemClick} />
                        {key === 1 && (
                            <Grid
                                headers={columns_undeleted}
                                datas={promotionsUneleted}
                                rowHeight={100}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        )}
                        {key === 2 && (
                            <Grid
                                headers={columns_deleted}
                                datas={promotionsDeleted}
                                rowHeight={100}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        )}
                        {key === 3 && (
                            <Grid
                                headers={columns_special}
                                datas={promotionsSpecial}
                                rowHeight={100}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        )}
                    </div>
                </Spin>
            </div>
            {id !== '' && (
                <ModalPromotion
                    open={open}
                    onClose={() => setOpen(false)}
                    id={id}
                    onResetId={() => {
                        setId('');
                    }}
                ></ModalPromotion>
            )}
            {/* {id !== '' && (
                <ModalSendPromotion
                    open={openSend}
                    onClose={() => setOpenSend(false)}
                    id={id}
                    onResetId={() => {
                        setId('');
                    }}
                ></ModalSendPromotion>
            )} */}
            <ModalPromotionNew open={openNew} onClose={() => setOpenNew(false)}></ModalPromotionNew>
        </>
    );
}
