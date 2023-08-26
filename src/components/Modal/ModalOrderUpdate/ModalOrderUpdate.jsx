import { Modal, Spin } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalOrderUpdate.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalOrderUpdate = (props) => {
    const { open, onClose, id, onResetId } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    const navigation = useNavigate();
    // const [order, setOrder] = useState({});
    const [recipient, setRecipient] = useState({});

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res = await axiosClient.get('order/admin/' + id);
                if (res) {
                    setRecipient(res.data.order.recipient);
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

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: recipient.username + '',
            phone: recipient.phone + '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Nhập tên Khách hàng'),
            phone: Yup.string()
                .required('Nhập số điện thoại')
                .matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, 'Nhập số điện thoại không chính xác'),
        }),

        onSubmit: async (values) => {
            const { username, phone } = values;

            setLoading(true);
            try {
                const res = await axiosClient.put('order/info/update/' + id, {
                    username: username,
                    phone: phone,
                });
                if (res) {
                    toast.success('Cập nhật thành công!');
                    handleCancel();
                    navigation('/orders');
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
                title="CẬP NHẬT THÔNG TIN KHÁCH HÀNG"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <form onSubmit={formik.handleSubmit} className={cx('add-orderupdate-form')} spellCheck="false">
                        <div className={cx('add-orderupdate-item')}>
                            <label>Thông tin khách hàng</label>
                        </div>
                        {JSON.stringify(recipient) !== '{}' && (
                            <div className={cx('add-orderupdate-item')}>
                                <InputField
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="."
                                    value={formik.values.username}
                                    label={'Tên khách hàng'}
                                    require
                                    touched={formik.touched.username}
                                    error={formik.errors.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        )}

                        <div className={cx('add-orderupdate-item')}>
                            <InputField
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="."
                                value={formik.values.phone}
                                label={'Số điện thoại'}
                                require
                                touched={formik.touched.phone}
                                error={formik.errors.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {JSON.stringify(recipient) !== '{}' && (
                            <div className={cx('add-orderupdate-item')}>
                                <InputField
                                    customClass={styles}
                                    type="textarea"
                                    readonly={true}
                                    id="address"
                                    name="address"
                                    placeholder="."
                                    value={
                                        recipient.address +
                                        ', ' +
                                        recipient.addressWard.WardName +
                                        ', ' +
                                        recipient.addressDistrict.DistrictName +
                                        ', ' +
                                        recipient.addressProvince.ProvinceName
                                    }
                                    label={'Địa chỉ'}
                                    require
                                    onChange={formik.handleChange}
                                />
                            </div>
                        )}

                        <Button type="submit" customClass={styles}>
                            Cập nhật
                        </Button>
                    </form>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalOrderUpdate;
