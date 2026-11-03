import { useState } from "react";
import axios from "axios";

function AddMovie() {

    const [movie, setMovie] = useState({
        ten_phim: "",
        mo_ta: "",
        thoi_luong: "",
        the_loai: "",
        ngon_ngu: "",
        gioi_han_do_tuoi: "",
        trailer: "",
        ngay_khoi_chieu: "",
        trang_thai: "sap_chieu"
    });

    const [posterFile, setPosterFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setMovie({
            ...movie,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            let posterUrl = "";

            // Upload ảnh trước
            if (posterFile) {

                const formData = new FormData();

                formData.append(
                    "poster",
                    posterFile
                );

                const uploadRes =
                    await axios.post(
                        "http://localhost:5000/api/upload-poster",
                        formData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data"
                            }
                        }
                    );

                posterUrl =
                    uploadRes.data.poster;
            }

            // Thêm phim
            await axios.post(
                "http://localhost:5000/api/phim",
                {
                    ...movie,
                    poster: posterUrl
                }
            );

            alert(
                "Thêm phim thành công!"
            );

            window.location.href =
                "/admin/movies";

        } catch (error) {

    console.error("LỖI:", error);

    console.log(error.response);

    alert(
        error.response?.data?.message ||
        error.message
    );

} finally {

            setLoading(false);

        }

    };

    return (

        <div className="container">

            <h2 className="mb-4">
                Thêm phim mới
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">
                        Tên phim
                    </label>

                    <input
                        type="text"
                        name="ten_phim"
                        className="form-control"
                        value={movie.ten_phim}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">
                        Mô tả
                    </label>

                    <textarea
                        name="mo_ta"
                        className="form-control"
                        rows="4"
                        value={movie.mo_ta}
                        onChange={handleChange}
                    />

                </div>

                <div className="row">

                    <div className="col-md-6 mb-3">

                        <label>
                            Thời lượng (phút)
                        </label>

                        <input
                            type="number"
                            name="thoi_luong"
                            className="form-control"
                            value={movie.thoi_luong}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <label>
                            Thể loại
                        </label>

                        <input
                            type="text"
                            name="the_loai"
                            className="form-control"
                            value={movie.the_loai}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <div className="row">

                    <div className="col-md-6 mb-3">

                        <label>
                            Ngôn ngữ
                        </label>

                        <input
                            type="text"
                            name="ngon_ngu"
                            className="form-control"
                            value={movie.ngon_ngu}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <label>
                            Giới hạn độ tuổi
                        </label>

                        <input
                            type="text"
                            name="gioi_han_do_tuoi"
                            className="form-control"
                            placeholder="P, K, T13, T16, T18..."
                            value={movie.gioi_han_do_tuoi}
                            onChange={handleChange}
                        />

                    </div>

                </div>

                <div className="mb-3">

                    <label>
                        Poster phim
                    </label>

                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) =>
                            setPosterFile(
                                e.target.files[0]
                            )
                        }
                    />

                </div>

                {
                    posterFile && (

                        <div className="mb-3">

                            <img
                                src={URL.createObjectURL(
                                    posterFile
                                )}
                                alt="preview"
                                width="200"
                            />

                        </div>

                    )
                }

                <div className="mb-3">

                    <label>
                        Trailer Youtube
                    </label>

                    <input
                        type="text"
                        name="trailer"
                        className="form-control"
                        value={movie.trailer}
                        onChange={handleChange}
                    />

                </div>

                <div className="row">

                    <div className="col-md-6 mb-3">

                        <label>
                            Ngày khởi chiếu
                        </label>

                        <input
                            type="date"
                            name="ngay_khoi_chieu"
                            className="form-control"
                            value={movie.ngay_khoi_chieu}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="col-md-6 mb-3">

                        <label>
                            Trạng thái
                        </label>

                        <select
                            name="trang_thai"
                            className="form-select"
                            value={movie.trang_thai}
                            onChange={handleChange}
                        >
                            <option value="dang_chieu">
                                Đang chiếu
                            </option>

                            <option value="sap_chieu">
                                Sắp chiếu
                            </option>

                        </select>

                    </div>

                </div>

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                >

                    {
                        loading
                            ? "Đang lưu..."
                            : "Lưu phim"
                    }

                </button>

            </form>

        </div>

    );
}

export default AddMovie;