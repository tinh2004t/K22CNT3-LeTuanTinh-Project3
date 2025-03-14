import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    
    const userId = localStorage.getItem("userId"); 
    const userRole = localStorage.getItem("userRole"); // Lấy role từ localStorage
    const isAdmin = userRole === "ADMIN";

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }
        fetchNotifications();
    }, [userId, userRole]);

    const fetchNotifications = async () => {
        try {
            const url = isAdmin 
                ? "http://localhost:8080/notifications/all"  // Nếu admin, lấy tất cả thông báo
                : `http://localhost:8080/notifications/user/${userId}`;

            const response = await axios.get(url);
            setNotifications(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông báo:", error);
        }
    };

    const sendNotification = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/notifications/send", {
                userId, title, message
            });
            alert("Thông báo đã gửi thành công!");
            setTitle("");
            setMessage("");
            setNotifications((prev) => [response.data, ...prev]); 
        } catch (error) {
            console.error("Lỗi khi gửi thông báo:", error);
        }
    };

    const deleteNotification = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa thông báo này?")) return;
        try {
            await axios.delete(`http://localhost:8080/notifications/delete/${id}`);
            setNotifications(notifications.filter((n) => n.id !== id));
            alert("Đã xóa thông báo.");
        } catch (error) {
            console.error("Lỗi khi xóa thông báo:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Thông báo</h2>

            {/* Form gửi thông báo (chỉ admin mới thấy) */}
            {isAdmin && (
                <div className="bg-white shadow-md p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold mb-2">Gửi Thông Báo</h3>
                    <form onSubmit={sendNotification}>
                        <input
                            type="text"
                            placeholder="Tiêu đề"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border p-2 w-full mb-2"
                            required
                        />
                        <textarea
                            placeholder="Nội dung thông báo"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="border p-2 w-full mb-2"
                            required
                        ></textarea>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Gửi thông báo
                        </button>
                    </form>
                </div>
            )}

            {/* Danh sách thông báo */}
            <div className="bg-white shadow-md p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Danh sách thông báo</h3>
                {notifications.length === 0 ? (
                    <p>Không có thông báo nào.</p>
                ) : (
                    <ul>
                        {notifications.map((notification) => (
                            <li key={notification.id} className="border-b py-2 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{notification.title}</p>
                                    <p>{notification.message}</p>
                                    <p className="text-gray-500 text-sm">
                                        Thời gian: {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Xóa
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
