// components/Auth/Register.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importando useRouter para redirecionamento

const Register = () => {
  const router = useRouter(); // Inicializando o roteador
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<any[]>([]); // Armazena os usuários

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers); 
  }, []);

  const handleRegister = (e: React.FormEvent) => {
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
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers); 
    alert('Registro bem-sucedido!');
    
    // Redirecionar para a página user-dashboard após registro
    router.push('/user-dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center">Registrar</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
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
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
