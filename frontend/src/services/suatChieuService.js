import axios from "axios";

export const layLichChieu = () => {

    return axios.get(
        "http://localhost:5000/api/lich-chieu"
    );

};