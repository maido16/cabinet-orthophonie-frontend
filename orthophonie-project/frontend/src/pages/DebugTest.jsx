import React, { useState, useEffect } from 'react';
import { orthophonieAIService } from '../services/orthophonieAIService';

export default function DebugTest() {
  const [status, setStatus] = useState('En attente...');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    console.log('🟡 DebugTest monté');
    console.log('🟡 Service:', orthophonieAIService);
    
    // Test automatique
    orthophonieAIService.getQuestions()
      .then(data => {
        console.log('✅ Questions reçues:', data);
        setQuestions(data);
        setStatus(`✅ ${data.length} questions chargées`);
      })
      .catch(err => {
        console.error('❌ Erreur:', err);
        setStatus(`❌ Erreur: ${err.message}`);
      });
  }, []);

  const handleClick = async () => {
    console.log('🟡 Bouton cliqué');
    try {
      const result = await orthophonieAIService.createTest({
        first_name: 'Debug',
        age: 5,
        parent_email: 'debug@test.com'
      });
      console.log('✅ Test créé:', result);
      setStatus(`✅ Test créé ID: ${result.test_id}`);
    } catch (err) {
      console.error('❌ Erreur création:', err);
      setStatus(`❌ Erreur: ${err.message}`);
    }
  };

  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>Debug OrthophonieAI</h1>
      <button onClick={handleClick} style={styles.button}>
        Créer un test
      </button>
      <div style={styles.status}>{status}</div>
      
      {questions.length > 0 && (
        <div style={styles.questions}>
          <h3>Questions disponibles:</h3>
          {questions.map(q => (
            <div key={q.id} style={styles.question}>
              <strong>ID {q.id}:</strong> {q.text.substring(0, 50)}...
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  status: {
    marginTop: '20px',
    padding: '10px',
    background: '#f3f4f6',
    borderRadius: '5px'
  },
  questions: {
    marginTop: '20px',
    padding: '15px',
    background: '#f0f9ff',
    borderRadius: '5px'
  },
  question: {
    padding: '5px 0',
    borderBottom: '1px solid #e5e7eb'
  }
};
