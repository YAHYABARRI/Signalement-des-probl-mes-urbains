import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Leaf, User, AlertCircle, CheckCircle, MapPin, Award } from 'lucide-react';

const SignalementList = () => {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState({});
  const [pointsAwarded, setPointsAwarded] = useState({});

  useEffect(() => {
    const storedPointsAwarded = localStorage.getItem('pointsAwarded');
    if (storedPointsAwarded) {
      setPointsAwarded(JSON.parse(storedPointsAwarded));
    }
  }, []);

  const fetchReports = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reports/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.results ? response.data.results : response.data;
      setReports(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await refreshAndRetry();
      } else {
        setMessage("Erreur lors du chargement des signalements.");
      }
    }
  };

  const refreshAndRetry = async () => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
      setMessage("Session expirée. Veuillez vous reconnecter.");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh });
      const newAccess = response.data.access;
      localStorage.setItem('access', newAccess);
      await fetchReports(newAccess);
    } catch {
      setMessage("Échec de l'authentification. Veuillez vous reconnecter.");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      fetchReports(accessToken);
    } else {
      setMessage("Token introuvable. Veuillez vous reconnecter.");
      window.location.href = "/login";
    }
  }, []);

  const handleAddPoints = async (reportId) => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      setMessage("Token introuvable. Veuillez vous reconnecter.");
      return;
    }
  
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/reports/${reportId}/add_points/`,
        {
          user_id: 1,
          points: 10,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const updatedPointsAwarded = { ...pointsAwarded, [reportId]: true };
      setPointsAwarded(updatedPointsAwarded);
      localStorage.setItem('pointsAwarded', JSON.stringify(updatedPointsAwarded));
      
      setFeedback((prev) => ({
        ...prev,
        [reportId]: '✅ Points ajoutés avec succès !',
      }));
    } catch {
      setFeedback((prev) => ({
        ...prev,
        [reportId]: "❌ Erreur lors de l'ajout des points.",
      }));
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'en attente':
        return 'bg-amber-100 text-amber-800';
      case 'validé':
      case 'validée':
      case 'valide':
        return 'bg-green-100 text-green-800';
      case 'rejeté':
      case 'rejetée':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-green-800">
      <nav className="bg-green-800 text-white p-4 shadow-md border-b border-yellow-500">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="text-yellow-500" size={24} />
            <span className="text-xl font-bold text-yellow-500">MDINT<span className="text-white">KOUM</span></span>
          </div>
          <div className="flex items-center">
            <a href="/admin" className="flex items-center px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <User size={18} className="mr-2" />
              <span>Utilisateur</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-yellow-500 mb-6 p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="text-yellow-500 mr-2" size={24} />
            <h2 className="text-2xl font-bold text-green-800">Liste des Signalements</h2>
          </div>

          {message && (
            <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-500">
              {message}
            </div>
          )}

          {reports.length === 0 && !message ? (
            <div className="text-center py-8 bg-green-50 rounded-lg">
              <MapPin className="mx-auto text-green-600 mb-2" size={32} />
              <p className="text-gray-600">Aucun signalement trouvé.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {reports.map((report) => {
                const statusLower = report.status?.toLowerCase();
                return (
                  <li key={report.id} className="bg-green-50 p-5 rounded-lg border-l-4 border-green-600 hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex items-center mb-2">
                          <Leaf className="text-green-600 mr-2" size={16} />
                          <span className="font-semibold text-green-800">Catégorie: {report.category_name || 'N/A'}</span>
                        </div>

                        <div className="bg-white p-3 rounded-md my-2 text-gray-700 border border-green-100">
                          <p><strong>Description:</strong> {report.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(report.status)}`}>
                            {report.status}
                          </div>

                          <div className="text-sm text-gray-600 flex items-center">
                            <User size={14} className="mr-1" />
                            {report.user?.username || report.user}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 md:mt-0">
                        {statusLower === 'rejected' ? null : pointsAwarded[report.id] ? (
                          <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 font-medium rounded-lg">
                            <Award size={16} className="mr-2 text-yellow-500" />
                            10 points déjà attribués
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddPoints(report.id)}
                            className="px-4 py-2 bg-yellow-500 text-green-800 font-bold rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
                          >
                            <CheckCircle size={16} className="mr-1" />
                            Ajouter 10 points
                          </button>
                        )}

                        {feedback[report.id] && (
                          <div className="mt-2 text-sm p-2 rounded-md bg-green-100 text-green-700">
                            {feedback[report.id]}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignalementList;
