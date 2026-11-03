import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";


import { layDanhSachPhim } from "../services/phimService";

function Home() {

    const [danhSachPhim, setDanhSachPhim] = useState([]);
    const [trangThai, setTrangThai] = useState("dang_chieu");

 useEffect(() => {

    layDanhSachPhim()
        .then((res) => {

            setDanhSachPhim(res.data);

        })
        .catch((err) => {

            console.log(err);

        });

}, []);
    const phimHienThi = danhSachPhim.filter(
        (phim) => phim.trang_thai === trangThai
    );

    return (
        <>
              

            <Navbar />

            <Banner />

            <div className="container my-5">

                <h2 className="text-center fw-bold mb-4">
                    DANH SÁCH PHIM
                </h2>

                <div className="text-center mb-5">

                    <button
                        className={
                            trangThai === "dang_chieu"
                                ? "btn btn-danger me-2"
                                : "btn btn-outline-danger me-2"
                        }
                        onClick={() =>
                            setTrangThai("dang_chieu")
                        }
                    >
                        Đang chiếu
                    </button>

                    <button
                        className={
                            trangThai === "sap_chieu"
                                ? "btn btn-danger"
                                : "btn btn-outline-danger"
                        }
                        onClick={() =>
                            setTrangThai("sap_chieu")
                        }
                    >
                        Sắp chiếu
                    </button>

                </div>

        <div className="row g-4">

    {phimHienThi.length > 0 ? (

        phimHienThi.map((phim) => (

            <div
                className="col-lg-3 col-md-6 col-sm-12"
                key={phim.ma_phim}
            >
                <MovieCard phim={phim} />
            </div>

        ))

    ) : (

        <div className="text-center py-5">
            <h4>Rạp này hiện chưa có phim.</h4>
        </div>

    )}

</div>


            </div>
             <Footer />
        </>
    );
}

export default Home;