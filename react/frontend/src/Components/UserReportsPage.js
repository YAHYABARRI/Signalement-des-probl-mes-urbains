import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Leaf, MapPin, Calendar } from "lucide-react";

const UserReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    fetch("http://127.0.0.1:8000/api/user-reports/", {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Erreur serveur: ' + res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      setReports(data);
    })
    .catch((err) => {
      console.error('Erreur:', err);
      setError('Erreur lors de la récupération des signalements: ' + err.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [navigate]);

  // Fonction pour déterminer la couleur en fonction du statut
  const getStatusStyles = (status) => {
    switch(status) {
      case 'VALIDATED':
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          border: "border-emerald-300",
          icon: <CheckCircle2 className="w-4 h-4 mr-2" />
        };
      case 'REJECTED':
        return {
          bg: "bg-rose-100",
          text: "text-rose-800",
          border: "border-rose-300",
          icon: <XCircle className="w-4 h-4 mr-2" />
        };
      default:
        return {
          bg: "bg-amber-100",
          text: "text-amber-800",
          border: "border-amber-300",
          icon: <Clock className="w-4 h-4 mr-2" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 relative overflow-hidden">
      {/* Éléments décoratifs de nature */}
      <div className="absolute top-0 left-0 w-full h-16 bg-green-900/5 rounded-b-full"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-800/5 rounded-full -mr-20 -mb-20"></div>
      <div className="absolute top-1/3 left-0 w-32 h-32 bg-yellow-400/5 rounded-full -ml-10"></div>
      
      {/* Conteneur principal avec un effet de papier recyclé */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* En-tête avec effet de feuille */}
        <div className="mb-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Leaf className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-3xl font-bold text-green-800">Mes Signalements</h1>
            </div>
            <Link 
              to="/home" 
              className="flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
          <p className="mt-2 text-gray-600 pl-11">Suivez l'état de vos contributions pour un environnement plus sain</p>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de vos signalements...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <XCircle className="w-8 h-8" />
            </div>
            <p className="mt-4 text-red-600 font-medium">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                fetch("http://127.0.0.1:8000/api/user-reports/", {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json'
                  },
                })
                .then((res) => res.json())
                .then((data) => setReports(data))
                .catch((err) => setError('Erreur lors de la récupération des signalements: ' + err.message))
                .finally(() => setLoading(false));
              }}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Réessayer
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
              <Leaf className="w-8 h-8" />
            </div>
            <p className="mt-4 text-gray-600">Vous n'avez encore fait aucun signalement</p>
            <Link 
              to="/ReportProblemPage" 
              className="inline-block mt-6 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Créer un signalement
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const statusStyle = getStatusStyles(report.status);
              
              return (
                <div key={report.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transform hover:scale-102 transition-all duration-300 border border-green-100 hover:border-green-200">
                  <div className="h-2 bg-gradient-to-r from-green-400 to-teal-500"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{report.category.name}</h3>
                      <div className={`flex items-center px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                        {statusStyle.icon}
                        {report.status_display}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg border-l-2 border-gray-200">{report.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-green-600" />
                        <span>{new Date(report.date_reported).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 text-green-600" />
                        <span>{report.location_address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Élément décoratif du bas */}
        <div className="mt-16 text-center text-sm text-green-800/60">
          <p>Merci pour votre contribution à la préservation de notre environnement</p>
          <div className="flex justify-center mt-2">
            <Leaf className="w-4 h-4 mx-1 text-green-600" />
            <Leaf className="w-4 h-4 mx-1 text-green-600" />
            <Leaf className="w-4 h-4 mx-1 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReportsPage;