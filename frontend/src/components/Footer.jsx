import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
    return (
        <footer
            className="text-light mt-5"
            style={{
                background: "#111827",
            }}
        >
            <div className="container py-5">

                <div className="row">

                    {/* Logo */}

                    <div className="col-lg-4 mb-4">

                        <h3 className="fw-bold text-warning">
                            🎬 CườngCV
                        </h3>

                        <p className="text-secondary mt-3">
                            Hệ thống đặt vé xem phim trực tuyến nhanh chóng,
                            tiện lợi và hiện đại.
                        </p>

                        <div className="d-flex gap-3 mt-4">

                            <a
                                href="#"
                                className="text-white fs-4"
                            >
                                <FaFacebookF />
                            </a>

                            <a
                                href="#"
                                className="text-white fs-4"
                            >
                                <FaInstagram />
                            </a>

                            <a
                                href="#"
                                className="text-white fs-4"
                            >
                                <FaYoutube />
                            </a>

                        </div>

                    </div>

                    {/* Menu */}

                    <div className="col-lg-4 mb-4">

                        <h5 className="fw-bold mb-3">
                            Liên kết nhanh
                        </h5>

                        <ul className="list-unstyled">

                            <li className="mb-2">
                                <Link
                                    to="/"
                                    className="text-decoration-none text-secondary"
                                >
                                    Trang chủ
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link
                                    to="/phim"
                                    className="text-decoration-none text-secondary"
                                >
                                    Phim
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link
                                    to="/lich-chieu"
                                    className="text-decoration-none text-secondary"
                                >
                                    Lịch chiếu
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link
                                    to="/rap"
                                    className="text-decoration-none text-secondary"
                                >
                                    Rạp chiếu
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* Liên hệ */}

                    <div className="col-lg-4">

                        <h5 className="fw-bold mb-3">
                            Liên hệ
                        </h5>

                        <p className="text-secondary">
                            <FaMapMarkerAlt className="me-2 text-danger" />
                            123 Nguyễn Huệ, Quận 1, TP.HCM
                        </p>

                        <p className="text-secondary">
                            <FaPhone className="me-2 text-success" />
                            1900 1234
                        </p>

                        <p className="text-secondary">
                            <FaEnvelope className="me-2 text-warning" />
                            support@galaxymovie.vn
                        </p>

                    </div>

                </div>

            </div>

            <div
                className="text-center py-3"
                style={{
                    background: "#0b1220",
                    borderTop: "1px solid #333",
                }}
            >
                © 2026 CườngCV Movie. All Rights Reserved.
            </div>

        </footer>
    );
}

export default Footer;