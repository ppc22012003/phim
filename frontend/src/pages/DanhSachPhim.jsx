import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function DanhSachPhim() {

    const [movies, setMovies] = useState([]);
    const [tab, setTab] = useState("dang_chieu");

    useEffect(() => {

        loadMovies();

    }, []);

    const loadMovies = async () => {

    try {

        const maRap = localStorage.getItem("ma_rap");

        const res = await axios.get(
            `http://localhost:5000/api/phim/rap/${maRap}`
        );

        setMovies(res.data);

    } catch (err) {

        console.log(err);

    }

};

    const danhSach = movies.filter(
        (movie) => movie.trang_thai === tab
    );

    return (
        <>
            <Navbar />

            <div className="container py-5">

                <h2 className="text-center fw-bold mb-5">
                    DANH SÁCH PHIM
                </h2>

                <div className="text-center mb-5">

                    <button
                        className={`btn ${
                            tab === "dang_chieu"
                                ? "btn-danger"
                                : "btn-outline-danger"
                        } me-3 px-4`}
                        onClick={() =>
                            setTab("dang_chieu")
                        }
                    >
                        Đang chiếu
                    </button>

                    <button
                        className={`btn ${
                            tab === "sap_chieu"
                                ? "btn-danger"
                                : "btn-outline-danger"
                        } px-4`}
                        onClick={() =>
                            setTab("sap_chieu")
                        }
                    >
                        Sắp chiếu
                    </button>

                </div>

                <div className="row">

                    {danhSach.length === 0 && (

                        <div className="text-center">

                            <h4>
                                Không có phim.
                            </h4>

                        </div>

                    )}

                    {danhSach.map((movie) => (

                        <div
                            className="col-lg-3 col-md-4 col-sm-6 mb-4"
                            key={movie.ma_phim}
                        >

                            <div
                                className="card shadow h-100 border-0"
                                style={{
                                    borderRadius: "15px"
                                }}
                            >

                                <img
                                    src={`http://localhost:5000${movie.poster}`}
                                    alt={movie.ten_phim}
                                    className="card-img-top"
                                    style={{
                                        height: "380px",
                                        objectFit: "cover",
                                        borderTopLeftRadius: "15px",
                                        borderTopRightRadius: "15px"
                                    }}
                                />

                                <div className="card-body d-flex flex-column">

                                    <h5 className="fw-bold">
                                        {movie.ten_phim}
                                    </h5>

                                    <p className="mb-1">
                                        <strong>Thể loại:</strong> {movie.the_loai}
                                    </p>

                                    <p className="mb-1">
                                        <strong>Thời lượng:</strong> {movie.thoi_luong} phút
                                    </p>

                                    <p className="mb-3">
                                        <strong>Khởi chiếu:</strong>{" "}
                                        {movie.ngay_khoi_chieu
                                            ? new Date(
                                                  movie.ngay_khoi_chieu
                                              ).toLocaleDateString("vi-VN")
                                            : ""}
                                    </p>

                                    <div className="mt-auto">

                                        <Link
                                            to={`/phim/${movie.ma_phim}`}
                                            className="btn btn-outline-dark w-100 mb-2"
                                        >
                                            Chi tiết
                                        </Link>

                                        {movie.trang_thai === "dang_chieu" ? (

                                            <Link
                                                to="/lich-chieu"
                                                className="btn btn-danger w-100"
                                            >
                                                Đặt vé
                                            </Link>

                                        ) : (

                                            <button
                                                className="btn btn-secondary w-100"
                                                disabled
                                            >
                                                Sắp chiếu
                                            </button>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
                         <Footer />

        </>
    );
}

export default DanhSachPhim;