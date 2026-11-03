import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditShowtime() {


const { id } = useParams();
const navigate = useNavigate();

const [movies, setMovies] = useState([]);
const [rooms, setRooms] = useState([]);

const [showtime, setShowtime] = useState({
    ma_phim: "",
    ma_phong: "",
    ngay_chieu: "",
    gio_bat_dau: "",
    gio_ket_thuc: ""
    
});

useEffect(() => {

    loadData();

}, []);

const loadData = async () => {

    try {

        const movieRes = await axios.get(
            "http://localhost:5000/api/movie-options"
        );

        const roomRes = await axios.get(
            "http://localhost:5000/api/room-options"
        );

        const showtimeRes = await axios.get(
            `http://localhost:5000/api/suat-chieu/${id}`
        );

        setMovies(movieRes.data);
        setRooms(roomRes.data);

        setShowtime({
            ...showtimeRes.data,

            ngay_chieu:
                showtimeRes.data.ngay_chieu
                    ? showtimeRes.data.ngay_chieu.split("T")[0]
                    : "",

            gio_bat_dau:
                showtimeRes.data.gio_bat_dau
                    ? showtimeRes.data.gio_bat_dau.substring(0, 5)
                    : "",

            gio_ket_thuc:
                showtimeRes.data.gio_ket_thuc
                    ? showtimeRes.data.gio_ket_thuc.substring(0, 5)
                    : ""
        });

    } catch (err) {

        console.log(err);

        alert("Không tải được dữ liệu");

    }

};

const handleChange = (e) => {

    setShowtime({
        ...showtime,
        [e.target.name]: e.target.value
    });

};

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const dataUpdate = {
            ...showtime,

            gio_bat_dau:
                showtime.gio_bat_dau.length === 5
                    ? showtime.gio_bat_dau + ":00"
                    : showtime.gio_bat_dau,

            gio_ket_thuc:
                showtime.gio_ket_thuc.length === 5
                    ? showtime.gio_ket_thuc + ":00"
                    : showtime.gio_ket_thuc
        };

        console.log("DATA GUI DI:");
        console.log(dataUpdate);

        const res = await axios.put(
            `http://localhost:5000/api/suat-chieu/${id}`,
            dataUpdate
        );

        console.log(res.data);

        alert(
            "Cập nhật suất chiếu thành công"
        );

        navigate(
            "/admin/showtimes"
        );

    } catch (err) {

        console.log(err);

        alert(
            err.response?.data?.message ||
            err.response?.data?.sqlMessage ||
            "Cập nhật thất bại"
        );

    }

};

return (

    <div className="container">

        <h2 className="mb-4">
            Sửa suất chiếu
        </h2>

        <form onSubmit={handleSubmit}>

            <div className="mb-3">

                <label>Phim</label>

                <select
                    name="ma_phim"
                    className="form-control"
                    value={showtime.ma_phim}
                    onChange={handleChange}
                >

                    {movies.map((movie) => (

                        <option
                            key={movie.ma_phim}
                            value={movie.ma_phim}
                        >
                            {movie.ten_phim}
                        </option>

                    ))}

                </select>

            </div>

            <div className="mb-3">

                <label>Phòng</label>

                <select
                    name="ma_phong"
                    className="form-control"
                    value={showtime.ma_phong}
                    onChange={handleChange}
                >

                    {rooms.map((room) => (

                        <option
                            key={room.ma_phong}
                            value={room.ma_phong}
                        >
                            {room.ten_phong}
                        </option>

                    ))}

                </select>

            </div>

            <div className="mb-3">

                <label>Ngày chiếu</label>

                <input
                    type="date"
                    name="ngay_chieu"
                    className="form-control"
                    value={showtime.ngay_chieu || ""}
                    onChange={handleChange}
                />

            </div>

            <div className="mb-3">

                <label>Giờ bắt đầu</label>

                <input
                    type="time"
                    name="gio_bat_dau"
                    className="form-control"
                    value={showtime.gio_bat_dau || ""}
                    onChange={handleChange}
                />

            </div>

            <div className="mb-3">

                <label>Giờ kết thúc</label>

                <input
                    type="time"
                    name="gio_ket_thuc"
                    className="form-control"
                    value={showtime.gio_ket_thuc || ""}
                    onChange={handleChange}
                />

            </div>

            

            <button
                type="submit"
                className="btn btn-primary"
            >
                Cập nhật
            </button>

        </form>

    </div>

);


}

export default EditShowtime;
