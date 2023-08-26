import { Modal, Spin } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import styles from './ModalChangePassword.module.scss';
import { toast } from 'react-toastify';
import axiosClient from '~/api/axiosClient';
import { useSelector } from 'react-redux';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ModalChangePassword = (props) => {
    const { open, onClose } = props;
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.user);
    // const [key, setKey] = useState();
    // setKey(seed);

    const handleCancel = () => {
        formik.errors.oldPassword = '';
        formik.errors.newPassword = '';
        formik.errors.newPasswordAgain = '';
        formik.values.oldPassword = '';
        formik.values.newPassword = '';
        formik.values.newPasswordAgain = '';
        onClose(false);
    };

    //-------------------------------------------------------------

    // const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            newPasswordAgain: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('Nhập mật khẩu cũ'),
            newPassword: Yup.string().required('Nhập mật khẩu mới').min(8, 'Mật khẩu có ít nhất 8 ký tự'),
            newPasswordAgain: Yup.string()
                .required('Xác nhận mật khẩu mới')
                .oneOf([Yup.ref('newPassword')], 'Xác nhận mật khẩu không chính xác'),
        }),
        onSubmit: async (values) => {
            const { oldPassword, newPasswordAgain } = values;

            setLoading(true);
            try {
                const res = await axiosClient.put('auth/changepassword/' + user.user.id, {
                    password: oldPassword,
                    newPassword: newPasswordAgain,
                });
                if (res) {
                    toast.success('Đổi mật khẩu thành công!');
                    handleCancel();
                }
            } catch (error) {
                toast.warn('Nhập mật khẩu cũ không chính xác!');
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
                title="ĐỐI MẬT KHẨU"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-pass')}>
                        <form onSubmit={formik.handleSubmit} className={cx('add-pass-form')} spellCheck="false">
                            <div className={cx('add-pass-item')}>
                                <InputField
                                    type="password"
                                    id="oldPassword"
                                    name="oldPassword"
                                    placeholder="."
                                    value={formik.values.oldPassword}
                                    label={'Mật khẩu cũ'}
                                    require
                                    touched={formik.touched.oldPassword}
                                    error={formik.errors.oldPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-pass-item')}>
                                <InputField
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="."
                                    value={formik.values.newPassword}
                                    label={'Mật khẩu mới'}
                                    require
                                    touched={formik.touched.newPassword}
                                    error={formik.errors.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            <div className={cx('add-pass-item')}>
                                <InputField
                                    type="password"
                                    id="newPasswordAgain"
                                    name="newPasswordAgain"
                                    placeholder="."
                                    value={formik.values.newPasswordAgain}
                                    label={'Xác nhận mật khẩu mới'}
                                    require
                                    touched={formik.touched.newPasswordAgain}
                                    error={formik.errors.newPasswordAgain}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <Button type="submit" customClass={styles}>
                                Đổi mật khẩu
                            </Button>
                        </form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalChangePassword;
