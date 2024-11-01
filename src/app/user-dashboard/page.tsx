// src/app/pages/user-dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Importando o ícone do usuário

const UserDashboard = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null); // Estado para o livro selecionado
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // Estado para controlar o modal de detalhes
  const [showLogoutMenu, setShowLogoutMenu] = useState(false); // Estado para controlar a visibilidade do menu de logout

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:5000/books');
      const data = await response.json();
      setBooks(data);
    };
    fetchBooks();
  }, []);

  const openDetailsModal = (book: any) => {
    setSelectedBook(book);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedBook(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedUser'); // Remover o usuário logado do localStorage
    window.location.href = '/'; // Redirecionar para a página principal
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 flex justify-center">Painel do Usuário</h1>
      <div className="flex justify-end mb-4">
        <FaUserCircle
          className="text-3xl cursor-pointer"
          onClick={() => setShowLogoutMenu(!showLogoutMenu)} // Alternar o menu de logout
        />
        {showLogoutMenu && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32">
            <button 
              onClick={handleLogout} 
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
            >
              Sair
            </button>
          </div>
        )}
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Título</th>
            <th className="border p-2">Autor</th>
            <th className="border p-2">Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">
                <button onClick={() => openDetailsModal(book)} className="text-blue-500">Ver Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para Detalhes do Livro */}
      {detailsModalOpen && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <div className="flex justify-center mb-2">
              <img src={selectedBook.image} alt={selectedBook.title} className="w-30 h-48 object-cover" />
            </div>
            <h2 className="text-xl font-bold mb-2">{selectedBook.title}</h2>
            <p className="text-gray-700 mb-2"><strong>Autor:</strong> {selectedBook.author}</p>
            <p className="text-gray-600">{selectedBook.synopsis}</p>
            <button onClick={closeDetailsModal} className="bg-gray-500 text-white p-2 rounded mt-4">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
