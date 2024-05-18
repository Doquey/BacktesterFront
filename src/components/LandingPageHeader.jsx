import React from "react";

const LandingPageHeader = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-5xl font-extrabold text-white mb-4 animate-bounce">
        Bem vindo ao <span className="text-yellow-400">BRBT</span>
      </h1>
      <p className="text-lg text-gray-200 max-w-2xl mx-auto">
        Utilize nossa plataforma para testar diferentes estratégias de
        investimento, e obtenha insights valiosos sobre o desempenho histórico
        de suas carteiras.
      </p>
    </div>
  );
};

export default LandingPageHeader;
