import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";




function ThanhToan() {
    
const [dangThanhToan, setDangThanhToan] = useState(false);
const thanhToanMomo = async () => {

    if (dangThanhToan) {
        return;
    }

    setDangThanhToan(true);

    try {

        localStorage.setItem(
            "paymentData",
            JSON.stringify({
                ma_tai_khoan:
                    user.ma_tai_khoan,

                seats,

                maSuatChieu,

                tongTien:
                    tongThanhToan,

                gioHangCombo,

                phuongThuc:
                    "MOMO"
            })
        );

        console.log(
            "ĐANG TẠO THANH TOÁN MOMO..."
        );

        const res = await axios.post(

            "http://localhost:5000/api/momo-payment",

            {
                amount:
                    tongThanhToan
            }

        );

        console.log(
            "MOMO CREATE:",
            res.data
        );

        if (!res.data?.payUrl) {

            throw new Error(
                "MoMo không trả về payUrl"
            );

        }

        // =========================
        // LƯU ORDER ID
        // =========================

        localStorage.setItem(
            "momoOrderId",
            res.data.orderId
        );

        console.log(
            "MOMO ORDER ID:",
            res.data.orderId
        );

        // =========================
        // MỞ MOMO
        // =========================

        window.location.href =
            res.data.payUrl;

    } catch (error) {

        console.error(
            "MOMO CREATE ERROR:",
            error.response?.data ||
            error
        );

        setDangThanhToan(false);

        alert(
            "Không tạo được thanh toán MoMo"
        );

    }

};
    const [maDon] = useState("DV" + Date.now());

    const soTaiKhoan = "123456789";
     const tenTaiKhoan = "WEB DAT VE XEM PHIM";
    const maNganHang = "970422"; // MB Bank

    const location = useLocation();
    const navigate = useNavigate();

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const {
        seats = [],
        maSuatChieu,
        tongTien = 0
    } = location.state || {};

    const [phuongThuc, setPhuongThuc] =
        useState("QR");
    const [combos, setCombos] = useState([]);

    const [gioHangCombo, setGioHangCombo] = useState([]);
const tangCombo = (combo) => {

    console.log("========== CHỌN COMBO ==========");
    console.log("COMBO:", combo);

    const tonTai = gioHangCombo.find(
        item =>
            Number(item.ma_combo) ===
            Number(combo.ma_combo)
    );

    if (tonTai) {

        setGioHangCombo(prev =>
            prev.map(item =>
                Number(item.ma_combo) ===
                Number(combo.ma_combo)
                    ? {
                        ...item,
                        soLuong:
                            Number(item.soLuong) + 1
                    }
                    : item
            )
        );

    } else {

        setGioHangCombo(prev => [

            ...prev,

            {
                ma_combo:
                    combo.ma_combo,

                ten_combo:
                    combo.ten_combo,

                gia:
                    Number(combo.gia),

                soLuong: 1
            }

        ]);

    }

};
const giamCombo = (id) => {

    const tonTai = gioHangCombo.find(
        item => item.ma_combo === id
    );

    if (!tonTai) return;

    if (tonTai.soLuong === 1) {

        setGioHangCombo(

            gioHangCombo.filter(
                item => item.ma_combo !== id
            )

        );

    } else {

        setGioHangCombo(

            gioHangCombo.map(item =>

                item.ma_combo === id
                    ? {
                        ...item,
                        soLuong: item.soLuong - 1
                    }
                    : item

            )

        );

    }

};
    
useEffect(() => {

    axios
        .get("http://localhost:5000/api/combo")
        .then((res) => {

            setCombos(res.data);

        })
        .catch((err) => {

            console.log(err);

        });

}, []);
    // Nếu vào trực tiếp URL
    if (!location.state) {

        return (
            <div className="container py-5 text-center">

                <h3>
                    Không có dữ liệu đặt vé
                </h3>

            </div>
        );

    }

    // Gộp ghế theo loại

    const gheThuong =
        seats.filter(
            seat =>
                !seat.loai_ghe ||
                seat.loai_ghe === "Thuong"
        );

    const gheVip =
        seats.filter(
            seat =>
                seat.loai_ghe === "Vip"
        );

    const gheDoi =
        seats.filter(
            seat =>
                seat.loai_ghe === "Doi"
        );
        const tongTienCombo =
    gioHangCombo.reduce(
        (tong, item) =>
            tong + item.gia * item.soLuong,
        0
    );

const tongThanhToan =
    tongTien + tongTienCombo;

const qrUrl =
    `https://img.vietqr.io/image/${maNganHang}-${soTaiKhoan}-compact2.png` +
    `?amount=${tongThanhToan}` +
    `&addInfo=${maDon}` +
    `&accountName=${encodeURIComponent(tenTaiKhoan)}`;

   const handleDatVe = async () => {

    try {

        await axios.post(
            "http://localhost:5000/api/dat-ve",
            {
                ma_tai_khoan: user.ma_tai_khoan,
                ma_suat_chieu: maSuatChieu,
                gheDaChon: seats,
                tong_tien: tongThanhToan,
                gioHangCombo: gioHangCombo,
                phuong_thuc_thanh_toan: phuongThuc
            }
        );

        alert("Thanh toán thành công!");

        navigate("/");

    } catch (err) {

        console.log(err);

        alert("Thanh toán thất bại!");

    }

};

    return (

        <div
            className="container py-5"
            style={{
                maxWidth: "1100px"
            }}
        >

            <h2
                className="fw-bold mb-5"
                style={{
                    color: "#374151"
                }}
            >
                THÔNG TIN THANH TOÁN
            </h2>

            {/* THÔNG TIN KHÁCH */}

            <div className="row mb-5">

                <div className="col-md-4">

                    <h6 className="text-muted">
                        Họ tên
                    </h6>

                    <h5>
                        {user?.ho_ten}
                    </h5>

                </div>

                <div className="col-md-4">

                    <h6 className="text-muted">
                        Số điện thoại
                    </h6>

                    <h5>
                        {user?.so_dien_thoai}
                    </h5>

                </div>

                <div className="col-md-4">

                    <h6 className="text-muted">
                        Email
                    </h6>

                    <h5>
                        {user?.email}
                    </h5>

                </div>


            </div>
<div className="container mt-4">

    <div className="row">

        {/* ================== BÊN TRÁI ================== */}

        <div className="col-lg-8">

            {/* Thông tin vé */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h4 className="mb-4">
                        THÔNG TIN VÉ
                    </h4>

                    {gheThuong.length > 0 && (

                        <div className="mb-4">

                            <h5>Ghế thường</h5>

                            <p>

                                {gheThuong
                                    .map(seat => seat.so_ghe)
                                    .join(", ")}

                            </p>

                        </div>

                    )}

                    {gheVip.length > 0 && (

                        <div className="mb-4">

                            <h5>Ghế VIP</h5>

                            <p>

                                {gheVip
                                    .map(seat => seat.so_ghe)
                                    .join(", ")}

                            </p>

                        </div>

                    )}

                    {gheDoi.length > 0 && (

                        <div className="mb-4">

                            <h5>Ghế đôi</h5>

                            <p>

                                {gheDoi
                                    .map(seat => seat.so_ghe)
                                    .join(", ")}

                            </p>

                        </div>

                    )}

                </div>

            </div>

            {/* Combo */}

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <h4 className="mb-4">
                        🍿 Chọn Combo
                    </h4>

                    <div className="row">

                        {

                            combos.map(combo => {

                                const daChon = gioHangCombo.find(
                                    item => item.ma_combo === combo.ma_combo
                                );

                                return (

                                    <div
                                        className="col-md-4 mb-4"
                                        key={combo.ma_combo}
                                    >

                                        <div className="card h-100 shadow-sm">

                                            <img
                                                src={`http://localhost:5000${combo.hinh_anh}`}
                                                className="card-img-top"
                                                alt={combo.ten_combo}
                                            />

                                            <div className="card-body text-center">

                                                <h5>
                                                    {combo.ten_combo}
                                                </h5>

                                                <p>
                                                    {combo.mo_ta}
                                                </p>

                                                <h4 className="text-danger">
                                                    {Number(combo.gia).toLocaleString()}đ
                                                </h4>

                                                <div className="d-flex justify-content-center align-items-center mt-3">

                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => giamCombo(combo.ma_combo)}
                                                    >
                                                        -
                                                    </button>

                                                    <span className="mx-3 fs-5">
                                                        {daChon?.soLuong || 0}
                                                    </span>

                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => tangCombo(combo)}
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            })

                        }

                    </div>

                </div>

            </div>

        </div>

        {/* ================== BÊN PHẢI ================== */}

        <div className="col-lg-4">

            <div
                className="card shadow border-0 sticky-top"
                style={{ top: "20px" }}
            >

                <div className="card-body">

                    <h4 className="mb-4">
                        Thanh toán
                    </h4>

                    <div className="form-check mb-2">

                        <input
                            className="form-check-input"
                            type="radio"
                            checked={phuongThuc === "QR"}
                            onChange={() => setPhuongThuc("QR")}
                        />

                        <label className="form-check-label">
                            QR Code
                        </label>

                    </div>

                    <div className="form-check mb-2">

                        <input
                            className="form-check-input"
                            type="radio"
                            checked={phuongThuc === "MOMO"}
                            onChange={() => setPhuongThuc("MOMO")}
                        />

                        <label className="form-check-label">
                            MoMo
                        </label>

                    </div>

                    <div className="form-check mb-3">

                        <input
                            className="form-check-input"
                            type="radio"
                            checked={phuongThuc === "ZALOPAY"}
                            onChange={() => setPhuongThuc("ZALOPAY")}
                        />

                        <label className="form-check-label">
                            ZaloPay
                        </label>

                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">

                        <span>Tiền vé</span>

                        <strong>
                            {tongTien.toLocaleString()} đ
                        </strong>

                    </div>

                    <div className="d-flex justify-content-between mt-2">

                        <span>Tiền combo</span>

                        <strong>
                            {tongTienCombo.toLocaleString()} đ
                        </strong>

                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">

                        <h5>Tổng cộng</h5>

                        <h4 className="text-danger">
                            {tongThanhToan.toLocaleString()} đ
                        </h4>
                        

                    </div>
                            <hr />

        {phuongThuc === "QR" && (

    <>

        <hr />

        <h4 className="text-center mb-3">
            Quét mã QR để thanh toán
        </h4>

        <div className="text-center">

            <img
                src={qrUrl}
                alt="QR Thanh toán"
                style={{
                    width: "260px"
                }}
            />

        </div>

        <div className="mt-3">

            <p>
                <strong>Ngân hàng:</strong> MB Bank
            </p>

            <p>
                <strong>Số tài khoản:</strong> {soTaiKhoan}
            </p>

            <p>
                <strong>Chủ tài khoản:</strong> {tenTaiKhoan}
            </p>

            <p>
                <strong>Nội dung:</strong> {maDon}
            </p>

        </div>

    </>

)}

                   <div className="d-grid gap-2 mt-4">

    <button
        className="btn btn-outline-secondary"
        onClick={() => navigate(-1)}
    >
        ← Trở lại
    </button>

   <button
    className="btn btn-danger"
    onClick={() => {

        if (phuongThuc === "MOMO") {

            thanhToanMomo();

        } else {

            handleDatVe();

        }

    }}
>
    XÁC NHẬN THANH TOÁN
</button>
 {/* =========================
        KIỂM TRA MOMO
    ========================= */}

    {phuongThuc === "MOMO" && (

        <button
            className="btn btn-success"
            onClick={() =>
                navigate("/momo-return")
            }
        >
            Tôi đã thanh toán MoMo - Kiểm tra giao dịch
        </button>

    )}

</div>

                </div>

            </div>

        </div>

    </div>

</div>
</div>

    );

}

export default ThanhToan;