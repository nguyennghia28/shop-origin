import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Button, Popover } from 'antd';

import styles from './Topbar.module.scss';
import logo from '~/assets/images/logo-white-removebg-preview.png';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '~/features/user/userSlice';
import ModalStaffInfo from '../Modal/ModalStaffInfo/ModalStaffInfo';
import ModalChangePassword from '../Modal/ModalChangePassword/ModalChangePassword';
// import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

export default function Topbar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const [userInfo, setUserInfo] = useState({});
    const [openInfo, setOpenInfo] = useState(false);
    const [openChangePass, setOpenChangePass] = useState(false);

    // console.log(userInfo);

    // const fecthData = async () => {
    //     if (user.user.id !== undefined) {
    //         const getUser = async () => {
    //             const res = await axiosClient.get('user/find/' + user.user.id);
    //             setUserInfo(res.data);
    //         };
    //         getUser();
    //     }
    // };

    // useEffect(() => {
    //     try {
    //         fecthData();
    //     } finally {
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const handleLogout = () => {
        dispatch(logOut({ id: '', role: '' }));
        navigate('/login');
    };

    const content = (
        <div>
            <Button className={cx('ant-btn')} onClick={() => setOpenInfo(true)}>
                Thông tin cá nhân
            </Button>
            <br />
            <Button className={cx('ant-btn')} onClick={() => setOpenChangePass(true)}>
                Đổi mật khẩu
            </Button>
            <br />
            <hr />
            {/* <Link to={'/login'}> */}
            <Button className={cx('ant-btn-logout')} onClick={handleLogout}>
                Đăng xuất
            </Button>
            {/* </Link> */}
        </div>
    );
    return (
        <div className={cx('topbar')}>
            <div className={cx('topbar-wrapper')}>
                <div className={cx('top-left')}>
                    <Link to="/">
                        <img className={cx('logo-img')} src={logo} alt="" />
                        <span className={cx('logo')}>MYNHBAKE WATCH STORE</span>
                    </Link>
                </div>
                <div className={cx('top-right')}>
                    <Popover placement="bottomRight" content={content} trigger="hover">
                        <div className={cx('user-avt')}>
                            <UserOutlined className={cx('top-avatar')} />
                        </div>
                    </Popover>
                </div>
            </div>
            <ModalStaffInfo
                open={openInfo}
                onClose={() => setOpenInfo(false)}
                id={user.user.id}
                onResetId={() => {}}
                type="myInfo"
            />
            <ModalChangePassword open={openChangePass} onClose={() => setOpenChangePass(false)} />
        </div>
    );
}
