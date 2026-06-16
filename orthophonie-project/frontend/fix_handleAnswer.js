const fs = require('fs');
let content = fs.readFileSync('src/pages/OrthophonieAITest.jsx', 'utf8');

// Trouvons et corrigeons handleAnswer
const handleAnswerRegex = /const handleAnswer = \(value\) => \{[\s\S]*?\n\s*submitToAI\(updatedAnswers\);[\s\S]*?\n\s*\}/;

if (handleAnswerRegex.test(content)) {
  // Version CORRIGÉE de handleAnswer
  const correctedHandleAnswer = `const handleAnswer = (value) => {
    console.log('🎯 HANDLEANSWER CALLED! Value:', value);
    console.log('🎯 Current question index:', currentIndex);
    
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) {
      console.error('❌ No current question!');
      return;
    }
    
    // ⭐ IMPORTANT: Convertir ID en string
    const questionId = currentQuestion.id.toString();
    console.log('🎯 Question ID:', questionId);
    
    const updatedAnswers = {
      ...testData.answers,
      [questionId]: value
    };
    
    console.log('🎯 Updated answers:', updatedAnswers);
    setTestData(prev => ({ ...prev, answers: updatedAnswers }));
    
    // Prochaine question ou soumission
    if (currentIndex < questions.length - 1) {
      console.log('🎯 Next question...');
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('🎯 All questions answered, submitting...');
      submitToAI(updatedAnswers);
    }
  }`;
  
  content = content.replace(handleAnswerRegex, correctedHandleAnswer);
  fs.writeFileSync('src/pages/OrthophonieAITest.jsx', content);
  console.log('✅ handleAnswer corrigé avec logging');
} else {
  console.log('⚠️ handleAnswer non trouvé, cherchons autrement...');
  
  // Ajoutons du logging dans les boutons directement
  const buttonFix = content.replace(
    /onClick=\{\(\) => handleAnswer\(option\.value\)\}/g,
    `onClick={() => { console.log('🟡 Button clicked for option:', option.value); handleAnswer(option.value); }}`
  );
  
  fs.writeFileSync('src/pages/OrthophonieAITest.jsx', buttonFix);
  console.log('✅ Logging ajouté aux boutons');
}
