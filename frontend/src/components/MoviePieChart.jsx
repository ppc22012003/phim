import { useEffect, useState } from "react";
import axios from "axios";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const COLORS = [
    "#ff6384",
    "#36a2eb",
    "#4bc0c0",
    "#ffcd56",
    "#9966ff",
    "#ff9f40",
    "#2ecc71",
    "#e67e22"
];

function MoviePieChart() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios
            .get("http://localhost:5000/api/dashboard/movie-pie")
            .then((res) => {

                console.log("Movie Pie API:", res.data);

                const chartData = res.data.map(item => ({
                    name: item.name,
                    value: Number(item.value)
                }));

                setData(chartData);

            })
            .catch((err) => {

                console.log(err);

            })
            .finally(() => {

                setLoading(false);

            });

    }, []);

    if (loading) {

        return (

            <div className="card shadow border-0 mt-4">

                <div className="card-header bg-danger text-white">

                    <h5 className="mb-0">
                        Doanh thu theo phim
                    </h5>

                </div>

                <div className="card-body text-center">

                    Đang tải dữ liệu...

                </div>

            </div>

        );

    }

    if (data.length === 0) {

        return (

            <div className="card shadow border-0 mt-4">

                <div className="card-header bg-danger text-white">

                    <h5 className="mb-0">
                        Doanh thu theo phim
                    </h5>

                </div>

                <div className="card-body text-center text-muted">

                    Chưa có dữ liệu.

                </div>

            </div>

        );

    }

    return (

        <div className="card shadow border-0 mt-4">

            <div className="card-header bg-danger text-white">

                <h5 className="mb-0">

                    Doanh thu theo phim

                </h5>

            </div>

            <div className="card-body">

                <ResponsiveContainer
                    width="100%"
                    height={380}
                >

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={130}
                            label={({ name, percent }) =>
                                `${name} (${(percent * 100).toFixed(1)}%)`
                            }
                        >

                            {
                                data.map((entry, index) => (

                                    <Cell
                                        key={index}
                                        fill={
                                            COLORS[
                                                index % COLORS.length
                                            ]
                                        }
                                    />

                                ))
                            }

                        </Pie>

                        <Tooltip
                            formatter={(value) =>
                                Number(value).toLocaleString("vi-VN") + " đ"
                            }
                        />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default MoviePieChart;