import React, { useState, useEffect } from "react";
import {
  getServices, addService, updateService, deleteService,
  getServiceFees, addServiceFee, updateServiceFee, deleteServiceFee
} from "../api/serviceApi";
import {
  Button, Modal, Input, Table, message, DatePicker, Select, Card,
  Tabs, Form, InputNumber, Space, Divider, Popconfirm, Tag, Typography,
  Tooltip, notification, Spin
} from "antd";
import {
  EditOutlined, DeleteOutlined, PlusOutlined, AppstoreOutlined,
  DollarOutlined, EyeOutlined, ExclamationCircleOutlined, InfoCircleOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [serviceFees, setServiceFees] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [feeModalVisible, setFeeModalVisible] = useState(false);
  
  // Form states
  const [serviceForm] = Form.useForm();
  const [feeForm] = Form.useForm();
  
  // Current editing items
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [currentFeeId, setCurrentFeeId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesData, feesData] = await Promise.all([
        getServices(),
        getServiceFees()
      ]);
  
      console.log("Dữ liệu service fees từ API:", feesData);
  
      setServices(servicesData);
      
      const updatedFees = feesData.map(fee => ({
        ...fee,
        serviceName: fee.service ? fee.service.serviceName : "Không xác định",
        key: fee.serviceFeeId,
        // Đảm bảo apartmentId luôn có giá trị
        apartmentId: fee.apartmentId || null
      }));
  
      setServiceFees(updatedFees);
      
      // Phần còn lại của hàm...
    } catch (error) {
      // Xử lý lỗi...
    } finally {
      setLoading(false);
    }
  };
  

  // Service handlers
  const openServiceModal = (service = null) => {
    setCurrentServiceId(service?.serviceId || null);
    
    if (service) {
      serviceForm.setFieldsValue({
        serviceName: service.serviceName,
        description: service.description,
        price: parseFloat(service.price)
      });
    } else {
      serviceForm.resetFields();
    }
    
    setServiceModalVisible(true);
  };

  const handleServiceSubmit = async () => {
    try {
      const values = await serviceForm.validateFields();
      setLoading(true);
      
      if (currentServiceId) {
        await updateService(currentServiceId, values);
        notification.success({ message: "Cập nhật dịch vụ thành công" });
      } else {
        await addService(values);
        notification.success({ message: "Thêm dịch vụ mới thành công" });
      }
      
      setServiceModalVisible(false);
      fetchData();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin dịch vụ."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      setLoading(true);
      await deleteService(id);
      notification.success({ message: "Xóa dịch vụ thành công" });
      fetchData();
    } catch (error) {
      notification.error({
        message: "Không thể xóa dịch vụ",
        description: "Dịch vụ này có thể đang được sử dụng trong các phí dịch vụ."
      });
    } finally {
      setLoading(false);
    }
  };

  // Service Fee handlers
  const openFeeModal = (fee = null) => {
    setCurrentFeeId(fee?.serviceFeeId || null);
    
    if (fee) {
      feeForm.setFieldsValue({
        serviceId: fee.serviceId,
        apartmentId: fee.apartmentId,
        amount: parseFloat(fee.amount),
        dateRange: fee.startDate && fee.endDate ? 
          [new Date(fee.startDate), new Date(fee.endDate)] : null
      });
    } else {
      feeForm.resetFields();
    }
    
    setFeeModalVisible(true);
  };

  const handleFeeSubmit = async () => {
    try {
      const values = await feeForm.validateFields();
      setLoading(true);
      
      // Chuyển đổi định dạng ngày tháng
      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };
      
      const feeData = {
        serviceId: values.serviceId,
        apartmentId: values.apartmentId,
        amount: values.amount,
        startDate: formatDate(values.dateRange[0]),
        endDate: formatDate(values.dateRange[1])
      };
      console.log("Gửi dữ liệu phí dịch vụ:", feeData);
      
      if (currentFeeId) {
        await updateServiceFee(currentFeeId, feeData);
        notification.success({ message: "Cập nhật phí dịch vụ thành công" });
      } else {
        await addServiceFee(feeData);
        notification.success({ message: "Thêm phí dịch vụ mới thành công" });
      }
      
      setFeeModalVisible(false);
      fetchData();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin phí dịch vụ."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFee = async (id) => {
    try {
      setLoading(true);
      await deleteServiceFee(id);
      notification.success({ message: "Xóa phí dịch vụ thành công" });
      fetchData();
    } catch (error) {
      notification.error({
        message: "Không thể xóa phí dịch vụ",
        description: "Có lỗi xảy ra khi xóa phí dịch vụ."
      });
    } finally {
      setLoading(false);
    }
  };

  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Check status helper
  const getServiceFeeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return { text: 'Sắp áp dụng', color: 'blue' };
    } else if (now > end) {
      return { text: 'Hết hạn', color: 'gray' };
    } else {
      return { text: 'Đang áp dụng', color: 'green' };
    }
  };

  // Table columns
  const serviceColumns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      sorter: (a, b) => a.serviceName.localeCompare(b.serviceName),
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: "Giá cơ bản",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <Text type="success">{formatCurrency(price)}</Text>
    },
    {
      title: "Hành động",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="primary" 
              ghost 
              icon={<EditOutlined />} 
              onClick={() => openServiceModal(record)} 
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa dịch vụ này?"
              onConfirm={() => handleDeleteService(record.serviceId)}
              okText="Xóa"
              cancelText="Hủy"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const serviceFeeColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      sorter: (a, b) => a.serviceName.localeCompare(b.serviceName),
    },
    {
      title: "Căn hộ",
      dataIndex: "apartmentId",
      key: "apartmentId",
      render: (apartmentId) => {
        console.log("apartmentId:", apartmentId);
        console.log("apartments:", apartments);
        
        if (apartmentId === undefined || apartmentId === null) {
          return <Text type="danger">Không xác định</Text>;
        }
        
        const apartment = apartments.find(apt => apt.id === apartmentId);
        return apartment ? apartment.name : <Text type="danger">Không xác định</Text>;
      }
    },
    
    {
      title: "Giá dịch vụ",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => <Text type="success">{formatCurrency(amount)}</Text>
    },
    {
      title: "Thời gian áp dụng",
      key: "dateRange",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>Bắt đầu: {formatDate(record.startDate)}</Text>
          <Text>Kết thúc: {formatDate(record.endDate)}</Text>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const status = getServiceFeeStatus(record.startDate, record.endDate);
        return <Tag color={status.color}>{status.text}</Tag>;
      }
    },
    {
      title: "Hành động",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="primary" 
              ghost 
              icon={<EditOutlined />} 
              onClick={() => openFeeModal(record)} 
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa phí dịch vụ này?"
              onConfirm={() => handleDeleteFee(record.serviceFeeId)}
              okText="Xóa"
              cancelText="Hủy"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Define items for Tabs
  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <AppstoreOutlined />
          Quản lý Dịch vụ
        </span>
      ),
      children: (
        <Card className="card-container">
          <div className="table-header">
            <Title level={4}>Danh sách Dịch vụ</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => openServiceModal()}
            >
              Thêm Dịch vụ
            </Button>
          </div>
          <Table 
            dataSource={services} 
            columns={serviceColumns} 
            rowKey="serviceId"
            pagination={{ pageSize: 10 }} 
            bordered
          />
        </Card>
      )
    },
    {
      key: "2",
      label: (
        <span>
          <DollarOutlined />
          Quản lý Phí Dịch vụ
        </span>
      ),
      children: (
        <Card className="card-container">
          <div className="table-header">
            <Title level={4}>Danh sách Phí Dịch vụ</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => openFeeModal()}
            >
              Thêm Phí Dịch vụ
            </Button>
          </div>
          <Table 
            dataSource={serviceFees} 
            columns={serviceFeeColumns} 
            rowKey="serviceFeeId"
            pagination={{ pageSize: 10 }} 
            bordered
          />
        </Card>
      )
    }
  ];

  return (
    <div className="service-management">
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Spin>

      {/* Service Modal */}
      <Modal
        title={currentServiceId ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}
        open={serviceModalVisible}
        onOk={handleServiceSubmit}
        onCancel={() => setServiceModalVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={serviceForm}
          layout="vertical"
        >
          <Form.Item
            name="serviceName"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input placeholder="Nhập tên dịch vụ" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea
              placeholder="Nhập mô tả chi tiết về dịch vụ"
              rows={4}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá cơ bản (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập giá dịch vụ"
              min={0}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Service Fee Modal */}
      <Modal
        title={currentFeeId ? "Cập nhật phí dịch vụ" : "Thêm phí dịch vụ mới"}
        open={feeModalVisible}
        onOk={handleFeeSubmit}
        onCancel={() => setFeeModalVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form
          form={feeForm}
          layout="vertical"
        >
          <Form.Item
            name="serviceId"
            label="Dịch vụ"
            rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
          >
            <Select placeholder="Chọn dịch vụ">
              {services.map(service => (
                <Option key={service.serviceId} value={service.serviceId}>
                  {service.serviceName} - {formatCurrency(service.price)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="apartmentId"
            label="Căn hộ"
            rules={[{ required: true, message: 'Vui lòng chọn căn hộ!' }]}
          >
            <Select placeholder="Chọn căn hộ">
              {apartments.map(apt => (
                <Option key={apt.id} value={apt.id}>{apt.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Giá dịch vụ (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập giá dịch vụ"
              min={0}
            />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Thời gian áp dụng"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}
          >
            <RangePicker 
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .service-management {
          padding: 20px;
        }
        .card-container {
          margin-bottom: 24px;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default ServiceManagement;