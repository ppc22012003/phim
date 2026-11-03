import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ChiTietPhim from "./pages/ChiTietPhim";

import Dashboard from "./admin/Dashboard";
import MovieList from "./admin/MovieList";
import AddMovie from "./admin/AddMovie";
import EditMovie from "./admin/EditMovie";
import BannerList from "./admin/BannerList";
import NewsList from "./admin/NewsList";
import ShowtimeList from "./admin/ShowtimeList";
import AddShowtime from "./admin/AddShowtime";
import LichChieu from "./pages/LichChieu";
import EditShowtime from "./admin/EditShowtime";
import DatVe from "./pages/DatVe";
import ThanhToan from "./pages/ThanhToan";
import QuanLyRap from "./admin/QuanLyRap";
import Register from "./pages/Register";
import DanhSachPhim from "./pages/DanhSachPhim";
import DanhSachRap from "./pages/DanhSachRap";
import PaymentSuccess from "./pages/PaymentSuccess";
import MomoReturn from "./pages/MomoReturn";
import AddNews from "./admin/AddNews";
import EditNews from "./admin/EditNews";
import VeCuaToi from "./pages/VeCuaToi";
import ChiTietVe from "./pages/ChiTietVe";
import AdminUsers from "./admin/AdminUsers";
import TinTuc from "./pages/TinTuc";
import ChiTietTinTuc from "./pages/ChiTietTinTuc";


import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* USER */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route 
                    path="/register" 
                    element={<Register />} 
                />
                <Route
                    path="/phim/:id"
                    element={<ChiTietPhim />}
                />
                                  <Route
                    path="/lich-chieu"
                    element={<LichChieu />}
                />
             
                <Route
                    path="/dat-ve/:id"
                    element={<DatVe />}
                />
                <Route
                    path="/thanh-toan/:id"
                    element={<ThanhToan />}
                />
                <Route
                     path="/phim"
                     element={<DanhSachPhim />}
                />
                <Route
                    path="/rap"
                    element={<DanhSachRap />}
                />
                <Route
                    path="/payment-success"
                    element={<PaymentSuccess />}
                />
                <Route
                    path="/momo-return"
                    element={<MomoReturn />}
                />
                <Route
    path="/ve-cua-toi"
    element={<VeCuaToi />}
/>
<Route
    path="/chi-tiet-ve/:maDatVe"
    element={<ChiTietVe/>}
/>
<Route
    path="/tin-tuc"
    element={<TinTuc />}
/>

<Route
    path="/tin-tuc/:id"
    element={<ChiTietTinTuc />}
/>

                {/* ADMIN */}
            <Route
    path="/admin"
    element={
        <ProtectedAdminRoute>
            <AdminLayout />
        </ProtectedAdminRoute>
    }
>

    <Route
        index
        element={<Dashboard />}
    />

    <Route
        path="movies"
        element={<MovieList />}
    />

    <Route
        path="movies/add"
        element={<AddMovie />}
    />

    <Route
        path="movies/edit/:id"
        element={<EditMovie />}
    />

    <Route
        path="showtimes"
        element={<ShowtimeList />}
    />

    <Route
        path="showtimes/add"
        element={<AddShowtime />}
    />

    <Route
        path="showtimes/edit/:id"
        element={<EditShowtime />}
    />

    <Route
        path="cinemas"
        element={<QuanLyRap />}
    />

    <Route
        path="banners"
        element={<BannerList />}
    />

    <Route
        path="news"
        element={<NewsList />}
    />

    <Route
        path="news/add"
        element={<AddNews />}
    />

    <Route
        path="news/edit/:id"
        element={<EditNews />}
    />

    <Route
        path="users"
        element={<AdminUsers />}
    />

</Route>
                    
                   
            </Routes>
            

        </BrowserRouter>

    );
}

export default App;