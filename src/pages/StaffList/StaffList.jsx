import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import * as moment from 'moment';
import { Modal, Spin, Tabs } from 'antd';
import { toast } from 'react-toastify';
import { ExclamationCircleFilled } from '@ant-design/icons';

import styles from './StaffList.module.scss';
import { useLocation } from 'react-router-dom';
import Grid from '~/components/Grid/Grid';
import axiosClient from '~/api/axiosClient';
import Button from '~/components/Button/Button';
import ModalStaffInfo from '~/components/Modal/ModalStaffInfo/ModalStaffInfo';
import ModalStaffNew from '~/components/Modal/ModalStaffNew/ModalStaffNew';

const cx = classNames.bind(styles);

export default function StaffList() {
    const location = useLocation();
    const { confirm } = Modal;
    const [users_undeleted, setUsers_undeleted] = useState([]);
    const [users_deleted, setUsers_deleted] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(false);

    const [id, setId] = useState('');
    const [open, setOpen] = useState(false);
    const [openNew, setOpenNew] = useState(false);

    const fecthData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('user/staffs/');
            if (res) {
                var users_undeleted = [];
                var users_deleted = [];
                for (let i = 0; i < res.data.users.length; i++) {
                    if (res.data.users[i].isDelete === false) {
                        users_undeleted.push(res.data.users[i]);
                    } else if (res.data.users[i].isDelete === true) {
                        users_deleted.push(res.data.users[i]);
                    }
                }
                setUsers_undeleted(users_undeleted);
                setUsers_deleted(users_deleted);
            }
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
            const res = await axiosClient.put('user/delete/' + id);
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
            const res = await axiosClient.put('user/restore/' + id);
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
            title: 'HẠN CHẾ NHÂN VIÊN',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn hạn chế nhân viên?',
            okText: 'Hạn chế',
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
            title: 'KHÔI PHỤC NHÂN VIÊN',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn khôi phục nhân viên?',
            okText: 'Khôi phục',
            okType: 'primary',
            cancelText: 'Trở lại',
            onOk() {
                handleReStore(id);
            },
            onCancel() {},
        });
    };

    const Sex = (value) => {
        if (value === 'm') {
            return 'Nam';
        } else if (value === 'w') {
            return 'Nữ';
        }
    };

    const showResetPassConfirm = (id) => {
        confirm({
            title: 'ĐẶT LẠI MẬT KHẨU',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn có chắc muốn đặt lại mật khẩu tài khoản nhân viên?',
            okText: 'Đặt lại',
            okType: 'primary',
            cancelText: 'Trở lại',
            onOk() {
                handleResetpassword(id);
            },
            onCancel() {},
        });
    };

    const handleResetpassword = async (id) => {
        setLoading(true);

        try {
            const res = await axiosClient.put('user/resetpassword/' + id);
            if (res) {
                toast.success('Đặt lại mật khẩu thành công');
            }
        } finally {
            setLoading(false);
        }
    };
    const columns_undeleted = [
        {
            field: 'username',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên nhân viên',
            width: 325,
        },
        {
            field: 'email',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Email',
            width: 320,
        },
        {
            field: 'phone',
            align: 'right',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Số điện thoại',
            width: 200,
        },
        {
            field: 'sex',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giới tính',
            width: 100,
            valueFormatter: function (params) {
                return Sex(params.value);
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
            field: 'action',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 195,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <>
                        {/* <Link to={'/product/' + params.row._id}> */}
                        {/* <button className={cx('product-list-edit')}>Chi tiết</button> */}
                        {/* </Link> */}

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <button
                                className={cx('user-list-edit')}
                                onClick={() => {
                                    setOpen(true);
                                    setId(params.row._id);
                                }}
                            >
                                Chi tiết
                            </button>
                            <button
                                className={cx('user-list-edit')}
                                onClick={() => {
                                    showResetPassConfirm(params.row._id);
                                }}
                            >
                                Đặt lại mật khẩu
                            </button>
                            <Button
                                className={cx('user-list-delete-button')}
                                onClick={() => showDeleteConfirm(params.row._id)}
                            >
                                Hạn chế
                            </Button>
                        </div>
                    </>
                );
            },
        },
    ];

    const columns_deleted = [
        {
            field: 'username',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên nhân viên',
            width: 325,
        },
        {
            field: 'email',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Email',
            width: 320,
        },
        {
            field: 'phone',
            align: 'right',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Số điện thoại',
            width: 200,
        },
        {
            field: 'sex',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giới tính',
            width: 100,
            valueFormatter: function (params) {
                return Sex(params.value);
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
            field: 'action',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 195,
            filterable: false,
            disableExport: true,
            renderCell: (params) => {
                return (
                    <>
                        {/* <Link to={'/product/' + params.row._id}> */}
                        {/* <button className={cx('product-list-edit')}>Chi tiết</button> */}
                        {/* </Link> */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <button
                                className={cx('user-list-edit')}
                                onClick={() => {
                                    setOpen(true);
                                    setId(params.row._id);
                                }}
                            >
                                Chi tiết
                            </button>
                            <button
                                className={cx('user-list-edit')}
                                onClick={() => {
                                    showResetPassConfirm(params.row._id);
                                }}
                            >
                                Đặt lại mật khẩu
                            </button>
                            <Button
                                className={cx('user-list-restore-button')}
                                onClick={() => showRestoreConfirm(params.row._id)}
                            >
                                Khôi phục
                            </Button>
                        </div>
                    </>
                );
            },
        },
    ];

    const items = [
        {
            key: '1',
            label: `Nhân viên`,
            children: ``,
        },
        {
            key: '2',
            label: `Đã hạn chế`,
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
            <div className={cx('user-list')}>
                <Spin spinning={loading}>
                    <label className={cx('label')}>DANH SÁCH NHÂN VIÊN</label>
                    <div style={{ height: 10 }}></div>
                    <Button
                        customClass={styles}
                        onClick={() => {
                            setOpenNew(true);
                        }}
                    >
                        Thêm nhân viên
                    </Button>
                    <div className={cx('grid')}>
                        <Tabs type="card" defaultActiveKey="1" items={items} onChange={tabItemClick} />
                        {key === false ? (
                            <Grid
                                headers={columns_undeleted}
                                datas={users_undeleted}
                                rowHeight={135}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        ) : (
                            <Grid
                                headers={columns_deleted}
                                datas={users_deleted}
                                rowHeight={135}
                                pagesize={10}
                                hideToolbar={false}
                            />
                        )}
                    </div>
                </Spin>
            </div>
            {id !== '' && (
                <ModalStaffInfo
                    open={open}
                    onClose={() => setOpen(false)}
                    id={id}
                    onResetId={() => setId('')}
                    type="staffInfo"
                ></ModalStaffInfo>
            )}
            <ModalStaffNew
                open={openNew}
                onClose={() => setOpenNew(false)}
                id={id}
                onResetId={() => setId('')}
            ></ModalStaffNew>
        </>
    );
}
