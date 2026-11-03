import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ChiTietTinTuc() {

    const { id } = useParams();

    const [news, setNews] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios
            .get(`http://localhost:5000/api/tin-tuc/${id}`)
            .then((res) => {

                setNews(res.data);

                setLoading(false);

            })
            .catch((err) => {

                console.log(err);

                setLoading(false);

            });

    }, [id]);

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

    if (!news) {

        return (
            <>
                <Navbar />
                <div className="container py-5 text-center">
                    <h3>Không tìm thấy bài viết.</h3>
                </div>
            </>
        );

    }

    return (

        <>

            <Navbar />

            <div className="container py-5">

                <div className="card shadow-lg border-0">

                    <img
                        src={`http://localhost:5000${news.hinh_anh}`}
                        alt=""
                        className="card-img-top"
                        style={{
                            height: 500,
                            objectFit: "cover"
                        }}
                    />

                    <div className="card-body p-5">

                        <span
                            className={
                                news.loai_tin === "uu_dai"
                                    ? "badge bg-success mb-3"
                                    : "badge bg-primary mb-3"
                            }
                        >

                            {news.loai_tin === "uu_dai"
                                ? "Ưu đãi"
                                : "Tin tức"}

                        </span>

                        <h2 className="fw-bold">

                            {news.tieu_de}

                        </h2>

                        <p className="text-muted">

                            Ngày đăng:

                            {" "}

                            {news.ngay_dang?.split("T")[0]}

                        </p>

                        <hr />

                        <div
                            style={{
                                whiteSpace: "pre-line",
                                lineHeight: "32px",
                                fontSize: "18px"
                            }}
                        >

                            {news.noi_dung}

                        </div>

                        <hr />

                        <Link
                            to="/tin-tuc"
                            className="btn btn-danger"
                        >

                            ← Quay lại

                        </Link>

                    </div>

                </div>

            </div>
             <Footer />

        </>

    );

}

export default ChiTietTinTuc;