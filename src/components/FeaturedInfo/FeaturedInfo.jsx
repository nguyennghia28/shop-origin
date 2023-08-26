import classNames from 'classnames/bind';
import styles from './FeaturedInfo.module.scss';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import axiosClient from '~/api/axiosClient';
dayjs.extend(customParseFormat);

const cx = classNames.bind(styles);
const monthFormat = 'MM/YYYY';

export default function FeaturedInfo() {
    const [loadingIncome, setLoadingIncome] = useState(false);
    const [loadingQuantity, setLoadingQuantity] = useState(false);

    const currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    if (currentMonth < 10) currentMonth = '0' + currentMonth;
    const currentYear = currentDate.getFullYear();

    const [income, setIncome] = useState();
    const [spending, setSpending] = useState();
    const [quantity, setQuantity] = useState();

    const getIncome = async () => {
        setLoadingIncome(true);
        try {
            const res = await axiosClient.get(`/order/incomeorder?year=${currentYear}&month=${currentMonth}`);
            setIncome(res.data.revenue.income[0].total);
            setSpending(res.data.revenue.spending[0].total);
        } catch {
        } finally {
            setLoadingIncome(false);
        }
    };

    const getQuantity = async () => {
        setLoadingQuantity(true);
        try {
            const res = await axiosClient.get(`/order/incomequantity?year=${currentYear}&month=${currentMonth}`);
            setQuantity(res.data.income[0].total);
        } catch {
        } finally {
            setLoadingQuantity(false);
        }
    };

    useEffect(() => {
        getIncome();

        getQuantity();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeIncomeTime = async (value) => {
        setLoadingIncome(true);
        const d = new Date(value);
        try {
            const res = await axiosClient.get(`/order/incomeorder?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
            if (JSON.stringify(res.data.revenue.income) !== '[]') {
                setIncome(res.data.revenue.income[0].total);
            } else {
                setIncome(0);
            }
            if (JSON.stringify(res.data.revenue.spending) !== '[]') {
                setSpending(res.data.revenue.spending[0].total);
            } else {
                setSpending(0);
            }
        } finally {
            setLoadingIncome(false);
        }
    };

    const handleChangeQuantityTime = async (value) => {
        setLoadingQuantity(true);
        const d = new Date(value);
        try {
            const res = await axiosClient.get(
                `/order/incomequantity?year=${d.getFullYear()}&month=${d.getMonth() + 1}`,
            );
            if (JSON.stringify(res.data.income) !== '[]') {
                setQuantity(res.data.income[0].total);
            } else {
                setQuantity(0);
            }
        } finally {
            setLoadingQuantity(false);
        }
    };

    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    return (
        <div className={cx('featured')}>
            <div className={cx('featured-item')}>
                <Spin spinning={loadingIncome}>
                    <span className={cx('featured-title')}>Doanh thu</span>
                    <DatePicker
                        style={{ width: '100px' }}
                        defaultValue={dayjs(`${currentMonth}/${currentYear}`, monthFormat)}
                        format={monthFormat}
                        picker="month"
                        onChange={handleChangeIncomeTime}
                    />
                    {income !== undefined && spending !== undefined && (
                        <>
                            <div className={cx('featured-money-container')}>
                                <label className={cx('featured-lable')}>Tổng thu: </label>
                                <span className={cx('featured-money')}>{NumberWithCommas(income)}</span>
                            </div>
                            <div className={cx('featured-money-container')}>
                                <label className={cx('featured-lable')}>Tổng chi: </label>
                                <span className={cx('featured-money')}>{NumberWithCommas(spending)}</span>
                            </div>
                            <div className={cx('featured-money-container')}>
                                <label className={cx('featured-lable')}>Lợi nhuận: </label>
                                <span className={cx('featured-money')}>{NumberWithCommas(income - spending)}</span>
                            </div>
                        </>
                    )}
                </Spin>
            </div>
            <div className={cx('featured-item')}>
                <Spin spinning={loadingQuantity}>
                    <span className={cx('featured-title')}>Bán hàng</span>
                    <DatePicker
                        style={{ width: '100px' }}
                        defaultValue={dayjs(`${currentMonth}/${currentYear}`, monthFormat)}
                        format={monthFormat}
                        picker="month"
                        onChange={handleChangeQuantityTime}
                    />
                    {quantity !== undefined && (
                        <div className={cx('featured-money-container')}>
                            <span className={cx('featured-money')}>{quantity} sản phẩm</span>
                        </div>
                    )}
                </Spin>
            </div>
        </div>
    );
}
