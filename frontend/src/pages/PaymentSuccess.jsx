import { useEffect } from "react";

function PaymentSuccess() {

    useEffect(() => {

        alert("Thanh toán thành công!");

    }, []);

    return (

        <div className="container text-center mt-5">

            <h2>Thanh toán thành công</h2>

        </div>

    );

}

export default PaymentSuccess;