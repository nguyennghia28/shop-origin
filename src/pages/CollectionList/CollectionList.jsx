import classNames from 'classnames/bind';
import styles from './CollectionList.module.scss';
import { useLocation } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Tabs, Spin } from 'antd';

import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Grid from '~/components/Grid/Grid';
import ModalCollecion from '~/components/Modal/ModalCollecion/ModalCollecion';
import ModalCollecionNew from '~/components/Modal/ModalCollecionNew/ModalCollecionNew';

const cx = classNames.bind(styles);

export default function CollectionList() {
    const { confirm } = Modal;
    const location = useLocation();
    const [collectionsDeleted, setCollectionsDeleted] = useState([]);
    const [collectionsUndeleted, setCollectionsUndeleted] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(false);

    const [id, setId] = useState('');
    const [open, setOpen] = useState(false);
    const [openNew, setOpenNew] = useState(false);

    const fecthData = async () => {
        setLoading(true);
        try {
            const res_undeleted = await axiosClient.get('collections/undeleted/');
            setCollectionsUndeleted(res_undeleted.data.collections_undeleted);

            const res_deleted = await axiosClient.get('collections/deleted/');
            setCollectionsDeleted(res_deleted.data.collections_deleted);
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
            const res = await axiosClient.put('collections/delete/' + id);
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
            const res = await axiosClient.put('collections/restore/' + id);
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
            title: 'XÓA DANH MỤC',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn xóa danh mục?',
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
            title: 'KHÔI PHỤC DANH MỤC',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn khôi phục danh mục?',
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
            field: 'name',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên danh mục',
            width: 320,
        },
        {
            field: 'descriptionen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mô tả tiếng Anh',
            width: 375,
        },
        {
            field: 'descriptionvi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mô tả tiếng việt',
            width: 375,
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
                        {/* <Link to={'/collection/' + params.row._id}>
                            <button className={cx('product-list-edit')}>Chỉnh sửa</button>
                        </Link> */}
                        <button
                            className={cx('collection-list-edit-1')}
                            onClick={() => {
                                setOpen(true);
                                setId(params.row._id);
                            }}
                        >
                            Chỉnh sửa
                        </button>

                        <button
                            className={cx('collection-list-delete-button')}
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
            field: 'name',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên danh mục',
            width: 320,
        },
        {
            field: 'descriptionen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mô tả tiếng Anh',
            width: 375,
        },
        {
            field: 'descriptionvi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mô tả tiếng việt',
            width: 375,
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
                        {/* <Link to={'/collection/' + params.row._id}>
                            <button className={cx('product-list-edit')}>Chỉnh sửa</button>
                        </Link> */}
                        <button
                            className={cx('collection-list-edit')}
                            onClick={() => {
                                setOpen(true);
                                setId(params.row._id);
                            }}
                        >
                            Chỉnh sửa
                        </button>

                        <button
                            className={cx('collection-list-restore-button')}
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
            label: `Danh mục`,
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

    return (
        <>
            <div className={cx('collection-list')}>
                <Spin spinning={loading}>
                    <label className={cx('label')}>DANH SÁCH DANH MỤC</label>
                    <div style={{ height: 10 }}></div>
                    {/* <Link to="/newcollection">
                        <Button customClass={styles}>Thêm danh mục</Button>
                    </Link> */}
                    <Button
                        customClass={styles}
                        onClick={() => {
                            setOpenNew(true);
                        }}
                    >
                        Thêm danh mục
                    </Button>

                    <div className={cx('grid')}>
                        <Tabs type="card" defaultActiveKey="1" items={items} onChange={tabItemClick} />
                        {key === false ? (
                            <Grid
                                headers={columns_undeleted}
                                datas={collectionsUndeleted}
                                rowHeight={63}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        ) : (
                            <Grid
                                headers={columns_deleted}
                                datas={collectionsDeleted}
                                rowHeight={63}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        )}
                    </div>
                </Spin>
            </div>
            {id !== '' && (
                <ModalCollecion
                    open={open}
                    onClose={() => setOpen(false)}
                    id={id}
                    onResetId={() => setId('')}
                ></ModalCollecion>
            )}
            <ModalCollecionNew open={openNew} onClose={() => setOpenNew(false)}></ModalCollecionNew>
        </>
    );
}
