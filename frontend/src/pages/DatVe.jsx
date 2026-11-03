
import {
    useParams,
    useNavigate
} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./DatVe.css";

function DatVe() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [showtime, setShowtime] = useState(null);
    const [ghe, setGhe] = useState([]);
    const [chonGhe, setChonGhe] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            const resShowtime =
                await axios.get(
                    `http://localhost:5000/api/thong-tin-dat-ve/${id}`
                );

            setShowtime(resShowtime.data);

            const resGhe =
                await axios.get(
                    `http://localhost:5000/api/dat-ve/${id}`
                );

            setGhe(resGhe.data);

        } catch (err) {

            console.log(err);

        }

    };

    const toggleSeat = (seat) => {

    const daTonTai = chonGhe.find(
        item => item.ma_ghe === seat.ma_ghe
    );

    if (daTonTai) {

        setChonGhe(
            chonGhe.filter(
                item => item.ma_ghe !== seat.ma_ghe
            )
        );

    } else {

        setChonGhe([
            ...chonGhe,
            seat
        ]);

    }

};
    const handleCheckout = () => {

   const user =
    JSON.parse(
        localStorage.getItem("user")
    );

if (!user) {
    alert("Vui lòng đăng nhập");
    navigate("/login");
    return;
}

    if (chonGhe.length === 0) {

        alert(
            "Vui lòng chọn ghế"
        );

        return;
    }

    console.log(
        "Ghế đã chọn:",
        chonGhe
    );

    const tongTien =
    chonGhe.reduce(
        (sum, seat) =>
            sum + Number(seat.gia_ghe),
        0
    );

navigate(
    `/thanh-toan/${id}`,
    {
        state: {
            seats: chonGhe,
            maSuatChieu: id,
            tongTien
        }
    }
);

};
const renderSeat = (seat, index) => {

    let seatClass = "seat seat-normal";

    if (seat.loai_ghe === "Vip") {
        seatClass = "seat seat-vip";
    }

    if (seat.loai_ghe === "Doi") {

        if(index >= 5){
            return null;
        }

        seatClass = "seat seat-double";

    }

    if (seat.da_dat === 1) {
        seatClass = "seat seat-booked";
    }

    if (
        chonGhe.some(
            item => item.ma_ghe === seat.ma_ghe
        )
    ) {
        seatClass = "seat seat-selected";
    }

    return (

        <button
            key={seat.ma_ghe}
            className={seatClass}
            disabled={seat.da_dat===1}
            onClick={()=>
                toggleSeat({
                    ma_ghe:seat.ma_ghe,
                    so_ghe:seat.so_ghe,
                    loai_ghe:seat.loai_ghe,
                    gia_ghe:
                        seat.loai_ghe==="Vip"
                        ?120000
                        :seat.loai_ghe==="Doi"
                        ?180000
                        :100000
                })
            }
        >
            {seat.so_ghe.substring(1)}
        </button>

    );

};
const renderPhong1 = (rows) => {

    return rows.map(([row, seats]) => (

        <div key={row}>

            {row === "E" && (
                <div className="horizontal-aisle"></div>
            )}

            <div className="seat-row">

                <div className="row-label">
                    {row}
                </div>

                <div className="seat-group">

    {seats.map((seat, index) => renderSeat(seat, index))}
        </div>                

    </div>

 </div>

        

    ));

};
const renderPhong2 = (rows) => {

    return rows.map(([row, seats]) => {

        const leftSeats = seats.slice(0, 5);
        const rightSeats = seats.slice(5);

        return (

            <div key={row}>

                {row === "E" && (
                    <div className="horizontal-aisle"></div>
                )}

                <div className="seat-row">

                    <div className="row-label">
                        {row}
                    </div>

                    <div className="seat-group">
    {leftSeats.map((seat,index)=>renderSeat(seat,index))}
</div>

<div className="middle-aisle"></div>

<div className="seat-group">
    {rightSeats.map((seat,index)=>renderSeat(seat,index+5))}
</div>

                </div>

            </div>

        );

    });

};
const renderPhong3 = (rows) => {

    return rows.map(([row, seats], index) => {

        let padding = "0px";

        switch (row) {

            case "A":
                padding = "120px";
                break;

            case "B":
                padding = "90px";
                break;

            case "C":
                padding = "60px";
                break;

            case "D":
                padding = "30px";
                break;

            case "E":
                padding = "30px";
                break;

            case "F":
                padding = "60px";
                break;

            case "G":
                padding = "90px";
                break;

            case "H":
                padding = "120px";
                break;

            default:
                padding = "0px";

        }

        return (

            <div key={row}>

                {row === "E" && (
                    <div className="horizontal-aisle"></div>
                )}

                <div className="seat-row">

    <div className="row-label">
        {row}
    </div>

    <div
        className="seat-wrapper"
        style={{
            paddingLeft: padding
        }}
    >

        <div className="seat-group">

            {
                seats.map((seat,index)=>
                    renderSeat(seat,index)
                )
            }

        </div>

    </div>

</div>

            </div>

        );

    });

};
const rows = Object.entries(

    ghe.reduce((acc, seat) => {

        const row = seat.so_ghe.charAt(0);

        if (!acc[row]) {
            acc[row] = [];
        }

        acc[row].push(seat);

        return acc;

    }, {})

);
    if (!showtime) {
        return <h2 className="text-center mt-5">Đang tải...</h2>;
    }

    return (

        <div className="booking-page">

            <div className="container">

                <h1 className="movie-title">
                    {showtime.ten_phim}
                </h1>

                <div className="booking-info">

                    <p>
                        <strong>Phòng:</strong>
                        {" "}
                        {showtime.ten_phong}
                    </p>

                    <p>
                        <strong>Ngày:</strong>
                        {" "}
                        {showtime.ngay_chieu?.split("T")[0]}
                    </p>

                    <p>
                        <strong>Giờ:</strong>
                        {" "}
                        {showtime.gio_bat_dau?.substring(0, 5)}
                    </p>

                </div>

                <div className="screen-wrapper">

                    <div className="screen"></div>

                    <div className="screen-text">
                        MÀN HÌNH
                    </div>

                </div>
                <div className="entrance">

    <div>

         LỐI VÀO ➡

    </div>

    <div>

        LỐI RA ➡

    </div>

</div>

 <div className="seat-area">

{
    showtime.ten_phong === "Phòng 1" &&
    renderPhong1(rows)
}

{
    showtime.ten_phong === "Phòng 2" &&
    renderPhong2(rows)
}

{
    showtime.ten_phong === "Phòng 3" &&
    renderPhong3(rows)
}

</div>




<div className="legend">

    <div className="legend-item">
        <div className="legend-box normal"></div>
        <span>Ghế thường</span>
    </div>

    <div className="legend-item">
        <div className="legend-box vip"></div>
        <span>Ghế VIP</span>
    </div>

    <div className="legend-item">
        <div className="legend-box double"></div>
        <span>Ghế đôi</span>
    </div>

    <div className="legend-item">
        <div className="legend-box selected"></div>
        <span>Đang chọn</span>
    </div>

    <div className="legend-item">
        <div className="legend-box booked"></div>
        <span>Đã đặt</span>
    </div>

</div>

                <div className="payment-box">

    <h3>
        Ghế đã chọn: {chonGhe.length}
    </h3>

    <div className="d-flex justify-content-center gap-3 mt-4">

        <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate(-1)}
        >
            ← Trở lại
        </button>

        <button
            className="btn btn-danger btn-lg"
            onClick={handleCheckout}
        >
            Tiếp tục thanh toán →
        </button>

    </div>

</div>

            </div>

        </div>

    );

}

export default DatVe;

