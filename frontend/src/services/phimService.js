import axios from "axios";

export const layDanhSachPhim = () => {
    return axios.get("http://localhost:5000/api/phim");
};
export const layChiTietPhim = (id) => {
    return axios.get(
        `http://localhost:5000/api/phim/${id}`
    );
};