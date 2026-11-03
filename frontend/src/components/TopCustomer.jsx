import { useEffect, useState } from "react";
import axios from "axios";

function TopCustomer() {

    const [data, setData] = useState([]);

    useEffect(() => {

        axios
            .get("http://localhost:5000/api/dashboard/top-customers")
            .then(res => setData(res.data));

    }, []);

    return (

        <div className="card shadow border-0 mt-4">

            <div className="card-header bg-success text-white">

                <h5 className="mb-0">

                    Top 5 khách hàng

                </h5>

            </div>

            <div className="card-body">

                <table className="table">

                    <thead>

                        <tr>

                            <th>Khách hàng</th>

                            <th>Vé</th>

                            <th>Chi tiêu</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            data.map((item,index)=>(

                                <tr key={index}>

                                    <td>{item.ho_ten}</td>

                                    <td>{item.tongVe}</td>

                                    <td>

                                        {Number(item.tongTien).toLocaleString()}đ

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default TopCustomer;