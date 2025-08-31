import PolicyLayout from "../components/PolicyLayout";

export default function CancellationRefundPage() {
    return (
        <PolicyLayout title="Cancellation and Refund Policy">
        <p>
            Orders once placed can be cancelled within 2-3 business days by contacting us at{" "}
            <strong>yadhronics.edukid@gmail.com</strong>.
        </p>
        <p>
            Refunds will be processed to the original payment method within 7–10
            business days, subject to bank/payment gateway timelines.
        </p>
        <p>
            No refunds will be provided once the product has been shipped, unless
            the product is defective or damaged during transit.
        </p>
        </PolicyLayout>
    );
}
