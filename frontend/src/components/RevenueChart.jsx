import { useEffect, useState } from "react";
import axios from "axios";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

function RevenueChart({ type }) {

    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);

    useEffect(() => {

        axios

            .get(`http://localhost:5000/api/dashboard/revenue?type=${type}`)

            .then(res => {

                setLabels(
                    res.data.map(i => i.label)
                );

                setValues(
                    res.data.map(i => i.doanhThu)
                );

            });

    }, [type]);

    const data = {

        labels,

        datasets: [

            {

                label: "Doanh thu",

                data: values,

                borderRadius: 8,

                backgroundColor: "#ff4d4f"

            }

        ]

    };

    return (

        <div
            className="card border-0 shadow mt-4"
            style={{
                borderRadius:20
            }}
        >

            <div className="card-body">

                <h4 className="fw-bold mb-4">

                    Biểu đồ doanh thu

                </h4>

                <Bar
                    data={data}
                    options={{

                        responsive:true,

                        plugins:{

                            legend:{
                                display:false
                            }

                        }

                    }}
                />

            </div>

        </div>

    );

}

export default RevenueChart;