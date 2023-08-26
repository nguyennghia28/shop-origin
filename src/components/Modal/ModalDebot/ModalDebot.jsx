import { Modal, Spin } from 'antd';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalDebot.module.scss';
import axiosClient from '~/api/axiosClient';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalDebot = (props) => {
    const { open, onClose, id, onResetId } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        formik.values.quantity = '';
        formik.values.importPrice = '';
        formik.errors.quantity = '';
        formik.errors.importPrice = '';
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------
    const navigation = useNavigate();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            quantity: '',
            importPrice: '',
        },
        validationSchema: Yup.object({
            quantity: Yup.number()
                .required('Nhập tên danh mục')
                .min(1, 'Số lượng nhập phải lớn hơn 0')
                .max(100, 'Số lượng nhập phải nhỏ hơn hoặc bằng 100'),
            importPrice: Yup.number().required('Nhập mô tả tiếng Anh').min(1, 'Giá nhập phải lớn hơn 0'),
        }),
        onSubmit: async (values) => {
            const { quantity, importPrice } = values;
            setLoading(true);
            try {
                const res = await axiosClient.post('depot/', {
                    productId: id,
                    quantity: quantity,
                    importPrice: importPrice,
                });
                if (res) {
                    toast.success('Nhập hàng thành công!');
                    handleCancel();
                    navigation('/products');
                }
            } catch (error) {
                toast.error(error);
            } finally {
                setLoading(false);
            }
        },
    });
    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="NHẬP HÀNG"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-collection')}>
                        {/* <h1 className={cx('add-collection-title')}>Cập nhật danh mục</h1> */}
                        <form onSubmit={formik.handleSubmit} className={cx('add-collection-form')} spellCheck="false">
                            <div className={cx('add-collection-item')}>
                                <InputField
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    placeholder="."
                                    value={formik.values.quantity}
                                    label={'Số lượng nhập'}
                                    require
                                    touched={formik.touched.quantity}
                                    error={formik.errors.quantity}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div className={cx('add-collection-item')}>
                                <InputField
                                    type="number"
                                    id="importPrice"
                                    name="importPrice"
                                    placeholder="."
                                    value={formik.values.importPrice}
                                    label={'Giá nhập mỗi sản phẩm'}
                                    require
                                    touched={formik.touched.importPrice}
                                    error={formik.errors.importPrice}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <p style={{ fontStyle: 'italic', color: 'red' }}>
                                Lưu ý nhập đúng dữ liệu, không thể chỉnh sửa sau khi nhập!
                            </p>
                            <Button type="submit" customClass={styles}>
                                Nhập hàng
                            </Button>
                        </form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalDebot;
