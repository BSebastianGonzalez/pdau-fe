import React, { useState, useEffect, useRef } from "react";

const CategorySelector = ({ categories, onSelect }) => {
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(""); // Estado para manejar el mensaje de error
  const dropdownRef = useRef(null); // Referencia para detectar clics fuera

  useEffect(() => {
    // Filtrar categorías cuando cambie la búsqueda o las categorías
    setFilteredCategories(
      categories.filter(
        (category) =>
          category.nombre.toLowerCase().includes(search.toLowerCase()) &&
          !selectedCategories.some((selected) => selected.id === category.id)
      )
    );
  }, [search, categories, selectedCategories]);

  const handleSelect = (category) => {
    if (!selectedCategories.some((selected) => selected.id === category.id)) {
      const updatedCategories = [...selectedCategories, category];
      setSelectedCategories(updatedCategories);
      onSelect(updatedCategories); // Notifica al padre las categorías seleccionadas
      setError(""); // Limpia el mensaje de error si se selecciona una categoría
    }
    setSearch("");
    setIsOpen(false);
  };

  const handleRemove = (category) => {
    const updatedCategories = selectedCategories.filter(
      (item) => item.id !== category.id
    );
    setSelectedCategories(updatedCategories);
    onSelect(updatedCategories); // Notifica al padre las categorías seleccionadas
  };

  // Maneja clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (selectedCategories.length === 0) {
          setError("Se debe seleccionar al menos una categoría");
        }
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedCategories]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedCategories.map((category) => (
          <div
            key={category.id}
            className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-md"
          >
            <span>{category.nombre}</span>
            <button
              onClick={() => handleRemove(category)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Selecciona una categoría"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isOpen && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
          {filteredCategories.map((category) => (
            <li
              key={category.id}
              onClick={() => handleSelect(category)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {category.nombre}
            </li>
          ))}
          {filteredCategories.length === 0 && (
            <li className="p-2 text-gray-500">No se encontraron categorías</li>
          )}
        </ul>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CategorySelector;