import { Modal, Select } from 'antd';

import classNames from 'classnames/bind';
import styles from './ModalSendPromotion.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Button from '~/components/Button/Button';

const cx = classNames.bind(styles);

const ModalSendPromotion = (props) => {
    const { open, onClose, id, onResetId } = props;

    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    const [rank, setRank] = useState([]);
    const [selectRank, setSelectRank] = useState();
    console.log(selectRank);
    const fecthData = async () => {
        // console.log(id);
        if (id !== undefined) {
            const getRank = async () => {
                const res = await axiosClient.get('rank/undeleted/');
                setRank(res.data.ranks_undeleted);
            };
            getRank();
        }
    };

    useEffect(() => {
        try {
            fecthData();
        } finally {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    //---------------------------------------------------------------------------------

    // const navigate = useNavigate();

    const handleSendEmail = async (rankId, promotionId) => {
        try {
            const res = await axiosClient.post('promotion/sendEmailToUser', {
                rankId: rankId,
                promotionId: promotionId,
            });
            await axiosClient.put('promotion/forrank/' + promotionId, {
                rank: rankId,
            });
            if (res) {
                toast.success('Gửi email thông báo khuyến mãi thành công');
                handleCancel();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="GỬI MÃ KHUYẾN MÃI"
                width={500}
                centered
                footer={[]}
            >
                <div className={cx('new-user')}>
                    <div className={cx('add-user-item')}>
                        <Select
                            allowClear
                            className={cx('input_antd')}
                            placeholder="Gửi đến khách hàng có hạng..."
                            onChange={(e) => {
                                setSelectRank(e);
                            }}
                            options={[{ value: '', label: 'Tất cả khách hàng' }].concat(
                                rank.map((r) => {
                                    return { value: r._id, label: r.namevi };
                                }),
                            )}
                        />
                    </div>
                    <Button
                        customClass={styles}
                        onClick={() => {
                            handleSendEmail(selectRank, id);
                        }}
                    >
                        Gửi
                    </Button>
                </div>
            </Modal>
        </>
    );
};
export default ModalSendPromotion;
