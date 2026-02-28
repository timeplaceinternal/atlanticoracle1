import React from 'react';

const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050510] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </div>
  );
};

export default CosmicBackground;
