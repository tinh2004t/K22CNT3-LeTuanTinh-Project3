import React, { useState, useEffect } from "react";
import { Form, Select, DatePicker, InputNumber, Button, notification, Card, Typography, Spin, Space, Input, Radio, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getServices, addServiceFee, getApartments } from "../api/serviceApi";
import { getResidentByPhone } from "../api/residentApi"; // Giả định API này tồn tại
import { addInvoice } from "../api/invoiceApi"; // Import từ API hóa đơn
import { ArrowLeftOutlined, PhoneOutlined, UserOutlined, InfoCircleOutlined, ToolOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const AddServiceFeePage = () => {
  const navigate = useNavigate();
  const [feeForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [residentInfo, setResidentInfo] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Format currency helper
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesData, apartmentsData] = await Promise.all([
        getServices(),
        getApartments()
      ]);

      setServices(servicesData);

      // Format apartments data
      const formattedApartments = apartmentsData.map(apartment => ({
        apartmentId: apartment.apartmentId,
        apartmentNumber: apartment.apartmentNumber
      }));

      setApartments(formattedApartments);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi tải dữ liệu."
      });
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm cư dân theo số điện thoại
  const handlePhoneLookup = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      notification.warning({
        message: "Cảnh báo",
        description: "Vui lòng nhập số điện thoại hợp lệ."
      });
      return;
    }

    setLookupLoading(true);
    try {
      const resident = await getResidentByPhone(phoneNumber);
      
      if (resident) {
        setResidentInfo(resident);
        notification.success({
          message: "Thành công",
          description: `Đã tìm thấy thông tin cư dân: ${resident.fullName}`
        });
      } else {
        setResidentInfo(null);
        notification.warning({
          message: "Thông báo",
          description: "Không tìm thấy cư dân với số điện thoại này."
        });
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm cư dân:", error);
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi tìm kiếm cư dân."
      });
      setResidentInfo(null);
    } finally {
      setLookupLoading(false);
    }
  };

  // Handle auto calculation of amount when service or date range changes
  const handleAutoCalculate = (changedValues, allValues) => {
    const { serviceId, dateRange } = allValues;
    if (!serviceId || !dateRange || dateRange.length < 2) return;

    const selectedService = services.find(service => service.serviceId === serviceId);
    if (!selectedService) return;

    const startDate = dateRange[0];
    const endDate = dateRange[1];

    // Calculate number of days
    const days = endDate.diff(startDate, 'day') + 1;

    // Calculate price based on service base price and days
    const calculatedPrice = selectedService.price * days;
    setCalculatedAmount(calculatedPrice);

    // Update form field
    feeForm.setFieldsValue({ amount: calculatedPrice });
  };

 

  const handleFeeSubmit = async () => {
    try {
      const values = await feeForm.validateFields();
      setLoading(true);

      // Kiểm tra thông tin cư dân
      if (!residentInfo) {
        throw new Error("Vui lòng nhập số điện thoại và tìm kiếm thông tin cư dân trước.");
      }

      // Validation
      if (!values.dateRange || values.dateRange.length < 2) {
        throw new Error("Vui lòng chọn đầy đủ thời gian áp dụng.");
      }

      // Format date function
      const formatDate = (date) => {
        return date ? date.format("YYYY-MM-DD") : null;
      };

      // Ensure serviceId & apartmentId are not undefined/null
      if (!values.serviceId || !values.apartmentId) {
        throw new Error("Vui lòng chọn đầy đủ Dịch vụ và Căn hộ.");
      }

      const feeData = {
        amount: values.amount,
        startDate: formatDate(values.dateRange[0]),
        endDate: formatDate(values.dateRange[1]),
        service: { serviceId: values.serviceId },
        apartment: { apartmentId: values.apartmentId }
      };

      console.log("Dữ liệu gửi đi (Phí dịch vụ):", feeData);

      // Thêm phí dịch vụ mới
      await addServiceFee(feeData);

      // Tạo dữ liệu hóa đơn mới
      const invoiceData = {
        resident: { residentId: residentInfo.residentId },
        amount: values.amount,
        dueDate: formatDate(values.dateRange[1]), // Sử dụng ngày kết thúc làm hạn thanh toán
        status: "CHUA_THANH_TOAN"
      };

      console.log("Dữ liệu gửi đi (Hóa đơn):", invoiceData);

      // Thêm hóa đơn mới
      await addInvoice(invoiceData);

      notification.success({ 
        message: "Thành công", 
        description: "Đăng ký dịch vụ thành công, ban quản lý tòa thu phí sau 2 ngày" 
      });
      
      navigate("/services"); // Navigate back to services page
    } catch (error) {
      console.error("Lỗi khi xử lý submit:", error);
      notification.error({
        message: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi lưu thông tin."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-service-fee-page" style={{ padding: "20px" }}>
      <Spin spinning={loading}>
        <Card className="card-container">
          <div className="page-header" style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              style={{ marginRight: "10px" }}
              onClick={() => navigate("/services")}
            />
            <Title level={4} style={{ margin: 0 }}>Thêm Phí Dịch Vụ Mới</Title>
          </div>

          {/* Phần tìm kiếm cư dân theo số điện thoại */}
          <Card 
            title="Thông tin cư dân" 
            size="small" 
            style={{ marginBottom: "20px" }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <Input
                placeholder="Nhập số điện thoại cư dân"
                prefix={<PhoneOutlined />}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ marginRight: "10px", flex: 1 }}
              />
              <Button 
                type="primary" 
                onClick={handlePhoneLookup} 
                loading={lookupLoading}
              >
                Tìm kiếm
              </Button>
            </div>

            {residentInfo && (
              <div className="resident-info" style={{ padding: "10px", backgroundColor: "#f0f7ff", borderRadius: "4px" }}>
                <p style={{ margin: "0 0 5px 0" }}><UserOutlined /> <b>Tên cư dân:</b> {residentInfo.fullName}</p>
                <p style={{ margin: "0 0 5px 0" }}><b>ID Cư dân:</b> {residentInfo.residentId}</p>
                <p style={{ margin: "0" }}><b>Căn hộ:</b> {residentInfo.apartment?.apartmentNumber || "Không có thông tin"}</p>
              </div>
            )}
          </Card>

          <Form
            form={feeForm}
            layout="vertical"
            onValuesChange={handleAutoCalculate}
            initialValues={{ 
              dateRange: [dayjs(), dayjs().add(1, "month")],
              amount: 0,
              paymentMethod: "cash"
            }}
          >
            <Form.Item
              name="serviceId"
              label="Dịch vụ"
              rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}
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
              rules={[{ required: true, message: "Vui lòng chọn căn hộ!" }]}
            >
              <Select 
                placeholder="Chọn căn hộ"
                value={residentInfo?.apartment?.apartmentId}
              >
                {apartments.map(apt => (
                  <Option key={apt.apartmentId} value={apt.apartmentId}>
                    {apt.apartmentNumber}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Thời gian áp dụng"
              rules={[{ required: true, message: "Vui lòng chọn thời gian áp dụng!" }]}
            >
              <RangePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Giá dịch vụ (VNĐ)"
              rules={[{ required: true, message: "Giá dịch vụ không được để trống!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={value => value.replace(/\$\s?|(,*)/g, "")}
                disabled={true} // Disabled to prevent manual editing
              />
            </Form.Item>


            <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button type="default" onClick={() => navigate("/services")}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                onClick={handleFeeSubmit} 
                loading={loading}
                disabled={!residentInfo || paymentMethod === "transfer"} // Vô hiệu hóa nếu chưa tìm thấy cư dân hoặc chọn phương thức chuyển khoản
              >
                Lưu và Tạo Hóa Đơn
              </Button>
            </div>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default AddServiceFeePage;