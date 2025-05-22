import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    username: '',
    email: '',
    phone: '',
    user_type: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('Token manquant');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/users/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Réponse de l\'API:', response.data); 
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const token = localStorage.getItem('access');
        await axios.delete(`http://localhost:8000/api/users/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers(); // Rafraîchir la liste après suppression
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdatedUser({
      username: user.username,
      email: user.email,
      phone: user.phone,
      user_type: user.user_type,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      await axios.put(
        `http://localhost:8000/api/users/${editingUser.id}/`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingUser(null);
      fetchUsers(); // Rafraîchir la liste après mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    navigate('/login');
  };

  // Nouveaux styles MDINTKOUM
  return (
    <div className="min-h-screen bg-green-800 p-4 md:p-6">
      {/* Header avec logo et infos utilisateur */}
      <div className="flex justify-between items-center mb-6 bg-green-900 rounded-lg p-3 shadow-lg">
        <div className="flex items-center">
          <span className="text-green-400 text-xl mr-2">🌱</span>
          <span className="text-yellow-500 font-bold text-xl">MDINT</span>
          <span className="text-white font-bold text-xl">KOUM</span>
        </div>
        <div className="flex items-center">
          
          <span className="text-white mr-4">Bienvenue, Admin !</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center"
          >
            <span className="mr-1">📝</span>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Titre principal */}
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-2">
          <span className="text-yellow-400 font-bold">Ensemble,</span>
          <span className="text-white"> améliorons notre</span>
        </h1>
        <h1 className="text-white text-4xl mb-6">environnement</h1>
        <div className="h-1 w-32 bg-yellow-400 mx-auto mb-6"></div>
        <p className="text-white text-lg max-w-3xl mx-auto">
          Participez activement à l'amélioration de votre cadre de vie en gérant efficacement les utilisateurs de la plateforme.
        </p>
      </div>

      {/* Navigation secondaire */}
      <div className="flex justify-center mb-8 space-x-4">
        <Link 
          to="/categories" 
          className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center"
        >
          <span className="mr-2">🌱</span>
          Gérer les catégories
        </Link>
        <Link 
          to="/signalements" 
          className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all flex items-center"
        >
          <span className="mr-2">📷</span>
          Voir signalements
        </Link>
      </div>

      {/* Contenu principal */}
      <div className="bg-white bg-opacity-95 rounded-xl p-6 shadow-xl border border-green-200 max-w-6xl mx-auto">
        {editingUser ? (
          <div className="mb-4 bg-green-50 rounded-lg p-5 shadow-md border-l-4 border-yellow-400">
            <h2 className="text-2xl mb-4 text-green-800 font-bold flex items-center">
              <svg className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier l'utilisateur
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-green-700 font-medium mb-2">Nom d'utilisateur</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={updatedUser.username}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
                    className="pl-10 w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-green-700 font-medium mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={updatedUser.email}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                    className="pl-10 w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-green-700 font-medium mb-2">Téléphone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={updatedUser.phone}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
                    className="pl-10 w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-green-700 font-medium mb-2">Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <select
                    value={updatedUser.user_type}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, user_type: e.target.value })}
                    className="pl-10 w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  >
                    <option value="USER">Utilisateur</option>
                    <option value="ADMIN">Admin</option>
                    <option value="CONSTATEUR">Constateur</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Mettre à jour
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-green-800 font-bold flex items-center">
                <svg className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Gestion des Utilisateurs
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">Username</th>
                    <th className="py-3 px-4 text-left font-medium">Email</th>
                    <th className="py-3 px-4 text-left font-medium">Téléphone</th>
                    <th className="py-3 px-4 text-left font-medium">Type</th>
                    <th className="py-3 px-4 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-green-50">
                        <td className="py-3 px-4 border-b border-green-100">{user.username}</td>
                        <td className="py-3 px-4 border-b border-green-100">{user.email}</td>
                        <td className="py-3 px-4 border-b border-green-100">{user.phone}</td>
                        <td className="py-3 px-4 border-b border-green-100">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            user.user_type === 'ADMIN' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : user.user_type === 'CONSTATEUR' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {user.user_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-green-100 text-center">
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg mr-2 shadow-sm hover:shadow-md transition-all"
                          >
                            <span className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Modifier
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm hover:shadow-md transition-all"
                          >
                            <span className="flex items-center">
                              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="h-12 w-12 text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
                          <p className="text-sm text-gray-500">Les utilisateurs apparaîtront ici une fois ajoutés</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-white text-sm">
        <p>© 2025 MDINTKOUM - Ensemble, améliorons notre environnement</p>
      </div>
    </div>
  );
};

export default UsersManagement;