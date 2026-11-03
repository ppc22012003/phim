import logo from "../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [raps, setRaps] = useState([]);
    const [selectedRap, setSelectedRap] = useState("");

    useEffect(() => {

        axios
            .get("http://localhost:5000/api/rap")
            .then((res) => {

                setRaps(res.data);

                const rapDaChon = localStorage.getItem("ma_rap");

                if (rapDaChon) {

                    setSelectedRap(rapDaChon);

                } else if (res.data.length > 0) {

                    setSelectedRap(res.data[0].ma_rap);
                    localStorage.setItem(
                        "ma_rap",
                        res.data[0].ma_rap
                    );

                }

            })
            .catch((err) => {

                console.log(err);

            });

    }, []);

    const handleChangeRap = (e) => {

        const id = e.target.value;

        setSelectedRap(id);

        localStorage.setItem("ma_rap", id);

        window.location.reload();

    };

    const handleLogout = () => {

        localStorage.removeItem("user");

        alert("Đăng xuất thành công");

        navigate("/");

        window.location.reload();

    };

   return (

<nav className="navbar-custom">

    <div className="navbar-left">

        <Link to="/">
            <img
                src={logo}
                alt="logo"
                className="logo-navbar"
            />
        </Link>

        <select
            className="rap-select"
            value={selectedRap}
            onChange={handleChangeRap}
        >

            {raps.map((rap)=>(

                <option
                    key={rap.ma_rap}
                    value={rap.ma_rap}
                >
                    📍 {rap.ten_rap}
                </option>

            ))}

        </select>

    </div>


    <div className="nav-menu">

        <Link to="/lich-chieu" className="nav-item-custom">
            LỊCH CHIẾU
        </Link>

        <Link to="/phim" className="nav-item-custom">
            PHIM
        </Link>

        {user && (

            <Link
                to="/ve-cua-toi"
                className="nav-item-custom"
            >
                VÉ CỦA TÔI
            </Link>

        )}

        <Link to="/rap" className="nav-item-custom">
            RẠP
        </Link>

        <Link to="/tin-tuc"     className="nav-item-custom">
            TIN MỚI & ƯU ĐÃI
        </Link>

    </div>


    <div className="navbar-right">

        {user ? (

           <>
    <span className="user-name">
        Xin chào, {user.ho_ten}
    </span>

    <div className="user-buttons">

        {user.vai_tro==="quan_tri" && (
            <Link
                to="/admin"
                className="btn-admin"
            >
                Admin
            </Link>
        )}

        <button
            className="btn-logout"
            onClick={handleLogout}
        >
            Đăng xuất
        </button>

    </div>
</>

        ) : (

           <div className="auth-buttons">
    <Link
        className="btn-login"
        to="/login"
    >
        Đăng nhập
    </Link>

    <Link
        className="btn-register"
        to="/register"
    >
        Đăng ký
    </Link>
</div>

        )}

    </div>

</nav>

);
}

export default Navbar;