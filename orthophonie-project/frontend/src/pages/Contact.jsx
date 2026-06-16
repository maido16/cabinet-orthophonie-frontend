import React from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Contact</h1>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-lg text-gray-700 mb-6">
            Page en construction - Utilisez le formulaire de contact sur la page d'accueil.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;