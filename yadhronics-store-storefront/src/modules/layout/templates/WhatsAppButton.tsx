"use client"
import { FaWhatsapp } from "react-icons/fa"

const WhatsAppButton = () => {
    return (
        <a
        href="https://wa.me/9952278911"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
        >
        <FaWhatsapp size={28} />
        </a>
    )
}

export default WhatsAppButton
