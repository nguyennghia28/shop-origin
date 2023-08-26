import { Modal, Spin } from 'antd';
import classNames from 'classnames/bind';
import styles from './ModalHistoryPrice.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import Grid from '~/components/Grid/Grid';

const cx = classNames.bind(styles);

const ModalHistoryPrice = (props) => {
    const { open, onClose, id, onResetId } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    const [historyPrices, setHistoryPrices] = useState({});

    const fetchData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res = await axiosClient.get('historyPrice', {
                    params: { productId: id },
                });
                for (let i = 0; i < res.data.historyPrices.length; i++) {
                    res.data.historyPrices[i].productName = res.data.historyPrices[i].product.name;
                }
                setHistoryPrices(res.data.historyPrices);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    const columns = [
        {
            field: 'productName',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên sản phẩm',
            width: 200,
        },
        {
            field: 'user',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Người thực hiện',
            width: 150,
            renderCell: (params) => {
                return params.row.user.username;
            },
        },
        {
            field: 'oldPrice',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá trước thay đổi',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('price_cell')}>
                            <span className={cx('price_cell_value')}>
                                {NumberWithCommas(Number(params.row.oldPrice))}
                            </span>
                        </div>
                    </>
                );
            },
        },
        {
            field: 'newPrice',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá sau thay đổi',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('price_cell')}>
                            <span className={cx('price_cell_value')}>
                                {NumberWithCommas(Number(params.row.newPrice))}
                            </span>
                        </div>
                    </>
                );
            },
        },
        {
            field: 'createdAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày thực hiện',
            width: 200,
            type: 'date',
            valueFormatter: function (params) {
                return new Date(params.value).toLocaleString();
            },
        },
    ];

    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="LỊCH SỬ THAY ĐỔI GIÁ"
                width={1000}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('grid')}>
                        <Grid
                            headers={columns}
                            datas={historyPrices}
                            rowHeight={63}
                            pagesize={10}
                            hideToolbar={false}
                        />
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalHistoryPrice;
