import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Leaf, User } from 'lucide-react'; // Importer les icônes pour le thème nature

const AddCategory = () => {
  const [name, setName] = useState('');
  const [pointValue, setPointValue] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      console.log("Catégories reçues :", response.data); // Debugging
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
      setMessage("Erreur lors du chargement des catégories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = localStorage.getItem('access');
    
    if (!token) {
      setMessage("Token non trouvé. Veuillez vous reconnecter.");
      return;
    }

    try {
      // Essayer d'envoyer la requête
      const response = await axios.post(
        'http://localhost:8000/api/categories/add/',
        { name, point_value: pointValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setMessage('Catégorie ajoutée avec succès !');
        setName('');
        setPointValue('');
        fetchCategories(); // Rafraîchir la liste des catégories
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Si le token est invalide ou expiré, essayer de rafraîchir
        console.log("Token expiré ou invalide, tentative de rafraîchissement...");
        const refreshToken = localStorage.getItem('refresh');

        try {
          const refreshResponse = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });

          const newAccessToken = refreshResponse.data.access;
          localStorage.setItem('access', newAccessToken);
          console.log("Nouveau Token d'accès :", newAccessToken);

          // Réessayer la requête originale avec le nouveau token
          const retryResponse = await axios.post(
            'http://localhost:8000/api/categories/add/',
            { name, point_value: pointValue },
            { headers: { Authorization: `Bearer ${newAccessToken}` } }
          );

          if (retryResponse.status === 201) {
            setMessage('Catégorie ajoutée avec succès !');
            setName('');
            setPointValue('');
            fetchCategories();
          }
        } catch (refreshError) {
          setMessage("Erreur lors du rafraîchissement du token. Veuillez vous reconnecter.");
          console.error(refreshError);
          // Rediriger l'utilisateur vers la page de connexion
          window.location.href = "/login";  // Exemple de redirection
        }
      } else {
        setMessage("Une erreur est survenue lors de l'ajout de la catégorie.");
        console.error(error.response || error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-800"> {/* Changé pour vert foncé */}
      {/* Navigation Bar */}
      <nav className="bg-green-800 text-white p-4 shadow-md border-b border-yellow-500"> {/* Ajout bordure jaune */}
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="text-yellow-500" size={24} /> {/* Changé en jaune */}
            <span className="text-xl font-bold text-yellow-500">MDINT<span className="text-white">KOUM</span></span> {/* Stylisé le logo */}
          </div>
          <div className="flex items-center">
            <a 
              href="/admin" 
              className="flex items-center px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <User size={18} className="mr-2" />
              <span>Utilisateur</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="bg-green-700 py-8 px-4 text-center text-white"> {/* Ajout section bannière */}
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-yellow-500">Gestion</span> des catégories
        </h1>
        <div className="w-32 h-1 bg-yellow-500 mx-auto my-6"></div> {/* Séparateur stylisé */}
      </div>

      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-yellow-500"> {/* Changé bordure en jaune */}
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Leaf className="text-yellow-500 mr-2" size={24} /> {/* Changé en jaune */}
              <h2 className="text-2xl font-bold text-green-800">Ajouter une catégorie</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-green-700 mb-1">Nom:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-green-700 mb-1">Valeur en points:</label>
                <input
                  type="number"
                  value={pointValue}
                  onChange={(e) => setPointValue(e.target.value)}
                  className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                  min="1"
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-green-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center" /* Changé pour jaune avec texte vert */
              >
                <Leaf size={16} className="mr-2" />
                <span>Ajouter</span>
              </button>
              
              {message && (
                <div className="p-3 rounded-lg bg-green-100 text-green-800 border-l-4 border-green-600">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-8 border-t-4 border-yellow-500"> {/* Changé bordure en jaune */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <Leaf className="text-yellow-500 mr-2" size={20} /> {/* Changé en jaune */}
              Catégories existantes
            </h3>
            
            {categories.length > 0 ? (
              <ul className="divide-y divide-green-100">
                {categories.map((cat) => (
                  <li key={cat.id} className="py-3 flex items-center">
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-3"></span> {/* Changé en jaune */}
                    <span className="flex-grow text-gray-800">{cat.name}</span>
                    <span className="bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full">
                      {cat.point_value} pts
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-gray-500 italic bg-green-50 rounded-lg">
                Aucune catégorie disponible.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;