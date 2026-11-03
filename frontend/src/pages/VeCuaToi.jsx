import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function VeCuaToi() {

    const [danhSachVe, setDanhSachVe] = useState([]);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {

        if (!user) return;

      axios.get(
    `http://localhost:5000/api/ve-cua-toi/${user.ma_tai_khoan}`
)
.then((res) => {

    console.log("USER:", user);
    console.log("API:", res.data);

    setDanhSachVe(res.data);

})
.catch((err) => {

    console.log(err);

});

    }, []);

    return (

        <>
            <Navbar />

            <div className="container py-5">

                <h2 className="text-center fw-bold mb-5">

                    VÉ CỦA TÔI

                </h2>

                {
                    danhSachVe.length === 0 ?

                    (

                        <div className="alert alert-warning text-center">

                            Bạn chưa đặt vé nào.

                        </div>

                    )

                    :

                    (

                        <div className="row">

                            {

                                danhSachVe.map((ve) => (

                                    <div
                                        className="col-lg-4 mb-4"
                                        key={ve.ma_dat_ve}
                                    >

                                        <div className="card shadow h-100">

                                            <img
                                                src={`http://localhost:5000${ve.poster}`}
                                                className="card-img-top"
                                                style={{
                                                    height: "420px",
                                                    objectFit: "cover"
                                                }}
                                                alt=""
                                            />

                                            <div className="card-body">

                                                <h4>

                                                    {ve.ten_phim}

                                                </h4>

                                                <hr />

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

                                                    <b>Ngày:</b>

                                                    {" "}

                                                    {ve.ngay_chieu?.split("T")[0]}

                                                </p>

                                                <p>

                                                    <b>Giờ:</b>

                                                    {" "}

                                                    {ve.gio_bat_dau?.substring(0,5)}

                                                </p>

                                                <p>

                                                    <b>Tổng tiền:</b>

                                                    {" "}

                                                    {Number(
                                                        ve.tong_tien
                                                    ).toLocaleString()}

                                                    đ

                                                </p>

                                                <Link
                                                    to={`/chi-tiet-ve/${ve.ma_dat_ve}`}
                                                    className="btn btn-danger w-100"
                                                >

                                                    Chi tiết vé

                                                </Link>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </div>

        </>

    );

}

export default VeCuaToi;