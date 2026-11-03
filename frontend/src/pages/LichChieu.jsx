import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./LichChieu.css";

function LichChieu() {
    const [lichChieu, setLichChieu] = useState([]);
    const [ngayChon, setNgayChon] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const maRap = localStorage.getItem("ma_rap");

        axios
            .get("http://localhost:5000/api/lich-chieu", {
                params: {
                    ma_rap: maRap,
                },
            })
            .then((res) => {
                setLichChieu(res.data);

                if (res.data.length > 0) {
                    setNgayChon(res.data[0].ngay_chieu);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    if (!localStorage.getItem("ma_rap")) {
        return (
            <>
                <Navbar />

                <div className="container mt-5">
                    <div className="alert alert-warning">
                        Vui lòng chọn rạp trước khi xem lịch chiếu.
                    </div>
                </div>

                <Footer />
            </>
        );
    }

    const danhSachNgay = [
        ...new Set(lichChieu.map((item) => item.ngay_chieu)),
    ].sort((a, b) => new Date(a) - new Date(b));

    const lichTheoNgay = lichChieu.filter(
        (item) => item.ngay_chieu === ngayChon
    );

    const nhomPhim = {};

    lichTheoNgay.forEach((item) => {
        if (!nhomPhim[item.ma_phim]) {
            nhomPhim[item.ma_phim] = {
                ten_phim: item.ten_phim,
                poster: item.poster,
                the_loai: item.the_loai,
                thoi_luong: item.thoi_luong,
                suatChieu: [],
            };
        }

        nhomPhim[item.ma_phim].suatChieu.push(item);
    });

    return (
        <>
            <Navbar />

            <div className="container mt-5 mb-5">
                <h2 className="fw-bold mb-4 text-danger">
                    Lịch chiếu phim
                </h2>

                {/* Chọn ngày */}

                <div className="d-flex flex-wrap gap-2 mb-4">
                    {danhSachNgay.map((ngay) => (
                        <button
                            key={ngay}
                            className={
                                ngay === ngayChon
                                    ? "btn btn-danger"
                                    : "btn btn-outline-danger"
                            }
                            onClick={() => setNgayChon(ngay)}
                        >
                            {new Date(ngay).toLocaleDateString("vi-VN")}
                        </button>
                    ))}
                </div>

                {/* Danh sách phim */}

                {Object.keys(nhomPhim).length === 0 ? (
                    <div className="alert alert-info">
                        Không có suất chiếu.
                    </div>
                ) : (
                    Object.keys(nhomPhim).map((maPhim) => {
                        const phim = nhomPhim[maPhim];

                        return (
                            <div
                                key={maPhim}
                                className="card shadow-sm mb-4 border-0"
                            >
                                <div className="row g-0">

                                    <div className="col-md-3">
                                        <img
                                            src={`http://localhost:5000${phim.poster}`}
                                            alt={phim.ten_phim}
                                            className="img-fluid rounded-start h-100"
                                            style={{
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>

                                    <div className="col-md-9">
                                        <div className="card-body">

                                            <h3 className="fw-bold">
                                                {phim.ten_phim}
                                            </h3>

                                            <p className="mb-2">
                                                <strong>Thể loại:</strong>{" "}
                                                {phim.the_loai}
                                            </p>

                                            <p className="mb-4">
                                                <strong>Thời lượng:</strong>{" "}
                                                {phim.thoi_luong} phút
                                            </p>

                                            <h5 className="mb-3">
                                                Chọn suất chiếu
                                            </h5>

                                            <div className="d-flex flex-wrap gap-3">

                                                {phim.suatChieu.map((sc) => (

                                                    <button
                                                        key={sc.ma_suat_chieu}
                                                        className="btn btn-outline-primary fw-bold"
                                                        onClick={() =>
                                                            navigate(
                                                                `/dat-ve/${sc.ma_suat_chieu}`
                                                            )
                                                        }
                                                    >
                                                        {sc.gio_bat_dau.slice(
                                                            0,
                                                            5
                                                        )}
                                                    </button>

                                                ))}

                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <Footer />
        </>
    );
}

export default LichChieu;