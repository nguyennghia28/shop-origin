import { Modal, Spin } from 'antd';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalCollecion.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalCollecion = (props) => {
    const { open, onClose, id, onResetId } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    const [collection, setCollection] = useState({});
    const navigation = useNavigate();

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const getProduct = async () => {
                    const res = await axiosClient.get('collections/detail/' + String(id));
                    setCollection(res.data.detailCollection);
                };
                getProduct();
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
            name: collection.name + '',
            descriptionen: collection.descriptionen + '',
            descriptionvi: collection.descriptionvi + '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Nhập tên danh mục'),
            descriptionen: Yup.string().required('Nhập mô tả tiếng Anh'),
            descriptionvi: Yup.string().required('Nhập mô tả tiếng Việt'),
        }),
        onSubmit: async (values) => {
            const { name, descriptionen, descriptionvi } = values;
            setLoading(true);
            try {
                const res = await axiosClient.put('collections/update/' + id, {
                    name: name,
                    descriptionen: descriptionen,
                    descriptionvi: descriptionvi,
                });
                if (res) {
                    toast.success('Cập nhật thành công!');
                    handleCancel();
                    navigation('/collections');
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
                title="CẬP NHẬT DANH MỤC"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-collection')}>
                        {/* <h1 className={cx('add-collection-title')}>Cập nhật danh mục</h1> */}
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
                                Cập nhật
                            </Button>
                        </form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalCollecion;
