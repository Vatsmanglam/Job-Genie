import React from 'react';
import './HeroSection.css'; // Assuming you have some CSS for HeroSection

const HeroSection = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-8xl font-black bg-gradient-to-r from-pink-600 via-green-500 to-purple-400 inline-block text-transparent bg-clip-text">
        JobGenie
      </h1>
      <img src="..\Job search.gif" alt="Logo" className="my-8" />
      <h2 className="my-8 text-2xl font-semibold bg-gradient-to-r from-pink-600 via-green-500 to-purple-400 inline-block text-transparent bg-clip-text">
        Unlocking Opportunities, Empowering Careers
      </h2>
    </div>
  );
};

export default HeroSection;