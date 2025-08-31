"use client";
import { useEffect, useState } from "react";

const images = ["https://d19u8jta4am29c.cloudfront.net/quality.png", "https://d19u8jta4am29c.cloudfront.net/bestplace.png"];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade-out
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true); // fade back in
      }, 500); // fade duration
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        margin: "20px",
        borderRadius: "12px",
        overflow: "hidden",
        minHeight: "320px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        position: "relative",
      }}
    >
      <img
        src={images[current]}
        alt="Hero"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          transition: "opacity 0.5s ease-in-out",
          opacity: fade ? 1 : 0,
        }}
      />
    </div>
  );
};

export default Hero;
