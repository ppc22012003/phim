import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        ho_ten: "",
        email: "",
        so_dien_thoai: "",
        mat_khau: "",
        xac_nhan: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (form.mat_khau !== form.xac_nhan) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {

            const res = await axios.post(
                "http://localhost:5000/api/register",
                {
                    ho_ten: form.ho_ten,
                    email: form.email,
                    so_dien_thoai: form.so_dien_thoai,
                    mat_khau: form.mat_khau,
                }
            );

            alert(res.data.message);

            navigate("/login");

        } catch (err) {

            alert(
                err.response?.data?.message || "Đăng ký thất bại"
            );

        }
    };

    return (
        <div className="register-page">

            <div className="register-box">

                <h2>ĐĂNG KÝ</h2>

                <p>Tạo tài khoản để đặt vé xem phim</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="ho_ten"
                        placeholder="Họ và tên"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="so_dien_thoai"
                        placeholder="Số điện thoại"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="mat_khau"
                        placeholder="Mật khẩu"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="xac_nhan"
                        placeholder="Xác nhận mật khẩu"
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Đăng ký
                    </button>

                </form>

                <div className="login-link">

                    Đã có tài khoản?

                    <Link to="/login">
                        Đăng nhập
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Register;