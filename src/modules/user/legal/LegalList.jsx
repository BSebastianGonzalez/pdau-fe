import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListContainer from "../../../components/ListContainer";
import Button from "../../../components/Button";

const LegalList = () => {
  const laws = [
    {
      id: 1,
      name: "Constitución Política de Colombia - Artículo 20",
      description:
        "Garantiza la libertad de expresión y el derecho a informar y recibir información veraz e imparcial. Fundamenta la posibilidad de realizar denuncias de manera libre, incluso de forma anónima.",
    },
    {
      id: 2,
      name: "Constitución Política de Colombia - Artículo 23",
      description:
        "Reconoce el derecho de toda persona a presentar peticiones respetuosas a las autoridades y a obtener pronta respuesta. Este artículo respalda el uso de canales de denuncia, incluidos los digitales.",
    },
    {
      id: 3,
      name: "Constitución Política de Colombia - Artículo 74",
      description:
        "Establece el derecho de acceso a documentos públicos y promueve la participación ciudadana en la vigilancia de la gestión pública, incluidos entornos como el universitario.",
    },
    {
      id: 4,
      name: "Ley 1755 de 2015 - Derecho de Petición",
      description:
        "Regula el derecho fundamental de petición en sus diferentes modalidades: quejas, reclamos, denuncias, sugerencias y consultas. Aplica tanto a entidades públicas como privadas que presten funciones públicas, como las universidades estatales.",
    },
    {
      id: 5,
      name: "Ley 1757 de 2015 - Participación Ciudadana",
      description:
        "Promueve mecanismos de control social y participación en la gestión pública, incluyendo veedurías ciudadanas, observatorios y otras formas de vigilancia ciudadana.",
    },
    {
      id: 6,
      name: "Ley 1712 de 2014 - Ley de Transparencia y del Derecho de Acceso a la Información Pública",
      description:
        "Garantiza el acceso libre a la información pública, bajo el principio de máxima divulgación. Obliga a entidades públicas (y privadas que presten servicios públicos) a facilitar información sin restricciones indebidas.",
    },
    {
      id: 7,
      name: "Decreto 1081 de 2015",
      description:
        "Reglamenta parcialmente la Ley 1712 de 2014, estableciendo procedimientos, plazos y criterios para la entrega y publicación de información pública.",
    },
    {
      id: 8,
      name: "Ley 1581 de 2012 - Ley de Protección de Datos Personales",
      description:
        "Establece principios y normas para el tratamiento de datos personales, garantizando el derecho a la privacidad, el consentimiento informado y el anonimato, fundamentales para plataformas de denuncias anónimas.",
    },
    {
      id: 9,
      name: "Decreto 1377 de 2013",
      description:
        "Reglamenta parcialmente la Ley 1581 de 2012, estableciendo lineamientos sobre el manejo, seguridad y confidencialidad de los datos personales recolectados por las entidades.",
    },
    {
      id: 10,
      name: "Ley 1474 de 2011 - Estatuto Anticorrupción",
      description:
        "Incluye disposiciones para la protección de informantes en casos de corrupción, garantizando la reserva de identidad y evitando represalias. Es un respaldo legal clave para plataformas de denuncias anónimas.",
    },
    {
      id: 11,
      name: "Ley 1621 de 2013 - Ley de Inteligencia y Contrainteligencia",
      description:
        "Aunque dirigida a organismos de seguridad, establece principios de confidencialidad que pueden aplicarse a sistemas de denuncia internos para proteger la identidad de los denunciantes.",
    },
    {
      id: 12,
      name: "Ley 30 de 1992 - Ley de Educación Superior",
      description:
        "Reconoce la autonomía universitaria para crear reglamentos internos, incluyendo mecanismos de convivencia y denuncia. Facilita la adopción de plataformas digitales de denuncia dentro del marco institucional.",
    },
    {
      id: 13,
      name: "Ley 1010 de 2006 - Ley de Acoso Laboral",
      description:
        "Establece mecanismos para prevenir, corregir y sancionar el acoso laboral, incluyendo la protección de los denunciantes. Aplica a entornos laborales, incluyendo instituciones educativas, y respalda la implementación de canales de denuncia confidenciales.",
    },
    {
      id: 14,
      name: "Ley 1257 de 2008 - Ley de Violencia contra la Mujer",
      description:
        "Define y sanciona diversas formas de violencia contra las mujeres, incluyendo la violencia psicológica y sexual. Promueve la creación de mecanismos de denuncia seguros y confidenciales en instituciones, como las universidades.",
    },
    {
      id: 15,
      name: "Ley 1098 de 2006 - Código de Infancia y Adolescencia",
      description:
        "Establece normas para la protección integral de niños, niñas y adolescentes, incluyendo el derecho a la intimidad y a la protección contra toda forma de violencia. Relevante para universidades con estudiantes menores de edad.",
    },
    {
      id: 16,
      name: "Ley 1908 de 2018 - Ley de Fortalecimiento de la Investigación y Judicialización de Organizaciones Criminales",
      description:
        "Fortalece los mecanismos de investigación y judicialización de organizaciones criminales, incluyendo medidas para proteger a los denunciantes y testigos, lo cual es aplicable en contextos universitarios donde se denuncien actividades ilícitas.",
    },
    {
      id: 17,
      name: "Ley 906 de 2004 - Código de Procedimiento Penal",
      description:
        "Establece el procedimiento penal en Colombia, incluyendo medidas de protección para víctimas y testigos. El artículo 342 contempla la adopción de medidas necesarias para ofrecer eficaz protección a víctimas y testigos, lo cual respalda la confidencialidad en las denuncias.",
    },
  ];

  const [filteredLaws, setFilteredLaws] = useState(laws);
  const [keyword, setKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1); 

  const navigate = useNavigate();

  const handleRowClick = (lawId) => {
    navigate(`/${lawId}`);
  };

  // Filtrado
  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    setKeyword(keyword);

    const filtered = laws.filter(
      (law) =>
        law.name.toLowerCase().includes(keyword) ||
        law.description.toLowerCase().includes(keyword)
    );

    setFilteredLaws(filtered);
    setCurrentPage(1); // 👉 Reiniciar página cuando se filtra
  };

  // Calcular el índice de inicio y fin
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaws = filteredLaws.slice(startIndex, endIndex);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Listado de Leyes</h1>

      {/* Filtro y selector "Mostrar" en la misma fila */}
      <div className="mb-4 flex justify-between items-center gap-4">
        {/* Campo de búsqueda */}
        <input
          type="text"
          value={keyword}
          onChange={handleFilter}
          placeholder="Buscar por nombre o descripción"
          className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
        />

        {/* Selector de elementos por página */}
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-lg font-medium">
            Mostrar:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // 👉 Reiniciar página
            }}
            className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <ListContainer
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredLaws.length}
        onPageChange={setCurrentPage}
      >
        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {currentLaws.map((law) => (
                <tr
                  key={law.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(law.id)}
                >
                  <td
                    className="px-4 py-2 font-bold truncate"
                    style={{
                      maxWidth: "300px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {law.name}
                  </td>
                  <td
                    className="px-4 py-2 truncate"
                    style={{
                      maxWidth: "500px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {law.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListContainer>

      {/* Botón "Volver" */}
      <div className="mt-6 flex justify-start">
        <Link to="/">
          <Button
            text="Volver"
            className="bg-red-500 text-white hover:bg-red-600"
          />
        </Link>
      </div>
    </div>
  );
};

export default LegalList;
