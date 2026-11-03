import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaImage,
    FaSave,
    FaArrowLeft
} from "react-icons/fa";

function EditNews() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [tieu_de, setTieuDe] = useState("");
    const [noi_dung, setNoiDung] = useState("");
    const [loai_tin, setLoaiTin] = useState("Tin tức");
    const [hinh_anh, setHinhAnh] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {

        axios
            .get(`http://localhost:5000/api/tin-tuc/${id}`)
            .then((res) => {

                const item = res.data;

                setTieuDe(item.tieu_de);

                setNoiDung(item.noi_dung);

                setLoaiTin(item.loai_tin);

                setPreview(
                    `http://localhost:5000${item.hinh_anh}`
                );

            })
            .catch((err) => {

                console.log(err);

            });

    }, [id]);

    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setHinhAnh(file);

        setPreview(URL.createObjectURL(file));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("tieu_de", tieu_de);
        formData.append("noi_dung", noi_dung);
        formData.append("loai_tin", loai_tin);

        if (hinh_anh) {

            formData.append("hinh_anh", hinh_anh);

        }

        axios
            .put(
                `http://localhost:5000/api/tin-tuc/${id}`,
                formData
            )
            .then(() => {

                alert("Cập nhật thành công!");

                navigate("/admin/news");

            })
            .catch((err) => {

                console.log(err);

                alert("Có lỗi xảy ra!");

            });

    };

    return (

        <div
            className="container-fluid py-4"
            style={{
                background: "#f4f6f9",
                minHeight: "100vh"
            }}
        >

            <div
                className="card border-0 shadow"
                style={{
                    maxWidth: "900px",
                    margin: "auto",
                    borderRadius: "20px"
                }}
            >

                <div
                    className="card-header bg-white border-0"
                    style={{
                        borderTopLeftRadius: "20px",
                        borderTopRightRadius: "20px"
                    }}
                >

                    <h2
                        className="fw-bold"
                        style={{
                            color: "#dc3545"
                        }}
                    >
                        Cập nhật Tin tức & Ưu đãi
                    </h2>

                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">

                            <label className="fw-bold mb-2">

                                Tiêu đề

                            </label>

                            <input
                                className="form-control"
                                value={tieu_de}
                                onChange={(e) =>
                                    setTieuDe(e.target.value)
                                }
                            />

                        </div>

                        <div className="mb-4">

                            <label className="fw-bold mb-2">

                                Loại bài viết

                            </label>

                            <select
    className="form-select"
    value={loai_tin}
    onChange={(e) => setLoaiTin(e.target.value)}
>
    <option value="tin_tuc">Tin tức</option>
    <option value="uu_dai">Ưu đãi</option>
</select>

                        </div>

                        <div className="mb-4">

                            <label className="fw-bold mb-3">

                                Hình ảnh

                            </label>

                            <div
                                className="border rounded text-center p-3 mb-3"
                                style={{
                                    background: "#fafafa"
                                }}
                            >

                                {

                                    preview ?

                                        <img
                                            src={preview}
                                            alt=""
                                            style={{
                                                width: "100%",
                                                maxHeight: "320px",
                                                objectFit: "cover",
                                                borderRadius: "10px"
                                            }}
                                        />

                                    :

                                        <div
                                            style={{
                                                height: "220px",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                color: "#999"
                                            }}
                                        >

                                            <FaImage
                                                size={60}
                                            />

                                            <p className="mt-3">

                                                Chưa có hình ảnh

                                            </p>

                                        </div>

                                }

                            </div>

                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleImage}
                            />

                        </div>

                        <div className="mb-4">

                            <label className="fw-bold mb-2">

                                Nội dung

                            </label>

                            <textarea
                                rows="10"
                                className="form-control"
                                value={noi_dung}
                                onChange={(e) =>
                                    setNoiDung(e.target.value)
                                }
                            />

                        </div>

                        <div className="d-flex justify-content-end">

                            <button
                                type="button"
                                className="btn btn-secondary rounded-pill me-3 px-4"
                                onClick={() =>
                                    navigate("/admin/news")
                                }
                            >

                                <FaArrowLeft className="me-2" />

                                Quay lại

                            </button>

                            <button
                                className="btn btn-danger rounded-pill px-4"
                            >

                                <FaSave className="me-2" />

                                Cập nhật

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditNews;