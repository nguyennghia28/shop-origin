import { Modal, Spin } from 'antd';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalCollecionNew.module.scss';
import axiosClient from '~/api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const cx = classNames.bind(styles);

const ModalCollecionNew = (props) => {
    const { open, onClose } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        formik.values.name = '';
        formik.values.descriptionen = '';
        formik.values.descriptionvi = '';

        formik.errors.name = '';
        formik.errors.descriptionen = '';
        formik.errors.descriptionvi = '';
        onClose(false);
    };

    //-------------------------------------------------------------

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            descriptionen: '',
            descriptionvi: '',
            isDelete: false,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Nhập tên danh mục'),
            descriptionen: Yup.string().required('Nhập mô tả tiếng Anh'),
            descriptionvi: Yup.string().required('Nhập mô tả tiếng Việt'),
        }),
        onSubmit: async (values) => {
            const { name, descriptionen, descriptionvi, isDelete } = values;
            setLoading(true);
            try {
                const res = await axiosClient.post('collections/', {
                    name: name,
                    descriptionen: descriptionen,
                    descriptionvi: descriptionvi,
                    isDelete: isDelete,
                });
                if (res) {
                    toast.success('Thêm thành công!');
                    handleCancel();
                    navigate('/collections');
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
                title="THÊM MỚI DANH MỤC"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-collection')}>
                        <form onSubmit={formik.handleSubmit} className={cx('add-collection-form')} spellCheck="false">
                            <div className={cx('add-collection-item')}>
                                <label>Thông tin danh mục</label>
                            </div>
                            <div className={cx('add-collection-item')}>
                                <InputField
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="."
                                    value={formik.values.name}
                                    label={'Tên danh mục'}
                                    require
                                    touched={formik.touched.name}
                                    error={formik.errors.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div className={cx('add-collection-item')}>
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
                            <div className={cx('add-collection-item')}>
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
                                Thêm
                            </Button>
                        </form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalCollecionNew;
