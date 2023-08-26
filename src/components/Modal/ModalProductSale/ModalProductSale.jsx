import { Modal, Spin } from 'antd';
import classNames from 'classnames/bind';

// import { productData } from '~/data/dummyData.js';
import Chart from '~/components/Chart/Chart';
import styles from './ModalProductSale.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useMemo, useState } from 'react';

const cx = classNames.bind(styles);

const ModalProductSale = (props) => {
    const { open, onClose, id } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        // setPStats(null);
        onClose(false);
    };

    //-------------------------------------------------------------

    const [product, setProduct] = useState({});
    const [img, setImg] = useState();

    const [pStats, setPStats] = useState([]);

    const MONTHS = useMemo(
        () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'],
        [],
    );

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res_detailProduct = await axiosClient.get('product/detail/' + id);
                setProduct(res_detailProduct.data.detailProduct);
                setImg(res_detailProduct.data.detailProduct.images[0]);

                const res = await axiosClient.get('order/income?pid=' + id);
                const list = res.data.income.sort((a, b) => {
                    return a._id - b._id;
                });
                const rs = list.reduce((acc, cur) => {
                    acc.push({ name: MONTHS[cur._id - 1], 'Đã bán': cur.total });
                    return acc;
                }, []);
                setPStats(rs);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fecthData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, MONTHS]);

    // useEffect(() => {

    // }, [id]);

    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="DOANH SỐ SẢN PHẨM"
                width={1000}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('product')}>
                        <div className={cx('product-top')}>
                            <div className={cx('product-top-right')}>
                                <div className={cx('product-info-top')}>
                                    <img src={img} alt="" className={cx('product-info-img')} />
                                    <span className={cx('product-name')}>{product.name}</span>
                                </div>
                                <div className={cx('product-info-bottom')}>
                                    <div className={cx('product-info-item')}>
                                        <span className={cx('product-info-key')}>Đã bán:</span>
                                        <span className={cx('product-info-value')}>{product.sold}</span>
                                    </div>
                                    <div className={cx('product-info-item')}>
                                        <span className={cx('product-info-key')}>Tồn kho:</span>
                                        <span className={cx('product-info-value')}>{product.stock}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('product-top-left')}>
                                <Chart data={pStats} dataKey="Đã bán" title="Hiệu suất bán hàng" />
                            </div>
                        </div>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalProductSale;
