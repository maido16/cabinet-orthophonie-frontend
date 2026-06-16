import React from 'react'
import { Link } from 'react-router-dom'

const Confirm = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-green-200 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✅</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Demande Enregistrée !
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Votre demande de rendez-vous a été envoyée avec succès. 
            Nous vous recontacterons sous 24h pour confirmer votre créneau.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
              <p className="text-gray-700">
                <strong>Prochaines étapes :</strong>
              </p>
              <ul className="text-left mt-2 space-y-2 text-gray-600">
                <li>• Confirmation sous 24h par téléphone ou email</li>
                <li>• Rappel 48h avant votre consultation</li>
                <li>• Présentez-vous 10 minutes avant l'heure du rendez-vous</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              ← Retour à l'accueil
            </Link>
            <Link
              to="/appointment"
              className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-green-600 hover:text-white transition-all"
            >
              Nouveau rendez-vous
            </Link>

          </div>
        </div>
      </div>
    </section>
  )
}
export default Confirm