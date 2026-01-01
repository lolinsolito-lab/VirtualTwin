
import React from 'react';
import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import Logic from './components/sections/Logic';
import Performance from './components/sections/Performance';
import Infrastructure from './components/sections/Infrastructure';
import Inquiry from './components/sections/Inquiry';
import Footer from './components/sections/Footer';

const App: React.FC = () => {
  return (
    <div className="selection:bg-[#C5A059] selection:text-black min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Logic />
        <Performance />
        <Infrastructure />
        <Inquiry />
      </main>
      <Footer />
    </div>
  );
};

export default App;
