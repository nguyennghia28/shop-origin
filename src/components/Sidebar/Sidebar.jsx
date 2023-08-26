import classNames from 'classnames/bind';
import { LineStyle, PermIdentity, Storefront, AttachMoney, BarChart, Menu } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

export default function Sidebar() {
    return (
        <div className={cx('sidebar')}>
            <div className={cx('sidebar-wrapper')}>
                <div className={cx('sidebar-menu')}>
                    <h3 className={cx('sidebar-title')}>Dashboard</h3>
                    <ul className={cx('sidebar-list')}>
                        <Link to="/" className="link">
                            <li className={cx('sidebar-list-item', 'active')}>
                                <LineStyle className={cx('sidebar-icon')} />
                                Trang chủ
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className={cx('sidebar-menu')}>
                    <h3 className={cx('sidebar-title')}>Người dùng</h3>
                    <ul className={cx('sidebar-list')}>
                        <Link to="/users" className="link">
                            <li className={cx('sidebar-list-item')}>
                                <PermIdentity className={cx('sidebar-icon')} />
                                Khách hàng
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className={cx('sidebar-menu')}>
                    <h3 className={cx('sidebar-title')}>Sản phẩm</h3>
                    <ul className={cx('sidebar-list')}>
                        <Link to="/products" className="link">
                            <li className={cx('sidebar-list-item')}>
                                <Storefront className={cx('sidebar-icon')} />
                                Sản phẩm
                            </li>
                        </Link>
                        <Link to="/collections" className="link">
                            <li className={cx('sidebar-list-item')}>
                                <Menu className={cx('sidebar-icon')} />
                                Danh mục
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className={cx('sidebar-menu')}>
                    <h3 className={cx('sidebar-title')}>Hóa đơn</h3>
                    <ul className={cx('sidebar-list')}>
                        <Link to="/" className="link">
                            <li className={cx('sidebar-list-item')}>
                                <AttachMoney className={cx('sidebar-icon')} />
                                Hóa đơn
                            </li>
                        </Link>
                        <Link to="/" className="link">
                            <li className={cx('sidebar-list-item')}>
                                <BarChart className={cx('sidebar-icon')} />
                                Thống kê
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    );
}
