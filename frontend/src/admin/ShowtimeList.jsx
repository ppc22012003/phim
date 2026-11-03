import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash
} from "react-icons/fa";

function ShowtimeList() {

    const [showtimes, setShowtimes] = useState([]);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {

        loadShowtimes();

    }, []);

    const loadShowtimes = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/api/suat-chieu"
            );

            setShowtimes(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const handleDelete = async (id) => {

        if (
            !window.confirm(
                "Bạn có chắc muốn xóa suất chiếu này?"
            )
        ) return;

        try {

            await axios.delete(
                `http://localhost:5000/api/suat-chieu/${id}`
            );

            alert("Xóa thành công!");

            loadShowtimes();

        } catch (err) {

            console.log(err);

            alert("Xóa thất bại!");

        }

    };

  const filteredShowtimes = showtimes.filter((item) => {

    const key = keyword.toLowerCase();

    return (

        item.ten_phim?.toLowerCase().includes(key) ||

        item.ten_rap?.toLowerCase().includes(key) ||

        item.ten_phong?.toLowerCase().includes(key)

    );

});

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

                                Quản lý suất chiếu

                            </h2>

                            <small className="text-muted">

                                Danh sách các suất chiếu trong hệ thống

                            </small>

                        </div>

                        <Link
                            to="/admin/showtimes/add"
                            className="btn btn-danger rounded-pill px-4"
                        >

                            <FaPlus className="me-2" />

                            Thêm suất chiếu

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
                                    placeholder="Tìm theo phim hoặc phòng..."
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

                                    <th>

                                        Phim

                                    </th>
                                    <th width="180">
    Rạp
</th>

                                    <th width="160">

                                        Phòng

                                    </th>

                                    <th width="150">

                                        Ngày chiếu

                                    </th>

                                    <th width="120">

                                        Bắt đầu

                                    </th>

                                    <th width="120">

                                        Kết thúc

                                    </th>

                                    <th width="170">

                                        Thao tác

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    filteredShowtimes.length > 0 ?

                                        filteredShowtimes.map((item) => (

                                            <tr
                                                key={item.ma_suat_chieu}
                                            >

                                                <td>

                                                    {item.ma_suat_chieu}

                                                </td>

                                                <td>

                                                    <strong>

                                                        {item.ten_phim}

                                                    </strong>

                                                </td>
                                                <td>

    <strong>
        {item.ten_rap}
    </strong>

</td>

                                                <td>

                                                    {item.ten_phong}

                                                </td>

                                                <td>

                                                    {item.ngay_chieu?.split("T")[0]}

                                                </td>

                                                <td>

                                                    {item.gio_bat_dau}

                                                </td>

                                                <td>

                                                    {item.gio_ket_thuc}

                                                </td>

                                                <td>

                                                    <Link
                                                        to={`/admin/showtimes/edit/${item.ma_suat_chieu}`}
                                                        className="btn btn-warning btn-sm rounded-pill me-2"
                                                    >

                                                        <FaEdit />

                                                    </Link>

                                                    <button
                                                        className="btn btn-danger btn-sm rounded-pill"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.ma_suat_chieu
                                                            )
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

                                                Chưa có suất chiếu nào.

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

export default ShowtimeList;