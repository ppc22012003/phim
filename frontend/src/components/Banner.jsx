function Banner() {

    const banners = [
        'http://localhost:5000/uploads/banners/b1.jpg',
        'http://localhost:5000/uploads/banners/b2.jpg',
        'http://localhost:5000/uploads/banners/b3.jpg',
        'http://localhost:5000/uploads/banners/b4.jpg',
        'http://localhost:5000/uploads/banners/b5.jpg'
    ];

    return (

        <div
            id="bannerCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
        >

            {/* CHẤM CHẤM */}
            <div className="carousel-indicators">

                {banners.map((banner, index) => (

                    <button
                        key={index}
                        type="button"
                        data-bs-target="#bannerCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                    ></button>

                ))}

            </div>

            {/* DANH SÁCH ẢNH */}
            <div className="carousel-inner">

                {banners.map((banner, index) => (

                    <div
                        key={index}
                        className={
                            index === 0
                            ? 'carousel-item active'
                            : 'carousel-item'
                        }
                    >

                        <img
                            src={banner}
                            className="d-block w-100"
                            alt="banner"
                            style={{
                                height: '500px',
                                objectFit: 'cover'
                            }}
                        />

                    </div>

                ))}

            </div>

            {/* NÚT PREV */}
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#bannerCarousel"
                data-bs-slide="prev"
            >

                <span className="carousel-control-prev-icon"></span>

            </button>

            {/* NÚT NEXT */}
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#bannerCarousel"
                data-bs-slide="next"
            >

                <span className="carousel-control-next-icon"></span>

            </button>

        </div>

    );
}

export default Banner;