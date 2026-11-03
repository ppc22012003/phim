import { useState } from 'react';
import axios from 'axios';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


const handleLogin = async (e) => {

    e.preventDefault();

    try {

        const res = await axios.post(
            'http://localhost:5000/api/login',
            {
                email,
                password
            }
        );

        console.log("DATA LOGIN:", res.data);

        localStorage.setItem(
            'user',
            JSON.stringify(res.data)
        );

        // Lưu ID người dùng
        localStorage.setItem(
            'user_id',
            res.data.ma_nguoi_dung
        );

        alert('Đăng nhập thành công');

        const redirectUrl =
            localStorage.getItem(
                "redirect_after_login"
            );

        if (redirectUrl) {

            localStorage.removeItem(
                "redirect_after_login"
            );

            window.location.href =
                redirectUrl;

            return;
        }

        if (res.data.role === 'quan_tri') {

            window.location.href =
                '/admin';

        } else {

            window.location.href =
                '/';

        }

    } catch (err) {

        console.error(err);

        alert(
            err.response?.data?.message ||
            'Đăng nhập thất bại'
        );

    }

};



    return (

        <div className="container mt-5">

            <div
                className="card shadow p-4 mx-auto"
                style={{ maxWidth: '500px' }}
            >

                <h2 className="text-center mb-4">
                    Đăng nhập
                </h2>

                <form onSubmit={handleLogin}>

                    <div className="mb-3">

                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Mật khẩu
                        </label>

                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                    >
                        Đăng nhập
                    </button>

                </form>

            </div>

        </div>

    );
}

export default Login;