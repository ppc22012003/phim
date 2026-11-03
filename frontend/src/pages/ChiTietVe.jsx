import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function ChiTietVe() {

    const params = useParams();

    console.log("PARAMS =", params);

    const { maDatVe } = params;

    console.log("maDatVe =", maDatVe);

    const [ve, setVe] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios
            .get(`http://localhost:5000/api/chi-tiet-ve/${maDatVe}`)
            .then((res) => {

                console.log(res.data);

                setVe(res.data);

                setLoading(false);

            })
            .catch((err) => {

                console.log(err);

                setLoading(false);

            });

    }, [maDatVe]);

    if (loading) {

        return (
            <>
                <Navbar />
                <div className="container py-5 text-center">
                    <h3>Đang tải...</h3>
                </div>
            </>
        );

    }

    if (!ve) {

        return (
            <>
                <Navbar />
                <div className="container py-5 text-center">

                    <h3>Không tìm thấy vé</h3>

                </div>
            </>
        );

    }

    return (

        <>

            <Navbar />

            <div className="container py-5">

                <div className="card shadow-lg border-0">

                    <div className="row g-0">

                        <div className="col-lg-4">

                            <img
                                src={`http://localhost:5000${ve.poster}`}
                                alt=""
                                className="img-fluid rounded-start"
                                style={{
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />

                        </div>

                        <div className="col-lg-8">

                            <div className="card-body p-4">

                                <h2 className="fw-bold">

                                    {ve.ten_phim}

                                </h2>

                                <hr />

                                <div className="row">

                                    <div className="col-md-6">

                                        <p>

                                            <b>Mã vé:</b>

                                            {" "}

                                            #{ve.ma_dat_ve}

                                        </p>

                                        <p>

                                            <b>Rạp:</b>

                                            {" "}

                                            {ve.ten_rap}

                                        </p>

                                        <p>

                                            <b>Phòng:</b>

                                            {" "}

                                            {ve.ten_phong}

                                        </p>

                                        <p>

                                            <b>Ghế:</b>

                                            {" "}

                                            {ve.ghe || "Không có"}

                                        </p>

                                        <p>

                                            <b>Ngày chiếu:</b>

                                            {" "}

                                            {ve.ngay_chieu?.split("T")[0]}

                                        </p>

                                        <p>

                                            <b>Giờ chiếu:</b>

                                            {" "}

                                            {ve.gio_bat_dau?.substring(0,5)}

                                        </p>

                                    </div>

                                    <div className="col-md-6">

                                        <p>

                                            <b>Thanh toán:</b>

                                            {" "}

                                            {ve.phuong_thuc_thanh_toan}

                                        </p>

                                        <p>

                                            <b>Trạng thái:</b>

                                            {" "}

                                            <span className="badge bg-success">

                                                {ve.trang_thai}

                                            </span>

                                        </p>

                                        <p>

                                            <b>Ngày đặt:</b>

                                            {" "}

                                            {ve.ngay_dat?.split("T")[0]}

                                        </p>

                                        <p className="fs-4 text-danger fw-bold">

                                            Tổng tiền:

                                            {" "}

                                            {Number(
                                                ve.tong_tien
                                            ).toLocaleString()}

                                            đ

                                        </p>

                                    </div>

                                </div>

                                <hr />

                                <div className="text-center">

                                    <Link
                                        to="/ve-cua-toi"
                                        className="btn btn-secondary me-2"
                                    >

                                        Quay lại

                                    </Link>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => window.print()}
                                    >

                                        In vé

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );

}

export default ChiTietVe;