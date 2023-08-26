import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import FeaturedInfo from '~/components/FeaturedInfo/FeaturedInfo';
// import NewMember from '~/components/NewMember/NewMember';
import LastestTransactions from '~/components/LastestTransactions/LastestTransactions';
import Chart from '~/components/Chart/Chart';
// import { userData } from '../../data/dummyData.js';
import axiosClient from '~/api/axiosClient';
import { useEffect, useMemo, useState } from 'react';
import { Spin } from 'antd';

const cx = classNames.bind(styles);

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [userStats, setUserStats] = useState([]);

    const MONTHS = useMemo(
        () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'],
        [],
    );

    const getStats = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/user/stats');
            const list = res.data.data.sort((a, b) => {
                return a._id - b._id;
            });
            list.map((item) =>
                setUserStats((prev) => [...prev, { name: MONTHS[item._id - 1], 'Người dùng hoạt động': item.total }]),
            );
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MONTHS]);

    return (
        <div className={cx('home')}>
            <FeaturedInfo />
            <Spin spinning={loading}>
                <Chart data={userStats} title="Biểu đồ phân tích người dùng" dataKey="Người dùng hoạt động" />
            </Spin>
            <div className={cx('home-widgets')}>
                {/* <NewMember /> */}
                <LastestTransactions />
            </div>
        </div>
    );
}
