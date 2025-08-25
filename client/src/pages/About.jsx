import React from "react";

const About = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-['Merriweather'] font-bold text-green-800 mb-4">
            Sobre Dietética Yuyo
          </h1>
          <p className="text-xl text-gray-600">
            Tu fuente de productos naturales y orgánicos desde 2020
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-['Merriweather'] font-bold text-green-800 mb-6">
            Nuestra Historia
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              Dietética Yuyo nació de la pasión por una vida más saludable y el respeto por la naturaleza. 
              Fundada en 2010 por un grupo de profesionales de la salud y amantes de la alimentación consciente, 
              nuestra misión siempre ha sido acercar productos naturales y orgánicos de la más alta calidad a 
              nuestros clientes.
            </p>
            <p className="text-gray-600 mb-4">
              Lo que comenzó como una pequeña tienda en Buenos Aires, hoy se ha convertido en un referente 
              en el mercado de productos naturales, ofreciendo una amplia variedad de alimentos orgánicos, 
              suplementos naturales y productos para el cuidado personal.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-['Merriweather'] font-bold text-green-800 mb-6">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Calidad</h3>
              <p className="text-gray-600">
                Seleccionamos cuidadosamente cada producto, asegurando que cumpla con los más altos 
                estándares de calidad y pureza.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Sustentabilidad</h3>
              <p className="text-gray-600">
                Promovemos prácticas sostenibles y trabajamos con proveedores que comparten nuestro 
                compromiso con el medio ambiente.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Bienestar</h3>
              <p className="text-gray-600">
                Creemos en el poder de la alimentación natural para mejorar la calidad de vida y 
                promover el bienestar integral.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-8 rounded-lg">
          <h2 className="text-2xl font-['Merriweather'] font-bold text-green-800 mb-6">
            Nuestro Compromiso
          </h2>
          <p className="text-gray-600 mb-4">
            En Dietética Yuyo, nos comprometemos a ofrecer productos que no solo nutran el cuerpo, 
            sino que también respeten el planeta. Trabajamos constantemente para expandir nuestra 
            selección de productos orgánicos y naturales, siempre manteniendo nuestros estándares 
            de calidad y sostenibilidad.
          </p>
          <p className="text-gray-600">
            Nuestro equipo de expertos está siempre disponible para asesorarte y ayudarte a encontrar 
            los productos que mejor se adapten a tus necesidades y estilo de vida.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
