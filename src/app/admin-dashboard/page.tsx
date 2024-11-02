// src/app/pages/admin-dashboard/page.tsx
"use client"; // Certifique-se de que este componente é um cliente

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { TbListDetails } from 'react-icons/tb';

const AdminDashboard = () => {
  const router = useRouter(); // Inicializando o roteador
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addBookModalOpen, setAddBookModalOpen] = useState(false); // Modal para adicionar livro
  const [createAdminModalOpen, setCreateAdminModalOpen] = useState(false); // Modal para criar novo admin
  const [listAdminsModalOpen, setListAdminsModalOpen] = useState(false); // Modal para listar administradores
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null); // Para o administrador a ser removido
  const [error, setError] = useState('');
  const [showLogoutMenu, setShowLogoutMenu] = useState(false); // Estado para mostrar o menu de logout
  const [newBook, setNewBook] = useState<{ title: string; author: string; image: string; synopsis: string }>({ title: '', author: '', image: '', synopsis: '' }); // Estado para novo livro
  const [newAdmin, setNewAdmin] = useState<{ email: string; password: string }>({ email: '', password: '' }); // Estado para novo admin
  const [admins, setAdmins] = useState<any[]>([]); // Estado para listar administradores
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // Estado para controlar o modal de detalhes

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch('http://localhost:5000/books');
      const data = await response.json();
      setBooks(data);
    };
    fetchBooks();
  }, []);

  const fetchAdmins = async () => {
    const response = await fetch('http://localhost:5000/users'); // Buscando administradores
    const data = await response.json();
    setAdmins(data.filter((user: any) => user.role === 'admin')); // Filtrando apenas administradores
  };

  const handleEdit = (book: any) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedBook.title || !selectedBook.author) {
      setError('Título e Autor são obrigatórios.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/books/${selectedBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBook),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao salvar as alterações');
      }
  
      const updatedBook = await response.json();
      setBooks(books.map(book => (book.id === updatedBook.id ? updatedBook : book)));
      setModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      setError('Erro ao salvar as alterações.');
      console.error(error);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.image || !newBook.synopsis) {
      setError('Título, Autor, Imagem e Sinopse são obrigatórios.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newBook, id: books.length + 1 }), // Atribuindo um novo ID
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar o livro');
      }

      const addedBook = await response.json();
      setBooks([...books, addedBook]);
      setAddBookModalOpen(false);
      setNewBook({ title: '', author: '', image: '', synopsis: '' }); // Resetando o estado do novo livro
    } catch (error) {
      setError('Erro ao adicionar o livro.');
      console.error(error);
    }
  };

  const handleRemove = (bookId: number) => {
    setBookToDelete(bookId);
    setConfirmDelete(true);
  };

  const confirmRemove = async () => {
    if (bookToDelete !== null) {
      await fetch(`http://localhost:5000/books/${bookToDelete}`, {
        method: 'DELETE',
      });
      setBooks(books.filter(book => book.id !== bookToDelete));
      setConfirmDelete(false);
      setBookToDelete(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedUser'); // Remover o usuário logado do localStorage
    router.push('/login'); // Redirecionar para a página de login
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password) {
      setError('Email e Senha são obrigatórios.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newAdmin, id: String(Date.now()), role: 'admin' }), // Atribuindo um novo ID como string
      });

      if (!response.ok) {
        throw new Error('Erro ao criar o administrador');
      }

      // Limpar o estado do novo admin e fechar o modal
      setNewAdmin({ email: '', password: '' });
      setCreateAdminModalOpen(false);
    } catch (error) {
      setError('Erro ao criar o administrador.');
      console.error(error);
    }
  };

  const handleRemoveAdmin = async (adminId: number) => {
    setAdminToDelete(adminId);
    setConfirmDelete(true);
  };

  const confirmRemoveAdmin = async () => {
    if (adminToDelete !== null) {
      try {
        const response = await fetch(`http://localhost:5000/users/${adminToDelete}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Erro ao remover o administrador');
        }
        
        // Atualiza a lista de administradores após a remoção
        setAdmins(admins.filter(admin => admin.id !== adminToDelete)); // Filtra a lista de administradores
        setConfirmDelete(false);
        setAdminToDelete(null);
      } catch (error) {
        setError('Erro ao remover o administrador.');
        console.error(error);
      }
    }
  };

  const openDetailsModal = (book: any) => {
    setSelectedBook(book);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl relative">
        <h1 className="text-3xl font-bold mb-4 text-center">Painel do Administrador</h1>

        {/* Ícone de Avatar */}
        <div className="absolute top-4 right-4">
          <FaUserCircle
            className="text-3xl cursor-pointer"
            onClick={() => {
              setShowLogoutMenu(!showLogoutMenu);
              if (!listAdminsModalOpen) fetchAdmins(); // Carregar administradores quando abrir o menu
            }}
          />
          {showLogoutMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-32">
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
              >
                Sair
              </button>
              <button 
                onClick={() => { 
                  setListAdminsModalOpen(true); 
                  fetchAdmins(); // Carregar administradores ao abrir o modal
                }} 
                className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-200"
              >
                Listar Administradores
              </button>
            </div>
          )}
        </div>

        <div className='flex justify-between'>
          {/* Botão para Adicionar Novo Livro */}
          <button 
            onClick={() => setAddBookModalOpen(true)} 
            className="bg-green-500 text-white p-2 rounded mb-4"
          >
            Adicionar Novo Livro
          </button>

          {/* Botão para Criar Novo Admin */}
          <button 
            onClick={() => setCreateAdminModalOpen(true)} 
            className="bg-blue-500 text-white p-2 rounded mb-4"
          >
            Criar Novo Admin
          </button>
        </div>

        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-4 text-left">Título</th>
              <th className="border p-4 text-left">Autor</th>
              <th className="border p-4 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="border p-4">{book.title}</td>
                  <td className="border p-4">{book.author}</td>
                  <td className="border p-4 flex flex-col space-y-1">
                    <div className="flex justify-center align-baseline space-x-5">
                      <button onClick={() => openDetailsModal(book)} className="text-green-500 hover:text-green-700 ml-4">
                        <TbListDetails />
                      </button>
                      <button onClick={() => handleEdit(book)} className="text-blue-500 hover:text-blue-700">
                        <MdEdit />
                      </button>
                      <button onClick={() => handleRemove(book.id)} className="text-red-500 hover:text-red-700 ml-4">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                <td colSpan={3} className="border p-4 text-center">
                  <div className="relative flex justify-center items-center">
                    <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
                    <img 
                      src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg" 
                      alt="Loading" 
                      className="rounded-full h-28 w-28"
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Adicionar Novo Livro */}
      {addBookModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <h2 className="text-xl font-bold mb-4">Adicionar Novo Livro</h2>
            <input
              type="text"
              placeholder="Título"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Autor"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Imagem (URL)"
              value={newBook.image}
              onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Sinopse"
              value={newBook.synopsis}
              onChange={(e) => setNewBook({ ...newBook, synopsis: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-between mt-4">
              <button onClick={handleAddBook} className="bg-green-500 text-white p-2 rounded">Adicionar</button>
              <button onClick={() => setAddBookModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Criar Novo Admin */}
      {createAdminModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <h2 className="text-xl font-bold mb-4">Criar Novo Administrador</h2>
            <input
              type="text"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="password"
              placeholder="Senha"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-between mt-4">
              <button onClick={handleCreateAdmin} className="bg-blue-500 text-white p-2 rounded">Criar</button>
              <button onClick={() => setCreateAdminModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para listar Administradores */}
      {listAdminsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <h2 className="text-xl font-bold mb-4">Administradores</h2>
            <ul>
              {admins.map(admin => (
                <li key={admin.id} className="flex justify-between items-center border-b py-2">
                  <span>{admin.email}</span>
                  <button onClick={() => handleRemoveAdmin(admin.id)} className="text-red-500">Remover</button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4">
              <button onClick={() => setListAdminsModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Edição */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <h2 className="text-xl font-bold mb-4">Editar Livro</h2>
            <input
              type="text"
              placeholder="Título"
              value={selectedBook?.title || ''}
              onChange={(e) => setSelectedBook({ ...selectedBook, title: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Autor"
              value={selectedBook?.author || ''}
              onChange={(e) => setSelectedBook({ ...selectedBook, author: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Imagem (URL)"
              value={selectedBook?.image || ''}
              onChange={(e) => setSelectedBook({ ...selectedBook, image: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Sinopse"
              value={selectedBook?.synopsis || ''}
              onChange={(e) => setSelectedBook({ ...selectedBook, synopsis: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-between mt-4">
              <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">Salvar</button>
              <button onClick={() => setModalOpen(false)} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Detalhes do Livro */}
      {detailsModalOpen && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <div className="flex justify-center mb-2">
              <img src={selectedBook.image} alt={selectedBook.title} className="w-30 h-48 object-cover" />
            </div>
            <h2 className="text-xl font-bold mb-2 flex justify-center">{selectedBook.title}</h2>
            <p className="text-gray-700 mb-2"><strong>Autor:</strong> {selectedBook.author}</p>
            <p className="text-gray-600">{selectedBook.synopsis}</p>
            <button onClick={closeDetailsModal} className="bg-gray-500 text-white p-2 rounded mt-4">Fechar</button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Remoção de Livro */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <h2 className="text-xl font-bold mb-4">Confirmação</h2>
            <p>Você tem certeza que deseja remover este livro?</p>
            <div className="flex justify-between mt-4">
              <button onClick={confirmRemove} className="bg-red-500 text-white p-2 rounded">Remover</button>
              <button onClick={() => setConfirmDelete(false)} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Remoção de Administrador */}
      {adminToDelete !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-96">
            <h2 className="text-xl font-bold mb-4">Confirmação</h2>
            <p>Você tem certeza que deseja remover este administrador?</p>
            <div className="flex justify-between mt-4">
              <button onClick={confirmRemoveAdmin} className="bg-red-500 text-white p-2 rounded">Remover</button>
              <button onClick={() => setAdminToDelete(null)} className="bg-gray-500 text-white p-2 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
