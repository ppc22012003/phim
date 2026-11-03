const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('./middleware/uploadMovie');
const app = express();

// Bổ sung dòng này vào server.js backend của bạn
app.use('/uploads', express.static('uploads'));
// Hoặc nếu ảnh lưu ở thư mục public:
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.post(
    '/api/upload-poster',
    upload.single('poster'),
    (req, res) => {

        res.json({
    poster:
    `/uploads/movies/${req.file.filename}`
});

    }
);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    timezone: '+07:00',
    dateStrings: true,
    database: 'quanly_datvexemphim'
});

db.connect((err) => {
    if(err){
        console.log(err);
    }else{
        console.log('Kết nối MySQL thành công');
    }
});

app.get('/api/phim', (req, res) => {

    const sql = 'SELECT * FROM phim';

    db.query(sql, (err, result) => {
        if(err){
            res.status(500).json(err);
        }else{
            res.json(result);
        }
    });
});
app.get('/api/phim/:id', (req, res) => {

    const id = req.params.id;

    const sql =
        'SELECT * FROM phim WHERE ma_phim = ?';

    db.query(sql, [id], (err, result) => {

        if(err){

            res.status(500).json(err);

        }else{

            res.json(result[0]);

        }

    });

});
app.post("/api/register", async (req, res) => {

    const {
        ho_ten,
        email,
        so_dien_thoai,
        mat_khau
    } = req.body;

    try {

        const checkSql =
            "SELECT * FROM tai_khoan WHERE email = ?";

        db.query(checkSql, [email], async (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Lỗi server"
                });

            }

            if (result.length > 0) {

                return res.status(400).json({
                    message: "Email đã tồn tại"
                });

            }

            const hashPassword =
                await bcrypt.hash(mat_khau, 10);

            const sql = `
                INSERT INTO tai_khoan
                (ho_ten,email,so_dien_thoai,mat_khau,vai_tro)
                VALUES(?,?,?,?,?)
            `;

            db.query(

                sql,

                [
                    ho_ten,
                    email,
                    so_dien_thoai,
                    hashPassword,
                    "khach_hang"
                ],

                (err) => {

                    if (err) {

                        return res.status(500).json({
                            message: "Không thể đăng ký"
                        });

                    }

                    res.json({
                        message: "Đăng ký thành công"
                    });

                }

            );

        });

    } catch (err) {

        res.status(500).json({
            message: "Lỗi server"
        });

    }

});

