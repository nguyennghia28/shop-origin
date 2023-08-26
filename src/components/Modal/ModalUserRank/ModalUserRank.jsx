import { Modal } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalUserRank.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalUserRank = (props) => {
    const { open, onClose, id, onResetId } = props;
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    const [rank, setRank] = useState({});
    const navigation = useNavigate();

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res = await axiosClient.get('rank/detail/' + String(id));
                setRank(res.data.detailRank);
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
            namevi: rank.namevi + '',
            nameen: rank.nameen + '',
            icon: [],
            minValue: rank.minValue,
            maxValue: rank.maxValue,
            descriptionvi: rank.descriptionvi + '',
            descriptionen: rank.descriptionen + '',
        },
        validationSchema: Yup.object({
            namevi: Yup.string().required('Nhập tên tiếng Việt'),
            nameen: Yup.string().required('Nhập tên tiếng Anh'),
            minValue: Yup.number().min(1, 'Chi tiêu tối thiểu phải lớn hơn 0').required('Nhập chi tiêu tối thiểu'),
            maxValue: Yup.number()
                // .min(1, 'Chi tiêu tối đa phải lớn hơn 0')
                .moreThan(Yup.ref('minValue'), 'Chi tiêu tối đa phải lớn hơn chi tiêu tối thiểu')
                .required('Nhập chi tiêu tối đa'),
            descriptionvi: Yup.string().required('Nhập mô tả tiếng Việt'),
            descriptionen: Yup.string().required('Nhập mô tả tiếng Anh'),
        }),
        onSubmit: async (values) => {
            const { namevi, nameen, icon, minValue, maxValue, descriptionen, descriptionvi } = values;
            const formData = new FormData();
            if (icon[0] !== undefined) {
                formData.append('icon', icon[0]);
            }
            formData.append('namevi', namevi);
            formData.append('nameen', nameen);
            formData.append('minValue', minValue);
            formData.append('maxValue', maxValue);
            formData.append('descriptionen', descriptionen);
            formData.append('descriptionvi', descriptionvi);

            setLoading(true);
            try {
                const res = await axiosClient.put('rank/' + id, formData);
                if (res) {
                    toast.success('Cập nhật thành công!');
                    handleCancel();
                    navigation('/ranks');
                }
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
                title="CẬP NHẬT THỨ HẠNG"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-rank')}>
                        {/* <h1 className={cx('add-rank-title')}>Cập nhật danh mục</h1> */}
                        <form onSubmit={formik.handleSubmit} className={cx('add-rank-form')} spellCheck="false">
                            <div className={cx('add-product-item')}>
                                <label className={cx('lable-update')}>Hình ảnh hiện tại thứ hạng</label>

                                <div className={cx('list-img')}>
                                    <div className={cx('img')}>
                                        <img className={cx('item-img')} src={rank.icon} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('add-product-item')}>
                                <label className={cx('lable-update')}>Cập nhật hình ảnh thứ hạng</label>
                                {/* <input type="file" id="image" /> */}
                                <br />
                                <label className={cx('input-image')} htmlFor="icon">
                                    Chọn hình ảnh
                                </label>
                                <input
                                    type="file"
                                    id="icon"
                                    name="icon"
                                    accept="image/*"
                                    onChange={(e) =>
                                        formik.setFieldValue('icon', Array.prototype.slice.call(e.currentTarget.files))
                                    }
                                    onClick={(e) => (e.target.value = null)}
                                    hidden
                                />

                                <div className={cx('list-img')}>
                                    {formik.values?.icon?.map((img, i) => (
                                        <div className={cx('img')} key={i}>
                                            <img className={cx('item-img')} src={URL.createObjectURL(img)} alt="" />
                                            <i
                                                className={cx('btn-x')}
                                                onClick={() => {
                                                    const imgs = [...formik.values.icon];
                                                    imgs.splice(i, 1);
                                                    formik.setFieldValue('icon', imgs);
                                                }}
                                            >
                                                X
                                            </i>
                                        </div>
                                    ))}
                                </div>
                                {formik.errors.icon && <div className={cx('input-feedback')}>{formik.errors.icon}</div>}
                            </div>
                            <label className={cx('lable-update')}>Thông tin thứ hạng</label>

                            <div className={cx('add-rank-item')}>
                                <InputField
                                    type="text"
                                    id="namevi"
                                    name="namevi"
                                    placeholder="."
                                    value={formik.values.namevi}
                                    label={'Tên tiếng Việt'}
                                    require
                                    touched={formik.touched.namevi}
                                    error={formik.errors.namevi}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div className={cx('add-rank-item')}>
                                <InputField
                                    type="text"
                                    id="nameen"
                                    name="nameen"
                                    placeholder="."
                                    value={formik.values.nameen}
                                    label={'Tên tiếng Anh'}
                                    require
                                    touched={formik.touched.nameen}
                                    error={formik.errors.nameen}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-rank-item')}>
                                <InputField
                                    type="number"
                                    id="minValue"
                                    name="minValue"
                                    placeholder="."
                                    value={String(formik.values.minValue)}
                                    label={'Chi tiêu tối thiểu'}
                                    require
                                    touched={formik.touched.minValue}
                                    error={formik.errors.minValue}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-rank-item')}>
                                <InputField
                                    type="number"
                                    id="maxValue"
                                    name="maxValue"
                                    placeholder="."
                                    value={String(formik.values.maxValue)}
                                    label={'Chi tiêu tối đa'}
                                    require
                                    touched={formik.touched.maxValue}
                                    error={formik.errors.maxValue}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-rank-item')}>
                                <InputField
                                    type="textarea"
                                    id="descriptionen"
                                    name="descriptionen"
                                    placeholder="."
                                    value={formik.values.descriptionen}
                                    label={'Mô tả tiếng Anh'}
                                    require
                                    touched={formik.touched.descriptionen}
                                    error={formik.errors.descriptionen}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-rank-item')}>
                                <InputField
                                    type="textarea"
                                    id="descriptionvi"
                                    name="descriptionvi"
                                    placeholder="."
                                    value={formik.values.descriptionvi}
                                    label={'Mô tả tiếng Việt'}
                                    require
                                    touched={formik.touched.descriptionvi}
                                    error={formik.errors.descriptionvi}
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
export default ModalUserRank;
