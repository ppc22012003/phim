import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditMovie() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState({});
    const [posterFile, setPosterFile] = useState(null);

    useEffect(() => {

        loadMovie();

    }, []);

   const loadMovie = async () => {

    try {

        const res = await axios.get(
            `http://localhost:5000/api/phim/${id}`
        );

        const movieData = {
            ...res.data,
            ngay_khoi_chieu:
                res.data.ngay_khoi_chieu
                    ? res.data.ngay_khoi_chieu.split("T")[0]
                    : ""
        };

        setMovie(movieData);

    } catch (err) {

        console.log(err);

    }

};

    const handleChange = (e) => {

        setMovie({
            ...movie,
            [e.target.name]: e.target.value
        });

    };

    const uploadPoster = async () => {

        if (!posterFile) {
            return movie.poster;
        }

        const formData = new FormData();

        formData.append(
            "poster",
            posterFile
        );

        const res = await axios.post(
            "http://localhost:5000/api/upload-poster",
            formData
        );

        return res.data.poster;

    };

   const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const posterPath =
            await uploadPoster();

        const data = {

            ...movie,

            poster: posterPath,

            ngay_khoi_chieu:
                movie.ngay_khoi_chieu
                    ? movie.ngay_khoi_chieu
                        .split("T")[0]
                    : null

        };

        console.log(
            "DATA UPDATE:",
            data
        );

        const res = await axios.put(
            `http://localhost:5000/api/phim/${id}`,
            data
        );

        console.log(res.data);

        alert(
            "Cập nhật phim thành công"
        );

        navigate(
            "/admin/movies"
        );

    } catch (err) {

        console.log(
            "LỖI UPDATE:",
            err
        );

        console.log(
            err.response
        );

        alert(
            err.response?.data?.message ||
            "Có lỗi xảy ra"
        );

    }

};
    return (

        <div className="container">

            <h2 className="mb-4">
                Sửa phim
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>
                        Tên phim
                    </label>

                    <input
                        type="text"
                        name="ten_phim"
                        className="form-control"
                        value={movie.ten_phim || ""}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">

                    <label>
                        Mô tả
                    </label>

                    <textarea
                        name="mo_ta"
                        rows="4"
                        className="form-control"
                        value={movie.mo_ta || ""}
                        onChange={handleChange}
                    />

                </div>

                <div className="row">

                    <div className="col-md-6">

                        <div className="mb-3">

                            <label>
                                Thời lượng
                            </label>

                            <input
                                type="number"
                                name="thoi_luong"
                                className="form-control"
                                value={movie.thoi_luong || ""}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="mb-3">

                            <label>
                                Thể loại
                            </label>

                            <input
                                type="text"
                                name="the_loai"
                                className="form-control"
                                value={movie.the_loai || ""}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                </div>

                <div className="row">

                    <div className="col-md-6">

                        <div className="mb-3">

                            <label>
                                Ngôn ngữ
                            </label>

                            <input
                                type="text"
                                name="ngon_ngu"
                                className="form-control"
                                value={movie.ngon_ngu || ""}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="mb-3">

                            <label>
                                Giới hạn độ tuổi
                            </label>

                            <input
                                type="text"
                                name="gioi_han_do_tuoi"
                                className="form-control"
                                value={movie.gioi_han_do_tuoi || ""}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                </div>

                <div className="mb-3">

                    <label>
                        Trailer
                    </label>

                    <input
                        type="text"
                        name="trailer"
                        className="form-control"
                        value={movie.trailer || ""}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-3">

                    <label>
                        Ngày khởi chiếu
                    </label>

                    <input
    type="date"
    name="ngay_khoi_chieu"
    className="form-control"
    value={movie.ngay_khoi_chieu || ""}
    onChange={handleChange}
/>

                </div>

                <div className="mb-3">

                    <label>
                        Trạng thái
                    </label>

                    <select
                        name="trang_thai"
                        className="form-control"
                        value={movie.trang_thai || ""}
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

                <div className="mb-3">

                    <label>
                        Poster hiện tại
                    </label>

                    <br />

                    {
                        movie.poster && (

                            <img
                                src={`http://localhost:5000${movie.poster}`}
                                alt=""
                                width="200"
                                className="mb-3 rounded"
                            />

                        )
                    }

                </div>

                <div className="mb-4">

                    <label>
                        Đổi Poster
                    </label>

                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                            setPosterFile(
                                e.target.files[0]
                            )
                        }
                    />

                </div>

                <button
                    className="btn btn-primary"
                >
                    Cập nhật phim
                </button>

            </form>

        </div>

    );

}

export default EditMovie;