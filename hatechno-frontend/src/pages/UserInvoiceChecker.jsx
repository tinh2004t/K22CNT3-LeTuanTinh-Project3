import React, { useState } from "react";
import { getResidentByPhone } from "../api/residentApi"; // API lấy thông tin cư dân
import { getInvoicesByResidentId } from "../api/invoiceApi"; // API lấy hóa đơn theo ID cư dân
import { addPayment } from "../api/paymentApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserInvoiceChecker = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [residentInfo, setResidentInfo] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("MOMO","CHUYEN_KHOAN","TIEN_MAT");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePhoneSearch = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ", { position: "top-right" });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Bước 1: Lấy thông tin cư dân dựa vào số điện thoại
      const residentResponse = await getResidentByPhone(phoneNumber);
      
      if (residentResponse && residentResponse.residentId) {
        // Lưu thông tin cư dân vào state
        setResidentInfo(residentResponse);
        
        // Bước 2: Lấy danh sách hóa đơn dựa vào ID cư dân
        const residentId = residentResponse.residentId;
        
        try {
          const invoicesResponse = await getInvoicesByResidentId(residentId);
          
          if (invoicesResponse && Array.isArray(invoicesResponse)) {
            setInvoices(invoicesResponse);
            
            if (invoicesResponse.length === 0) {
              toast.info("Không tìm thấy hóa đơn nào cho cư dân này", { position: "top-right" });
            } else {
              toast.success(`Đã tìm thấy ${invoicesResponse.length} hóa đơn cho cư dân ${residentResponse.fullName}`, { position: "top-right" });
            }
          } else {
            setInvoices([]);
            toast.info("Không tìm thấy hóa đơn nào cho cư dân này", { position: "top-right" });
          }
        } catch (invoiceError) {
          console.error("Lỗi khi lấy danh sách hóa đơn:", invoiceError);
          toast.error("Đã xảy ra lỗi khi tải danh sách hóa đơn", { position: "top-right" });
          setInvoices([]);
        }
      } else {
        toast.error("Không tìm thấy thông tin cư dân với số điện thoại này", { position: "top-right" });
        setResidentInfo(null);
        setInvoices([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm cư dân:", error);
      toast.error("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.", { position: "top-right" });
      setResidentInfo(null);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Đảm bảo có residentId trong dữ liệu thanh toán
      const paymentData = {
        invoice: { invoiceId: selectedInvoice.invoiceId },
        amount: selectedInvoice.amount,
        paymentDate: new Date().toISOString().split('T')[0],
        method: paymentMethod,
        residentId: residentInfo.residentId // Thêm ID cư dân vào dữ liệu thanh toán
      };
      
      // Gọi API thanh toán
      const paymentResponse = await addPayment(paymentData);
      
      if (paymentResponse) {
        // Cập nhật trạng thái local để phản ánh hóa đơn đã thanh toán
        const updatedInvoices = invoices.map(inv => 
          inv.invoiceId === selectedInvoice.invoiceId 
            ? { ...inv, status: "DA_THANH_TOAN" } 
            : inv
        );
        
        setInvoices(updatedInvoices);
        setShowPaymentForm(false);
        setSelectedInvoice(null);
        
        toast.success("Thanh toán thành công!", { position: "top-right" });
      } else {
        throw new Error("Không nhận được phản hồi từ API thanh toán");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      toast.error("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại sau.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "DA_THANH_TOAN") {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đã thanh toán</span>;
    } else if (status === "CHUA_THANH_TOAN") {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Chưa thanh toán</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
  };

  const formatCurrency = (amount) => {
    return parseInt(amount).toLocaleString() + " VND";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Kiểm tra hóa đơn</h1>
          <p className="text-gray-600">Nhập số điện thoại đã đăng ký để xem hóa đơn của bạn</p>
        </div>

        {/* Form tìm kiếm */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <form onSubmit={handlePhoneSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="tel"
                placeholder="Nhập số điện thoại của bạn"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                pattern="[0-9]{10,11}"
                title="Số điện thoại cần có 10-11 chữ số"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium"
              >
                {isLoading ? "Đang tìm..." : "Tìm kiếm"}
              </button>
            </div>
          </form>
        </div>

        {/* Hiển thị thông tin cư dân */}
        {residentInfo && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Thông tin cư dân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Họ tên:</p>
                <p className="font-medium">{residentInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại:</p>
                <p className="font-medium">{residentInfo.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Căn hộ:</p>
                <p className="font-medium">{residentInfo.apartment?.apartmentName || "Không có thông tin"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mã cư dân:</p>
                <p className="font-medium">#{residentInfo.residentId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách hóa đơn */}
        {residentInfo && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh sách hóa đơn của cư dân #{residentInfo.residentId}</h2>
            
            {invoices.length === 0 ? (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
                <p className="text-yellow-700">Cư dân không có hóa đơn nào.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã hóa đơn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại phí
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đến hạn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{invoice.invoiceId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.type || "Phí dịch vụ"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.dueDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invoice.status === "CHUA_THANH_TOAN" && (
                            <button
                              onClick={() => handlePayInvoice(invoice)}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              Thanh toán
                            </button>
                          )}
                          {invoice.status === "DA_THANH_TOAN" && (
                            <button
                              className="text-gray-400 cursor-not-allowed text-sm font-medium"
                              disabled
                            >
                              Đã thanh toán
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal thanh toán */}
        {showPaymentForm && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Thanh toán hóa đơn #{selectedInvoice.invoiceId}</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Số tiền cần thanh toán:</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(selectedInvoice.amount)}</p>
              </div>
              
              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phương thức thanh toán
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="MOMO">MoMo</option>
                    <option value="CHUYEN_KHOAN">Chuyển khoản</option>
                  </select> 
                </div>
                
                {paymentMethod === "CHUYEN_KHOAN" && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <p className="font-medium">Thông tin chuyển khoản:</p>
                    <p className="text-sm">Ngân hàng: BIDV</p>
                    <p className="text-sm">Số tài khoản: 9999 8888 7777</p>
                    <p className="text-sm">Tên tài khoản: Quản lý chung cư</p>
                    <p className="text-sm">Nội dung: THANHTOAN {selectedInvoice.invoiceId} {residentInfo.residentId}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedInvoice(null);
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  >
                    {isLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserInvoiceChecker;