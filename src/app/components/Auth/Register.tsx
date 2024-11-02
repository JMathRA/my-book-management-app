// components/Auth/Register.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importando useRouter para redirecionamento
import Link from 'next/link';

const Register = () => {
  const router = useRouter(); // Inicializando o roteador
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]); // Armazena os usuários

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/users');
      if (response.ok) {
        const storedUsers = await response.json();
        setUsers(storedUsers);
      }
    };

    fetchUsers();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setError('Usuário já existe.');
      return;
    }

    // Verifica se é o primeiro registro
    const role = users.length === 0 ? 'admin' : 'common';
    const newUser = { name, email, password, role };

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar o usuário.');
      }

      alert('Registro bem-sucedido!');
      
      // Redirecionar para a página user-dashboard após registro
      // Redirecionar para a página admin-dashboard se for o primeiro registro
      if (role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/user-dashboard');
      }
    } catch (error) {
      setError('Erro ao registrar o usuário. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-300 to-blue-300">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Registrar</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 text-gray-700">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded-lg hover:bg-blue-500 transition duration-200">
            Registrar
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">Faça Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
