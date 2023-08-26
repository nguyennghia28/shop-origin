import classNames from 'classnames/bind';
import styles from './NotificationList.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

import axiosClient from '~/api/axiosClient';
import { useState, useEffect } from 'react';
import Grid from '~/components/Grid/Grid';
import ModalNotification from '~/components/Modal/ModalNotification/ModalNotification';
import Button from '~/components/Button/Button';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

export default function NotificationList() {
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const [open, setOpen] = useState(false);

    const fecthData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('notification/admin/');
            for (let i = 0; i < res.data.notifications.length; i++) {
                res.data.notifications[i].fromUser = res.data.notifications[i].user.username;
            }
            setPosts(res.data.notifications);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fecthData();
    }, [location]);

    const handleSeen = async (id) => {
        try {
            await axiosClient.put('notification/seen/' + id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSeenAll = async () => {
        setLoading(true);
        try {
            const notification_notseen = await axiosClient.get('notification/admin/notseen');
            notification_notseen.data.notifications.map(async (n) => {
                await axiosClient.put('notification/seen/' + n._id);
            });

            navigate('/notifications');
            toast.success('Đánh dấu tất cả đã xem thành công');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            field: 'shortContent',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Thông báo',
            width: 500,
        },
        {
            field: 'fromUser',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Từ khách hàng',
            width: 300,
            // renderCell: (params) => {
            //     return (
            //         <>
            //             <div>{params.row.user.username}</div>
            //         </>
            //     );
            // },
        },
        {
            field: 'createdAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày tạo',
            width: 220,
            type: 'date',

            valueFormatter: function (params) {
                return new Date(params.value).toLocaleString();
            },
        },
        {
            field: 'isSeen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Đã xem',
            type: 'boolean',
            width: 100,
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
                                    className={cx('notification-list-edit')}
                                    onClick={() => {
                                        handleSeen(params.row._id);
                                        setOpen(true);
                                        setId(params.row._id);
                                    }}
                                >
                                    Chi tiết
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
            <div className={cx('notification-list')}>
                <Spin spinning={loading}>
                    <label className={cx('label')}>DANH SÁCH THÔNG BÁO</label>
                    <div style={{ height: 10 }}></div>
                    <Button
                        customClass={styles}
                        onClick={() => {
                            handleSeenAll();
                        }}
                    >
                        Đánh dấu đã xem tất cả
                    </Button>
                    <div className={cx('grid')}>
                        <Grid headers={columns} datas={posts} rowHeight={63} pagesize={10} hideToolbar={false} />
                    </div>
                </Spin>
            </div>
            {/* <ModalNews open={openNew} onClose={() => setOpenNew(false)} /> */}
            {id !== '' && (
                <ModalNotification
                    open={open}
                    onClose={() => setOpen(false)}
                    id={id}
                    onResetId={() => setId('')}
                    onNavigate={() => navigate('/notifications')}
                ></ModalNotification>
            )}
        </>
    );
}
