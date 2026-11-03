import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  CalendarDays,
  Building2,
  DoorOpen,
  Armchair,
  Image,
  Newspaper,
  Users,
  LogOut,
} from "lucide-react";

function AdminLayout() {
  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Quản lý phim",
      path: "/admin/movies",
      icon: <Film size={20} />,
    },
    {
      name: "Quản lý suất chiếu",
      path: "/admin/showtimes",
      icon: <CalendarDays size={20} />,
    },
    {
      name: "Quản lý rạp",
      path: "/admin/cinemas",
      icon: <Building2 size={20} />,
    },
  
   
  
    {
      name: "Tin tức",
      path: "/admin/news",
      icon: <Newspaper size={20} />,
    },
    {
      name: "Tài khoản",
      path: "/admin/users",
      icon: <Users size={20} />,
    },
  ];

  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "270px",
          background: "#212529",
          color: "#fff",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          overflowY: "auto",
        }}
      >
        <div
          className="text-center py-4"
          style={{
            borderBottom: "1px solid rgba(255,255,255,.1)",
          }}
        >
          <h3
            className="fw-bold mb-1"
            style={{
              color: "#ffc107",
            }}
          >
            🎬 ADMIN
          </h3>

          <small className="text-light">
            Hệ thống quản lý rạp phim
          </small>
        </div>

        <div className="p-3">
          {menus.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="d-flex align-items-center text-decoration-none mb-2"
              style={{
                padding: "13px 16px",
                borderRadius: "10px",
                color:
                  location.pathname === item.path
                    ? "#fff"
                    : "#ced4da",
                background:
                  location.pathname === item.path
                    ? "#dc3545"
                    : "transparent",
                transition: ".25s",
                fontWeight: "600",
              }}
            >
              {item.icon}

              <span className="ms-3">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
          }}
        >
          <Link
            to="/"
            className="text-decoration-none d-flex align-items-center px-4 py-3"
            style={{
              color: "#fff",
              borderTop: "1px solid rgba(255,255,255,.1)",
            }}
          >
            <LogOut size={20} />

            <span className="ms-3">
              Về trang chủ
            </span>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: "270px",
        }}
      >
        {/* Header */}
        <div
          className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div>
            <h4 className="mb-0 fw-bold">
              Trang quản trị
            </h4>

            <small className="text-muted">
              Hệ thống quản lý đặt vé xem phim
            </small>
          </div>

          <div
            className="fw-semibold"
            style={{
              color: "#dc3545",
            }}
          >
            Xin chào, Quản trị viên 👋
          </div>
        </div>

        {/* Nội dung */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;