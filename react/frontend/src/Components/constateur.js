import React, { useEffect, useState } from 'react';

const ConstateurSignalements = () => {
  const [signalements, setSignalements] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSignalement, setSelectedSignalement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleLogout = () => {
    // Suppression du token d'accès
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    // Redirection vers la page de connexion
    window.location.href = '/login';
  };
  
  useEffect(() => {
    const fetchSignalements = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/constateur/reports/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Erreur de chargement des données');
        }
        
        const data = await response.json();
        setSignalements(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des signalements', err);
        setError('Erreur lors de la récupération des signalements.');
      }
    };
    
    fetchSignalements();
  }, []);
  
  const handleValidation = async (id, action) => {
    try {
      // Envoi de la requête pour valider ou rejeter le signalement
      const response = await fetch(
        `http://127.0.0.1:8000/api/constateur/reports/${id}/update_status/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
          body: JSON.stringify({ status: action }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Erreur de mise à jour');
      }
      
      const result = await response.json();
      console.log('Signalement mis à jour', result);
      
      // Récupérer à nouveau tous les signalements après mise à jour du statut
      const updatedResponse = await fetch('http://127.0.0.1:8000/api/constateur/reports/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      
      if (!updatedResponse.ok) {
        throw new Error('Erreur de récupération après mise à jour');
      }
      
      const updatedData = await updatedResponse.json();
      
      // Mettre à jour l'état local avec les nouveaux signalements
      setSignalements(updatedData);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du signalement', err);
      setError(err.message || 'Erreur réseau');
    }
  };
  
  const openModal = (signalement) => {
    setSelectedSignalement(signalement);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSignalement(null);
  };
  
  // Si le modal est ouvert, on ajoute une classe pour bloquer le scroll
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);
  
  return (
    <div className="bg-green-800 min-h-screen">
      {/* Navbar ajoutée */}
      <nav className="bg-green-900 py-3 px-6 flex justify-between items-center shadow-md mb-4">
        <div className="flex items-center">
          <span className="text-yellow-400 font-bold text-xl">MDINT<span className="text-white">KOUM</span></span>
        </div>
        <div>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </nav>
      
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Signalements à valider</h1>
        
        {error && (
          <div className="text-red-500 mb-4 bg-red-100 p-3 rounded-lg border-l-4 border-red-600">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signalements.map((signalement) => (
            <div 
              key={signalement.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
              onClick={() => openModal(signalement)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={signalement.image} 
                  alt="Image du signalement"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <p className="text-gray-700 font-semibold mb-2">{signalement.location_address}</p>
                <p className="text-gray-600 mb-2 text-sm">ID: {signalement.id}</p>
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche l'ouverture du modal
                      handleValidation(signalement.id, 'VALIDATED');
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <span className="mr-1">✓</span> Valider
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche l'ouverture du modal
                      handleValidation(signalement.id, 'REJECTED');
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <span className="mr-1">✗</span> Rejeter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {signalements.length === 0 && (
          <div className="text-center py-12 bg-green-700 rounded-lg text-white">
            <p className="text-lg">Aucun signalement à valider pour le moment.</p>
          </div>
        )}
      </div>
      
      {/* Modal pour afficher la description */}
      {isModalOpen && selectedSignalement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-800">Détails du signalement</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="mb-6">
                <img 
                src={selectedSignalement.image}
                                alt="Image du signalement"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-700">Adresse</h3>
                  <p>{selectedSignalement.location_address}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-700">Description</h3>
                  <p className="text-gray-700">{selectedSignalement.description || "Aucune description disponible"}</p>
                </div>
                
             
                
                <div>
                  <h3 className="font-semibold text-green-700">Statut actuel</h3>
                  <p>{selectedSignalement.status}</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleValidation(selectedSignalement.id, 'VALIDATED');
                    closeModal();
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <span className="mr-1">✓</span> Valider
                </button>
                <button
                  onClick={() => {
                    handleValidation(selectedSignalement.id, 'REJECTED');
                    closeModal();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg flex-1 hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <span className="mr-1">✗</span> Rejeter
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg flex-1 hover:bg-gray-500 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstateurSignalements;