import { useEffect, useState } from "react";
import axios from "axios";

import {
    Search,
    Pencil,
    Trash2,
    UserPlus
} from "lucide-react";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [showAdd, setShowAdd] = useState(false);
     const [showEdit, setShowEdit] = useState(false);

    

const [newUser, setNewUser] = useState({

    ho_ten: "",
    email: "",
    so_dien_thoai: "",
    mat_khau: "",
    vai_tro: "khach_hang"

});
    const [showModal,setShowModal]=useState(false);

const [editUser,setEditUser]=useState({

    ma_tai_khoan:"",
    ho_ten:"",
    email:"",
    so_dien_thoai:"",
    vai_tro:"khach_hang"
    

});


    const loadUsers = () => {
        axios
            .get("http://localhost:5000/api/admin/users")
            .then((res) => {
                setUsers(res.data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const openEdit = (user) => {

    setEditUser(user);

    setShowEdit(true);

};
    const deleteUser = (id) => {

        if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) {
            return;
        }

        axios
            .delete(`http://localhost:5000/api/admin/users/${id}`)
            .then(() => loadUsers())
            .catch((err) => console.log(err));

    };const addUser = () => {

    if (
        !newUser.ho_ten ||
        !newUser.email ||
        !newUser.mat_khau
    ) {

        alert("Vui lòng nhập đầy đủ thông tin");

        return;

    }

    axios.post(

        "http://localhost:5000/api/admin/users",

        newUser

    )

    .then((res)=>{

        alert(res.data.message);

        setShowAdd(false);

        loadUsers();

        setNewUser({

            ho_ten:"",
            email:"",
            so_dien_thoai:"",
            mat_khau:"",
            vai_tro:"khach_hang"

        });

    })

    .catch((err)=>{

        alert(

            err.response?.data?.message ||

            "Có lỗi xảy ra"

        );

    });

};
const updateUser = () => {

    axios.put(

        `http://localhost:5000/api/admin/users/${editUser.ma_tai_khoan}`,

        editUser

    )

    .then(() => {

        alert("Cập nhật thành công");

        setShowEdit(false);

        loadUsers();

    })

    .catch((err) => {

        console.log(err);

        alert("Cập nhật thất bại");

    });

};
    const filteredUsers = users.filter((u) =>
        u.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div className="card shadow-lg border-0 rounded-4">

            <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold text-danger mb-1">
                            Quản lý tài khoản
                        </h2>

                        <p className="text-muted mb-0">
                            Danh sách tài khoản trong hệ thống
                        </p>

                    </div>

                   <button
className="btn btn-danger rounded-pill px-4"
onClick={()=>setShowAdd(true)}
>

<UserPlus
size={18}
className="me-2"
/>

Thêm tài khoản

</button>

                </div>

                <div className="row mb-4">

                    <div className="col-md-5">

                        <div className="input-group">

                            <span className="input-group-text bg-white">

                                <Search size={18} />

                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm theo tên hoặc email..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>

                <div className="table-responsive">

                    <table className="table table-hover align-middle">

                        <thead className="table-danger">

                            <tr>

                                <th>ID</th>

                                <th>Họ tên</th>

                                <th>Email</th>

                                <th>SĐT</th>

                                <th>Vai trò</th>

                                <th className="text-center">
                                    Thao tác
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredUsers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center text-muted py-4"
                                    >
                                        Không có dữ liệu
                                    </td>

                                </tr>

                            ) : (

                                filteredUsers.map((u) => (

                                    <tr key={u.ma_tai_khoan}>

                                        <td className="fw-bold">
                                            #{u.ma_tai_khoan}
                                        </td>

                                        <td>{u.ho_ten}</td>

                                        <td>{u.email}</td>

                                        <td>{u.so_dien_thoai}</td>

                                        <td>

                                            {u.vai_tro === "quan_tri" ? (

                                                <span className="badge bg-danger px-3 py-2">
                                                    Quản trị
                                                </span>

                                            ) : (

                                                <span className="badge bg-primary px-3 py-2">
                                                    Khách hàng
                                                </span>

                                            )}

                                        </td>

                                        <td className="text-center">

                                           <button
    className="btn btn-warning btn-sm me-2"
    onClick={() => openEdit(u)}
>

    <Pencil size={16} />

</button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                title="Xóa"
                                                onClick={() =>
                                                    deleteUser(
                                                        u.ma_tai_khoan
                                                    )
                                                }
                                            >

                                                <Trash2 size={16} />

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
{

showAdd && (

<div
className="modal fade show d-block"
style={{
background:"rgba(0,0,0,.5)"
}}
>

<div className="modal-dialog">

<div className="modal-content">

<div className="modal-header">

<h4 className="fw-bold">

Thêm tài khoản

</h4>

<button

className="btn-close"

onClick={()=>setShowAdd(false)}

></button>

</div>

<div className="modal-body">

<div className="mb-3">

<label>

Họ tên

</label>

<input

className="form-control"

value={newUser.ho_ten}

onChange={(e)=>

setNewUser({

...newUser,

ho_ten:e.target.value

})

}

/>

</div>

<div className="mb-3">

<label>

Email

</label>

<input

type="email"

className="form-control"

value={newUser.email}

onChange={(e)=>

setNewUser({

...newUser,

email:e.target.value

})

}

/>

</div>

<div className="mb-3">

<label>

Số điện thoại

</label>

<input

className="form-control"

value={newUser.so_dien_thoai}

onChange={(e)=>

setNewUser({

...newUser,

so_dien_thoai:e.target.value

})

}

/>

</div>

<div className="mb-3">

<label>

Mật khẩu

</label>

<input

type="password"

className="form-control"

value={newUser.mat_khau}

onChange={(e)=>

setNewUser({

...newUser,

mat_khau:e.target.value

})

}

/>

</div>

<div className="mb-3">

<label>

Vai trò

</label>

<select

className="form-select"

value={newUser.vai_tro}

onChange={(e)=>

setNewUser({

...newUser,

vai_tro:e.target.value

})

}

>

<option value="khach_hang">

Khách hàng

</option>

<option value="quan_tri">

Quản trị

</option>

</select>

</div>

</div>

<div className="modal-footer">

<button

className="btn btn-secondary"

onClick={()=>setShowAdd(false)}

>

Đóng

</button>

<button

className="btn btn-danger"

onClick={addUser}

>

Lưu tài khoản

</button>

</div>

</div>

</div>

</div>

)

}
{
showEdit && (

<div
    className="modal fade show d-block"
    style={{
        background: "rgba(0,0,0,.5)"
    }}
>

    <div className="modal-dialog">

        <div className="modal-content">

            <div className="modal-header">

                <h5 className="fw-bold">
                    Sửa tài khoản
                </h5>

                <button
                    className="btn-close"
                    onClick={() => setShowEdit(false)}
                ></button>

            </div>

            <div className="modal-body">

                <div className="mb-3">

                    <label>Họ tên</label>

                    <input
                        className="form-control"
                        value={editUser.ho_ten}
                        onChange={(e)=>
                            setEditUser({
                                ...editUser,
                                ho_ten:e.target.value
                            })
                        }
                    />

                </div>

                <div className="mb-3">

                    <label>Email</label>

                    <input
                        className="form-control"
                        value={editUser.email}
                        onChange={(e)=>
                            setEditUser({
                                ...editUser,
                                email:e.target.value
                            })
                        }
                    />

                </div>

                <div className="mb-3">

                    <label>Số điện thoại</label>

                    <input
                        className="form-control"
                        value={editUser.so_dien_thoai}
                        onChange={(e)=>
                            setEditUser({
                                ...editUser,
                                so_dien_thoai:e.target.value
                            })
                        }
                    />

                </div>

                <div className="mb-3">

                    <label>Vai trò</label>

                    <select
                        className="form-select"
                        value={editUser.vai_tro}
                        onChange={(e)=>
                            setEditUser({
                                ...editUser,
                                vai_tro:e.target.value
                            })
                        }
                    >

                        <option value="khach_hang">
                            Khách hàng
                        </option>

                        <option value="quan_tri">
                            Quản trị
                        </option>

                    </select>

                </div>

            </div>

            <div className="modal-footer">

                <button
                    className="btn btn-secondary"
                    onClick={() => setShowEdit(false)}
                >
                    Hủy
                </button>

                <button
                    className="btn btn-warning"
                    onClick={updateUser}
                >
                    Cập nhật
                </button>

            </div>

        </div>

    </div>

</div>

)
}
        </div>
        

    );

}

export default AdminUsers;