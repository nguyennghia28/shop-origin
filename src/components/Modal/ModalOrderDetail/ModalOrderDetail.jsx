import { Modal, Spin } from 'antd';
import classNames from 'classnames/bind';

import styles from './ModalOrderDetail.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const ModalOrderDetail = (props) => {
    const { open, onClose, id, onResetId } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    // const [order, setOrder] = useState({});
    const [order, setOrder] = useState({});
    const [status, setStatus] = useState('');
    const [orderDetails, setOrderDetails] = useState([]);

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res = await axiosClient.get('order/admin/' + id);
                if (res) {
                    setStatus(res.data.order.status.state);
                    setOrderDetails(res.data.order.orderDetails);
                    var total_amout = 0;
                    for (let i = 0; i < res.data.order.orderDetails.length; i++) {
                        total_amout += res.data.order.orderDetails[i].quantity;
                    }
                    res.data.order.total_amout = total_amout;
                    setOrder(res.data.order);
                }
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fecthData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const StatusName = (status) => {
        if (status === 'PENDING') {
            return 'Chờ xác nhận';
        } else if (status === 'PACKAGE') {
            return 'Đã xác nhận và Bắt đầu đóng gói';
        } else if (status === 'DELIVERING') {
            return 'Bắt đầu vận chuyển';
        } else if (status === 'COMPLETE') {
            return 'Đã giao';
        } else if (status === 'CANCEL') {
            return 'Đã hủy';
        }
    };

    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="CHI TIẾT ĐƠN HÀNG"
                width={1000}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('order-bottom')}>
                        <div className={cx('add-order-form')}>
                            {status !== '{}' && (
                                <>
                                    <div className={cx('add-order-item')}>
                                        <label>
                                            Trạng thái đơn hàng: <span>{StatusName(status)}</span>
                                        </label>
                                    </div>

                                    <table className={cx('table_time')}>
                                        <tbody>
                                            <tr>
                                                <th>Quá trình</th>
                                                <th>Mốc thời gian</th>
                                            </tr>

                                            {status === 'PENDING' && (
                                                <tr>
                                                    <td>Đặt hàng</td>
                                                    <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                                </tr>
                                            )}
                                            {status === 'PACKAGE' && (
                                                <>
                                                    <tr>
                                                        <td>Đặt hàng</td>
                                                        <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Xác nhận & Bắt đầu đóng gói</td>
                                                        <td>{new Date(order.status.packageDate).toLocaleString()}</td>
                                                    </tr>
                                                </>
                                            )}
                                            {status === 'DELIVERING' && (
                                                <>
                                                    <tr>
                                                        <td>Đặt hàng</td>
                                                        <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Xác nhận & Bắt đầu đóng gói</td>
                                                        <td>{new Date(order.status.packageDate).toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Bắt đầu vận chuyển</td>
                                                        <td>
                                                            {new Date(order.status.deliveringDate).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                </>
                                            )}
                                            {status === 'COMPLETE' && (
                                                <>
                                                    <tr>
                                                        <td>Đặt hàng</td>
                                                        <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Xác nhận & Bắt đầu đóng gói</td>
                                                        <td>{new Date(order.status.packageDate).toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Bắt đầu vận chuyển</td>
                                                        <td>
                                                            {new Date(order.status.deliveringDate).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nhận hàng</td>
                                                        <td>{new Date(order.status.completeDate).toLocaleString()}</td>
                                                    </tr>
                                                </>
                                            )}
                                            {status === 'CANCEL' && (
                                                <>
                                                    <tr>
                                                        <td>Đặt hàng</td>
                                                        <td>{new Date(order.dateOrdered).toLocaleString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Hủy</td>
                                                        <td>{new Date(order.status.cancelDate).toLocaleString()}</td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={cx('order-bottom')}>
                        <div className={cx('add-order-form')}>
                            {JSON.stringify(orderDetails) !== '[]' && (
                                <>
                                    <div className={cx('add-order-item')}>
                                        <label>Chi tiết đơn hàng</label>
                                    </div>

                                    <table className={cx('table_orderDetail')}>
                                        <tbody>
                                            <tr>
                                                <th className={cx('th_orderDetail')}>Hình ảnh</th>
                                                <th className={cx('th_orderDetail')}>Tên sản phẩm</th>
                                                <th className={cx('th_orderDetail')}>Giá bán</th>
                                                <th className={cx('th_orderDetail')}>Số lượng</th>
                                                <th className={cx('th_orderDetail')}>Thành tiền</th>
                                            </tr>
                                            {orderDetails.map((orderDetail, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className={cx('td_img_orderDetail')}>
                                                            <img
                                                                className={cx('img_orderDetail')}
                                                                src={orderDetail.product.images[0]}
                                                                alt="img"
                                                            />
                                                        </td>
                                                        <td className={cx('td_name_orderDetail')}>
                                                            <div className={cx('order_name')}>
                                                                {orderDetail.product.name}
                                                            </div>
                                                        </td>
                                                        <td className={cx('td_price_orderDetail')}>
                                                            {NumberWithCommas(orderDetail.finalPrice)}
                                                        </td>
                                                        <td className={cx('td_amount_orderDetail')}>
                                                            {orderDetail.quantity}
                                                        </td>
                                                        <td className={cx('td_price_orderDetail')}>
                                                            {NumberWithCommas(
                                                                orderDetail.finalPrice * orderDetail.quantity,
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <table className={cx('table_orderDetail')}>
                                        <tbody>
                                            <tr>
                                                <td className={cx('td_title_total_orderDetail')}>Tổng số lượng</td>
                                                <td className={cx('td_price_total_orderDetail')}>
                                                    {order.total_amout}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cx('td_title_total_orderDetail')}>Tổng tiền hàng</td>
                                                <td className={cx('td_price_total_orderDetail')}>
                                                    {NumberWithCommas(order.originalPrice)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cx('td_title_total_orderDetail')}>Giảm giá</td>
                                                <td className={cx('td_price_total_orderDetail')}>
                                                    {NumberWithCommas(order.discountPrice)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cx('td_title_total_orderDetail')}>Tiền vận chuyển</td>
                                                <td className={cx('td_price_total_orderDetail')}>
                                                    {NumberWithCommas(order.shipPrice)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cx('td_title_total_orderDetail')}>Tổng tiền</td>
                                                <td className={cx('td_price_total_orderDetail')}>
                                                    {NumberWithCommas(order.finalPrice)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalOrderDetail;
