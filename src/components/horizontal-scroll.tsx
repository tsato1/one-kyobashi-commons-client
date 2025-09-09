"use client";

import { useEffect } from "react";
import { animate, scroll } from "motion";

const images = [
  { src: "/photos/cityscape/1.jpg", label: "#001" },
  { src: "/photos/cityscape/2.jpg", label: "#002" },
  { src: "/photos/cityscape/3.jpg", label: "#003" },
  { src: "/photos/cityscape/4.jpg", label: "#004" },
  { src: "/photos/cityscape/5.jpg", label: "#005" },
];

export default function Gallery() {
  useEffect(() => {
    const items = document.querySelectorAll(".img-container");

    // Animate gallery horizontally during vertical scroll
    scroll(
      animate(".img-group", {
        transform: ["none", `translateX(-${items.length - 1}00vw)`],
      }),
      { target: document.querySelector(".img-group-container") as Element }
    );

    // Progress bar representing gallery scroll
    scroll(animate(".progress", { scaleX: [0, 1] }), {
      target: document.querySelector(".img-group-container") as Element,
    });
  }, []);

  return (
    <>
      <article id="gallery" className="w-[98vw]">
        {/* Header */}
        <header className="h-[70vh] flex justify-center items-center">
          <h2 className="text-[56px] font-bold tracking-[-3px] leading-tight text-center m-0">
            Lines of London
          </h2>
        </header>

        {/* Scroll Section */}
        <section className="img-group-container h-[500vh] relative">
          <div className="sticky top-0 overflow-hidden h-screen">
            <ul className="img-group flex">
              {images.map((img, idx) => (
                <li
                  key={idx}
                  className="img-container flex flex-col w-screen h-screen flex-shrink-0 items-center justify-center"
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-[300px] h-[400px]" />
                  <h3 className="m-0 text-[50px] font-bold tracking-[-3px] leading-tight relative bottom-[30px] inline-block">
                    {img.label}
                  </h3>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer className="h-[70vh] flex justify-center items-center">
          <p>
            Photos by{" "}
            <a
              target="_blank"
              href="https://twitter.com/mattgperry"
              className="underline text-blue-600"
            >
              Matt Perry
            </a>
          </p>
        </footer>
      </article>

      {/* Progress bar */}
      <div className="progress fixed left-0 right-0 bottom-[50px] h-[5px] bg-[#9911ff] origin-left scale-x-0"></div>
    </>
  );
}
