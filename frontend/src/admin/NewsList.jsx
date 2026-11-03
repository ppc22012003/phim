import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";

// Ảnh fallback dạng SVG inline (chạy trực tiếp không lo lỗi mạng/connection closed)
const PLACEHOLDER_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='110' height='70' viewBox='0 0 110 70'><rect width='100%' height='100%' fill='%23e9ecef'/><text x='50%' y='50%' font-family='sans-serif' font-size='12' fill='%236c757d' text-anchor='middle' dy='.3em'>No Image</text></svg>";

function NewsList() {
    const [news, setNews] = useState([]);
    const [keyword, setKeyword] = useState("");

    const API_URL = "http://localhost:5000";

    useEffect(() => {
        loadNews();
    }, []);

    // =========================
    // Xử lý đường dẫn ảnh an toàn
    // =========================


const getImageUrl = (item) => {
    if (!item || !item.hinh_anh) return PLACEHOLDER_IMAGE;

    let path = item.hinh_anh.trim();

    if (!path) return PLACEHOLDER_IMAGE;

    // Nếu đã là link đầy đủ http/https
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // Đảm bảo có gạch chéo ở đầu path
    if (!path.startsWith("/")) {
        path = "/" + path;
    }

    // Kết quả thu được: http://localhost:5000/uploads/tintuc/1787077759611.png
    return `${API_URL}${path}`;
};
    // =========================
    // Lấy danh sách tin từ API
    // =========================
    const loadNews = () => {
        axios
            .get(`${API_URL}/api/tin-tuc`)
            .then((res) => {
                console.log("DỮ LIỆU TỪ API:", res.data);
                setNews(res.data);
            })
            .catch((err) => {
                console.log("LỖI LẤY TIN TỨC:", err);
            });
    };

    // =========================
    // Xóa tin
    // =========================
    const handleDelete = (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;

        axios
            .delete(`${API_URL}/api/tin-tuc/${id}`)
            .then(() => {
                alert("Xóa thành công!");
                loadNews();
            })
            .catch((err) => {
                console.log("LỖI XÓA:", err);
                alert("Xóa tin thất bại!");
            });
    };

    // Lọc theo từ khóa
    const filteredNews = news.filter((item) =>
        (item.tieu_de || "").toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <div className="container-fluid py-4" style={{ background: "#f4f6f9", minHeight: "100vh" }}>
            <div className="card border-0 shadow" style={{ borderRadius: "20px" }}>
                {/* HEADER */}
                <div className="card-header border-0 bg-white" style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: "#dc3545" }}>
                                Quản lý Tin tức & Ưu đãi
                            </h2>
                            <small className="text-muted">Danh sách các bài viết trên hệ thống</small>
                        </div>
                        <Link to="/admin/news/add" className="btn btn-danger rounded-pill px-4">
                            <FaPlus className="me-2" />
                            Thêm tin tức
                        </Link>
                    </div>
                </div>

                {/* BODY */}
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <FaSearch />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm tiêu đề..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* BẢNG DỮ LIỆU */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-danger">
                                <tr>
                                    <th width="130">Hình ảnh</th>
                                    <th>Tiêu đề</th>
                                    <th width="150">Loại</th>
                                    <th width="170">Ngày đăng</th>
                                    <th width="170">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNews.length > 0 ? (
                                    filteredNews.map((item) => (
                                        <tr key={item.ma_tin_tuc}>
                                            {/* CỘT HÌNH ẢNH */}
                                            <td>
                                                <img 
                                                    src={getImageUrl(item)} 
                                                    alt={item.tieu_de || "Tin tức"} 
                                                    style={{
                                                        width: "110px",
                                                        height: "70px",
                                                        objectFit: "cover",
                                                        borderRadius: "10px",
                                                        border: "1px solid #ddd"
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null; 
                                                        e.target.src = PLACEHOLDER_IMAGE; 
                                                    }}
                                                />
                                            </td>

                                            {/* TIÊU ĐỀ */}
                                            <td>
                                                <strong>{item.tieu_de}</strong>
                                            </td>

                                            {/* LOẠI TIN */}
                                            <td>
                                                {item.loai_tin === "uu_dai" ? (
                                                    <span className="badge bg-success">Ưu đãi</span>
                                                ) : (
                                                    <span className="badge bg-primary">Tin tức</span>
                                                )}
                                            </td>

                                            {/* NGÀY ĐĂNG */}
                                            <td>
                                                {item.ngay_dang
                                                    ? new Date(item.ngay_dang).toLocaleDateString("vi-VN")
                                                    : ""}
                                            </td>

                                            {/* THAO TÁC */}
                                            <td>
                                                <Link
                                                    to={`/admin/news/edit/${item.ma_tin_tuc}`}
                                                    className="btn btn-warning btn-sm rounded-pill me-2"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm rounded-pill"
                                                    onClick={() => handleDelete(item.ma_tin_tuc)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            Chưa có bài viết nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsList;