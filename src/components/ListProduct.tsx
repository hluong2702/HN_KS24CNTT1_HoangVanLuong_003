import React, { useState,useEffect } from 'react';
import { 
  Table, 
  Button, 
  Form, 
  Input, 
  InputNumber, 
  Switch, 
  Space, 
  Card, 
  Typography, 
  Select, 
  Popconfirm, 
  message,
  Row,
  Col,
  Tag,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  AppstoreOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Product {
  id: number;
  name: string;
  price: number;
  status: 'available' | 'unavailable';
}

const ListProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
  const productLocal = localStorage.getItem("products");
  return productLocal ? JSON.parse(productLocal) : [];
});

useEffect(() => {
  localStorage.setItem("products", JSON.stringify(products));
}, [products]);

  const [form] = Form.useForm();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const handleAddProduct = (values: any) => {
    const product: Product = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: values.name,
      price: values.price,
      status: values.status ? 'available' : 'unavailable'
    };
    setProducts([...products, product]);
    form.resetFields();
    setShowAddForm(false);
    message.success('Thêm sản phẩm thành công!');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      status: product.status === 'available'
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = (values: any) => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...editingProduct, 
              name: values.name,
              price: values.price,
              status: values.status ? 'available' : 'unavailable'
            }
          : p
      ));
      setEditingProduct(null);
      form.resetFields();
      setShowAddForm(false);
      message.success('Cập nhật sản phẩm thành công!');
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    message.success('Xóa sản phẩm thành công!');
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: '25%',
      render: (price: number) => (
        <Text style={{ color: '#52c41a', fontWeight: 600 }}>
          {formatPrice(price)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (status: string) => (
        <Tag color={status === 'available' ? 'green' : 'red'}>
          {status === 'available' ? 'Còn hàng' : 'Hết hàng'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '15%',
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button 
            type='primary'
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          >
            Đánh dấu
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              danger
              size="small" 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Card style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              border: 'none',
              color: 'white'
            }}
          >
            <Space direction="vertical" size="small">
              <AppstoreOutlined 
                style={{ 
                  fontSize: '32px', 
                  color: '#fadb14' 
                }} 
              />
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                Quản lý Sản phẩm
              </Title>
            </Space>
          </Card>
        </Card>

        <Card style={{ marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />}
              onClick={() => setShowAddForm(!showAddForm)}
              size="large"
            >
              Thêm sản phẩm mới
            </Button>
          </div>

          {showAddForm && (
            <>
              <Divider />
              <Form
                form={form}
                layout="vertical"
                onFinish={editingProduct ? handleUpdateProduct : handleAddProduct}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      label="Tên sản phẩm"
                      name="name"
                      rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                    >
                      <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      label="Giá (đ)"
                      name="price"
                      rules={[
                        { required: true, message: 'Vui lòng nhập giá!' },
                        { type: 'number', min: 1, message: 'Giá phải lớn hơn 0!' }
                      ]}
                    >
                      <InputNumber 
                        placeholder="Nhập giá"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item
                      label="Trạng thái"
                      name="status"
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Switch 
                        checkedChildren="Còn hàng" 
                        unCheckedChildren="Hết hàng"
                        defaultChecked
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item label=" " style={{ marginTop: '8px' }}>
                      <Space>
                        <Button type="primary" htmlType="submit">
                          {editingProduct ? 'Cập nhật' : 'Thêm'}
                        </Button>
                        <Button onClick={handleCancel}>
                          Hủy
                        </Button>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </>
          )}
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', justifyContent:'center' }}>
            <AppstoreOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
            <Title level={4} style={{ margin: 0 }}>
              Danh sách sản phẩm
            </Title>
          </div>

          <Table
            dataSource={products}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 3,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} sản phẩm`,
            }}
            scroll={{ y: 300 , x: 'max-content' }}
            locale={{
              emptyText: 'Không có dữ liệu'
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default ListProduct;