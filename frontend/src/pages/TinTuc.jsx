import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


function TinTuc() {

    const [news, setNews] = useState([]);
    const [type, setType] = useState("all");

    useEffect(() => {

        axios
            .get("http://localhost:5000/api/tin-tuc")
            .then(res => setNews(res.data))
            .catch(err => console.log(err));

    }, []);

    const data =
        type === "all"
            ? news
            : news.filter(item => item.loai_tin === type);

    return (
        <>
            <Navbar />

            <div className="container py-5">

                <h2 className="fw-bold text-center mb-4">
                    Tin tức & Ưu đãi
                </h2>

                <div className="text-center mb-4">

                    <button
                        className={`btn me-2 ${type==="all"?"btn-danger":"btn-outline-danger"}`}
                        onClick={()=>setType("all")}
                    >
                        Tất cả
                    </button>

                    <button
                        className={`btn me-2 ${type==="tin_tuc"?"btn-danger":"btn-outline-danger"}`}
                        onClick={()=>setType("tin_tuc")}
                    >
                        Tin tức
                    </button>

                    <button
                        className={`btn ${type==="uu_dai"?"btn-danger":"btn-outline-danger"}`}
                        onClick={()=>setType("uu_dai")}
                    >
                        Ưu đãi
                    </button>

                </div>

                <div className="row">

                    {data.map(item => (

                        <div
                            className="col-lg-4 mb-4"
                            key={item.ma_tin_tuc}
                        >

                            <div className="card shadow h-100">

                                <img
                                    src={`http://localhost:5000${item.hinh_anh}`}
                                    className="card-img-top"
                                    style={{
                                        height:220,
                                        objectFit:"cover"
                                    }}
                                    alt=""
                                />

                                <div className="card-body">

                                    <span
                                        className={
                                            item.loai_tin==="uu_dai"
                                            ?"badge bg-success"
                                            :"badge bg-primary"
                                        }
                                    >
                                        {item.loai_tin==="uu_dai"
                                            ?"Ưu đãi"
                                            :"Tin tức"}
                                    </span>

                                    <h5 className="mt-3">

                                        {item.tieu_de}

                                    </h5>

                                    <p className="text-muted">

                                        {item.noi_dung.substring(0,120)}...

                                    </p>

                                    <Link
                                        to={`/tin-tuc/${item.ma_tin_tuc}`}
                                        className="btn btn-danger"
                                    >
                                        Xem thêm
                                    </Link>

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

export default TinTuc;