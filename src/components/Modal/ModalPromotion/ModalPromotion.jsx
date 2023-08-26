import { Modal, Spin } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalPromotion.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalPromotion = (props) => {
    const { open, onClose, id, onResetId } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    const [promotion, setPromotion] = useState({});
    const [promotions, setPromotions] = useState([]);
    const navigate = useNavigate();

    const [startAt, setStartAt] = useState();
    const [endAt, setEndAt] = useState();

    const [start, setStart] = useState();
    const [end, setEnd] = useState();

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res = await axiosClient.get('promotion/detailById/' + String(id));
                if (res) {
                    setPromotion(res.data.detailPromotion);
                    setStartAt(new Date(res.data.detailPromotion.startDate));
                    setEndAt(new Date(res.data.detailPromotion.endDate));

                    const start = new Date(res.data.detailPromotion.startDate);
                    const yyyy_start = start.getFullYear();
                    let mm_start = start.getMonth() + 1; // Months start at 0!
                    let dd_start = start.getDate();
                    if (dd_start < 10) dd_start = '0' + dd_start;
                    if (mm_start < 10) mm_start = '0' + mm_start;
                    setStart(dd_start + '/' + mm_start + '/' + yyyy_start);

                    const end = new Date(res.data.detailPromotion.endDate);
                    const yyyy_end = end.getFullYear();
                    let mm_end = end.getMonth() + 1; // Months end at 0!
                    let dd_end = end.getDate();
                    if (dd_end < 10) dd_end = '0' + dd_end;
                    if (mm_end < 10) mm_end = '0' + mm_end;
                    setEnd(dd_end + '/' + mm_end + '/' + yyyy_end);
                }

                const res_promotions = await axiosClient.get('promotion/');
                setPromotions(res_promotions.data.promotions);
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

    const onChangeStartDate = (date) => {
        if (date !== null) {
            const d = new Date(date);
            setStartAt(d);
        } else {
            setStartAt(null);
        }
    };
    const onChangeEndDate = (date) => {
        if (date !== null) {
            const d = new Date(date);
            setEndAt(d);
        } else {
            setEndAt(null);
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            titlevi: promotion.titlevi + '',
            titleen: promotion.titleen + '',
            code: promotion.code + '',
            value: promotion.value,
            startDate: startAt,
            endDate: endAt,
            isDelete: promotion.isDelete,
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
                    promotion.type === 'normal'
                        ? new Date(
                              new Date().getMonth() + 1 + '-' + new Date().getDate() + '-' + new Date().getFullYear(),
                          )
                        : new Date('1-1-2000'),
                    'Ngày bắt đàu phải lớn hơn hoặc bằng ngày hiện tại',
                )
                .required('Chọn ngày bắt đầu'),
            endDate: Yup.date()
                .min(Yup.ref('startDate'), 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu')
                .required('Chọn ngày kết thúc'),
        }),
        onSubmit: async (values) => {
            const { titlevi, titleen, code, value, startDate, endDate, isDelete } = values;
            setLoading(true);
            try {
                var used_code = false;
                var arr = [];
                promotions.map((item) => {
                    return arr.push(item.code);
                });

                const new_arr = arr.filter((item) => item !== promotion.code);

                new_arr.map((p) => {
                    if (p === code) {
                        used_code = true;
                    }
                });
                if (used_code) {
                    toast.error('Mã khuyến mãi này đã được sử dụng');
                } else {
                    const res = await axiosClient.put('promotion/' + id, {
                        titlevi: titlevi,
                        titleen: titleen,
                        code: code,
                        value: value,
                        startDate: startDate,
                        endDate: endDate,
                        isDelete: isDelete,
                    });
                    if (res) {
                        toast.success('Cập nhật thành công!');
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
                title="CẬP NHẬT KHUYẾN MÃI"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-promotion')}>
                        <form onSubmit={formik.handleSubmit} className={cx('add-promotion-form')} spellCheck="false">
                            {promotion.type === 'normal' && (
                                <>
                                    <div className={cx('add-promotion-item')}>
                                        <label>Ngày bắt đầu</label>
                                        {start !== undefined && (
                                            <DatePicker
                                                defaultValue={dayjs(start, 'DD/MM/YYYY')}
                                                placeholder="Chọn ngày bắt đầu"
                                                className={cx('date-picker')}
                                                onChange={onChangeStartDate}
                                                format="DD/MM/YYYY"
                                            />
                                        )}
                                        {formik.errors.startDate && (
                                            <div className={cx('input-feedback')}>{formik.errors.startDate}</div>
                                        )}
                                    </div>
                                    <div className={cx('add-promotion-item')}>
                                        <label>Ngày kết thúc</label>
                                        {end !== undefined && (
                                            <DatePicker
                                                defaultValue={dayjs(end, 'DD/MM/YYYY')}
                                                placeholder="Chọn ngày kết thúc"
                                                className={cx('date-picker')}
                                                onChange={onChangeEndDate}
                                                format="DD/MM/YYYY"
                                            />
                                        )}

                                        {formik.errors.endDate && (
                                            <div className={cx('input-feedback')}>{formik.errors.endDate}</div>
                                        )}
                                    </div>
                                </>
                            )}

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
                                    value={String(formik.values.value)}
                                    label={'Giá trị khuyến mãi(%)'}
                                    require
                                    touched={formik.touched.value}
                                    error={formik.errors.value}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <Button type="submit" customClass={styles}>
                                Cập nhật
                            </Button>
                        </form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalPromotion;
