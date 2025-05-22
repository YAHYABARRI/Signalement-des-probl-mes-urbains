"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { CheckCircle, XCircle, User, Lock } from "lucide-react"

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      })
  
      // Store tokens
      localStorage.setItem("access", response.data.access)
      localStorage.setItem("refresh", response.data.refresh)
      localStorage.setItem("username", username)
  
      // Récupérer l'utilisateur avec les informations de rôle
      const userInfo = await axios.get("http://127.0.0.1:8000/api/protected/", {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
        },
      })
  
      console.log("User info:", userInfo.data)
  
      // Stocker l'utilisateur et son rôle
      localStorage.setItem("user", JSON.stringify(userInfo.data))
  
      setMessage("Connexion réussie ! Redirection en cours...")
      setStatus("success")
  
      // Rediriger en fonction du rôle
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem("user"))
        if (currentUser.user_role === "ADMIN") {
          navigate("/admin")
        } 
        else if (currentUser.user_role === "CONSTATEUR"){
          navigate("/constateur")
        }
        else {
          const redirectPath = localStorage.getItem("redirectAfterLogin") || "/home"
          localStorage.removeItem("redirectAfterLogin")
          navigate(redirectPath)
        }
      }, 1000)
  
    } catch (error) {
      setMessage("Identifiants incorrects")
      setStatus("error")
      console.error("Erreur de connexion:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/backgroundimg.png')" }}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white bg-opacity-90 rounded-2xl shadow-xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-emerald-800">Connexion</h2>
          <p className="mt-2 text-sm text-emerald-600">Entrez vos identifiants pour accéder à votre compte</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Nom d'utilisateur</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-emerald-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-emerald-300 rounded-lg bg-white bg-opacity-80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-emerald-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-emerald-300 rounded-lg bg-white bg-opacity-80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium ${
                isLoading ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150`}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>
        </form>

        {status && (
          <div className={`mt-4 p-3 rounded-lg flex items-center ${status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {status === "success" ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
            <p>{message}</p>
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <a href="/register" className="text-emerald-600 hover:text-emerald-800 font-medium">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
