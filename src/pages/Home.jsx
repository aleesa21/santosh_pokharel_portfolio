import React from "react";
import HeroSection from "../components/HeroSection";
import About from "../components/About";
import Video from "../components/Video";
import Contact from "../components/Contact";

function Home() {
  return (
    <>
      <HeroSection />
      <Video />
      <About />             
      <Contact />
      
    </>
  );
}

export default Home;
