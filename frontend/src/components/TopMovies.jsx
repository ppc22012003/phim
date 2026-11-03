import { useEffect,useState } from "react";
import axios from "axios";

function TopMovies(){

    const [movies,setMovies]=useState([]);

    useEffect(()=>{

        axios
        .get("http://localhost:5000/api/dashboard/top-movies")
        .then(res=>{

            setMovies(res.data);

        });

    },[]);

    return(

        <div
            className="card border-0 shadow"
            style={{
                borderRadius:20
            }}
        >

            <div className="card-body">

                <h4 className="fw-bold mb-4">

                    Top 5 phim bán chạy

                </h4>

                {

                    movies.map((item,index)=>(

                        <div
                            key={index}
                            className="d-flex justify-content-between align-items-center border-bottom py-3"
                        >

                            <div>

                                <h6 className="mb-1">

                                    {item.ten_phim}

                                </h6>

                                <small className="text-muted">

                                    {item.soVe} vé

                                </small>

                            </div>

                            <span
                                className="badge bg-success fs-6"
                            >

                                {Number(item.doanhThu).toLocaleString()}đ

                            </span>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default TopMovies;