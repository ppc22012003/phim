import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

import Navbar from "../components/Navbar";
import { layChiTietPhim } from "../services/phimService";

function ChiTietPhim() {

    const { id } = useParams();

    const [phim, setPhim] = useState(null);
    const [lichChieu, setLichChieu] = useState([]);
    const [ngayChon, setNgayChon] = useState("");

    useEffect(() => {

        layChiTietPhim(id)
            .then((res) => {
                setPhim(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .get(
                `http://localhost:5000/api/phim/${id}/lich-chieu`
            )
            .then((res) => {

                setLichChieu(res.data);

                if (res.data.length > 0) {

                    setNgayChon(
                        res.data[0].ngay_chieu
                            .split("T")[0]
                    );

                }

            })
            .catch((err) => {
                console.log(err);
            });

    }, [id]);

    if (!phim) {
        return <h2>Đang tải...</h2>;
    }

    const danhSachNgay = [
        ...new Set(
            lichChieu.map(
                (item) =>
                    item.ngay_chieu.split("T")[0]
            )
        )
    ];

    const gioTheoNgay = lichChieu.filter(
        (item) =>
            item.ngay_chieu.split("T")[0]
            === ngayChon
    );

    const trailerEmbed = phim.trailer
        ? phim.trailer.replace(
              "watch?v=",
              "embed/"
          )
        : "";

    return (
        <>
            <Navbar />

            <div className="container my-5">

                <div className="row">

                    <div className="col-md-4">

                        <img
                            src={`http://localhost:5000${phim.poster}`}
                            alt={phim.ten_phim}
                            className="img-fluid rounded shadow"
                        />

                    </div>

                    <div className="col-md-8">

                        <h1 className="mb-3">
                            {phim.ten_phim}
                        </h1>

                        <p>
                            <strong>Thể loại:</strong>{" "}
                            {phim.the_loai}
                        </p>

                        <p>
                            <strong>Thời lượng:</strong>{" "}
                            {phim.thoi_luong} phút
                        </p>

                        <p>
                            <strong>Ngôn ngữ:</strong>{" "}
                            {phim.ngon_ngu}
                        </p>

                        <p>
                            <strong>Giới hạn tuổi:</strong>{" "}
                            {phim.gioi_han_do_tuoi}
                        </p>

                        <p>
                            <strong>Mô tả:</strong>
                        </p>

                        <p>{phim.mo_ta}</p>

                    </div>

                </div>

                <hr className="my-5" />

                <h3 className="mb-4">
                    Lịch chiếu phim
                </h3>

                {/* CHỌN NGÀY */}

                <div className="d-flex gap-2 flex-wrap mb-4">

                    {danhSachNgay.map((ngay) => (

                        <button
                            key={ngay}
                            className={
                                ngay === ngayChon
                                    ? "btn btn-primary"
                                    : "btn btn-outline-primary"
                            }
                            onClick={() =>
                                setNgayChon(ngay)
                            }
                        >
                            {new Date(ngay)
                                .toLocaleDateString("vi-VN")}
                        </button>

                    ))}

                </div>

                {/* GIỜ CHIẾU */}

                <div className="d-flex gap-2 flex-wrap mb-5">

                    {gioTheoNgay.length > 0 ? (

                       gioTheoNgay.map((sc) => (

<Link
    to={`/dat-ve/${sc.ma_suat_chieu}`}
    className="btn btn-outline-secondary"
>
    {String(sc.gio_bat_dau).substring(0,5)}
</Link>

))

                    ) : (

                        <p>
                            Chưa có suất chiếu
                        </p>

                    )}

                </div>

                <hr className="my-5" />

                <h3 className="mb-4">
                    Trailer
                </h3>

                {trailerEmbed ? (

                    <div className="ratio ratio-16x9">

                        <iframe
                            src={trailerEmbed}
                            title="Trailer"
                            allowFullScreen
                        />

                    </div>

                ) : (

                    <p>
                        Chưa có trailer
                    </p>

                )}

            </div>
             <Footer />

        </>
        
    );
}

export default ChiTietPhim;