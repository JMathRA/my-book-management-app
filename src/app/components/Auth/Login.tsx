"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserAlt, FaLock } from 'react-icons/fa';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const users = await response.json();
      const existingUser = users.find((user: any) => user.email === email && user.password === password);

      if (!existingUser) {
        setError('Credenciais inválidas.');
        return;
      }

      localStorage.setItem('loggedUser', JSON.stringify(existingUser));
      alert('Login bem-sucedido!');

      if (existingUser.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/user-dashboard');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente mais tarde.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800">Bem-vindo, faça seu login!</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-lg text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaUserAlt className="text-gray-500 ml-3" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Digite seu email"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-lg text-gray-700">Senha</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaLock className="text-gray-500 ml-3" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-indigo-600 hover:underline">Registrar-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
