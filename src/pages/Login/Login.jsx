/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Spin } from 'antd';

import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import axiosClient from '~/api/axiosClient';
import { setCurrentUser } from '~/features/user/userSlice';
import style from './Login.module.scss';
import logo from '~/assets/images/logo-black-removebg-preview.png';

const cx = classNames.bind(style);

const Login = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            remember: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Nhập tên đăng nhập'),
            password: Yup.string().required('Nhập mật khẩu'),
        }),
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values) => {
            const { email, password } = values;
            setLoading(true);
            try {
                const res = await axiosClient.post('auth/login', {
                    email: email,
                    password: password,
                });

                toast.success('Đăng nhập thành công!');
                sessionStorage.setItem('mynhbake_token', res.data.token);
                dispatch(setCurrentUser(res.data.token));
                navigate('/');
            } catch (error) {
                toast.error('Tên đăng nhập hoặc mật khẩu không chính xác');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className={cx('container')}>
            <h2 className={cx('title')}>ĐĂNG NHẬP ADMIN</h2>
            <form onSubmit={formik.handleSubmit} spellCheck="false">
                <InputField
                    customClass={style}
                    type="text"
                    id="email"
                    name="email"
                    placeholder="."
                    value={formik.values.email}
                    label={'Tên đăng nhập'}
                    require
                    touched={formik.touched.email}
                    error={formik.errors.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                <InputField
                    customClass={style}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="."
                    value={formik.values.password}
                    label={'Mật khẩu'}
                    require
                    touched={formik.touched.password}
                    error={formik.errors.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />

                {/* <div className={cx('forgot')}>
                    {'Quên mật khẩu'}? <a>{'Bấm vào đây'}</a>
                </div> */}
                <Spin spinning={loading}>
                    <Button type="submit" customClass={style}>
                        Đăng nhập
                    </Button>
                </Spin>
            </form>
        </div>
    );
};

export default Login;
