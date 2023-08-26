import { Modal, Spin } from 'antd';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import InputField from '~/components/InputField/InputField';
import styles from './ModalNotification.module.scss';
import axiosClient from '~/api/axiosClient';

const cx = classNames.bind(styles);

const ModalNotification = (props) => {
    const { open, onClose, id, onNavigate } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        onNavigate();
        onClose(false);
    };

    //-------------------------------------------------------------

    const [notification, setNotification] = useState({});

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res = await axiosClient.get('notification/detail/' + String(id));
                setNotification(res.data.notification);
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
                title="CHI TIẾT THÔNG BÁO"
                width={740}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-user')}>
                        <form className={cx('add-user-form')} spellCheck="false">
                            {JSON.stringify(notification) !== '{}' && (
                                <>
                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="title"
                                            name="title"
                                            placeholder="."
                                            value={String(notification.title)}
                                            label={'Tiêu đề'}
                                            require
                                        />
                                    </div>
                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="."
                                            value={String(notification.user.username)}
                                            label={'Từ khách hàng'}
                                            require
                                        />
                                    </div>

                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="code"
                                            name="code"
                                            value={String(notification.order.code)}
                                            placeholder="."
                                            label={'Mã đơn hàng'}
                                            require
                                        />
                                    </div>
                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="text"
                                            id="shortContent"
                                            name="shortContent"
                                            placeholder="."
                                            value={String(notification.shortContent)}
                                            label={'Tóm tắt'}
                                            require
                                        />
                                    </div>
                                    <div className={cx('add-user-item')}>
                                        <InputField
                                            customClass={styles}
                                            readonly={true}
                                            type="textarea"
                                            id="content"
                                            name="content"
                                            placeholder="."
                                            value={String(notification.content)}
                                            label={'Nội dung'}
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
                                            value={String(new Date(notification.createdAt).toLocaleString())}
                                            label={'Ngày tạo'}
                                            require
                                        />
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalNotification;
