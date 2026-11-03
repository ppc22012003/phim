import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash
} from "react-icons/fa";

function MovieList() {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {

        loadMovies();

    }, []);

    const loadMovies = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/phim"
            );

            setMovies(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Bạn có chắc muốn xóa phim này?"
            )
        )
            return;

        try {

            await axios.delete(
                `http://localhost:5000/api/phim/${id}`
            );

            alert("Xóa phim thành công!");

            loadMovies();

        } catch (err) {

            console.log(err);

            alert("Xóa phim thất bại!");

        }

    };

    const filteredMovies = movies.filter((movie) =>
        movie.ten_phim
            .toLowerCase()
            .includes(keyword.toLowerCase())
    );

    if (loading) {

        return (

            <div className="text-center mt-5">

                Đang tải dữ liệu...

            </div>

        );

    }

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

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h2
                                className="fw-bold mb-1"
                                style={{
                                    color: "#dc3545"
                                }}
                            >
                                Quản lý phim
                            </h2>

                            <small className="text-muted">

                                Danh sách tất cả phim trong hệ thống

                            </small>

                        </div>

                        <Link
                            to="/admin/movies/add"
                            className="btn btn-danger rounded-pill px-4"
                        >

                            <FaPlus className="me-2" />

                            Thêm phim

                        </Link>

                    </div>

                </div>

                <div className="card-body">

                    <div className="row mb-4">

                        <div className="col-md-5">

                            <div className="input-group">

                                <span className="input-group-text bg-white">

                                    <FaSearch />

                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm tên phim..."
                                    value={keyword}
                                    onChange={(e) =>
                                        setKeyword(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                    </div>

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-danger">

                                <tr>

                                    <th width="70">

                                        ID

                                    </th>

                                    <th width="120">

                                        Poster

                                    </th>

                                    <th>

                                        Tên phim

                                    </th>

                                    <th width="180">

                                        Thể loại

                                    </th>

                                    <th width="120">

                                        Thời lượng

                                    </th>

                                    <th width="150">

                                        Trạng thái

                                    </th>

                                    <th width="170">

                                        Thao tác

                                    </th>

                                </tr>

                            </thead>

                            <tbody>
                                                            {

                                    filteredMovies.length > 0 ?

                                        filteredMovies.map((movie) => (

                                            <tr key={movie.ma_phim}>

                                                <td>

                                                    {movie.ma_phim}

                                                </td>

                                                <td>

                                                    <img
                                                        src={
                                                            movie.poster
                                                                ? `http://localhost:5000${movie.poster}`
                                                                : "https://via.placeholder.com/110x160"
                                                        }
                                                        alt={movie.ten_phim}
                                                        style={{
                                                            width: "110px",
                                                            height: "160px",
                                                            objectFit: "cover",
                                                            borderRadius: "10px",
                                                            border: "1px solid #ddd"
                                                        }}
                                                    />

                                                </td>

                                                <td>

                                                    <strong>

                                                        {movie.ten_phim}

                                                    </strong>

                                                </td>

                                                <td>

                                                    {movie.the_loai}

                                                </td>

                                                <td>

                                                    {movie.thoi_luong} phút

                                                </td>

                                                <td>

                                                    {

                                                        movie.trang_thai === "dang_chieu"

                                                            ?

                                                            <span className="badge bg-success">

                                                                Đang chiếu

                                                            </span>

                                                            :

                                                            <span className="badge bg-warning text-dark">

                                                                Sắp chiếu

                                                            </span>

                                                    }

                                                </td>

                                                <td>

                                                    <Link
                                                        to={`/admin/movies/edit/${movie.ma_phim}`}
                                                        className="btn btn-warning btn-sm rounded-pill me-2"
                                                    >

                                                        <FaEdit />

                                                    </Link>

                                                    <button
                                                        className="btn btn-danger btn-sm rounded-pill"
                                                        onClick={() =>
                                                            handleDelete(movie.ma_phim)
                                                        }
                                                    >

                                                        <FaTrash />

                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                        :

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="text-center py-5 text-muted"
                                            >

                                                Chưa có phim nào.

                                            </td>

                                        </tr>

                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default MovieList;