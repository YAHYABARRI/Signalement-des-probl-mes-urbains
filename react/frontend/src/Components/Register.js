import { useState, useEffect } from "react"
import axios from "axios"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword)
    } else {
      setPasswordMatch(true)
    }
  }, [password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas");
      setStatus("error");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        email,
        password,
        password2: confirmPassword,
      });
      setMessage("Compte créé avec succès");
      setStatus("success");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err.response);
      setMessage(err.response?.data?.message || "Erreur lors de la création du compte");
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/images/backgroundimg.png')" }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-emerald-800/30 z-0"></div>

      {/* Glass card container */}
      <div className="relative z-10 w-full max-w-xl bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-green-100">
        {/* Leaf-pattern top accent */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-green-500 via-emerald-400 to-green-600"></div>

        {/* Side decoration resembling plant growth */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-green-400 to-emerald-700"></div>
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-t from-green-400 to-emerald-700"></div>

        <div className="p-8 sm:p-12">
          {/* Logo and header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-white text-3xl font-bold mb-6 shadow-lg transform transition-transform hover:scale-105">
              🌱
            </div>
            <h2 className="text-3xl font-extrabold text-green-900 tracking-tight mb-2">Rejoignez notre communauté</h2>
            <p className="text-sm text-green-700 max-w-sm mx-auto">
              Ensemble, construisons un avenir plus vert et plus durable
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-green-800 mb-1">
                Nom d'utilisateur
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-green-600 sm:text-sm">🌿</span>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-green-300 bg-green-50/50 rounded-lg focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-400 transition duration-150"
                  placeholder="Choisissez un nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-green-800 mb-1">
                Adresse email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-green-600 sm:text-sm">🍃</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-green-300 bg-green-50/50 rounded-lg focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-400 transition duration-150"
                  placeholder="Entrez votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-green-800 mb-1">
                Mot de passe
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-green-600 sm:text-sm">🌲</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-green-300 bg-green-50/50 rounded-lg focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-400 transition duration-150"
                  placeholder="Créez un mot de passe sécurisé"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-green-800 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-green-600 sm:text-sm">🌳</span>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    !passwordMatch && confirmPassword ? "border-red-500 ring-1 ring-red-500" : "border-green-300 bg-green-50/50"
                  } rounded-lg focus:ring-green-500 focus:border-green-500 text-green-900 placeholder-green-400 transition duration-150`}
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {!passwordMatch && confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !passwordMatch}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium ${
                  isLoading || !passwordMatch
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transform transition-all hover:-translate-y-0.5"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Plantation en cours...
                  </span>
                ) : (
                  "Créer votre compte"
                )}
              </button>
            </div>
          </form>

          {/* Status Message */}
          {status && (
            <div
              className={`mt-6 p-4 rounded-md flex items-center text-sm ${
                status === "success"
                  ? "bg-green-50 text-green-800 border-l-4 border-green-500"
                  : "bg-red-50 text-red-800 border-l-4 border-red-500"
              }`}
            >
              <span className="mr-2 text-base">{status === "success" ? "🌱" : "⚠️"}</span>
              <p>{message}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-green-600">Déjà dans notre communauté ?</span>
              </div>
            </div>
            <div className="mt-4">
              <a href="/login" className="font-medium text-green-700 hover:text-green-900 transition-colors">
                Se connecter à votre espace 
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register