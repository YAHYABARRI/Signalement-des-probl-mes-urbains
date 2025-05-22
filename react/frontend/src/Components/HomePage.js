import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [points, setPoints] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const navigate = useNavigate();

  // Vérification de l'état de connexion au chargement
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access");
      const storedUsername = localStorage.getItem("username");

      if (token && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);

        // Appel pour récupérer les points réels
        fetch("http://127.0.0.1:8000/api/client/points/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setPoints(data.balance || 0);
            localStorage.setItem("points", data.balance || "0");
          });

        if (localStorage.getItem("isFirstLogin") === "true") {
          setShowWelcomeModal(true);
          localStorage.setItem("isFirstLogin", "false");
        }
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    // Nettoyage complet du localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("points");
    localStorage.removeItem("isFirstLogin");

    // Réinitialisation du state
    setIsLoggedIn(false);
    setUsername("");
    setPoints(0);

    // Rafraîchir la page pour s'assurer que tout est reset
    window.location.reload();
  };

  const navigateToReport = () => navigate("/ReportProblemPage");

  const closeWelcomeModal = () => setShowWelcomeModal(false);

  return (
    <div className="min-h-screen flex flex-col relative">

      {/* Navbar */}
      <nav className="bg-green-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-wider">🌱 <span className="text-yellow-400">MDINT</span>KOUM</span>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center bg-green-700 px-3 py-1 rounded-full">
                    <span className="mr-1 text-yellow-400">⭐</span>
                    <span className="font-medium">{points} points</span>
                  </div>
                  <span className="font-medium">Bienvenue, <span className="text-yellow-300">{username}</span> !</span>
                </div>
                <Link 
                  to="/user-reports"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 flex items-center"
                  onClick={() => navigate('/user-reports')}
                >
                  <span>Mes Signalements</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 flex items-center"
                >
                  <span className="mr-1">🚪</span> Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 flex items-center"
                >
                  <span className="mr-2">🔑</span> Connexion
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors duration-300 flex items-center"
                >
                  <span className="mr-1">✨</span> Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Background Image with Animated Overlay */}
      <div 
        className="flex-grow flex flex-col items-center justify-center text-center px-4 py-10 relative overflow-hidden"
        style={{
          backgroundImage: `url('/images/background_acceuil.png')`,
          backgroundSize: "cover",
          backgroundPosition: "top"
        }}
      >
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-emerald-800/30 z-0">
          {/* Animated Floating Elements */}
          <div className="absolute top-1/4 left-1/5 w-16 h-16 bg-yellow-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 right-1/4 w-10 h-10 bg-green-400/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-emerald-500/20 rounded-full animate-ping"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              <span className="text-yellow-400">Ensemble</span>, améliorons notre environnement
            </h1>
            <div className="h-1 w-24 bg-yellow-400 rounded-full mb-6"></div>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Participez activement à l'amélioration de votre cadre de vie en signalant les problèmes d'infrastructure et d'environnement dans votre quartier.
            </p>
          </div>

        {isLoggedIn ? (
  <div className="space-y-8">
    <button
      onClick={navigateToReport}
      className="px-8 py-4 bg-green-700 text-white text-xl font-semibold rounded-md shadow-md hover:bg-green-800 transition-all duration-300 flex items-center justify-center mx-auto w-full max-w-lg"
    >
      <span className="mr-3 text-2xl">📸</span> Signaler un problème
    </button>
              
    <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-green-500">
        <div className="text-4xl mb-4">🌳</div>
        <h3 className="text-2xl font-bold text-green-800 mb-3">Contribuez à votre ville</h3>
        <p className="text-gray-700 text-lg">Signalez les problèmes de votre quartier et participez activement à créer un environnement plus sain et plus agréable pour tous.</p>
      </div>
                
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-yellow-500">
        <div className="text-4xl mb-4">⭐</div>
        <h3 className="text-2xl font-bold text-green-800 mb-3">Cumulez des récompenses</h3>
        <p className="text-gray-700 text-lg">Recevez des points pour chaque signalement validé et échangez-les contre des récompenses exclusives offertes par nos partenaires locaux.</p>
      </div>
                
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-emerald-500">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-green-800 mb-3">Suivez les améliorations</h3>
        <p className="text-gray-700 text-lg">Restez informé de l'évolution de vos signalements et constatez par vous-même l'impact positif de votre engagement citoyen.</p>
      </div>
    </div>

              
              <div className="mt-10 bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
                    <h3 className="text-2xl font-bold text-green-800 mb-3">Votre impact est réel</h3>
                    <p className="text-gray-700 mb-4">
                      Chaque signalement que vous faites contribue directement à l'amélioration de votre environnement urbain. 
                      Ensemble, nous pouvons transformer notre communauté et créer un cadre de vie plus agréable pour tous.
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500 text-lg">⭐</span>
                      <p className="font-medium">Vous avez déjà accumulé {points} points!</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 bg-green-100 p-4 rounded-lg">
                    <h4 className="font-bold text-green-700 mb-2">Statistiques de la communauté:</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Problèmes signalés:</span>
                        <span className="font-bold">1,248</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Problèmes résolus:</span>
                        <span className="font-bold">876</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Membres actifs:</span>
                        <span className="font-bold">312</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Button to view reports */}
              {isLoggedIn && (
                <div className="mt-8">
                  <Link 
                    to="/user-reports"
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <span className="mr-2">📄</span>
                    Voir mes signalements
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <Link 
                  to="/register"
                  className="group relative px-8 py-4 bg-yellow-500 text-white text-lg font-semibold rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0 w-3 bg-yellow-600 transition-all duration-300 ease-out group-hover:w-full"></div>
                  <span className="relative flex items-center justify-center">
                    <span className="mr-2">✨</span> Rejoindre la communauté
                  </span>
                </Link>
                <Link 
                  to="/login"
                  className="group relative px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0 w-3 bg-green-700 transition-all duration-300 ease-out group-hover:w-full"></div>
                  <span className="relative flex items-center justify-center">
                    <span className="mr-2">🔑</span> Se connecter
                  </span>
                </Link>
              </div>
              
              <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-green-500">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-3">Simple et rapide</h3>
                  <p className="text-gray-700">Signalez des problèmes en quelques clics depuis votre smartphone ou ordinateur, où que vous soyez et quand vous le souhaitez.</p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-yellow-500">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-3">Communauté active</h3>
                  <p className="text-gray-700">Rejoignez une communauté engagée de citoyens qui se mobilisent quotidiennement pour l'amélioration de notre environnement commun.</p>
                </div>
                
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-emerald-500">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-green-800 mb-3">Système de récompenses</h3>
                  <p className="text-gray-700">Accumulez des points et débloquez des récompenses exclusives pour votre participation active à l'amélioration de votre quartier.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Animated scroll arrow */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Ce que disent nos utilisateurs</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md relative">
              <div className="absolute -top-5 left-6 h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-xl">
                ❝
              </div>
              <p className="text-gray-700 italic mb-4 pt-3">
                "Grâce à MDINTKOUM, j'ai pu signaler un lampadaire défectueux près de chez moi. En moins d'une semaine, il était réparé! Je me sens vraiment utile pour ma communauté."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span>👨</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Mohammed K.</h4>
                  <p className="text-sm text-gray-500">Membre depuis 6 mois</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md relative">
              <div className="absolute -top-5 left-6 h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-xl">
                ❝
              </div>
              <p className="text-gray-700 italic mb-4 pt-3">
                "J'ai déjà accumulé plus de 500 points en signalant différents problèmes dans mon quartier. C'est gratifiant de voir les améliorations et de recevoir des récompenses!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span>👩</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Fatima L.</h4>
                  <p className="text-sm text-gray-500">Membre depuis 1 an</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md relative">
              <div className="absolute -top-5 left-6 h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-xl">
                ❝
              </div>
              <p className="text-gray-700 italic mb-4 pt-3">
                "Cette plateforme a transformé notre façon d'interagir avec notre environnement urbain. Je me sens plus connecté à ma ville et plus responsable de son bien-être."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span>👨</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-800">Youssef B.</h4>
                  <p className="text-sm text-gray-500">Membre depuis 8 mois</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à faire la différence dans votre communauté?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez MDINTKOUM aujourd'hui et commencez à contribuer à un environnement urbain plus sain et plus agréable pour tous.
          </p>
          {!isLoggedIn && (
            <Link 
              to="/register"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold rounded-lg shadow-lg transform transition-all hover:-translate-y-1 inline-block"
            >
              Créer un compte gratuitement
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">🌱 <span className="text-yellow-400">MDINT</span>KOUM</h2>
              <p className="text-sm mb-4">
                Notre mission est de faciliter l'engagement citoyen pour créer des environnements urbains plus agréables et durables.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center hover:bg-green-700 transition-colors">
                  <span>📱</span>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center hover:bg-green-700 transition-colors">
                  <span>💬</span>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center hover:bg-green-700 transition-colors">
                  <span>📸</span>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-300 transition-colors">À propos de nous</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Comment ça marche</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Nos récompenses</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Témoignages</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>123 Rue de l'Environnement, Ville Verte</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>+212 522789024</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✉️</span>
                  <span>contact@mdintkoum.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-green-800 text-center">
            <p>&copy; {new Date().getFullYear()} MDINTKOUM. Tous droits réservés.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-sm hover:text-green-300 transition-colors">Politique de confidentialité</a>
              <a href="#" className="text-sm hover:text-green-300 transition-colors">Conditions d'utilisation</a>
              <a href="#" className="text-sm hover:text-green-300 transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative animate-fadeIn">
            <button 
              onClick={closeWelcomeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-800 mb-3">Bienvenue {username} !</h3>
              <p className="text-gray-700 mb-6">
                Vous êtes maintenant connecté à MDINTKOUM. Commencez à explorer et à contribuer à l'amélioration de votre environnement.
              </p>
              <button
                onClick={closeWelcomeModal}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;