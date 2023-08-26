import { Modal } from 'antd';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

import styles from './ModalNewsUpdate.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useRef, useState } from 'react';
import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import { useNavigate } from 'react-router-dom';
import { RichTextEditor } from '~/components/RichTextEditor/RichTextEditor';

const cx = classNames.bind(styles);

const ModalNewsUpdate = (props) => {
    const { open, onClose, id, onResetId } = props;
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState({});

    const contentRef = useRef();

    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    const navigate = useNavigate();

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res = await axiosClient.get('post/detail/' + id);
                contentRef.current?.setContent(res.data.detailPost.content || '');
                setPost(res.data.detailPost);
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
            title: post.title + '',
            image: [],
            description: post.description + '',
            content: post.content + '',
        },
        validationSchema: Yup.object().shape({
            title: Yup.string().required('Nhập tiêu đề bài viết'),
            // image: Yup.array().min(1, 'Chọn hình ảnh bài viết'),
            description: Yup.string().required('Nhập tóm tắt'),
            content: Yup.string().required('Nhập nội dung'),
        }),
        onSubmit: async (values) => {
            const { title, image, description, content } = values;
            const formData = new FormData();
            if (image[0] !== undefined) {
                formData.append('image', image[0]);
            }
            formData.append('title', title);
            formData.append('description', description);
            formData.append('content', content);

            setLoading(true);
            try {
                const res = await axiosClient.put('post/' + id, formData);
                if (res) {
                    toast.success('Cập nhật thành công!');
                    handleCancel();
                    navigate('/news');
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
                title="CẬP NHẬT BÀI VIẾT"
                width={800}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-news')}>
                        <form onSubmit={formik.handleSubmit} className={cx('add-news-form')} spellCheck="false">
                            <div className={cx('add-news-item')}>
                                <label>Hình ảnh hiện tại bài viết</label>

                                <div className={cx('list-img')}>
                                    <div className={cx('img')}>
                                        <img className={cx('item-img')} src={post.image} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className={cx('add-news-item')}>
                                <label>Chọn hình ảnh cập nhật</label>
                                {/* <input type="file" id="image" /> */}
                                <label className={cx('input-image')} htmlFor="images">
                                    Chọn hình ảnh
                                </label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    accept="image/*"
                                    onChange={(e) =>
                                        formik.setFieldValue('image', Array.prototype.slice.call(e.currentTarget.files))
                                    }
                                    onClick={(e) => (e.target.value = null)}
                                    hidden
                                />
                                <div className={cx('list-img')}>
                                    {formik.values?.image?.map((img, i) => (
                                        <div className={cx('img')} key={i}>
                                            <img className={cx('item-img')} src={URL.createObjectURL(img)} alt="" />
                                            <i
                                                className={cx('btn-x')}
                                                onClick={() => {
                                                    const imgs = [...formik.values.image];
                                                    imgs.splice(i, 1);
                                                    formik.setFieldValue('image', imgs);
                                                }}
                                            >
                                                X
                                            </i>
                                        </div>
                                    ))}
                                </div>
                                {formik.errors.image && (
                                    <div className={cx('input-feedback')}>{formik.errors.image}</div>
                                )}
                            </div>
                            <div className={cx('add-news-item')}>
                                <label>Thông tin bài viết</label>
                            </div>
                            <div className={cx('add-news-item')}>
                                <InputField
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="."
                                    value={formik.values.title}
                                    label={'Tiêu đề'}
                                    require
                                    touched={formik.touched.title}
                                    error={formik.errors.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-news-item')}>
                                <InputField
                                    type="textarea"
                                    id="description"
                                    name="description"
                                    placeholder="."
                                    value={formik.values.description}
                                    label={'Tóm tắt'}
                                    require
                                    touched={formik.touched.description}
                                    error={formik.errors.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>{' '}
                            <div className={cx('add-news-item')}>
                                <RichTextEditor
                                    ref={contentRef}
                                    onInit={() => {
                                        contentRef.current?.setContent(post.content || '');
                                    }}
                                    onChange={(e) => formik.setFieldValue('content', e)}
                                />
                                {formik.errors.content && (
                                    <div className={cx('input-feedback')}>{formik.errors.content}</div>
                                )}
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
export default ModalNewsUpdate;
