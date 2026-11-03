import { useEffect, useState } from "react";
import axios from "axios";
import {
    FaTicketAlt,
    FaMoneyBillWave,
    FaUsers,
    FaFilm
} from "react-icons/fa";
import RevenueChart from "../components/RevenueChart";
import TopMovies from "../components/TopMovies";
import TopCustomer from "../components/TopCustomer";
import MoviePieChart from "../components/MoviePieChart";
function Dashboard() {

    const [cards, setCards] = useState({
        tongVe: 0,
        doanhThu: 0,
        thanhVien: 0,
        phimDangChieu: 0
    });

    const [type, setType] = useState("day");

    useEffect(() => {

        loadCards(type);

    }, [type]);

    const loadCards = async (value) => {

        try {

            const res = await axios.get(
                `http://localhost:5000/api/dashboard/cards?type=${value}`
            );

            setCards(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const cardStyle = {
        border: "none",
        borderRadius: "18px",
        boxShadow: "0 8px 25px rgba(0,0,0,.08)"
    };

    const iconStyle = (color) => ({
        width: 65,
        height: 65,
        borderRadius: 15,
        background: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontSize: 28
    });

    return (

        <div className="container-fluid py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Dashboard
                    </h2>

                    <small className="text-muted">
                        Thống kê hệ thống đặt vé xem phim
                    </small>

                </div>

                <select
                    className="form-select"
                    style={{ width: 220 }}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >

                    <option value="day">
                        Hôm nay
                    </option>

                    <option value="week">
                        Tuần này
                    </option>

                    <option value="month">
                        Tháng này
                    </option>

                    <option value="quarter">
                        Quý này
                    </option>

                    <option value="year">
                        Năm nay
                    </option>

                </select>

            </div>

            <div className="row">

                {/* Vé */}

                <div className="col-lg-3 mb-4">

                    <div className="card" style={cardStyle}>

                        <div className="card-body d-flex justify-content-between align-items-center">

                            <div>

                                <small className="text-muted">
                                    Vé đã bán
                                </small>

                                <h2 className="fw-bold mt-2">
                                    {cards.tongVe}
                                </h2>

                            </div>

                            <div
                                style={iconStyle("linear-gradient(135deg,#ff4d4f,#ff7875)")}
                            >

                                <FaTicketAlt />

                            </div>

                        </div>

                    </div>

                </div>

                {/* Doanh thu */}

                <div className="col-lg-3 mb-4">

                    <div className="card" style={cardStyle}>

                        <div className="card-body d-flex justify-content-between align-items-center">

                            <div>

                                <small className="text-muted">
                                    Doanh thu
                                </small>

                                <h2 className="fw-bold mt-2">

                                    {Number(cards.doanhThu).toLocaleString()}đ

                                </h2>

                            </div>

                            <div
                                style={iconStyle("linear-gradient(135deg,#28a745,#20c997)")}
                            >

                                <FaMoneyBillWave />

                            </div>

                        </div>

                    </div>

                </div>

                {/* Thành viên */}

                <div className="col-lg-3 mb-4">

                    <div className="card" style={cardStyle}>

                        <div className="card-body d-flex justify-content-between align-items-center">

                            <div>

                                <small className="text-muted">
                                    Thành viên
                                </small>

                                <h2 className="fw-bold mt-2">

                                    {cards.thanhVien}

                                </h2>

                            </div>

                            <div
                                style={iconStyle("linear-gradient(135deg,#007bff,#00c6ff)")}
                            >

                                <FaUsers />

                            </div>

                        </div>

                    </div>

                </div>

                {/* Phim */}

                <div className="col-lg-3 mb-4">

                    <div className="card" style={cardStyle}>

                        <div className="card-body d-flex justify-content-between align-items-center">

                            <div>

                                <small className="text-muted">
                                    Phim đang chiếu
                                </small>

                                <h2 className="fw-bold mt-2">

                                    {cards.phimDangChieu}

                                </h2>

                            </div>

                            <div
                                style={iconStyle("linear-gradient(135deg,#6f42c1,#8e44ad)")}
                            >

                                <FaFilm />

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            
<div className="row mt-4">

    <div className="col-lg-8">

        <RevenueChart
            type={type}
        />

    </div>

    <div className="col-lg-4">

        <TopMovies/>

    </div>
<TopCustomer />
<MoviePieChart />
</div>
        </div>
        

    );

}

export default Dashboard;