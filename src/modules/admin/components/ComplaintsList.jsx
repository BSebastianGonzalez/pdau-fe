import React, { useState, useEffect } from "react";
import ComplaintService from "../../../services/ComplaintService";
import ListContainer from "../../../components/ListContainer";
import Tag from "../../../components/Tag";

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsData = await ComplaintService.getUnarchivedComplaints();
        const categoriesData = await ComplaintService.getAllCategories();
        setComplaints(complaintsData);
        setFilteredComplaints(complaintsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const applyFilters = async () => {
    try {
      let filtered = [];

      if (selectedCategoryId) {
        filtered = await ComplaintService.getComplaintsByCategory(selectedCategoryId);
      } else {
        filtered = complaints;
      }

      if (keyword) {
        filtered = filtered.filter((complaint) =>
          complaint.titulo.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      setFilteredComplaints(filtered);
      setCurrentPage(1);
      toggleFilterModal();
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
    }
  };

  const clearCategoryFilter = () => {
    setSelectedCategoryId("");
    setSelectedCategoryName("");
    setFilteredComplaints(complaints);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Denuncias anónimas</h1>

      <div className="mb-4 flex justify-between items-center">
        {selectedCategoryName && (
          <Tag text={`Categoría: ${selectedCategoryName}`} onRemove={clearCategoryFilter} />
        )}
        <button
          onClick={toggleFilterModal}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg shadow hover:bg-gray-300"
        >
          <img src="img/filter.svg" alt="Filtro" className="w-5 h-5" />
          Aplicar filtros de búsqueda
        </button>
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-white/10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Filtrar denuncias</h2>
            <div className="mb-4">
              <label htmlFor="category" className="block text-lg font-medium mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={selectedCategoryId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedName =
                    categories.find((cat) => String(cat.id) === selectedId)?.nombre || "";
                  setSelectedCategoryId(selectedId);
                  setSelectedCategoryName(selectedName);
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="keyword" className="block text-lg font-medium mb-2">
                Palabras clave
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Buscar por título"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={toggleFilterModal}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      <ListContainer
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredComplaints.length}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      >
        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Título de denuncia</th>
                <th className="px-4 py-2 text-left">Fecha de realización</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-base-600 hover:underline cursor-pointer">
                    {complaint.titulo}
                  </td>
                  <td className="px-4 py-2">{formatDate(complaint.fechaCreacion)}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        console.log(`Revisar denuncia con ID: ${complaint.id}`)
                      }
                      className="flex items-center gap-2 text-base-600 hover:underline"
                    >
                      <img
                        src="img/check_complaint.svg"
                        alt="Revisar"
                        className="w-5 h-5"
                      />
                      Revisar denuncia
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ListContainer>
    </div>
  );
};

export default ComplaintsList;
