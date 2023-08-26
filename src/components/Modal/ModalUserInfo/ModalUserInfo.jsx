import { Modal, Spin } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';

import InputField from '~/components/InputField/InputField';
import styles from './ModalUserInfo.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const ModalUserInfo = (props) => {
    const { open, onClose, id } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        onClose(false);
    };

    //-------------------------------------------------------------

    const [user, setUser] = useState({});
    const [address, setAddress] = useState({});

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res = await axiosClient.get('user/find/' + String(id));
                setUser(res.data);
                setAddress(res.data.address);
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
    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="THÔNG TIN KHÁCH HÀNG"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-user')}>
                        <form className={cx('add-user-form')} spellCheck="false">
                            {JSON.stringify(user) !== '{}' && (
                                <>
                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="."
                                            value={String(user.username)}
                                            label={'Tên khách hàng'}
                                            require
                                        />
                                    </div>

                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="namevinameviname"
                                            placeholder="."
                                            value={String(user.rank.namevi)}
                                            label={'Hạng'}
                                            require
                                        />
                                    </div>

                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="sex"
                                            name="sex"
                                            placeholder="."
                                            value={String(user.sex === 'm' ? 'Nam' : 'Nữ')}
                                            label={'Giới tính'}
                                            require
                                        />
                                    </div>

                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={String(user.email)}
                                            placeholder="."
                                            label={'Email'}
                                            require
                                        />
                                    </div>
                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            placeholder="."
                                            value={String(user.phone)}
                                            label={'Số điện thoại'}
                                            require
                                        />
                                    </div>
                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="created_at"
                                            name="created_at"
                                            placeholder="."
                                            value={String(new Date(user.createdAt).toLocaleString())}
                                            label={'Ngày tạo'}
                                            require
                                        />
                                    </div>
                                </>
                            )}

                            {JSON.stringify(address) !== '{}' && (
                                <div className={cx('add-user-item')}>
                                    <InputField
                                        customClass={styles}
                                        readonly={true}
                                        type="textarea"
                                        id="address"
                                        name="address"
                                        placeholder="."
                                        value={
                                            address.address +
                                            ', ' +
                                            address.ward.WardName +
                                            ', ' +
                                            address.district.DistrictName +
                                            ', ' +
                                            address.province.ProvinceName
                                        }
                                        label={'Địa chỉ'}
                                        require
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalUserInfo;
