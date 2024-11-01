// components/Auth/Login.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter(); // Inicializando o roteador
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
      // Acessando os usuários na porta 5000
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

      // Redirecionar para a página correspondente
      if (existingUser.role === 'admin') {
        router.push('/admin-dashboard'); // Redirecionar para o painel do administrador
      } else {
        router.push('/user-dashboard'); // Redirecionar para o painel do usuário comum
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente mais tarde.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded-lg">
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">Registrar-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