app.post('/api/login', (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT *
        FROM tai_khoan
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: 'Lỗi server'
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: 'Email không tồn tại'
            });
        }

        const user = result[0];

        // So sánh mật khẩu bằng bcrypt
        const isMatch = await bcrypt.compare(
            password,
            user.mat_khau
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Sai mật khẩu'
            });
        }

        const token = jwt.sign(
            {
                id: user.ma_tai_khoan,
                role: user.vai_tro
            },
            'movie_secret',
            {
                expiresIn: '1d'
            }
        );

        res.json({
            token,
            ma_tai_khoan: user.ma_tai_khoan,
            ho_ten: user.ho_ten,
            email: user.email,
            so_dien_thoai: user.so_dien_thoai,
            vai_tro: user.vai_tro
        });

    });

});
app.post('/api/phim', (req, res) => {

    const {
        ten_phim,
        mo_ta,
        thoi_luong,
        the_loai,
        ngon_ngu,
        gioi_han_do_tuoi,
        poster,
        trailer,
        ngay_khoi_chieu,
        trang_thai
    } = req.body;

    const sql = `
        INSERT INTO phim (
            ten_phim,
            mo_ta,
            thoi_luong,
            the_loai,
            ngon_ngu,
            gioi_han_do_tuoi,
            poster,
            trailer,
            ngay_khoi_chieu,
            trang_thai
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            ten_phim,
            mo_ta,
            thoi_luong,
            the_loai,
            ngon_ngu,
            gioi_han_do_tuoi,
            poster,
            trailer,
            ngay_khoi_chieu,
            trang_thai
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: 'Lỗi thêm phim',
                    error: err
                });

            }

            res.status(201).json({
                message: 'Thêm phim thành công',
                movieId: result.insertId
            });

        }
    );

});
app.delete('/api/phim/:id', (req, res) => {

    const id = req.params.id;

    const sql =
        'DELETE FROM phim WHERE ma_phim = ?';

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }

        res.json({
            message: 'Xóa thành công'
        });

    });

});





app.put('/api/phim/:id', (req, res) => {

    const id = req.params.id;

    const {
        ten_phim,
        mo_ta,
        thoi_luong,
        the_loai,
        ngon_ngu,
        gioi_han_do_tuoi,
        poster,
        trailer,
        ngay_khoi_chieu,
        trang_thai
    } = req.body;

    const sql = `
        UPDATE phim
        SET
            ten_phim = ?,
            mo_ta = ?,
            thoi_luong = ?,
            the_loai = ?,
            ngon_ngu = ?,
            gioi_han_do_tuoi = ?,
            poster = ?,
            trailer = ?,
            ngay_khoi_chieu = ?,
            trang_thai = ?
        WHERE ma_phim = ?
    `;

    db.query(
        sql,
        [
            ten_phim,
            mo_ta,
            thoi_luong,
            the_loai,
            ngon_ngu,
            gioi_han_do_tuoi,
            poster,
            trailer,
            ngay_khoi_chieu,
            trang_thai,
            id
        ],
        (err, result) => {

            if (err) {

    console.log("UPDATE ERROR:", err);

    return res.status(500).json({
        message: "Lỗi cập nhật phim",
        error: err.sqlMessage
    });

}

            res.json({
                message: 'Cập nhật thành công'
            });

        }
    );

});


app.delete('/api/suat-chieu/:id', (req, res) => {

    const sql =
        'DELETE FROM suat_chieu WHERE ma_suat_chieu = ?';

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: 'Xóa thành công'
            });

        }
    );

});

app.get('/api/movie-options', (req, res) => {

    db.query(
        'SELECT ma_phim, ten_phim FROM phim',
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.get('/api/room-options', (req, res) => {

    db.query(
        'SELECT ma_phong, ten_phong FROM phong_chieu',
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

app.get("/api/suat-chieu", (req, res) => {

    const sql = `
        SELECT
            sc.ma_suat_chieu,
            sc.ma_phim,
            sc.ma_phong,
            sc.ngay_chieu,
            sc.gio_bat_dau,
            sc.gio_ket_thuc,

            p.ten_phim,

            pc.ten_phong,

            r.ma_rap,
            r.ten_rap

        FROM suat_chieu sc

        JOIN phim p
            ON sc.ma_phim = p.ma_phim

        JOIN phong_chieu pc
            ON sc.ma_phong = pc.ma_phong

        JOIN rap_chieu r
            ON pc.ma_rap = r.ma_rap

        ORDER BY
            sc.ngay_chieu DESC,
            sc.gio_bat_dau ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }

        res.json(result);

    });

});
app.post('/api/suat-chieu', (req, res) => {
    console.log("BODY:", req.body);

    const {
        ma_phim,
        ma_phong,
        ngay_chieu,
        gio_bat_dau,
        gio_ket_thuc
        
    } = req.body;

    const sql = `
        INSERT INTO suat_chieu
        (
            ma_phim,
            ma_phong,
            ngay_chieu,
            gio_bat_dau,
            gio_ket_thuc
            
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            ma_phim,
            ma_phong,
            ngay_chieu,
            gio_bat_dau,
            gio_ket_thuc
            
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message:
                    'Thêm suất chiếu thành công'
            });

        }
    );

});

app.get("/api/lich-chieu", (req, res) => {

    const maRap = req.query.ma_rap;

    let sql = `
        SELECT
            sc.ma_suat_chieu,
            sc.ngay_chieu,
            sc.gio_bat_dau,
            p.ma_phim,
            p.ten_phim,
            p.poster,
            p.the_loai,
            p.thoi_luong,
            pc.ten_phong,
            rc.ten_rap
        FROM suat_chieu sc
        JOIN phim p
            ON sc.ma_phim = p.ma_phim
        JOIN phong_chieu pc
            ON sc.ma_phong = pc.ma_phong
        JOIN rap_chieu rc
            ON pc.ma_rap = rc.ma_rap
    `;

    let params = [];

    if (maRap) {

        sql += " WHERE rc.ma_rap = ? ";

        params.push(maRap);

    }

    sql += `
        ORDER BY
            p.ma_phim,
            sc.ngay_chieu,
            sc.gio_bat_dau
    `;

    db.query(sql, params, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }

        res.json(result);

    });

});
app.get('/api/phim/:id/lich-chieu', (req, res) => {

    const sql = `
        SELECT *
        FROM suat_chieu
        WHERE ma_phim = ?
        ORDER BY ngay_chieu, gio_bat_dau
    `;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.get('/api/suat-chieu/:id', (req, res) => {

    const sql =
        'SELECT * FROM suat_chieu WHERE ma_suat_chieu = ?';

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result[0]);

        }
    );

});
app.put('/api/suat-chieu/:id', (req, res) => {

    const {
        ma_phim,
        ma_phong,
        ngay_chieu,
        gio_bat_dau,
        gio_ket_thuc
    } = req.body;

    const sql = `
        UPDATE suat_chieu
        SET
            ma_phim = ?,
            ma_phong = ?,
            ngay_chieu = ?,
            gio_bat_dau = ?,
            gio_ket_thuc = ?,
        WHERE ma_suat_chieu = ?
    `;

    db.query(
        sql,
        [
            ma_phim,
            ma_phong,
            ngay_chieu,
            gio_bat_dau,
            gio_ket_thuc,
            req.params.id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: 'Cập nhật thành công'
            });

        }
    );

});
app.get("/api/dat-ve/:maSuatChieu", (req, res) => {

    const sql = `
        SELECT
            g.ma_ghe,
            g.so_ghe,
            g.loai_ghe,

            CASE
                WHEN EXISTS (

                    SELECT 1
                    FROM chi_tiet_dat_ve ctdv
                    JOIN dat_ve dv
                        ON dv.ma_dat_ve = ctdv.ma_dat_ve
                    WHERE
                        dv.ma_suat_chieu = ?
                        AND ctdv.ma_ghe = g.ma_ghe

                )
                THEN 1
                ELSE 0
            END AS da_dat

        FROM ghe g

        JOIN suat_chieu sc
            ON sc.ma_phong = g.ma_phong

        WHERE sc.ma_suat_chieu = ?

        ORDER BY
            LEFT(g.so_ghe,1),
            CAST(SUBSTRING(g.so_ghe,2) AS UNSIGNED)
    `;

    db.query(
        sql,
        [
            req.params.maSuatChieu,
            req.params.maSuatChieu
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.post("/api/dat-ve", async (req, res) => {

    const {
        ma_tai_khoan,
        ma_suat_chieu,
        gheDaChon = [],
        tong_tien,
        gioHangCombo = [],
        phuong_thuc_thanh_toan
    } = req.body;

    console.log("=================================");
    console.log("POST /api/dat-ve");
    console.log("BODY:", req.body);
    console.log("GHẾ:", gheDaChon);
    console.log("COMBO:", gioHangCombo);
    console.log("=================================");

    try {

        // =====================================================
        // KIỂM TRA DỮ LIỆU
        // =====================================================

        if (!ma_tai_khoan) {

            return res.status(400).json({
                success: false,
                message: "Thiếu mã tài khoản"
            });

        }

        if (!ma_suat_chieu) {

            return res.status(400).json({
                success: false,
                message: "Thiếu mã suất chiếu"
            });

        }

        if (!gheDaChon.length) {

            return res.status(400).json({
                success: false,
                message: "Chưa chọn ghế"
            });

        }

        // =====================================================
        // KIỂM TRA GHẾ
        // =====================================================

        for (const ghe of gheDaChon) {

            if (!ghe.ma_ghe) {

                return res.status(400).json({
                    success: false,
                    message: "Ghế không có mã ghế"
                });

            }

            if (
                ghe.gia_ghe === undefined ||
                ghe.gia_ghe === null
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Ghế ${ghe.so_ghe || ghe.ma_ghe} không có giá`
                });

            }

        }

        // =====================================================
        // KIỂM TRA COMBO
        // =====================================================

       
        for (const combo of gioHangCombo) {

            console.log("ĐANG KIỂM TRA COMBO:", combo);

            if (!combo.ma_combo) {

                return res.status(400).json({
                    success: false,
                    message: "Combo không có mã combo",
                    combo
                });

            }

            if (
                combo.soLuong === undefined ||
                combo.soLuong === null ||
                Number(combo.soLuong) <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Combo ${combo.ten_combo || combo.ma_combo} có số lượng không hợp lệ`,
                    combo
                });

            }

            if (
                combo.gia === undefined ||
                combo.gia === null ||
                Number(combo.gia) < 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Combo ${combo.ten_combo || combo.ma_combo} không có giá`,
                    combo
                });

            }

        }
        // =====================================================
        // TẠO ĐẶT VÉ
        // =====================================================

        const sqlDatVe = `
            INSERT INTO dat_ve
            (
                ma_tai_khoan,
                ma_suat_chieu,
                tong_tien,
                phuong_thuc_thanh_toan,
                trang_thai
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const datVeResult = await new Promise(
            (resolve, reject) => {

                db.query(
                    sqlDatVe,
                    [
                        ma_tai_khoan,
                        ma_suat_chieu,
                        tong_tien,
                        phuong_thuc_thanh_toan,
                        "da_thanh_toan"
                    ],
                    (err, result) => {

                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }

                    }
                );

            }
        );

        const maDatVe =
            datVeResult.insertId;

        console.log(
            "ĐÃ TẠO ĐẶT VÉ:",
            maDatVe
        );

        // =====================================================
        // LƯU GHẾ
        // =====================================================

        for (const ghe of gheDaChon) {

            console.log(
                "Đang lưu ghế:",
                ghe
            );

            await new Promise(
                (resolve, reject) => {

                    const sqlGhe = `
                        INSERT INTO chi_tiet_dat_ve
                        (
                            ma_dat_ve,
                            ma_ghe,
                            gia_ghe
                        )
                        VALUES (?, ?, ?)
                    `;

                    db.query(
                        sqlGhe,
                        [
                            maDatVe,
                            ghe.ma_ghe,
                            ghe.gia_ghe
                        ],
                        (err, result) => {

                            if (err) {

                                console.log(
                                    "LỖI LƯU GHẾ:",
                                    err
                                );

                                reject(err);

                            } else {

                                console.log(
                                    "ĐÃ LƯU XONG GHẾ:",
                                    ghe.ma_ghe
                                );

                                resolve(result);

                            }

                        }
                    );

                }
            );

        }

        // =====================================================
        // LƯU COMBO
        // =====================================================

        for (const combo of gioHangCombo) {

            console.log(
                "Đang lưu combo:",
                combo
            );

            await new Promise(
                (resolve, reject) => {

                    const sqlCombo = `
                        INSERT INTO chi_tiet_combo
                        (
                            ma_dat_ve,
                            ma_combo,
                            so_luong,
                            don_gia
                        )
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        sqlCombo,
                        [
                            maDatVe,
                            combo.ma_combo,
                            Number(combo.soLuong),
                            Number(combo.gia)
                        ],
                        (err, result) => {

                            if (err) {

                                console.log(
                                    "================================="
                                );

                                console.log(
                                    "LỖI LƯU COMBO"
                                );

                                console.log(
                                    "COMBO:",
                                    combo
                                );

                                console.log(
                                    "ERROR:",
                                    err
                                );

                                console.log(
                                    "================================="
                                );

                                reject(err);

                            } else {

                                console.log(
                                    "ĐÃ LƯU XONG COMBO:",
                                    combo.ma_combo
                                );

                                resolve(result);

                            }

                        }
                    );

                }
            );

        }

        // =====================================================
        // HOÀN TẤT
        // =====================================================

        console.log(
            "ĐẶT VÉ THÀNH CÔNG:",
            maDatVe
        );

        return res.json({

            success: true,

            ma_dat_ve:
                maDatVe,

            message:
                "Đặt vé thành công"

        });

    } catch (error) {

        console.log(
            "================================="
        );

        console.log(
            "LỖI API /api/dat-ve"
        );

        console.log(
            error
        );

        console.log(
            "================================="
        );

        return res.status(500).json({

            success: false,

            message:
                "Không thể lưu đặt vé",

            error:
                error.sqlMessage ||
                error.message

        });

    }

});
app.get('/api/ghe/:maPhong', (req, res) => {

    const sql = `
        SELECT *
        FROM ghe
        WHERE ma_phong = ?
        ORDER BY so_ghe
    `;

    db.query(
        sql,
        [req.params.maPhong],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

app.get('/api/thong-tin-dat-ve/:id', (req, res) => {

    const sql = `
        SELECT
            sc.*,
            p.ten_phim,
            pc.ten_phong
        FROM suat_chieu sc
        JOIN phim p
            ON sc.ma_phim = p.ma_phim
        JOIN phong_chieu pc
            ON sc.ma_phong = pc.ma_phong
        WHERE sc.ma_suat_chieu = ?
    `;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result[0]);

        }
    );

});
app.get("/api/rap", (req, res) => {

    const sql = `
        SELECT *
        FROM rap_chieu
        ORDER BY ma_rap
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

});

app.get("/api/rap/:id", (req, res) => {

    const sql = `
        SELECT *
        FROM rap_chieu
        WHERE ma_rap = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy rạp"
            });
        }

        res.json(result[0]);

    });

});
app.post("/api/rap", (req, res) => {

    const {
        ten_rap,
        dia_chi,
        mo_ta,
        so_dien_thoai,
        hinh_anh
    } = req.body;

    db.query(
        `INSERT INTO rap_chieu
        (ten_rap,dia_chi,mo_ta,so_dien_thoai,hinh_anh)
        VALUES (?,?,?,?,?)`,
        [
            ten_rap,
            dia_chi,
            mo_ta,
            so_dien_thoai,
            hinh_anh
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Thêm rạp thành công"
            });

        }
    );

});
app.put("/api/rap/:id", (req, res) => {

    const { id } = req.params;

    const {
        ten_rap,
        dia_chi,
        mo_ta,
        so_dien_thoai,
        hinh_anh
    } = req.body;

    db.query(
        `UPDATE rap_chieu
         SET ten_rap=?,
             dia_chi=?,
             mo_ta=?,
             so_dien_thoai=?,
             hinh_anh=?
         WHERE ma_rap=?`,
        [
            ten_rap,
            dia_chi,
            mo_ta,
            so_dien_thoai,
            hinh_anh,
            id
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Cập nhật thành công"
            });

        }
    );

});
app.delete("/api/rap/:id", (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM rap_chieu WHERE ma_rap = ?",
        [id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Xóa rạp thành công"
            });

        }
    );

});
app.get("/api/combo", (req, res) => {

    db.query(
        "SELECT * FROM combo",
        (err, result) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.get("/api/phim/rap/:id", (req, res) => {

    const maRap = req.params.id;

    const sql = `
        SELECT DISTINCT p.*
        FROM phim p
        INNER JOIN suat_chieu sc
            ON p.ma_phim = sc.ma_phim
        INNER JOIN phong_chieu pc
            ON sc.ma_phong = pc.ma_phong
        WHERE pc.ma_rap = ?
        ORDER BY p.ngay_khoi_chieu
    `;

    db.query(sql, [maRap], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
const crypto = require("crypto");
const axios = require("axios");

app.post("/api/momo-payment", async (req, res) => {

    const { amount } = req.body;

    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

    const requestId = partnerCode + Date.now();
    const orderId = requestId;

    const orderInfo = "Thanh toan ve xem phim";

const redirectUrl =
    "http://localhost:5000/momo-return";

const ipnUrl =
    "http://localhost:5000/api/momo-ipn";

    // QUAN TRỌNG
    console.log("REDIRECT URL:", redirectUrl);
console.log("IPN URL:", ipnUrl);
    const requestType = "payWithMethod";

    const extraData = "";

    const rawSignature =
        "accessKey=" + accessKey +
        "&amount=" + amount +
        "&extraData=" + extraData +
        "&ipnUrl=" + ipnUrl +
        "&orderId=" + orderId +
        "&orderInfo=" + orderInfo +
        "&partnerCode=" + partnerCode +
        "&redirectUrl=" + redirectUrl +
        "&requestId=" + requestId +
        "&requestType=" + requestType;

    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

    const requestBody = {
        partnerCode,
        partnerName: "CGV Kinh Duong Vuong",
        storeId: "CGVTestStore",

        requestId,
        amount: amount.toString(),
        orderId,
        orderInfo,

        redirectUrl,
        ipnUrl,

        extraData,
        requestType,

        lang: "vi",

        signature
    };

    try {

        const result = await axios.post(
            "https://test-payment.momo.vn/v2/gateway/api/create",
            requestBody
        );

        console.log("MOMO RESPONSE:", result.data);

        return res.json({
    ...result.data,
    orderId
});

    } catch (err) {

        console.log(
            "MOMO ERROR:",
            err.response?.data || err.message
        );

        return res.status(500).json(
            err.response?.data || {
                message: "Không thể tạo thanh toán MoMo"
            }
        );

    }

});
app.post("/api/momo-check-status", async (req, res) => {

    try {

        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu orderId"
            });
        }

        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

        const requestId =
            partnerCode + Date.now();

        // =========================
        // SIGNATURE QUERY
        // =========================

        const rawSignature =
            "accessKey=" + accessKey +
            "&orderId=" + orderId +
            "&partnerCode=" + partnerCode +
            "&requestId=" + requestId;

        const signature =
            crypto
                .createHmac(
                    "sha256",
                    secretKey
                )
                .update(rawSignature)
                .digest("hex");

        const requestBody = {

            partnerCode,

            requestId,

            orderId,

            lang: "vi",

            signature

        };

        console.log(
            "===== MOMO CHECK STATUS ====="
        );

        console.log(
            "ORDER ID:",
            orderId
        );

        const result = await axios.post(

            "https://test-payment.momo.vn/v2/gateway/api/query",

            requestBody,

            {
                timeout: 30000
            }

        );

        console.log(
            "MOMO STATUS:",
            result.data
        );

        return res.json(
            result.data
        );

    } catch (error) {

        console.error(
            "MOMO CHECK STATUS ERROR:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Không kiểm tra được trạng thái MoMo",

            error:
                error.response?.data ||
                error.message

        });

    }

});
app.get("/momo-return", (req, res) => {

    console.log("🔥 ĐÃ VỀ MOMO RETURN");
    console.log(req.query);

    res.send("MOMO RETURN OK");

});
app.post("/api/momo-ipn", (req, res) => {

    console.log("\n========================================");
    console.log("           MOMO IPN RECEIVED");
    console.log("========================================");

    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Headers:", req.headers);

    console.log("\nMoMo IPN BODY:");
    console.log(JSON.stringify(req.body, null, 2));

    console.log("\n========================================\n");

    // MoMo cần nhận được HTTP response thành công
    return res.status(204).send();
});
app.get("/momo-return", (req, res) => {

    console.log("===== MOMO RETURN BACKEND =====");
    console.log(req.query);

    const query = new URLSearchParams(req.query).toString();

    res.redirect(
        `http://localhost:3000/momo-return?${query}`
    );

});
app.get("/api/tin-tuc", (req, res) => {

    const sql = `
        SELECT *
        FROM tin_tuc
        ORDER BY ngay_dang DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
app.post("/api/tin-tuc", upload.single("hinh_anh"), (req, res) => {

    const {
        tieu_de,
        noi_dung,
        loai_tin
    } = req.body;

    const hinh_anh = req.file
        ? "/uploads/movies/" + req.file.filename
        : null;

    const sql = `
        INSERT INTO tin_tuc
        (
            tieu_de,
            noi_dung,
            hinh_anh,
            loai_tin,
            ngay_dang
        )
        VALUES (?, ?, ?, ?, NOW())
    `;

    db.query(
        sql,
        [
            tieu_de,
            noi_dung,
            hinh_anh,
            loai_tin
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Thêm tin tức thành công"
            });

        }

    );

});
app.delete("/api/tin-tuc/:id", (req, res) => {

    db.query(
        "DELETE FROM tin_tuc WHERE ma_tin_tuc = ?",
        [req.params.id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json({
                message: "Xóa thành công"
            });

        }
    );

});
app.put("/api/tin-tuc/:id", upload.single("hinh_anh"), (req, res) => {

    const {
        tieu_de,
        noi_dung,
        loai_tin
    } = req.body;

    let sql;
    let values;

    if (req.file) {

        sql = `
            UPDATE tin_tuc
            SET
                tieu_de=?,
                noi_dung=?,
                hinh_anh=?,
                loai_tin=?
            WHERE ma_tin_tuc=?
        `;

        values = [
            tieu_de,
            noi_dung,
            "/uploads/movies/" + req.file.filename,
            loai_tin,
            req.params.id
        ];

    } else {

        sql = `
            UPDATE tin_tuc
            SET
                tieu_de=?,
                noi_dung=?,
                loai_tin=?
            WHERE ma_tin_tuc=?
        `;

        values = [
            tieu_de,
            noi_dung,
            loai_tin,
            req.params.id
        ];

    }

    db.query(sql, values, (err) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json({
            message: "Cập nhật thành công"
        });

    });

});
app.get("/api/tin-tuc/:id", (req, res) => {

    db.query(
        "SELECT * FROM tin_tuc WHERE ma_tin_tuc = ?",
        [req.params.id],
        (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy tin tức" });
            }

            res.json(result[0]);

        }
    );

});

app.get("/api/ve-cua-toi/:maTaiKhoan", (req, res) => {

    const sql = `
        SELECT
            dv.ma_dat_ve,
            dv.tong_tien,
            dv.phuong_thuc_thanh_toan,
            dv.trang_thai,

            p.ten_phim,
            p.poster,

            r.ten_rap,

            pc.ten_phong,

            sc.ngay_chieu,
            sc.gio_bat_dau

        FROM dat_ve dv

        INNER JOIN suat_chieu sc
            ON dv.ma_suat_chieu = sc.ma_suat_chieu

        INNER JOIN phim p
            ON sc.ma_phim = p.ma_phim

        INNER JOIN phong_chieu pc
            ON sc.ma_phong = pc.ma_phong

        INNER JOIN rap_chieu r
            ON pc.ma_rap = r.ma_rap

        WHERE dv.ma_tai_khoan = ?

        ORDER BY dv.ma_dat_ve DESC
    `;

    db.query(
        sql,
        [req.params.maTaiKhoan],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});
app.get("/api/chi-tiet-ve/:maDatVe", (req, res) => {

    const sql = `
        SELECT
            dv.ma_dat_ve,
            dv.tong_tien,
            dv.phuong_thuc_thanh_toan,
            dv.trang_thai,
            dv.ngay_dat,

            p.ten_phim,
            p.poster,

            rc.ten_rap,
            pc.ten_phong,

            sc.ngay_chieu,
            sc.gio_bat_dau,

            g.so_ghe,
            ctdv.gia_ghe

        FROM dat_ve dv

        INNER JOIN suat_chieu sc
            ON dv.ma_suat_chieu = sc.ma_suat_chieu

        INNER JOIN phim p
            ON sc.ma_phim = p.ma_phim

        INNER JOIN phong_chieu pc
            ON sc.ma_phong = pc.ma_phong

        INNER JOIN rap_chieu rc
            ON pc.ma_rap = rc.ma_rap

        LEFT JOIN chi_tiet_dat_ve ctdv
            ON dv.ma_dat_ve = ctdv.ma_dat_ve

        LEFT JOIN ghe g
            ON ctdv.ma_ghe = g.ma_ghe

        WHERE dv.ma_dat_ve = ?

        ORDER BY g.so_ghe
    `;

    db.query(sql, [req.params.maDatVe], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy vé"
            });
        }

        const first = result[0];

        const ve = {

            ma_dat_ve: first.ma_dat_ve,

            tong_tien: first.tong_tien,

            phuong_thuc_thanh_toan: first.phuong_thuc_thanh_toan,

            trang_thai: first.trang_thai,

            ngay_dat: first.ngay_dat,

            ten_phim: first.ten_phim,

            poster: first.poster,

            ten_rap: first.ten_rap,

            ten_phong: first.ten_phong,

            ngay_chieu: first.ngay_chieu,

            gio_bat_dau: first.gio_bat_dau,

            ghe: result
                .filter(item => item.so_ghe)
                .map(item => item.so_ghe)
                .join(", "),

            chiTietGhe: result
                .filter(item => item.so_ghe)
                .map(item => ({
                    so_ghe: item.so_ghe,
                    gia_ghe: item.gia_ghe
                }))
        };

        res.json(ve);

    });

});
// ================= DASHBOARD =================

app.get("/api/dashboard/cards", (req, res) => {

    const type = req.query.type || "day";

    let condition = "";

    switch (type) {

        case "day":
            condition = "DATE(dv.ngay_dat)=CURDATE()";
            break;

        case "week":
            condition = "YEARWEEK(dv.ngay_dat,1)=YEARWEEK(CURDATE(),1)";
            break;

        case "month":
            condition = "MONTH(dv.ngay_dat)=MONTH(CURDATE()) AND YEAR(dv.ngay_dat)=YEAR(CURDATE())";
            break;

        case "quarter":
            condition = "QUARTER(dv.ngay_dat)=QUARTER(CURDATE()) AND YEAR(dv.ngay_dat)=YEAR(CURDATE())";
            break;

        case "year":
            condition = "YEAR(dv.ngay_dat)=YEAR(CURDATE())";
            break;

        default:
            condition = "1=1";
    }

    const sql = `
        SELECT

        (
            SELECT COUNT(*)
            FROM chi_tiet_dat_ve ct
            INNER JOIN dat_ve dv
                ON ct.ma_dat_ve = dv.ma_dat_ve
            WHERE ${condition}
            AND dv.trang_thai = 'da_thanh_toan'
        ) AS tongVe,

        (
            SELECT IFNULL(SUM(dv.tong_tien),0)
            FROM dat_ve dv
            WHERE ${condition}
            AND dv.trang_thai = 'da_thanh_toan'
        ) AS doanhThu,

        (
            SELECT COUNT(*)
            FROM tai_khoan
            WHERE vai_tro = 'khach_hang'
        ) AS thanhVien,

        (
            SELECT COUNT(*)
            FROM phim
            WHERE trang_thai = 'dang_chieu'
        ) AS phimDangChieu
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }

        res.json(result[0]);

    });

});
app.get("/api/dashboard/revenue", (req, res) => {

    const type = req.query.type || "day";

    let sql = "";

    switch (type) {

        // ================= HÔM NAY =================
        case "day":

            sql = `
                SELECT
                    HOUR(ngay_dat) AS label,
                    SUM(tong_tien) AS doanhThu
                FROM dat_ve
                WHERE DATE(ngay_dat)=CURDATE()
                AND trang_thai='da_thanh_toan'
                GROUP BY HOUR(ngay_dat)
                ORDER BY HOUR(ngay_dat)
            `;

            break;

        // ================= TUẦN =================
        case "week":

            sql = `
                SELECT
                    DAYOFWEEK(ngay_dat) AS thu,
                    DAYNAME(ngay_dat) AS label,
                    SUM(tong_tien) AS doanhThu
                FROM dat_ve
                WHERE YEARWEEK(ngay_dat,1)=YEARWEEK(CURDATE(),1)
                AND trang_thai='da_thanh_toan'
                GROUP BY DAYOFWEEK(ngay_dat),DAYNAME(ngay_dat)
                ORDER BY DAYOFWEEK(ngay_dat)
            `;

            break;

        // ================= THÁNG =================
        case "month":

            sql = `
                SELECT
                    DAY(ngay_dat) AS label,
                    SUM(tong_tien) AS doanhThu
                FROM dat_ve
                WHERE MONTH(ngay_dat)=MONTH(CURDATE())
                AND YEAR(ngay_dat)=YEAR(CURDATE())
                AND trang_thai='da_thanh_toan'
                GROUP BY DAY(ngay_dat)
                ORDER BY DAY(ngay_dat)
            `;

            break;

        // ================= QUÝ =================
        case "quarter":

            sql = `
                SELECT
                    MONTH(ngay_dat) AS label,
                    SUM(tong_tien) AS doanhThu
                FROM dat_ve
                WHERE QUARTER(ngay_dat)=QUARTER(CURDATE())
                AND YEAR(ngay_dat)=YEAR(CURDATE())
                AND trang_thai='da_thanh_toan'
                GROUP BY MONTH(ngay_dat)
                ORDER BY MONTH(ngay_dat)
            `;

            break;

        // ================= NĂM =================
        case "year":

            sql = `
                SELECT
                    MONTH(ngay_dat) AS label,
                    SUM(tong_tien) AS doanhThu
                FROM dat_ve
                WHERE YEAR(ngay_dat)=YEAR(CURDATE())
                AND trang_thai='da_thanh_toan'
                GROUP BY MONTH(ngay_dat)
                ORDER BY MONTH(ngay_dat)
            `;

            break;

        default:

            sql = `
                SELECT
                    MONTH(ngay_dat) AS label,
                    SUM(tong_tien) AS doanhThu
                FROM dat_ve
                WHERE YEAR(ngay_dat)=YEAR(CURDATE())
                AND trang_thai='da_thanh_toan'
                GROUP BY MONTH(ngay_dat)
                ORDER BY MONTH(ngay_dat)
            `;

    }

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json(err);

        }

        res.json(result);

    });

});
app.get("/api/dashboard/top-movies", (req, res) => {

    const sql = `

        SELECT

            p.ten_phim,

            COUNT(ct.ma_ghe) AS soVe,

            SUM(ct.gia_ghe) AS doanhThu

        FROM dat_ve dv

        JOIN suat_chieu sc
            ON dv.ma_suat_chieu=sc.ma_suat_chieu

        JOIN phim p
            ON sc.ma_phim=p.ma_phim

        JOIN chi_tiet_dat_ve ct
            ON dv.ma_dat_ve=ct.ma_dat_ve

        WHERE dv.trang_thai='da_thanh_toan'

        GROUP BY p.ma_phim

        ORDER BY doanhThu DESC

        LIMIT 5

    `;

    db.query(sql,(err,result)=>{

        if(err){

            console.log(err);

            return res.status(500).json(err);

        }

        res.json(result);

    });

});
app.get("/api/dashboard/top-customers", (req, res) => {

    const sql = `
        SELECT
            tk.ho_ten,
            COUNT(dv.ma_dat_ve) AS tongVe,
            SUM(dv.tong_tien) AS tongTien

        FROM tai_khoan tk

        JOIN dat_ve dv
            ON tk.ma_tai_khoan = dv.ma_tai_khoan

        WHERE dv.trang_thai='da_thanh_toan'

        GROUP BY
            tk.ma_tai_khoan,
            tk.ho_ten

        ORDER BY tongTien DESC

        LIMIT 5
    `;

    db.query(sql,(err,result)=>{

        if(err) return res.status(500).json(err);

        res.json(result);

    });

});
app.get("/api/dashboard/top-cinemas",(req,res)=>{

    const sql=`

        SELECT

            rc.ten_rap,

            SUM(dv.tong_tien) doanhThu,

            COUNT(ct.ma_ghe) soVe

        FROM rap_chieu rc

        JOIN phong_chieu pc
            ON rc.ma_rap=pc.ma_rap

        JOIN suat_chieu sc
            ON pc.ma_phong=sc.ma_phong

        JOIN dat_ve dv
            ON sc.ma_suat_chieu=dv.ma_suat_chieu

        JOIN chi_tiet_dat_ve ct
            ON dv.ma_dat_ve=ct.ma_dat_ve

        WHERE dv.trang_thai='da_thanh_toan'

        GROUP BY rc.ma_rap,rc.ten_rap

        ORDER BY doanhThu DESC

        LIMIT 5

    `;

    db.query(sql,(err,result)=>{

        if(err) return res.status(500).json(err);

        res.json(result);

    });

});
app.get("/api/dashboard/movie-pie", (req, res) => {

    const sql = `
        SELECT
            p.ten_phim AS name,
            SUM(ct.gia_ghe) AS value
        FROM dat_ve dv

        INNER JOIN suat_chieu sc
            ON dv.ma_suat_chieu = sc.ma_suat_chieu

        INNER JOIN phim p
            ON sc.ma_phim = p.ma_phim

        INNER JOIN chi_tiet_dat_ve ct
            ON dv.ma_dat_ve = ct.ma_dat_ve

        WHERE dv.trang_thai='da_thanh_toan'

        GROUP BY
            p.ma_phim,
            p.ten_phim

        ORDER BY value DESC;
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
        // ================= QLTK =================
        app.post("/api/tai-khoan", async (req, res) => {

    const {
        ho_ten,
        email,
        mat_khau,
        so_dien_thoai,
        vai_tro
    } = req.body;

    try {

        const hashPassword = await bcrypt.hash(mat_khau, 10);

        const sql = `
            INSERT INTO tai_khoan
            (
                ho_ten,
                email,
                mat_khau,
                so_dien_thoai,
                vai_tro
            )
            VALUES (?,?,?,?,?)
        `;

        db.query(
            sql,
            [
                ho_ten,
                email,
                hashPassword,
                so_dien_thoai,
                vai_tro
            ],
            (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    success: true,
                    message: "Thêm tài khoản thành công"
                });

            }
        );

    } catch (err) {

        res.status(500).json(err);

    }

});
app.put("/api/tai-khoan/:id", async (req, res) => {

    const {
        ho_ten,
        email,
        mat_khau,
        so_dien_thoai,
        vai_tro
    } = req.body;

    try {

        // Không đổi mật khẩu
        if (!mat_khau || mat_khau.trim() === "") {

            const sql = `
                UPDATE tai_khoan
                SET
                    ho_ten=?,
                    email=?,
                    so_dien_thoai=?,
                    vai_tro=?
                WHERE ma_tai_khoan=?
            `;

            db.query(
                sql,
                [
                    ho_ten,
                    email,
                    so_dien_thoai,
                    vai_tro,
                    req.params.id
                ],
                (err) => {

                    if (err)
                        return res.status(500).json(err);

                    res.json({
                        success: true
                    });

                }
            );

        }

        // Có đổi mật khẩu
        else {

            const hash = await bcrypt.hash(mat_khau, 10);

            const sql = `
                UPDATE tai_khoan
                SET
                    ho_ten=?,
                    email=?,
                    mat_khau=?,
                    so_dien_thoai=?,
                    vai_tro=?
                WHERE ma_tai_khoan=?
            `;

            db.query(
                sql,
                [
                    ho_ten,
                    email,
                    hash,
                    so_dien_thoai,
                    vai_tro,
                    req.params.id
                ],
                (err) => {

                    if (err)
                        return res.status(500).json(err);

                    res.json({
                        success: true
                    });

                }
            );

        }

    } catch (err) {

        res.status(500).json(err);

    }

});
app.get("/api/tai-khoan", (req, res) => {

    const sql = `
        SELECT
            ma_tai_khoan,
            ho_ten,
            email,
            so_dien_thoai,
            vai_tro
        FROM tai_khoan
        ORDER BY ma_tai_khoan DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
app.get("/api/admin/users", (req, res) => {

    const sql = `
        SELECT
            ma_tai_khoan,
            ho_ten,
            email,
            so_dien_thoai,
            vai_tro
        FROM tai_khoan
        ORDER BY ma_tai_khoan DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
app.put("/api/admin/users/:id", (req, res) => {

    const { id } = req.params;

    const {
        ho_ten,
        email,
        so_dien_thoai,
        vai_tro
    } = req.body;

    const sql = `
        UPDATE tai_khoan
        SET
            ho_ten=?,
            email=?,
            so_dien_thoai=?,
            vai_tro=?
        WHERE ma_tai_khoan=?
    `;

    db.query(
        sql,
        [
            ho_ten,
            email,
            so_dien_thoai,
            vai_tro,
            id
        ],
        (err) => {

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Cập nhật thành công"
            });

        }
    );

});
app.delete("/api/admin/users/:id",(req,res)=>{

    const {id}=req.params;

    db.query(
        "DELETE FROM tai_khoan WHERE ma_tai_khoan=?",
        [id],
        (err)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Đã xóa"
            });

        }
    );

});
app.put("/api/admin/users/password/:id", async(req,res)=>{

    const {id}=req.params;

    const {password}=req.body;

    const hash=await bcrypt.hash(password,10);

    db.query(
        `
        UPDATE tai_khoan
        SET mat_khau=?
        WHERE ma_tai_khoan=?
        `,
        [
            hash,
            id
        ],
        (err)=>{

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                message:"Đổi mật khẩu thành công"
            });

        }
    );

});
app.post("/api/admin/users", async (req, res) => {

    const {
        ho_ten,
        email,
        so_dien_thoai,
        mat_khau,
        vai_tro
    } = req.body;

    try {

        // Kiểm tra email đã tồn tại
        db.query(
            "SELECT * FROM tai_khoan WHERE email = ?",
            [email],
            async (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        message: "Email đã tồn tại"
                    });
                }

                // Mã hóa mật khẩu
                const hash = await bcrypt.hash(mat_khau, 10);

                const sql = `
                    INSERT INTO tai_khoan
                    (
                        ho_ten,
                        email,
                        so_dien_thoai,
                        mat_khau,
                        vai_tro
                    )
                    VALUES (?, ?, ?, ?, ?)
                `;

                db.query(
                    sql,
                    [
                        ho_ten,
                        email,
                        so_dien_thoai,
                        hash,
                        vai_tro
                    ],
                    (err, result) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }

                        res.json({
                            success: true,
                            message: "Thêm tài khoản thành công",
                            id: result.insertId
                        });

                    }
                );

            }
        );

    } catch (err) {

        console.log(err);

        res.status(500).json(err);

    }

});
app.get("/api/phong-chieu", (req, res) => {
    // 1. Lấy ma_rap từ query
    const ma_rap = req.query.ma_rap;

    // In ra terminal backend để kiểm tra
    console.log("-> Query ma_rap nhận được:", ma_rap);

    let sql = "SELECT ma_phong, ma_rap, ten_phong FROM phong_chieu";
    let values = [];

    // 2. Ép điều kiện lọc (kiểm tra chặt chẽ chuỗi rỗng)
    if (ma_rap && ma_rap !== "" && ma_rap !== "undefined") {
        sql += " WHERE ma_rap = ?";
        values.push(Number(ma_rap)); // Ép về kiểu Số
    }

    sql += " ORDER BY ten_phong ASC";

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Lỗi SQL:", err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

const path = require("path");

// Cho phép truy cập static tất cả nội dung trong thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(5000, () => {
    console.log('Server chạy cổng 5000');
});