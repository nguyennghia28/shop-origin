import classNames from 'classnames/bind';
import styles from './Chart.module.scss';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

const cx = classNames.bind(styles);

export default function Chart({ title, data, dataKey, grid }) {
    return (
        <div className={cx('chart')}>
            <h3 className={cx('chart-title')}>{title}</h3>
            <ResponsiveContainer width="99%" aspect={4 / 1}>
                <LineChart data={data}>
                    <XAxis dataKey="name" stroke="#5550bd" />
                    <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
                    <YAxis />
                    <Tooltip />
                    {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
