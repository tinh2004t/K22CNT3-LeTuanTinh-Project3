import React, { useState, useEffect } from "react";
import { getInvoices, addInvoice } from "../api/invoiceApi";
import { getPayments, addPayment } from "../api/paymentApi";

const InvoicePaymentManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("invoices");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  const [newInvoice, setNewInvoice] = useState({ 
    residentId: "", 
    amount: "", 
    dueDate: new Date().toISOString().split('T')[0], 
    status: "CHUA_THANH_TOAN" 
  });
  
  const [newPayment, setNewPayment] = useState({ 
    invoiceId: "", 
    amount: "", 
    paymentDate: new Date().toISOString().split('T')[0], 
    method: "MOMO" 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [invoiceData, paymentData] = await Promise.all([
        getInvoices(),
        getPayments()
      ]);
      setInvoices(invoiceData);
      setPayments(paymentData);
    } catch (error) {
      showNotification("Lỗi khi tải dữ liệu. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const addedInvoice = await addInvoice(newInvoice);
      setInvoices([...invoices, addedInvoice]);
      setNewInvoice({ 
        residentId: "", 
        amount: "", 
        dueDate: new Date().toISOString().split('T')[0], 
        status: "CHUA_THANH_TOAN" 
      });
      showNotification("Hóa đơn đã được thêm thành công!", "success");
    } catch (error) {
      showNotification("Lỗi khi thêm hóa đơn. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const addedPayment = await addPayment(newPayment);
      setPayments([...payments, addedPayment]);
      
      // Cập nhật trạng thái hóa đơn thành "ĐÃ_THANH_TOÁN"
      const updatedInvoices = invoices.map(invoice => 
        invoice.invoiceId === newPayment.invoiceId 
          ? { ...invoice, status: "DA_THANH_TOAN" }
          : invoice
      );
      setInvoices(updatedInvoices);
      
      setNewPayment({ 
        invoiceId: "", 
        amount: "", 
        paymentDate: new Date().toISOString().split('T')[0], 
        method: "MOMO" 
      });
      showNotification("Thanh toán đã được ghi nhận thành công!", "success");
    } catch (error) {
      showNotification("Lỗi khi thêm thanh toán. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceId?.toString().includes(searchTerm) || 
    invoice.residentId?.toString().includes(searchTerm)
  );

  const filteredPayments = payments.filter(payment => 
    payment.paymentId?.toString().includes(searchTerm) || 
    payment.invoiceId?.toString().includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    if (status === "DA_THANH_TOAN") {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Đã thanh toán</span>;
    } else if (status === "CHUA_THANH_TOAN") {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Chưa thanh toán</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
  };

  const getPaymentMethodBadge = (method) => {
    switch (method) {
      case "MOMO":
        return <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs">MoMo</span>;
      case "BANKING":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Banking</span>;
      case "CASH":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Tiền mặt</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{method}</span>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md ${notification.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Hóa đơn & Thanh toán</h1>
          <button 
            onClick={fetchData}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <span className="mr-2">🔄</span> Làm mới
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button
              className={`py-2 px-4 font-medium ${activeTab === "invoices" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("invoices")}
            >
              📄 Hóa đơn
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === "payments" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("payments")}
            >
              💰 Thanh toán
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === "add" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("add")}
            >
              ➕ Thêm mới
            </button>
          </div>
        </div>

        {/* Nội dung Tab */}
        {activeTab === "add" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Form thêm hóa đơn */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thêm hóa đơn mới</h2>
              <form onSubmit={handleAddInvoice}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Cư dân</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nhập ID cư dân" 
                    value={newInvoice.residentId} 
                    onChange={(e) => setNewInvoice({ ...newInvoice, residentId: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Nhập số tiền" 
                    value={newInvoice.amount} 
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đến hạn</label>
                  <input 
                    type="date" 
                    value={newInvoice.dueDate} 
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select 
                    value={newInvoice.status} 
                    onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="CHUA_THANH_TOAN">Chưa thanh toán</option>
                    <option value="DA_THANH_TOAN">Đã thanh toán</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex justify-center items-center"
                >
                  {isLoading ? <span>Đang xử lý...</span> : <span>Thêm hóa đơn</span>}
                </button>
              </form>
            </div>

            {/* Form thêm thanh toán */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thêm thanh toán mới</h2>
              <form onSubmit={handleAddPayment}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Hóa đơn</label>
                  <select 
                    required
                    value={newPayment.invoiceId} 
                    onChange={(e) => setNewPayment({ ...newPayment, invoiceId: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="">Chọn hóa đơn</option>
                    {invoices
                      .filter(invoice => invoice.status !== "DA_THANH_TOAN")
                      .map(invoice => (
                        <option key={invoice.invoiceId} value={invoice.invoiceId}>
                          {`#${invoice.invoiceId} - Cư dân: ${invoice.residentId} - ${invoice.amount} VND`}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Nhập số tiền" 
                    value={newPayment.amount} 
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày thanh toán</label>
                  <input 
                    type="date" 
                    value={newPayment.paymentDate} 
                    onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
                  <select 
                    value={newPayment.method} 
                    onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="MOMO">MoMo</option>
                    <option value="BANKING">Chuyển khoản</option>
                    <option value="CASH">Tiền mặt</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex justify-center items-center"
                >
                  {isLoading ? <span>Đang xử lý...</span> : <span>Ghi nhận thanh toán</span>}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cư dân
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Không tìm thấy hóa đơn nào.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{invoice.invoiceId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.residentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {parseInt(invoice.amount).toLocaleString()} VND
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.dueDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(invoice.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hóa đơn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phương thức
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Không tìm thấy thanh toán nào.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.paymentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{payment.paymentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          #{payment.invoiceId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {parseInt(payment.amount).toLocaleString()} VND
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.paymentDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPaymentMethodBadge(payment.method)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePaymentManagement;