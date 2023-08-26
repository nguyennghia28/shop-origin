import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import * as moment from 'moment';
import { DatePicker, Form, Select, Spin } from 'antd';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';

import styles from './OrderList.module.scss';
// import GridMultiFilter from '~/components/GridMultiFilter/GridMultiFilter';
import axiosClient from '~/api/axiosClient';
import Button from '~/components/Button/Button';
import Grid from '~/components/Grid/Grid';
import ModalOrderUpdate from '~/components/Modal/ModalOrderUpdate/ModalOrderUpdate';
import { useLocation } from 'react-router-dom';
import ModalOrderDetail from '~/components/Modal/ModalOrderDetail/ModalOrderDetail';
import { GHN } from '~/api/axiosClient';
// import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const { RangePicker } = DatePicker;

export default function OrderList() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [rerender, setRerender] = useState(false);

    const [id, setId] = useState('');
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);

    //------------------------------------------------------------
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);

    const [query, setQuery] = useState({
        code: undefined,
        status: undefined,
        ProvinceID: undefined,
        DistrictID: undefined,
        WardCode: undefined,
        startDate: undefined,
        endDate: undefined,
    });

    const getProducts = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('order/admin');
            // setOrders(res.data.orderList);
            if (res) {
                const oders_list = res.data.orderList;

                for (let i = 0; i < oders_list.length; i++) {
                    var total_amount = 0;
                    var oderdetails_list = oders_list[i].orderDetails;
                    for (let j = 0; j < oderdetails_list.length; j++) {
                        total_amount += oderdetails_list[j].quantity;
                    }
                    oders_list[i].total_amount = total_amount;

                    var title = '';
                    if (oders_list[i].status.state === 'PENDING') {
                        title = 'Chờ xác nhận';
                    } else if (oders_list[i].status.state === 'PACKAGE') {
                        title = 'Đóng gói';
                    } else if (oders_list[i].status.state === 'DELIVERING') {
                        title = 'Đang vận chuyển';
                    } else if (oders_list[i].status.state === 'COMPLETE') {
                        title = 'Đã giao';
                    } else if (oders_list[i].status.state === 'CANCEL') {
                        title = 'Đã hủy';
                    }
                    oders_list[i].status_vi = title;

                    // moment(params.value).format('DD/MM/YYYY')

                    oders_list[i].orderDate_vi = new Date(oders_list[i].dateOrdered).toLocaleString();
                }
                setOrders(oders_list);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    const handleGetAddressProvince = async () => {
        const resP = await GHN.post('master-data/province');
        setProvince([{ ProvinceID: 0, NameExtension: ['', 'Tất cả'] }, ...resP.data]);
    };

    useEffect(() => {
        getProducts();
        handleGetAddressProvince();
    }, [rerender, location]);

    //--------------------------------------------------------------------------------

    const handleGetAddressDistrict = async (value) => {
        var res;
        if (value !== 0) {
            res = await GHN.post('master-data/district', {
                province_id: value,
            });
            setDistrict([{ DistrictID: 0, DistrictName: 'Tất cả' }, ...res.data]);
            setWard([]);
            form.setFieldValue('district', '');
            form.setFieldValue('ward', '');
        } else if (value === 0) {
            setDistrict([{ DistrictID: 0, DistrictName: 'Tất cả' }]);
            setWard([]);
            form.setFieldValue('district', '');
            form.setFieldValue('ward', '');
        }
    };

    const handleGetAddressWard = async (value) => {
        var res;
        if (value !== 0) {
            res = await GHN.post('master-data/ward', {
                district_id: value,
            });
            setWard([{ WardCode: 0, WardName: 'Tất cả' }, ...res.data]);
            form.setFieldValue('ward', '');
        } else if (value === 0) {
            setWard([{ WardCode: 0, WardName: 'Tất cả' }]);
            form.setFieldValue('ward', '');
        }
    };

    //--------------------------------------------------------------------------------

    const ButtonStatus = ({ type, children }) => {
        var title = '';
        if (children === 'PENDING') {
            title = 'Chờ xác nhận';
        } else if (children === 'PACKAGE') {
            title = 'Đóng gói';
        } else if (children === 'DELIVERING') {
            title = 'Đang vận chuyển';
        } else if (children === 'COMPLETE') {
            title = 'Đã giao';
        } else if (children === 'CANCEL') {
            title = 'Đã hủy';
        }
        return <button className={cx('button-cell', type)}>{title}</button>;
    };

    const ButtonPeymentStatus = ({ type, children }) => {
        var title = '';
        if (children === 'PENDING') {
            title = 'Chờ thanh toán';
        } else if (children === 'COMPLETE') {
            title = 'Hoàn thành';
        } else if (children === 'CANCEL') {
            title = 'Thất bại';
        } else if (children === 'REFUNDING') {
            title = 'Hoàn tiền';
        }
        return <button className={cx('button-cell', type)}>{title}</button>;
    };

    const handleChangeOrderStatus = async (value, code) => {
        setLoading(true);
        try {
            const res = await axiosClient.put('order/status/update/' + code, {
                status: value,
            });
            if (res) {
                setRerender(!rerender);
                setId('');
                toast.success('Cập nhật trạng thái đơn hàng thành công!');
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeOrderStatusPayment = async (value, code) => {
        setLoading(true);
        try {
            const res = await axiosClient.put('order/statusPayment/update/' + code, {
                status: value,
            });
            if (res) {
                setRerender(!rerender);
                setId('');
                toast.success('Cập nhật trạng thái thanh toán đơn hàng thành công!');
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    const columns = [
        {
            field: '_orders',
            headerName: 'Mã đơn',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            width: 200,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                var disable = false;
                if (params.row.status.state === 'CANCEL' || params.row.status.state === 'COMPLETE') {
                    disable = true;
                }
                // console.log(disable);
                var disableStatus = false;
                if (params.row.paymentType === 'CASH') {
                    disableStatus = true;
                }
                return (
                    <div className={cx('order-code')}>
                        <ul className={cx('ul-text')}>
                            <li>{params.row.code}</li>
                            <li>
                                <ButtonStatus type={params.row.status.state} children={params.row.status.state} />
                            </li>
                            <li>
                                <Select
                                    className={cx('select-cell')}
                                    defaultValue={params.row.status.state}
                                    onChange={(value) => handleChangeOrderStatus(value, params.row._id)}
                                    disabled={disable}
                                    options={[
                                        {
                                            value: 'PENDING',
                                            label: 'Chờ xác nhận',
                                        },
                                        {
                                            value: 'PACKAGE',
                                            label: 'Đóng gói',
                                        },
                                        {
                                            value: 'DELIVERING',
                                            label: 'Đang vận chuyển',
                                        },
                                        {
                                            value: 'COMPLETE',
                                            label: 'Đã giao',
                                            disabled: disableStatus,
                                        },
                                        {
                                            value: 'CANCEL',
                                            label: 'Đã hủy ',
                                        },
                                    ]}
                                />
                            </li>
                        </ul>
                    </div>
                );
            },
        },
        {
            field: 'orders',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: 'Khách hàng',
            width: 300,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                return (
                    <div className={cx('order-code')}>
                        <ul>
                            <li>
                                <label className={cx('label-cell')}>Họ tên: </label>
                                <span>{params.row.recipient.username}</span>
                            </li>
                            <li>
                                <label className={cx('label-cell')}>SĐT: </label>
                                <span>{params.row.recipient.phone}</span>
                            </li>
                            <li>
                                <label className={cx('label-cell')}>Địa chỉ: </label>
                                <span className={cx('address')}>
                                    {params.row.recipient.address}, <br /> {params.row.recipient.addressWard.WardName},
                                    {params.row.recipient.addressDistrict.DistrictName},<br />{' '}
                                    {params.row.recipient.addressProvince.ProvinceName}
                                </span>
                            </li>
                        </ul>
                    </div>
                );
            },
        },
        {
            field: 'orders2',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: 'Tổng tiền',
            width: 300,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                return (
                    <div className={cx('order-code-number')}>
                        <ul className={cx('ul-cell')}>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Tổng số lượng: </label>
                                <span className={cx('number-cell')}>{params.row.total_amount}</span>
                            </li>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Tổng tiền hàng: </label>
                                <span className={cx('number-cell')}>{NumberWithCommas(params.row.originalPrice)}</span>
                            </li>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Giảm giá: </label>
                                <span className={cx('number-cell')}>{NumberWithCommas(params.row.discountPrice)}</span>
                            </li>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Tiền vận chuyển: </label>
                                <span className={cx('number-cell')}>{NumberWithCommas(params.row.shipPrice)}</span>
                            </li>
                            <li className={cx('li-cell')}>
                                <label className={cx('label-cell')}>Tổng tiền: </label>
                                <span className={cx('number-cell')}>{NumberWithCommas(params.row.finalPrice)}</span>
                            </li>
                        </ul>
                    </div>
                );
            },
        },
        {
            field: 'orders1',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: 'Thanh toán',
            width: 200,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                var disable = false;
                var typePay = '';

                if (params.row.status.state === 'PENDING' || params.row.status.state === 'PACKAGE') {
                    disable = true;
                }

                if (
                    params.row.paymentStatus === 'COMPLETE' ||
                    params.row.paymentStatus === 'CANCEL' ||
                    params.row.paymentStatus === 'REFUNDING'
                ) {
                    disable = true;
                }

                if (params.row.paymentType === 'CASH') {
                    typePay = 'Tiền mặt';
                } else if (params.row.paymentType === 'ONLINE') {
                    typePay = 'Trực tuyến';
                    disable = true;
                }
                return (
                    <div className={cx('order-code')}>
                        <ul className={cx('ul-text')}>
                            <li>
                                <span>{typePay}</span>
                            </li>
                            <li>
                                <ButtonPeymentStatus
                                    type={params.row.paymentStatus}
                                    children={params.row.paymentStatus}
                                />
                            </li>
                            <li>
                                <Select
                                    className={cx('select-cell')}
                                    defaultValue={params.row.paymentStatus}
                                    disabled={disable}
                                    onChange={(value) => handleChangeOrderStatusPayment(value, params.row._id)}
                                    options={[
                                        {
                                            value: 'PENDING',
                                            label: 'Chờ thanh toán',
                                        },
                                        {
                                            value: 'COMPLETE',
                                            label: 'Hoàn thành',
                                        },
                                        {
                                            value: 'CANCEL',
                                            label: 'Thất bại',
                                        },
                                        {
                                            value: 'REFUNDING',
                                            label: 'Hoàn tiền',
                                            disabled: true,
                                        },
                                    ]}
                                />
                            </li>
                        </ul>
                    </div>
                );
            },
        },
        {
            field: 'dateOrdered',
            headerClassName: 'super-app-theme--header',
            align: 'center',
            headerAlign: 'center',
            headerName: 'Ngày tạo',
            sortable: false,
            width: 150,
            type: 'date',
            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'action',
            headerClassName: 'super-app-theme--header',
            align: 'center',
            headerAlign: 'center',
            headerName: 'Hành động',
            width: 120,
            filterable: false,
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <ul>
                            <li>
                                <button
                                    className={cx('order-list-edit')}
                                    onClick={() => {
                                        setOpen(true);
                                        setId(params.row._id);
                                    }}
                                >
                                    Cập nhật
                                </button>
                            </li>
                            <li>
                                <button
                                    className={cx('order-list-edit')}
                                    onClick={() => {
                                        setOpenDetail(true);
                                        setId(params.row._id);
                                    }}
                                >
                                    Chi tiết
                                </button>
                            </li>
                        </ul>
                    </>
                );
            },
        },
    ];

    const [form] = Form.useForm();

    const handleDate = (value) => {
        if (value !== null) {
            if (value[0] !== null) {
                const d = new Date(value[0]);
                query.startDate = d.toISOString();
                setQuery({ ...query });
            }
            if (value[1] !== null) {
                const d = new Date(value[1]);
                query.endDate = d.toISOString();
                setQuery({ ...query });
            }
        } else {
            query.startDate = undefined;
            query.endDate = undefined;
            setQuery({ ...query });
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('order/admin', { params: query });
            if (res) {
                const oders_list = res.data.orderList;

                for (let i = 0; i < oders_list.length; i++) {
                    var total_amount = 0;
                    var oderdetails_list = oders_list[i].orderDetails;
                    for (let j = 0; j < oderdetails_list.length; j++) {
                        total_amount += oderdetails_list[j].quantity;
                    }
                    oders_list[i].total_amount = total_amount;

                    var title = '';
                    if (oders_list[i].status.state === 'PENDING') {
                        title = 'Chờ xác nhận';
                    } else if (oders_list[i].status.state === 'PACKAGE') {
                        title = 'Đóng gói';
                    } else if (oders_list[i].status.state === 'DELIVERING') {
                        title = 'Đang vận chuyển';
                    } else if (oders_list[i].status.state === 'COMPLETE') {
                        title = 'Đã giao';
                    } else if (oders_list[i].status.state === 'CANCEL') {
                        title = 'Đã hủy';
                    }
                    oders_list[i].status_vi = title;

                    // moment(params.value).format('DD/MM/YYYY')

                    oders_list[i].orderDate_vi = new Date(oders_list[i].dateOrdered).toLocaleString();
                }
                setOrders(oders_list);

                // setOrders(res.data.orderList);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const headers = [
        { label: 'Mã đơn', key: 'code' },
        {
            label: 'Trạng thái',
            key: 'status_vi',
        },
        {
            label: 'Tên khách hàng',
            key: 'recipient.username',
        },
        {
            label: 'SĐT',
            key: 'recipient.phone',
        },
        {
            label: 'Địa chỉ nhà',
            key: 'recipient.address',
        },
        {
            label: 'Phường/Xã',
            key: 'recipient.addressWard.WardName',
        },
        {
            label: 'Quận/Huyện',
            key: 'recipient.addressDistrict.DistrictName',
        },
        {
            label: 'Tỉnh/Thành phố',
            key: 'recipient.addressProvince.ProvinceName',
        },
        {
            label: 'Tổng số lượng',
            key: 'total_amount',
        },
        {
            label: 'Tổng tiền hàng',
            key: 'originalPrice',
        },
        {
            label: 'Tiền giảm giá',
            key: 'discountPrice',
        },
        {
            label: 'Tiền ship',
            key: 'shipPrice',
        },
        {
            label: 'Tổng tiền',
            key: 'finalPrice',
        },
        {
            label: 'Ngày tạo',
            key: 'orderDate_vi',
        },
    ];

    return (
        <>
            <div className={cx('order-list')}>
                <label className={cx('label')}>DANH SÁCH ĐƠN HÀNG</label>
                <div className={cx('header')}>
                    <ul>
                        <li className={cx('li')}>
                            <label className={cx('label_form')}>Chọn ngày: </label>
                            <RangePicker className={cx('input_antd_date')} allowClear onChange={handleDate} />

                            <label className={cx('label_form')}>Mã đơn: </label>
                            <input
                                className={cx('input')}
                                type="text"
                                placeholder="Nhập mã đơn"
                                onChange={(e) => {
                                    e.target.value === '' ? (query.code = undefined) : (query.code = e.target.value);
                                    setQuery({ ...query });
                                }}
                            />

                            <label className={cx('label_form')}>Trạng thái đơn: </label>
                            <Select
                                allowClear
                                className={cx('input_antd')}
                                placeholder="Trạng thái đơn"
                                onChange={(e) => {
                                    e === 0 ? (query.status = undefined) : (query.status = e);
                                    setQuery({ ...query });
                                }}
                                options={[
                                    {
                                        value: 0,
                                        label: 'Tất cả',
                                    },
                                    {
                                        value: 'PACKAGE',
                                        label: 'Đóng gói',
                                    },
                                    {
                                        value: 'PENDING',
                                        label: 'Chờ xác nhận',
                                    },
                                    {
                                        value: 'DELIVERING',
                                        label: 'Đang vận chuyển',
                                    },
                                    {
                                        value: 'COMPLETE',
                                        label: 'Đã giao',
                                    },
                                    {
                                        value: 'CANCEL',
                                        label: 'Đã hủy ',
                                    },
                                ]}
                            />
                        </li>
                        <li className={cx('li')}>
                            <Form form={form} layout="inline">
                                <Form.Item
                                    style={{ fontSize: '20px', width: '306px', fontWeight: 'bold' }}
                                    label="Tỉnh / Thành phố"
                                    name="province"
                                >
                                    <Select
                                        allowClear
                                        className={cx('input_antd')}
                                        showSearch
                                        placeholder="Tỉnh thành"
                                        optionFilterProp="children"
                                        onChange={(e) => {
                                            handleGetAddressDistrict(e);
                                            // e === 0 ? (query.ProvinceID = undefined) : (query.ProvinceID = e);
                                            if (e === 0 || e === undefined) {
                                                query.ProvinceID = undefined;
                                                query.DistrictID = undefined;
                                                query.WardCode = undefined;
                                            } else {
                                                query.ProvinceID = e;
                                            }
                                            setQuery({ ...query });
                                        }}
                                        // onSearch={onSearch}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={province.map((item, i) => ({
                                            value: item.ProvinceID,
                                            label: item.NameExtension[1],
                                        }))}
                                    />
                                </Form.Item>
                                <Form.Item
                                    style={{ fontSize: '20px', width: '306px', fontWeight: 'bold' }}
                                    label="Quận / Huyện"
                                    name="district"
                                >
                                    <Select
                                        allowClear
                                        className={cx('input_antd')}
                                        showSearch
                                        placeholder="Quận huyện"
                                        optionFilterProp="children"
                                        // onChange={onChange}
                                        // onSearch={onSearch}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        onChange={(e) => {
                                            handleGetAddressWard(e);
                                            // e === 0 ? (query.DistrictID = undefined) : (query.DistrictID = e);
                                            if (e === 0 || e === undefined) {
                                                query.DistrictID = undefined;
                                                query.WardCode = undefined;
                                            } else {
                                                query.DistrictID = e;
                                            }
                                            setQuery({ ...query });
                                        }}
                                        options={district.map((item) => ({
                                            value: item.DistrictID,
                                            label: item.DistrictName,
                                        }))}
                                        disabled={query.ProvinceID ? false : true}
                                    />
                                </Form.Item>
                                <Form.Item
                                    style={{ fontSize: '20px', width: '306px', fontWeight: 'bold' }}
                                    label="Phường / Xã"
                                    name="ward"
                                >
                                    <Select
                                        className={cx('input_antd')}
                                        showSearch
                                        placeholder="Phường xã"
                                        optionFilterProp="children"
                                        onChange={(e) => {
                                            e === 0 || e === undefined
                                                ? (query.WardCode = undefined)
                                                : (query.WardCode = e);
                                            setQuery({ ...query });
                                        }}
                                        // onSearch={onSearch}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={ward.map((item) => ({
                                            value: item.WardCode,
                                            label: item.WardName,
                                        }))}
                                        disabled={query.ProvinceID && query.DistrictID ? false : true}
                                    />
                                </Form.Item>
                            </Form>
                            <div className={cx('div_btn')}>
                                <Button customClass={styles} onClick={handleSearch}>
                                    Tìm kiếm
                                </Button>

                                <CSVLink
                                    filename={'list-orders.csv'}
                                    className={cx('export')}
                                    data={orders}
                                    headers={headers}
                                    target="_blank"
                                    onClick={() => toast.success('Xuất file CSV thành công!')}
                                >
                                    Xuất CSV
                                </CSVLink>
                            </div>
                        </li>
                    </ul>
                </div>

                <Spin spinning={loading}>
                    <div className={cx('grid')}>
                        <Grid datas={orders} headers={columns} rowHeight={150} pagesize={10} hideToolbar={true} />
                    </div>
                </Spin>
            </div>
            {id !== '' && (
                <ModalOrderUpdate
                    open={open}
                    onClose={() => setOpen(false)}
                    id={id}
                    onResetId={() => setId('')}
                ></ModalOrderUpdate>
            )}
            {id !== '' && (
                <ModalOrderDetail
                    open={openDetail}
                    onClose={() => setOpenDetail(false)}
                    id={id}
                    onResetId={() => setId('')}
                ></ModalOrderDetail>
            )}
        </>
    );
}
