import PolicyLayout from "../components/PolicyLayout";

export default function TermsPage() {
    return (
        <PolicyLayout title="Terms and Conditions">
        <p>
            Welcome to YADHRONICS PRIVATE LIMITED. By accessing or using our
            website, you agree to comply with and be bound by the following terms
            and conditions.
        </p>
        <ul className="list-disc ml-6 space-y-2">
            <li>
            All purchases are subject to product availability and payment
            confirmation.
            </li>
            <li>
            Prices, offers, and availability are subject to change without prior
            notice.
            </li>
            <li>
            Customers are responsible for providing accurate shipping information.
            </li>
            <li>
            We reserve the right to refuse service or cancel orders at our
            discretion.
            </li>
        </ul>
        <p>
            For any questions, contact us at{" "}
            <strong>yadhronics.edukid@gmail.com</strong>.
        </p>
        </PolicyLayout>
    );
}
