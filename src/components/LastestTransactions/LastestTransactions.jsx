import classNames from 'classnames/bind';
import styles from './LastestTransactions.module.scss';
// import { lastPersonOder } from '../../data/dummyData.js';
import { useEffect, useState } from 'react';
import axiosClient from '~/api/axiosClient';
import * as moment from 'moment';
import { Spin } from 'antd';

const cx = classNames.bind(styles);

export default function WidgetLg() {
    const [loading, setLoading] = useState(false);

    const Button = ({ type, children }) => {
        var title = '';
        if (children === 'PENDING') {
            title = 'Chờ xác nhận';
        } else if (children === 'PACKAGE') {
            title = 'Đóng gói';
        } else if (children === 'DELIVERING') {
            title = 'Đang vận chuyển';
        } else if (children === 'COMPLETE') {
            title = 'Đã giao';
        } else if (children === 'CANCEL') {
            title = 'Đã hủy';
        }
        return <button className={cx('widget-lg-button', type)}>{title}</button>;
    };

    const [orders, setOrders] = useState({});
    const getOrders = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('order/admin', { params: { new: true } });
            if (res) {
                setOrders(res.data.orderList);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getOrders();
    }, []);
    // console.log(orders);
    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }
    return (
        <div className={cx('widget-lg')}>
            <h3 className={cx('widget-lg-title')}>10 đơn hàng mới nhất</h3>
            <Spin spinning={loading}>
                <table className={cx('widget-lg-table')}>
                    <tbody>
                        <tr className={cx('widget-lg-tr')}>
                            <th className={cx('widget-lg-th')}>Khách hàng</th>
                            <th className={cx('widget-lg-th')}>Ngày</th>
                            <th className={cx('widget-lg-th')}>Giá trị giao dịch</th>
                            <th className={cx('widget-lg-th')}>Trạng thái</th>
                        </tr>
                        {JSON.stringify(orders) !== '{}' &&
                            orders.map((order, i) => (
                                <tr className={cx('widget-lg-tr')} key={i}>
                                    <td className={cx('widget-lg-user')}>
                                        <span className={cx('widget-lg-name')}>{order.recipient.username}</span>
                                    </td>
                                    {/* moment(params.value).format('DD/MM/YYYY') */}
                                    <td className={cx('widget-lg-date')}>
                                        {moment(order.dateOrdered).format('DD/MM/YYYY')}
                                    </td>
                                    <td className={cx('widget-lg-amount')}>{NumberWithCommas(order.finalPrice)}</td>
                                    <td className={cx('widget-lg-status')}>
                                        <Button type={order.status.state} children={order.status.state} />
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Spin>
        </div>
    );
}
