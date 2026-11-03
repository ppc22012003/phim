import { Navigate } from "react-router-dom";

function ProtectedAdminRoute({ children }) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.vai_tro !== "quan_tri") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedAdminRoute;