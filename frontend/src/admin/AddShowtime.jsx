import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddShowtime() {
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [raps, setRaps] = useState([]);
    const [phongs, setPhongs] = useState([]);
    const [maRap, setMaRap] = useState("");

    const [showtime, setShowtime] = useState({
        ma_phim: "",
        ma_phong: "",
        ngay_chieu: "",
        gio_bat_dau: "",
        gio_ket_thuc: ""
    });

    // 1. Tải danh sách Phim và Rạp khi vừa mở trang
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [movieRes, rapRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/phim"),
                    axios.get("http://localhost:5000/api/rap")
                ]);
                setMovies(movieRes.data);
                setRaps(rapRes.data);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu ban đầu:", err);
            }
        };

        fetchInitialData();
    }, []);

    // 2. Lấy danh sách Phòng chiếu mỗi khi `maRap` thay đổi
    useEffect(() => {
        if (!maRap) {
            setPhongs([]);
            setShowtime(prev => ({ ...prev, ma_phong: "" }));
            return;
        }

        axios
            .get(`http://localhost:5000/api/phong-chieu?ma_rap=${maRap}`)
            .then(res => {
                setPhongs(res.data);
            })
            .catch(err => {
                console.error("Lỗi khi tải danh sách phòng:", err);
            });
    }, [maRap]);

    // Xử lý khi chọn Rạp chiếu
    const handleRapChange = (e) => {
        const selectedRapId = e.target.value;
        setMaRap(selectedRapId);
        // Reset lại phòng trong state showtime khi đổi rạp
        setShowtime(prev => ({ ...prev, ma_phong: "" }));
    };

    // Xử lý thay đổi các ô input
    const handleChange = (e) => {
        setShowtime({
            ...showtime,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu bắt buộc trước khi gửi
        if (!showtime.ma_phim || !showtime.ma_phong) {
            alert("Vui lòng chọn đầy đủ Phim và Phòng chiếu!");
            return;
        }

        try {
            await axios.post(
                "http://localhost:5000/api/suat-chieu",
                showtime
            );
            alert("Thêm suất chiếu thành công");
            navigate("/admin/showtimes");
        } catch (err) {
            console.error(err);
            alert("Thêm thất bại");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Thêm suất chiếu</h2>

            <form onSubmit={handleSubmit}>
                {/* Chọn Phim */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Phim</label>
                    <select
                        name="ma_phim"
                        className="form-select"
                        value={showtime.ma_phim}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Chọn phim --</option>
                        {movies.map(movie => (
                            <option key={movie.ma_phim} value={movie.ma_phim}>
                                {movie.ten_phim}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chọn Rạp chiếu */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Rạp chiếu</label>
                    <select
                        className="form-select"
                        value={maRap}
                        onChange={handleRapChange}
                        required
                    >
                        <option value="">-- Chọn rạp --</option>
                        {raps.map(rap => (
                            <option key={rap.ma_rap} value={rap.ma_rap}>
                                {rap.ten_rap}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chọn Phòng chiếu */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Phòng chiếu</label>
                    <select
                        name="ma_phong"
                        className="form-select"
                        value={showtime.ma_phong}
                        onChange={handleChange}
                        disabled={!maRap}
                        required
                    >
                        <option value="">-- Chọn phòng --</option>
                        {phongs.map(phong => (
                            <option key={phong.ma_phong} value={phong.ma_phong}>
                                {phong.ten_phong}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ngày chiếu */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Ngày chiếu</label>
                    <input
                        type="date"
                        name="ngay_chieu"
                        className="form-control"
                        value={showtime.ngay_chieu}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Giờ bắt đầu */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Giờ bắt đầu</label>
                    <input
                        type="time"
                        name="gio_bat_dau"
                        className="form-control"
                        value={showtime.gio_bat_dau}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Giờ kết thúc */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Giờ kết thúc</label>
                    <input
                        type="time"
                        name="gio_ket_thuc"
                        className="form-control"
                        value={showtime.gio_ket_thuc}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success">
                    Lưu suất chiếu
                </button>
            </form>
        </div>
    );
}

export default AddShowtime;