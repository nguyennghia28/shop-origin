import { InputNumber } from 'antd';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Table } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import Column from 'antd/es/table/Column';
import TextArea from 'antd/es/input/TextArea';
import axiosClient from '~/api/axiosClient';
import moment from 'moment';

const ModalDepotImport = (props) => {
    const { depot, open, onClose, status } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [productData, setProductData] = useState([]);

    const fecthData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('product/undeleted');
            setProductData(res.data.products_undeleted);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'create') {
            fecthData();
            form.resetFields();
        } else {
            fecthData();
            form.setFieldsValue({
                products: depot?.depotDetails?.reduce((acc, cur) => {
                    acc.push({
                        productId: cur.product._id,
                        productQuantity: cur.quantity,
                        productStock: cur.stock,
                        productImportPrice: cur.importPrice,
                    });
                    return acc;
                }, []),
                note: depot?.note,
                code: depot?._id,
                employeeName: depot?.importUser?.username,
                createdDate: moment(depot?.createdAt).format('DD/MM/YYYY, hh:mm'),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, open]);

    const createData = async () => {
        // const valid = await form.validateFields();
        const data = {
            products: form.getFieldsValue().products.reduce((acc, cur) => {
                acc.push({
                    productId: cur.productId,
                    importPrice: Number(cur.productImportPrice),
                    stock: Number(cur.productStock),
                    quantity: Number(cur.productQuantity),
                });
                return acc;
            }, []),
            note: form.getFieldsValue().note,
        };
        setLoading(true);
        try {
            await axiosClient.post('depot/', data);
            message.success('Tạo phiếu nhập thành công!');
            onClose?.();
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose(false);
    };
    //-------------------------------------------------------------

    const mockData = {
        products: [{}],
    };

    return (
        <Modal
            onCancel={() => {
                handleCancel();
            }}
            open={open}
            title={status === 'create' ? 'Tạo phiếu nhập kho' : 'Chi tiết phiếu nhập kho'}
            style={{ top: 20 }}
            width={900}
            confirmLoading={loading}
            onOk={() => {
                status === 'create' ? createData() : handleCancel();
            }}
            footer={[
                <Button
                    key="back"
                    onClick={() => {
                        handleCancel();
                    }}
                >
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => {
                        status === 'create' ? createData() : handleCancel();
                    }}
                >
                    {status === 'create' ? 'Lưu' : 'Đóng'}
                </Button>,
            ]}
        >
            <Form layout="vertical" form={form} initialValues={mockData}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Ghi chú" name="note">
                            <TextArea showCount maxLength={255} placeholder="" style={{ height: 138 }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            hidden={status === 'create'}
                            label="Mã phiếu nhập kho"
                            name="code"
                            style={{ margin: 0 }}
                        >
                            <Input placeholder="" disabled />
                        </Form.Item>
                        <Form.Item
                            hidden={status === 'create'}
                            label="Người tạo"
                            name="employeeName"
                            style={{ margin: 0 }}
                        >
                            <Input placeholder="" disabled />
                        </Form.Item>
                        <Form.Item hidden={status === 'create'} label="Ngày tạo" name="createdDate">
                            <Input placeholder="" disabled />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.List name="products">
                            {(fields, { add, remove }) => (
                                <Table
                                    tableLayout="auto"
                                    pagination={false}
                                    size="small"
                                    rowKey={(item) => item.key}
                                    dataSource={fields}
                                    footer={(fields) => {
                                        return (
                                            <Button onClick={add}>
                                                <PlusOutlined /> Thêm dòng
                                            </Button>
                                        );
                                    }}
                                >
                                    <Column
                                        title="Sản phẩm"
                                        dataIndex="pruduct"
                                        key="name"
                                        width={450}
                                        render={(text, record, index) => (
                                            <Form.Item style={{ margin: 0 }} name={[index, 'productId']}>
                                                <Select
                                                    disabled={status !== 'create'}
                                                    allowClear
                                                    showSearch
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        (option?.label?.toString().toLowerCase() ?? '').includes(input)
                                                    }
                                                    filterSort={(optionA, optionB) =>
                                                        (optionA?.label?.toString() ?? '')
                                                            .toLowerCase()
                                                            .localeCompare(
                                                                (optionB?.label?.toString() ?? '').toLowerCase(),
                                                            )
                                                    }
                                                    options={productData?.map((item) => ({
                                                        value: item._id,
                                                        label: item.name,
                                                        disabled:
                                                            form
                                                                .getFieldsValue()
                                                                .products?.filter((p) => item._id === p.productId)
                                                                .length > 0,
                                                    }))}
                                                    onChange={(e) => {
                                                        const products = [...form.getFieldsValue().products];
                                                        const stock = productData.find(
                                                            (pdata) => pdata._id === e,
                                                        )?.stock;
                                                        products[index].productStock = stock;
                                                        form.setFieldsValue({
                                                            products,
                                                        });
                                                    }}
                                                />
                                            </Form.Item>
                                        )}
                                    />
                                    <Column
                                        title="Tồn kho"
                                        dataIndex="stock"
                                        key="stock"
                                        align="right"
                                        render={(text, recor, index) => (
                                            <Form.Item style={{ margin: 0 }} name={[index, 'productStock']}>
                                                <InputNumber disabled style={{ width: 100, textAlign: 'right' }} />
                                            </Form.Item>
                                        )}
                                    />
                                    <Column
                                        title="Giá nhập"
                                        dataIndex="importPrice"
                                        key="importPrice"
                                        align="right"
                                        render={(text, recor, index) => (
                                            <Form.Item style={{ margin: 0 }} name={[index, 'productImportPrice']}>
                                                <InputNumber
                                                    disabled={status !== 'create'}
                                                    min={1000}
                                                    style={{ width: 200, textAlign: 'right' }}
                                                />
                                            </Form.Item>
                                        )}
                                    />
                                    <Column
                                        title="Số lượng"
                                        dataIndex="quantity"
                                        key="quantity"
                                        align="right"
                                        render={(text, recor, index) => (
                                            <Form.Item style={{ margin: 0 }} name={[index, 'productQuantity']}>
                                                <InputNumber
                                                    disabled={status !== 'create'}
                                                    min={1}
                                                    style={{ width: 100, textAlign: 'right' }}
                                                />
                                            </Form.Item>
                                        )}
                                    />
                                    <Column
                                        key="delProduct"
                                        render={(text, record, index) => (
                                            <Form.Item style={{ margin: 0 }}>
                                                <Button
                                                    type="default"
                                                    icon={<CloseOutlined />}
                                                    disabled={fields.length === 1 || status !== 'create'}
                                                    onClick={() => {
                                                        remove(index);
                                                    }}
                                                />
                                            </Form.Item>
                                        )}
                                    />
                                </Table>
                            )}
                        </Form.List>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
export default ModalDepotImport;
