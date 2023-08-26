import { Modal, Spin } from 'antd';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalPromotionNew.module.scss';
import axiosClient from '~/api/axiosClient';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalPromotionNew = (props) => {
    const { open, onClose } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        formik.values.titlevi = '';
        formik.values.titleen = '';
        formik.values.code = '';
        formik.values.value = '';
        formik.values.startDate = null;
        formik.values.endDate = null;

        formik.errors.titlevi = '';
        formik.errors.titleen = '';
        formik.errors.code = '';
        formik.errors.value = '';
        formik.errors.startDate = '';
        formik.errors.endDate = '';

        onClose(false);
    };

    //-------------------------------------------------------------
    const navigate = useNavigate();

    const [startAt, setStartAt] = useState();
    const [endAt, setEndAt] = useState();

    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const getPromotion = async () => {
            const res = await axiosClient.get('promotion/');
            setPromotions(res.data.promotions);
        };
        getPromotion();
    }, []);

    const onChangeStartDate = (date) => {
        if (date !== null) {
            const d = new Date(date);
            setStartAt(d);
        } else {
            setStartAt(undefined);
        }
    };

    const onChangeEndDate = (date) => {
        if (date !== null) {
            const d = new Date(date);
            setEndAt(d);
        } else {
            setEndAt(undefined);
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            titlevi: '',
            titleen: '',
            code: '',
            value: '',
            startDate: startAt,
            endDate: endAt,
            isDelete: false,
        },
        validationSchema: Yup.object({
            titlevi: Yup.string().required('Nhập tên khuyến mãi tiếng Việt'),
            titleen: Yup.string().required('Nhập tên khuyến mãi tiếng Anh'),
            code: Yup.string().required('Nhập mã khuyến mãi'),
            value: Yup.number()
                .min(1, 'Giá trị khuyến mãi phải lớn hơn hoặc bằng 1')
                .max(99, 'Giá trị khuyến mãi phải nhỏ hơn hoặc bằng 99')
                .required('Nhập giá trị khuyến mãi(%)'),
            startDate: Yup.date()
                .min(
                    new Date(new Date().getMonth() + 1 + '-' + new Date().getDate() + '-' + new Date().getFullYear()),
                    'Ngày bắt đàu phải lớn hơn hoặc bằng ngày hiện tại',
                )
                .required('Chọn ngày bắt đầu'),
            endDate: Yup.date()
                .min(Yup.ref('startDate'), 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu')
                .required('Chọn ngày kết thúc'),
        }),
        onSubmit: async (values) => {
            const { titlevi, titleen, code, value, startDate, endDate, isDelete } = values;
            // console.log(values);
            setLoading(true);
            try {
                var used_code = false;
                promotions.map((p) => {
                    if (p.code === code) {
                        used_code = true;
                    }
                });
                if (used_code) {
                    toast.error('Mã khuyến mãi này đã được sử dụng');
                } else {
                    const res = await axiosClient.post('promotion/', {
                        titlevi: titlevi,
                        titleen: titleen,
                        code: code,
                        type: 'normal',
                        forRank: 'unrank',
                        value: value,
                        startDate: startDate,
                        endDate: endDate,
                        isDelete: isDelete,
                    });
                    if (res) {
                        toast.success('Thêm thành công!');
                        handleCancel();
                        navigate('/promotions');
                    }
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
                title="THÊM MỚI KHUYẾN MÃI"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-promotion')}>
                        <form onSubmit={formik.handleSubmit} className={cx('add-promotion-form')} spellCheck="false">
                            <div className={cx('add-promotion-item')}>
                                <label>Ngày bắt đầu</label>
                                <DatePicker
                                    placeholder="Chọn ngày bắt đầu"
                                    className={cx('date-picker')}
                                    onChange={onChangeStartDate}
                                    format="DD/MM/YYYY"
                                />
                                {formik.errors.startDate && (
                                    <div className={cx('input-feedback')}>{formik.errors.startDate}</div>
                                )}
                            </div>
                            <div className={cx('add-promotion-item')}>
                                <label>Ngày kết thúc</label>
                                <DatePicker
                                    placeholder="Chọn ngày kết thúc"
                                    className={cx('date-picker')}
                                    onChange={onChangeEndDate}
                                    format="DD/MM/YYYY"
                                />
                                {formik.errors.endDate && (
                                    <div className={cx('input-feedback')}>{formik.errors.endDate}</div>
                                )}
                            </div>
                            <div className={cx('add-promotion-item')}>
                                <label>Thông tin khuyến mãi</label>
                            </div>
                            <div className={cx('add-promotion-item')}>
                                <InputField
                                    type="text"
                                    id="titlevi"
                                    name="titlevi"
                                    placeholder="."
                                    value={formik.values.titlevi}
                                    label={'Tên khuyến mãi tiếng Việt'}
                                    require
                                    touched={formik.touched.titlevi}
                                    error={formik.errors.titlevi}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-promotion-item')}>
                                <InputField
                                    type="text"
                                    id="titleen"
                                    name="titleen"
                                    placeholder="."
                                    value={formik.values.titleen}
                                    label={'Tên khuyến mãi tiếng Anh'}
                                    require
                                    touched={formik.touched.titleen}
                                    error={formik.errors.titleen}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-promotion-item')}>
                                <InputField
                                    type="text"
                                    id="code"
                                    name="code"
                                    placeholder="."
                                    value={formik.values.code}
                                    label={'Mã khuyến mãi'}
                                    require
                                    touched={formik.touched.code}
                                    error={formik.errors.code}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-promotion-item')}>
                                <InputField
                                    type="number"
                                    id="value"
                                    name="value"
                                    placeholder="."
                                    value={formik.values.value}
                                    label={'Giá trị khuyến mãi(%)'}
                                    require
                                    touched={formik.touched.value}
                                    error={formik.errors.value}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <Button type="submit" customClass={styles}>
                                Thêm
                            </Button>
                        </form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalPromotionNew;
