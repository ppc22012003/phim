import { useState } from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ phim }) {

    const [showTrailer, setShowTrailer] =
        useState(false);

    const getYoutubeEmbed = (url) => {

        if (!url) return "";

        let videoId = "";

        if (url.includes("watch?v=")) {

            videoId =
                url.split("watch?v=")[1]
                   ?.split("&")[0];

        } else if (url.includes("youtu.be/")) {

            videoId =
                url.split("youtu.be/")[1]
                   ?.split("?")[0];

        }

        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    };

    return (
        <>
            <div className="card h-100 shadow-sm border-0">

                <img
                    src={
                        phim.poster
                            ? `http://localhost:5000${phim.poster}`
                            : "https://via.placeholder.com/300x450"
                    }
                    alt={phim.ten_phim}
                    className="card-img-top"
                    style={{
                        height: "420px",
                        objectFit: "cover",
                        cursor: "pointer"
                    }}
                    onClick={() =>
                        setShowTrailer(true)
                    }
                />

                <div className="card-body">

                    <Link
    to={`/phim/${phim.ma_phim}`}
    style={{
        textDecoration: "none"
    }}
>
    <h5
        className="fw-bold movie-title"
        style={{
            color: "#0d6efd",
            transition: "0.3s"
        }}
    >
        {phim.ten_phim}
    </h5>
</Link>

                    <p className="mb-1">
                        <strong>Thể loại:</strong>{" "}
                        {phim.the_loai}
                    </p>

                    <p className="mb-1">
                        <strong>Thời lượng:</strong>{" "}
                        {phim.thoi_luong} phút
                    </p>

                    <p className="mb-0">
                        <strong>Độ tuổi:</strong>{" "}
                        {phim.gioi_han_do_tuoi}
                    </p>

                </div>

            </div>

            {showTrailer && (

                <div
                    className="modal d-block"
                    style={{
                        backgroundColor:
                            "rgba(0,0,0,0.8)"
                    }}
                >

                    <div className="modal-dialog modal-xl">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Trailer - {phim.ten_phim}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setShowTrailer(false)
                                    }
                                />

                            </div>

                            <div className="modal-body">

                                <iframe
                                    width="100%"
                                    height="600"
                                    src={getYoutubeEmbed(
                                        phim.trailer
                                    )}
                                    title="Trailer"
                                    frameBorder="0"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                />

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}

export default MovieCard;
