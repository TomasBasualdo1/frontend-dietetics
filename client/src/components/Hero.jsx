import React from "react";
import { Link } from "react-router-dom";
import heroImg from '../images/hero.jpg';

const Hero = () => {
  return (
    <div
      className="relative h-[400px] md:h-[500px] flex items-center justify-center text-white"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="z-10 text-center p-4">
        <h1 className="text-4xl md:text-5xl font-bold font-['Merriweather'] mb-4">
          Dietética Yuyo
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Tu fuente de productos naturales y orgánicos
        </p>
        <Link
          to="/shop"
          className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg"
        >
          Explorar Productos
        </Link>
      </div>
    </div>
  );
};

export default Hero;
