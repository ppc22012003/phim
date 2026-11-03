import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function DanhSachRap() {

    const [rap, setRap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadRap();

    }, []);

    const loadRap = async () => {

        try {

            const maRap = localStorage.getItem("ma_rap");

            if (!maRap) {

                setLoading(false);
                return;

            }

            const res = await axios.get(
                `http://localhost:5000/api/rap/${maRap}`
            );

            setRap(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <>
                <Navbar />
                <div className="container py-5 text-center">
                    <h4>Đang tải...</h4>
                </div>
            </>
        );

    }

    if (!rap) {

        return (
            <>
                <Navbar />
                <div className="container py-5 text-center">
                    <h4>Không tìm thấy thông tin rạp.</h4>
                </div>
            </>
        );

    }

    return (

        <>
            <Navbar />

            <div className="container py-5">

                <h2 className="fw-bold text-center mb-5">

                    {rap.ten_rap}

                </h2>

                <div className="card shadow border-0">

                    <div className="row g-0">

                        {/* Hình rạp */}

                        <div className="col-lg-5">

                           <img
    src={rap.hinh_anh}
    alt={rap.ten_rap}
    className="img-fluid h-100 w-100 rounded-start"
    style={{
        objectFit: "cover",
        minHeight: "450px"
    }}
/>

                        </div>

                        {/* Thông tin */}

                        <div className="col-lg-7">

                            <div className="card-body p-5">

                                <h3 className="fw-bold mb-4">

                                    {rap.ten_rap}

                                </h3>

                                <hr />

                                <h5 className="text-danger">

                                    📍 Địa chỉ

                                </h5>

                                <p className="mb-4">

                                    {rap.dia_chi}

                                </p>

                                <h5 className="text-danger">

                                    📖 Giới thiệu

                                </h5>

                                <p
                                    style={{
                                        textAlign: "justify",
                                        lineHeight: "30px"
                                    }}
                                >

                                    {rap.mo_ta}

                                </p>

                                <h5 className="text-danger mt-4">

                                    ☎ Hotline

                                </h5>

                                <p>

                                    {rap.so_dien_thoai}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
             <Footer />

        </>

    );
             
}

export default DanhSachRap;