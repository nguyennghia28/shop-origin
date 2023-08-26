import classNames from 'classnames/bind';
import styles from './NewMember.module.scss';
import { Visibility } from '@material-ui/icons';
import { userRows } from '../../data/dummyData.js';

const cx = classNames.bind(styles);

export default function WidgetSm() {
    return (
        <div className={cx('widget-sm')}>
            <span className={cx('widget-sm-title')}>Khách hàng mới</span>
            <ul className={cx('widget-sm-list')}>
                {userRows.map((user) => (
                    <li className={cx('widget-sm-list-item')} key={user._id}>
                        <img
                            src={user.avatar || 'https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif'}
                            alt=""
                            className={cx('widget-sm-img')}
                        />
                        <div className={cx('widget-sm-user')}>
                            <span className={cx('widget-sm-username')}>{user.username}</span>
                        </div>
                        <button className={cx('widget-sm-button')}>
                            <Visibility className={cx('widget-sm-icon')} />
                            Hiển thị
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
