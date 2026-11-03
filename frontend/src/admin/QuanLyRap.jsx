import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

function QuanLyRap() {

    const [raps, setRaps] = useState([]);

    const [form, setForm] = useState({

        ten_rap: "",
        dia_chi: "",
        mo_ta:"",
        so_dien_thoai: "",
        hinh_anh: ""

    });

    const [editing, setEditing] = useState(false);

    const [idEdit, setIdEdit] = useState(null);

    const [search, setSearch] = useState("");

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        const res =
            await axios.get(
                "http://localhost:5000/api/rap"
            );

        setRaps(res.data);

    };

    const resetForm = () => {

        setForm({

            ten_rap: "",
            dia_chi: "",
            mo_ta:"",
            so_dien_thoai: "",
            hinh_anh: ""

        });

        setEditing(false);

        setIdEdit(null);

    };

    const handleSubmit = async () => {

        if (editing) {

            await axios.put(

                `http://localhost:5000/api/rap/${idEdit}`,

                form

            );

            alert("Cập nhật thành công");

        }

        else {

            await axios.post(

                "http://localhost:5000/api/rap",

                form

            );

            alert("Thêm thành công");

        }

        resetForm();

        loadData();

    };

    const handleEdit = (rap) => {

        setEditing(true);

        setIdEdit(rap.ma_rap);

        setForm({

            ten_rap: rap.ten_rap,

            dia_chi: rap.dia_chi,

            mo_ta: rap.mo_ta,

            so_dien_thoai: rap.so_dien_thoai,

            hinh_anh: rap.hinh_anh

        });

       const modal = new Modal(
    document.getElementById("modalRap")
);

modal.show();

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Xóa rạp này?")) {

            return;

        }

        await axios.delete(

            `http://localhost:5000/api/rap/${id}`

        );

        loadData();

    };

    return (

        <div className="card shadow">

            <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">

                <h4 className="mb-0">
                    Quản lý rạp
                </h4>

                <button

                    className="btn btn-light"

                    data-bs-toggle="modal"

                    data-bs-target="#modalRap"

                    onClick={resetForm}

                >

                    + Thêm rạp

                </button>

            </div>

            <div className="card-body">

                <input

                    className="form-control mb-4"

                    placeholder="Tìm theo tên rạp..."

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                />

                <table className="table table-bordered table-hover align-middle">

                    <thead className="table-dark">

                        <tr>

                            <th>ID</th>

                            <th>Hình</th>

                            <th>Tên rạp</th>

                            <th>Địa chỉ</th>

                            <th>Mô tả</th>

                            <th>SĐT</th>

                            <th width="180">
                                Thao tác
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            raps

                                .filter(item =>

                                    item.ten_rap

                                        .toLowerCase()

                                        .includes(

                                            search.toLowerCase()

                                        )

                                )

                                .map((rap) => (

                                    <tr key={rap.ma_rap}>

                                        <td>

                                            {rap.ma_rap}

                                        </td>

                                        <td>

                                            <img

                                                src={rap.hinh_anh}

                                                width="120"

                                                height="70"

                                                style={{

                                                    objectFit: "cover",

                                                    borderRadius: 8

                                                }}

                                                alt=""

                                            />

                                        </td>

                                        <td>

                                            {rap.ten_rap}

                                        </td>

                                        <td>

                                            {rap.dia_chi}

                                        </td>
                                            <td style={{maxWidth:"300px"}}>
                                            {rap.mo_ta}
                                        </td>


                                        <td>

                                            {rap.so_dien_thoai}

                                        </td>

                                        <td>

                                            <button

                                                className="btn btn-warning me-2"

                                                onClick={() =>
                                                    handleEdit(rap)
                                                }

                                            >

                                                Sửa

                                            </button>

                                            <button

                                                className="btn btn-danger"

                                                onClick={() =>
                                                    handleDelete(rap.ma_rap)
                                                }

                                            >

                                                Xóa

                                            </button>

                                        </td>

                                    </tr>

                                ))

                        }

                    </tbody>

                </table>

            </div>

            <div

                className="modal fade"

                id="modalRap"

            >

                <div className="modal-dialog">

                    <div className="modal-content">

                        <div className="modal-header">

                            <h5>

                                {

                                    editing

                                        ? "Sửa rạp"

                                        : "Thêm rạp"

                                }

                            </h5>

                            <button

                                className="btn-close"

                                data-bs-dismiss="modal"

                            ></button>

                        </div>

                        <div className="modal-body">

                            <input

                                className="form-control mb-3"

                                placeholder="Tên rạp"

                                value={form.ten_rap}

                                onChange={(e) =>

                                    setForm({

                                        ...form,

                                        ten_rap: e.target.value

                                    })

                                }

                            />

                            <input

                                className="form-control mb-3"

                                placeholder="Địa chỉ"

                                value={form.dia_chi}

                                onChange={(e) =>

                                    setForm({

                                        ...form,

                                        dia_chi: e.target.value

                                    })

                                }

                            />
<textarea
    className="form-control mb-3"
    rows="4"
    placeholder="Mô tả rạp"
    value={form.mo_ta}
    onChange={(e)=>
        setForm({
            ...form,
            mo_ta:e.target.value
        })
    }
/>
                            <input

                                className="form-control mb-3"

                                placeholder="Số điện thoại"

                                value={form.so_dien_thoai}

                                onChange={(e) =>

                                    setForm({

                                        ...form,

                                        so_dien_thoai: e.target.value

                                    })

                                }

                            />

                            <input

                                className="form-control"

                                placeholder="Link hình"

                                value={form.hinh_anh}

                                onChange={(e) =>

                                    setForm({

                                        ...form,

                                        hinh_anh: e.target.value

                                    })

                                }

                            />

                            {

                                form.hinh_anh &&

                                <img

                                    src={form.hinh_anh}

                                    alt=""

                                    className="mt-3 rounded"

                                    width="100%"

                                />

                            }

                        </div>

                        <div className="modal-footer">

                            <button

                                className="btn btn-secondary"

                                data-bs-dismiss="modal"

                            >

                                Đóng

                            </button>

                            <button

                                className="btn btn-danger"

                                data-bs-dismiss="modal"

                                onClick={handleSubmit}

                            >

                                {

                                    editing

                                        ? "Cập nhật"

                                        : "Thêm"

                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default QuanLyRap;