import React from "react";

function HeroSection() {
  return (
    <section className="bg-background h-full">
      <div className="flex h-full">
        <div className="left-texts w-full h-full border border-red-500">
          <div className="">on air.ntv nepal</div>
          <div className="">
            <h1>santosh pokharel</h1>
            <h2>nepali ma santosh pokharel</h2>
            <div className="">
              <span>senior reporter</span>
              <span>8+years </span>
            </div>
          </div>
          <p>paragraph</p>
          <div className="btns">
            <button>watch latest</button>
            <button>read blog</button>
          </div>
        </div>
        <div className="right-image  w-full h-full border border-yellow-500"></div>
      </div>
      <div className="marquee"></div>
    </section>
  );
}

export default HeroSection;
