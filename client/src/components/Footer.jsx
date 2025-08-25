import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-green-900 text-white py-10 font-['Montserrat']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Institucional</h3>
            <ul>
              <li className="mb-2">
                <Link to="/about" className="hover:underline" onClick={handleLinkClick}>
                  Sobre Dietética Yuyo
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline" onClick={handleLinkClick}>
                  Condiciones de Envío
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline" onClick={handleLinkClick}>
                  Términos y Condiciones
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline" onClick={handleLinkClick}>
                  Ventas Corporativas
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline" onClick={handleLinkClick}>
                  Trabaja con Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Ayuda</h3>
            <ul>
              <li className="mb-2">
                <Link to="#" className="hover:underline" onClick={handleLinkClick}>
                  Cómo comprar
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline" onClick={handleLinkClick}>
                  Medios de Pago
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline" onClick={handleLinkClick}>
                  Política de cambios
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline" onClick={handleLinkClick}>
                  Ventas Mayoristas y Franquicias
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="hover:underline" onClick={handleLinkClick}>
                  Locales Asociados
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contáctanos</h3>
            <p className="mb-2">📞 +54 9 11 2796-9705</p>
            <p className="mb-2">📧 info@dieteticayuyo.com.ar</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">
              Recibí nuestras novedades
            </h3>
            <p className="text-sm mb-4">
              Suscribite y recibí descuentos exclusivos.
            </p>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                placeholder="Tu email acá"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 rounded-l-md w-full text-green-600 border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-400"
                required
              />
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-600 p-2 rounded-r-md transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-green-800 mt-10 pt-6 text-center text-sm text-green-200">
          <p>
            Copyright Dietética Yuyo - {new Date().getFullYear()}. Todos los
            derechos reservados.{" "}
            <Link to="#" className="hover:underline" onClick={handleLinkClick}>
              Defensa de las y los consumidores
            </Link>
            . Para reclamos ingrese{" "}
            <Link to="#" className="hover:underline" onClick={handleLinkClick}>
              aquí
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
