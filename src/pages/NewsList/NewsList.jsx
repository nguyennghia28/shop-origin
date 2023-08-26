import classNames from 'classnames/bind';
import styles from './NewsList.module.scss';
import { useLocation } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Spin } from 'antd';
import { useState, useEffect } from 'react';
import * as moment from 'moment';

import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import { toast } from 'react-toastify';
import Grid from '~/components/Grid/Grid';
import ModalNews from '~/components/Modal/ModalNews/ModalNews';
import ModalNewsUpdate from '~/components/Modal/ModalNewsUpdate/ModalNewsUpdate';

const cx = classNames.bind(styles);

export default function NewsList() {
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const { confirm } = Modal;

    const [posts, setPosts] = useState([]);
    const [id, setId] = useState('');
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openNew, setOpenNew] = useState(false);

    const fecthData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('post/');
            setPosts(res.data.post);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    // console.log(productsUneleted);

    useEffect(() => {
        fecthData();
    }, [location]);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await axiosClient.delete('post/delete/' + id);
            if (res) {
                toast.success('Xóa thành công');
                fecthData();
            }
        } finally {
            setLoading(false);
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'XÓA BÀI VIẾT',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn xóa vĩnh viễn bài viết này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Trở lại',
            onOk() {
                handleDelete(id);
            },
            onCancel() {},
        });
    };

    const columns = [
        {
            field: 'posts',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hình ảnh',
            width: 150,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <div className={cx('new-list-item')}>
                        <img src={params.row.image} className={cx('new-list-img')} alt="img" />
                    </div>
                );
            },
        },
        {
            field: 'title',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tiêu đề',
            width: 325,
        },
        {
            field: 'description',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tóm tắt',
            width: 325,
        },
        {
            field: 'createdAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày tạo',
            width: 160,
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
                                    className={cx('new-list-edit')}
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
                                    className={cx('new-list-delete-button')}
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

    return (
        <>
            <div className={cx('new-list')}>
                <Spin spinning={loading}>
                    <label className={cx('label')}>DANH SÁCH BÀI VIẾT</label>
                    <div style={{ height: 10 }}></div>

                    <Button
                        customClass={styles}
                        onClick={() => {
                            setOpenNew(true);
                        }}
                    >
                        Thêm bài viết
                    </Button>

                    <div className={cx('grid')}>
                        <Grid headers={columns} datas={posts} rowHeight={135} pagesize={10} hideToolbar={false} />
                    </div>
                </Spin>
            </div>
            <ModalNews open={openNew} onClose={() => setOpenNew(false)} />
            {id !== '' && (
                <ModalNewsUpdate
                    open={openUpdate}
                    onClose={() => setOpenUpdate(false)}
                    id={id}
                    onResetId={() => setId('')}
                ></ModalNewsUpdate>
            )}
        </>
    );
}
