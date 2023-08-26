import { Badge, Menu } from 'antd';
import {
    LineStyle,
    PermIdentity,
    Storefront,
    AttachMoney,
    FileCopyOutlined,
    NotificationsOutlined,
} from '@material-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import './MenuSideBar.css';
import { useEffect, useState } from 'react';
import axiosClient from '~/api/axiosClient';
import { useSelector } from 'react-redux';
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
// const items = [
//     getItem('Trang chủ', ['sub1', '/'], <LineStyle />),
//     {
//         type: 'divider',
//     },
//     getItem('Quản lý người dùng', 'sub2', <PermIdentity />, [
//         getItem('Khách hàng', ['1', '/users']),
//         getItem('Thứ hạng khách hàng', ['2', '/ranks']),
//         getItem('Nhân viên', ['3', '/staffs']),
//     ]),
//     {
//         type: 'divider',
//     },
//     getItem('Quản lý sản phẩm', 'sub3', <Storefront />, [
//         getItem('Sản phẩm', ['4', '/products']),
//         getItem('Danh mục', ['5', '/collections']),
//     ]),
//     {
//         type: 'divider',
//     },
//     getItem(
//         <Badge count={100} showZero offset={[30, 0]}>
//             Thông báo đơn hàng
//         </Badge>,
//         ['sub4', '/notifications'],
//         <NotificationsOutlined />,
//     ),
//     {
//         type: 'divider',
//     },
//     getItem('Quản lý đơn hàng', 'sub5', <AttachMoney />, [
//         getItem('Đơn hàng', ['6', '/orders']),
//         getItem('Khuyến mãi', ['7', '/promotions']),
//     ]),
//     {
//         type: 'divider',
//     },
//     getItem('Quản lý bài viết', ['sub6', '/news'], <FileCopyOutlined />),
// ];
const MenuSideBar = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications, setNotifications] = useState();

    const fecthData = async () => {
        const getNotification = async () => {
            const res = await axiosClient.get('notification/admin/notseen');
            setNotifications(res.data.total);
        };
        getNotification();
    };

    useEffect(() => {
        try {
            fecthData();
        } finally {
        }
    }, [location]);

    const onClick = (e) => {
        navigate(e.key.split(',')[1]);
    };
    return (
        <Menu
            onClick={onClick}
            style={{
                width: 256,
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={
                user.user.role === 'admin'
                    ? [
                          getItem('Trang chủ', ['sub1', '/'], <LineStyle />),
                          {
                              type: 'divider',
                          },
                          getItem('Quản lý người dùng', 'sub2', <PermIdentity />, [
                              getItem('Khách hàng', ['1', '/users']),
                              getItem('Thứ hạng khách hàng', ['2', '/ranks']),
                              getItem('Nhân viên', ['3', '/staffs']),
                          ]),
                          {
                              type: 'divider',
                          },
                          getItem('Quản lý sản phẩm', 'sub3', <Storefront />, [
                              getItem('Sản phẩm', ['4', '/products']),
                              getItem('Danh mục', ['5', '/collections']),
                              getItem('Kho', ['6', '/depots']),
                          ]),
                          {
                              type: 'divider',
                          },
                          getItem(
                              <Badge count={notifications} showZero offset={[30, 0]}>
                                  Thông báo đơn hàng
                              </Badge>,
                              ['sub4', '/notifications'],
                              <NotificationsOutlined />,
                          ),
                          {
                              type: 'divider',
                          },
                          getItem('Quản lý đơn hàng', 'sub5', <AttachMoney />, [
                              getItem('Đơn hàng', ['7', '/orders']),
                              getItem('Khuyến mãi', ['8', '/promotions']),
                          ]),
                          {
                              type: 'divider',
                          },
                          getItem('Quản lý bài viết', ['sub6', '/news'], <FileCopyOutlined />),
                      ]
                    : [
                          getItem('Trang chủ', ['sub1', '/'], <LineStyle />),
                          {
                              type: 'divider',
                          },
                          getItem('Quản lý người dùng', 'sub2', <PermIdentity />, [
                              getItem('Khách hàng', ['1', '/users']),
                              getItem('Thứ hạng khách hàng', ['2', '/ranks']),
                          ]),
                          {
                              type: 'divider',
                          },
                          getItem('Quản lý sản phẩm', 'sub3', <Storefront />, [
                              getItem('Sản phẩm', ['3', '/products']),
                              getItem('Danh mục', ['4', '/collections']),
                              getItem('Kho', ['5', '/depots']),
                          ]),
                          {
                              type: 'divider',
                          },
                          getItem(
                              <Badge count={notifications} showZero offset={[30, 0]}>
                                  Thông báo đơn hàng
                              </Badge>,
                              ['sub4', '/notifications'],
                              <NotificationsOutlined />,
                          ),
                          {
                              type: 'divider',
                          },
                          getItem('Quản lý đơn hàng', 'sub5', <AttachMoney />, [
                              getItem('Đơn hàng', ['6', '/orders']),
                              getItem('Khuyến mãi', ['7', '/promotions']),
                          ]),
                          {
                              type: 'divider',
                          },
                          getItem('Quản lý bài viết', ['sub6', '/news'], <FileCopyOutlined />),
                      ]
            }
        />
    );
};
export default MenuSideBar;
