import classNames from 'classnames/bind';
import styles from './ProductList.module.scss';

// import { DeleteOutline } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Spin, Tabs } from 'antd';

import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Grid from '~/components/Grid/Grid';

import * as moment from 'moment';
import ModalProductSale from '~/components/Modal/ModalProductSale/ModalProductSale';
import ModalProduct from '~/components/Modal/ModalProduct/ModalProduct';
import ModalProductNew from '~/components/Modal/ModalProductNew/ModalProductNew';
import ModalDepot from '~/components/Modal/ModalDebot/ModalDebot';
import ModalHistoryPrice from '~/components/Modal/ModalHistoryPrice/ModalHistoryPrice';

const cx = classNames.bind(styles);

export default function ProductList() {
    const location = useLocation();
    const { confirm } = Modal;
    const [productsDeleted, setProductsDeleted] = useState([]);
    const [productsUneleted, setProductsUneleted] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(false);

    const [id, setId] = useState('');
    const [openDetail, setOpenDetail] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openNew, setOpenNew] = useState(false);
    const [openDepot, setOpenDepot] = useState(false);
    const [openDepotHistory, setOpenDepotHistory] = useState(false);

    const fecthData = async () => {
        setLoading(true);
        try {
            const res_deleted = await axiosClient.get('product/deleted/');
            for (let i = 0; i < res_deleted.data.products_deleted.length; i++) {
                res_deleted.data.products_deleted[i].colName = res_deleted.data.products_deleted[i].collectionObj.name;
                if (res_deleted.data.products_deleted[i].type === 'watch') {
                    res_deleted.data.products_deleted[i].type_vi = 'Đồng hồ';
                } else if (res_deleted.data.products_deleted[i].type === 'strap') {
                    res_deleted.data.products_deleted[i].type_vi = 'Dây đồng hồ';
                } else if (res_deleted.data.products_deleted[i].type === 'bracelet') {
                    res_deleted.data.products_deleted[i].type_vi = 'Vòng tay';
                }
            }
            setProductsDeleted(res_deleted.data.products_deleted);

            const res_undeleted = await axiosClient.get('product/undeleted/');
            for (let i = 0; i < res_undeleted.data.products_undeleted.length; i++) {
                res_undeleted.data.products_undeleted[i].colName =
                    res_undeleted.data.products_undeleted[i].collectionObj.name;
                if (res_undeleted.data.products_undeleted[i].type === 'watch') {
                    res_undeleted.data.products_undeleted[i].type_vi = 'Đồng hồ';
                } else if (res_undeleted.data.products_undeleted[i].type === 'strap') {
                    res_undeleted.data.products_undeleted[i].type_vi = 'Dây đồng hồ';
                } else if (res_undeleted.data.products_undeleted[i].type === 'bracelet') {
                    res_undeleted.data.products_undeleted[i].type_vi = 'Vòng tay';
                }
            }
            setProductsUneleted(res_undeleted.data.products_undeleted);
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
            const res = await axiosClient.put('product/delete/' + id);
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
            const res = await axiosClient.put('product/restore/' + id);
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
            title: 'XÓA SẢN PHẨM',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn xóa sản phẩm?',
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
            title: 'KHÔI PHỤC SẢN PHẨM',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn khôi phục sản phẩm?',
            okText: 'Khôi phục',
            okType: 'primary',
            cancelText: 'Trở lại',
            onOk() {
                handleReStore(id);
            },
            onCancel() {},
        });
    };
    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    const columns_deleted = [
        {
            field: 'products',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: 'Hình ảnh',
            width: 125,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <div className={cx('product-list-item')}>
                        <img src={params.row.images[0]} className={cx('product-list-img')} alt="img" />
                    </div>
                );
            },
        },
        {
            field: 'name',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên sản phẩm',
            width: 240,
        },
        {
            field: 'type_vi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Loại',
            width: 110,
        },
        {
            field: 'colName',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Danh mục',
            width: 175,
            // renderCell: (params) => {
            //     return (
            //         <>
            //             <div>{params.row.collectionObj.name}</div>
            //         </>
            //     );
            // },
        },
        {
            field: 'stock',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tồn',
            width: 75,
            type: 'number',
        },
        {
            field: 'produts_price',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá',
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('price_cell')}>
                            <span className={cx('price_cell_value')}>
                                {NumberWithCommas(Number(params.row.finalPrice))}
                            </span>
                        </div>
                    </>
                );
            },
        },
        {
            field: 'createdAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày tạo',
            width: 130,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'updatedAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày cập nhật',
            width: 135,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'action',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 130,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <>
                        <ul>
                            <li>
                                <button
                                    className={cx('product-list-edit')}
                                    onClick={() => {
                                        setOpenDetail(true);
                                        setId(params.row._id);
                                    }}
                                >
                                    Doanh số
                                </button>
                            </li>
                            <li>
                                <button
                                    className={cx('product-list-edit')}
                                    onClick={() => {
                                        setOpenUpdate(true);
                                        setId(params.row._id);
                                    }}
                                >
                                    Chỉnh sửa
                                </button>
                            </li>
                            <li>
                                <button
                                    className={cx('product-list-edit')}
                                    onClick={() => {
                                        setOpenDepotHistory(true);
                                        setId(params.row._id);
                                    }}
                                >
                                    Lịch sử nhập
                                </button>
                            </li>
                            <li>
                                <button
                                    className={cx('product-list-restore-button')}
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
            field: 'products',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hình ảnh',
            width: 125,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <div className={cx('product-list-item')}>
                        <img src={params.row.images[0]} className={cx('product-list-img')} alt="img" />
                    </div>
                );
            },
        },
        {
            field: 'name',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên sản phẩm',
            width: 240,
        },
        {
            field: 'type_vi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Loại',
            width: 110,
        },
        {
            field: 'colName',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Danh mục',
            width: 175,
            // renderCell: (params) => {
            //     return (
            //         <>
            //             <div>{params.row.collectionObj.name}</div>
            //         </>
            //     );
            // },
        },
        {
            field: 'stock',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tồn',
            width: 75,
            type: 'number',
        },
        {
            field: 'finalPrice',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá',
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('price_cell')}>
                            <span className={cx('price_cell_value')}>
                                {NumberWithCommas(Number(params.row.finalPrice))}
                            </span>
                        </div>
                    </>
                );
            },
        },
        {
            field: 'createdAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày tạo',
            width: 130,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'updatedAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày cập nhật',
            width: 135,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },

        {
            field: 'action',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 130,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <>
                        <ul>
                            <li>
                                <button
                                    className={cx('product-list-edit')}
                                    onClick={() => {
                                        setOpenDetail(true);
                                        setId(params.row._id);
                                    }}
                                >
                                    Doanh số
                                </button>
                            </li>
                            <li>
                                <button
                                    className={cx('product-list-edit')}
                                    onClick={() => {
                                        setOpenUpdate(true);
                                        setId(params.row._id);
                                    }}
                                >
                                    Chỉnh sửa
                                </button>
                            </li>
                            <li>
                                <button
                                    className={cx('product-list-edit')}
                                    onClick={() => {
                                        setOpenDepotHistory(true);
                                        setId(params.row._id);
                                    }}
                                >
                                    Lịch sử đổi giá
                                </button>
                            </li>
                            <li>
                                <button
                                    className={cx('product-list-delete-button')}
                                    onClick={() => showDeleteConfirm(params.row._id)}
                                >
                                    Xóa
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
            label: `Sản phẩm`,
            children: ``,
        },
        {
            key: '2',
            label: `Đã xóa`,
            children: ``,
        },
    ];

    const tabItemClick = (key) => {
        if (key === '1') {
            setKey(false);
        } else if (key === '2') {
            setKey(true);
        }
    };

    return (
        <>
            <div className={cx('product-list')}>
                <Spin spinning={loading}>
                    <label className={cx('label')}>DANH SÁCH SẢN PHẨM</label>
                    <div style={{ height: 10 }}></div>

                    <Button
                        customClass={styles}
                        onClick={() => {
                            setOpenNew(true);
                        }}
                    >
                        Thêm sản phẩm
                    </Button>

                    <div className={cx('grid')}>
                        <div className={cx('tabs')}>
                            <Tabs type="card" defaultActiveKey="1" items={items} onChange={tabItemClick} />
                        </div>
                        {key === false ? (
                            <Grid
                                headers={columns_undeleted}
                                datas={productsUneleted}
                                rowHeight={175}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        ) : (
                            <Grid
                                headers={columns_deleted}
                                datas={productsDeleted}
                                rowHeight={175}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        )}
                    </div>
                </Spin>
            </div>
            {id !== '' && (
                <ModalProductSale open={openDetail} onClose={() => setOpenDetail(false)} id={id}></ModalProductSale>
            )}
            {id !== '' && (
                <ModalProduct
                    open={openUpdate}
                    onClose={() => setOpenUpdate(false)}
                    id={id}
                    onResetId={() => setId('')}
                ></ModalProduct>
            )}
            {id !== '' && (
                <ModalDepot
                    open={openDepot}
                    onClose={() => setOpenDepot(false)}
                    id={id}
                    onResetId={() => setId('')}
                ></ModalDepot>
            )}
            {id !== '' && (
                <ModalHistoryPrice
                    open={openDepotHistory}
                    onClose={() => setOpenDepotHistory(false)}
                    id={id}
                    onResetId={() => setId('')}
                ></ModalHistoryPrice>
            )}
            <ModalProductNew open={openNew} onClose={() => setOpenNew(false)}></ModalProductNew>
        </>
    );
}
