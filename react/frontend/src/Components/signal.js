import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const ProblemReportForm = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location_address: '',
    image: null,
    latitude: 33.5731,  // Default to Casablanca if geolocation fails
    longitude: -7.5898
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 33.5731, lng: -7.5898 }); // Default map center (Casablanca)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Google Maps API key
  const googleMapsApiKey = 'AIzaSyAq4KQP4lSfu5bnnG_WSziVJWDL4CJdJig';

  // Base API URL - makes it easier to update if needed
  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      // Check for access token (using the same key name as in Login component)
      const accessToken = localStorage.getItem('access');
      
      if (!accessToken) {
        // Store the current location to redirect back after login
        localStorage.setItem('redirectAfterLogin', location.pathname);
        setAuthError('You must be logged in to report a problem');
        navigate('/login');
        return;
      }
      
      // Optional: Verify token is valid (if you have an endpoint for this)
      try {
        // If you have a token verification endpoint, use it
        // await axios.get(`${API_BASE_URL}/verify-token/`, {
        //   headers: {
        //     'Authorization': `Bearer ${accessToken}`
        //   }
        // });
        
        // For now, we'll just check if the token exists
        console.log('User authenticated with token');
      } catch (err) {
        console.error('Token validation error:', err);
        if (err.response && err.response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('access');
          localStorage.setItem('redirectAfterLogin', location.pathname);
          setAuthError('Your session has expired. Please login again.');
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/problem-categories/`);
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError(`Error loading categories: ${err.message || 'Unknown error'}`);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: latitude,
            longitude: longitude
          }));
          setMapCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // We'll keep using the default coordinates
        }
      );
    }
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle map clicks to update coordinates
  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMapCenter({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  // Success Alert Component
  const SuccessAlert = ({ message, onClose }) => {
    useEffect(() => {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }, [onClose]);
    
    return (
      <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 flex items-center animate-slide-in transition-all duration-300">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
        </div>
        <div className="ml-3">
          <p className="font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="ml-auto bg-transparent text-green-500 hover:text-green-700">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate form
    if (!formData.category || !formData.description || !formData.location_address) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Get the access token (same key as in Login component)
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
      setAuthError('You must be logged in to submit a report.');
      navigate('/login');
      return;
    }

    const data = new FormData();
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('location_address', formData.location_address);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      // Log the data being sent for debugging
      console.log('Sending data:', {
        category: formData.category,
        description: formData.description,
        location_address: formData.location_address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        image: formData.image ? formData.image.name : 'No image'
      });
      
      console.log('Using authorization token:', accessToken);

      const response = await axios.post(`${API_BASE_URL}/problem-reports/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      
      console.log('Report submitted successfully:', response.data);
      
      // Show custom success alert instead of default alert
      setShowSuccessAlert(true);
      
      // Reset form
      setFormData({
        category: '',
        description: '',
        location_address: '',
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
        image: null,
      });
      setTimeout(() => {
        navigate('/home');
      }, 5000);

    } catch (err) {
      console.error('Error submitting report:', err);
      
      if (err.response) {
        // Handle specific error responses
        if (err.response.status === 401) {
          localStorage.setItem('redirectAfterLogin', location.pathname);
          setAuthError('Your session has expired. Please login again.');
          localStorage.removeItem('access');
          navigate('/login');
        } else {
          const errorMsg = err.response.data.message || 
                          err.response.data.error || 
                          err.response.data.detail || 
                          'Error submitting report.';
          setError(`Error: ${errorMsg}`);
        }
      } else if (err.request) {
        // No response was received
        setError('Could not reach the server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to retry geolocation
  const retryGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: latitude,
            longitude: longitude
          }));
          setMapCenter({ lat: latitude, lng: longitude });
          
          // Use custom alert for location success too
          setShowSuccessAlert(true);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Could not retrieve geolocation. Please set the location manually using the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 to-green-200 bg-cover bg-center" style={{ backgroundImage: "url('images/StreetLight.png')" }}>
      {/* Success Alert */}
      {showSuccessAlert && (
        <SuccessAlert 
          message="Problem reported successfully!" 
          onClose={() => setShowSuccessAlert(false)} 
        />
      )}
      
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-lg border-2 border-green-500">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Report a Problem</h2>

          {authError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{authError}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

          {loading ? (
            <div className="flex justify-center">
              <p className="text-green-700 font-medium">Loading categories...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-green-700 font-medium">Category: <span className="text-red-500">*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
                >
                  <option value="">Select Category</option>
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  ) : (
                    <option value="">No categories available</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-green-700 font-medium">Description: <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Please describe the problem in detail..."
                  className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50 h-32"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-green-700 font-medium">Location Address: <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="location_address"
                  value={formData.location_address}
                  onChange={handleChange}
                  required
                  placeholder="Enter the address of the problem location"
                  className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-green-700 font-medium">Latitude:</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    readOnly
                    className="w-full p-3 border border-green-300 rounded-lg bg-green-100 text-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-green-700 font-medium">Longitude:</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    readOnly
                    className="w-full p-3 border border-green-300 rounded-lg bg-green-100 text-gray-700"
                  />
                </div>
              </div>

             

              <div className="space-y-2">
                <label className="block text-green-700 font-medium">Image:</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-green-50 hover:bg-green-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="text-sm text-green-600">
                        Click to upload an image
                      </p>
                    </div>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.image && (
                  <p className="text-green-600 text-sm text-center mt-2">
                    File selected: {formData.image.name}
                  </p>
                )}
              </div>

              {/* Google Maps Component */}
              <div className="mt-4">
                <label className="block text-green-700 font-medium">Select Location on Map:</label>
                <LoadScript googleMapsApiKey={googleMapsApiKey}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '300px', borderRadius: '8px' }}
                    center={mapCenter}
                    zoom={14}
                    onClick={onMapClick}
                  >
                    <Marker position={mapCenter} />
                  </GoogleMap>
                </LoadScript>
                <p className="text-sm text-gray-600 mt-1">Click on the map to set the exact location of the problem</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 ${isSubmitting ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white font-medium rounded-lg shadow transition duration-200`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Add these styles to your CSS file
/*
@keyframes slide-in {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out forwards;
}
*/

export default ProblemReportForm;