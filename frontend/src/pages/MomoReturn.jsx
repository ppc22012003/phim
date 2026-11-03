import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";


function MomoReturn() {

    const navigate =
        useNavigate();

    const [message, setMessage] =
        useState(
            "Đang kiểm tra thanh toán MoMo..."
        );

    useEffect(() => {

        const kiemTraThanhToan =
            async () => {

                try {

                    // =========================
                    // LẤY ORDER ID
                    // =========================

                    const orderId =
                        localStorage.getItem(
                            "momoOrderId"
                        );

                    const paymentDataString =
                        localStorage.getItem(
                            "paymentData"
                        );

                    const userString =
                        localStorage.getItem(
                            "user"
                        );


                    console.log(
                        "===== KIỂM TRA MOMO ====="
                    );

                    console.log(
                        "ORDER ID:",
                        orderId
                    );


                    if (
                        !orderId ||
                        !paymentDataString ||
                        !userString
                    ) {

                        setMessage(
                            "Không tìm thấy thông tin thanh toán."
                        );

                        return;

                    }


                    const paymentData =
                        JSON.parse(
                            paymentDataString
                        );

                    const user =
                        JSON.parse(
                            userString
                        );


                    // =========================
                    // HỎI MOMO
                    // =========================

                    setMessage(
                        "Đang xác nhận giao dịch..."
                    );


                    const response =
                        await axios.post(

                            "http://localhost:5000/api/momo-check-status",

                            {
                                orderId
                            }

                        );


                    console.log(
                        "MOMO STATUS:",
                        response.data
                    );


                    const resultCode =
                        response.data.resultCode;


                    // =========================
                    // THANH TOÁN THÀNH CÔNG
                    // =========================

                    if (
                        Number(resultCode) === 0
                    ) {

                        setMessage(
                            "Thanh toán thành công. Đang lưu vé..."
                        );


                        console.log(
                            "MOMO THANH TOÁN THÀNH CÔNG"
                        );


                        // =========================
                        // LƯU VÉ
                        // =========================

                        const datVe =
                            await axios.post(

                                "http://localhost:5000/api/dat-ve",

                                {

                                    ma_tai_khoan:
                                        user.ma_tai_khoan,

                                    ma_suat_chieu:
                                        paymentData.maSuatChieu,

                                    gheDaChon:
                                        paymentData.seats,

                                    tong_tien:
                                        paymentData.tongTien,

                                    gioHangCombo:
                                        paymentData.gioHangCombo,

                                    phuong_thuc_thanh_toan:
                                        "MOMO",

                                    momo_order_id:
                                        orderId

                                }

                            );


                        console.log(
                            "ĐẶT VÉ:",
                            datVe.data
                        );


                        localStorage.removeItem(
                            "paymentData"
                        );

                        localStorage.removeItem(
                            "momoOrderId"
                        );


                        setMessage(
                            "Thanh toán thành công!"
                        );


                        setTimeout(() => {

                            navigate("/");

                        }, 1000);


                        return;

                    }


                    // =========================
                    // CHƯA THANH TOÁN
                    // =========================

                    setMessage(
                        response.data.message ||
                        "Thanh toán chưa hoàn tất."
                    );


                } catch (error) {

                    console.error(
                        "MOMO CHECK ERROR:",
                        error.response?.data ||
                        error
                    );


                    setMessage(
                        "Không kiểm tra được trạng thái thanh toán."
                    );

                }

            };


        kiemTraThanhToan();

    }, [navigate]);


    return (

        <div
            className="container py-5 text-center"
        >

            <div className="spinner-border mb-4">
            </div>

            <h3>
                {message}
            </h3>

        </div>

    );

}


export default MomoReturn;