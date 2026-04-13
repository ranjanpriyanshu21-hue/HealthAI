const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = 'data.json';

// =========================
// 📂 File Helpers
// =========================
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// =========================
// 🧠 Advanced AI Prediction
// =========================
function predictDisease(symptoms) {
  symptoms = symptoms.map(s => s.toLowerCase().trim());

  const rules = [
    { symptoms: ['fever','cough','sore throat'], disease: 'Flu', treatment: 'Rest + Fluids' },
    { symptoms: ['fever','cough','loss of smell'], disease: 'COVID-19', treatment: 'Isolation + rest' },
    { symptoms: ['chest pain','breathlessness','fatigue'], disease: 'Heart Disease', treatment: 'Cardiology consult' },
    { symptoms: ['headache','nausea','light sensitivity'], disease: 'Migraine', treatment: 'Pain relief + rest' },
    { symptoms: ['fever','rash','joint pain'], disease: 'Dengue', treatment: 'Fluids + monitoring' },
    { symptoms: ['thirst','fatigue','frequent urination'], disease: 'Diabetes', treatment: 'Diet + sugar control' },
    { symptoms: ['cough','weight loss','night sweats'], disease: 'Tuberculosis', treatment: 'Antibiotics (DOTS)' },
    { symptoms: ['abdominal pain','vomiting','diarrhea'], disease: 'Food Poisoning', treatment: 'ORS + hydration' },
    { symptoms: ['fatigue','pale skin','dizziness'], disease: 'Anemia', treatment: 'Iron supplements' },
    { symptoms: ['fever','chills','sweating'], disease: 'Malaria', treatment: 'Antimalarial drugs' },
    { symptoms: ['runny nose','sneezing','cough'], disease: 'Common Cold', treatment: 'Rest + antihistamines' },
    { symptoms: ['burning urination','frequent urination','pelvic pain'], disease: 'UTI', treatment: 'Antibiotics' },
    { symptoms: ['joint pain','stiffness','swelling'], disease: 'Arthritis', treatment: 'Pain relief + physiotherapy' },
    { symptoms: ['shortness of breath','wheezing','cough'], disease: 'Asthma', treatment: 'Inhalers + bronchodilators' }
  ];

  let bestMatch = {
    disease: 'Unknown',
    confidence: 0,
    treatment: 'Consult doctor'
  };

  for (let rule of rules) {
    let matchCount = rule.symptoms.filter(s => symptoms.includes(s)).length;

    let confidence = (matchCount / rule.symptoms.length) * 100;

    if (confidence > bestMatch.confidence && matchCount > 0) {
      bestMatch = {
        disease: rule.disease,
        confidence: Math.round(confidence) + '%',
        treatment: rule.treatment
      };
    }
  }

  return bestMatch;
}

// =========================
// 🔐 Login
// =========================
app.post('/login', (req, res) => {
  const { role, username } = req.body;
  if (username) {
    res.json({ success: true, role });
  } else {
    res.json({ success: false });
  }
});

// =========================
// 👤 Register Patient
// =========================
app.post('/register-patient', (req, res) => {
  const data = readData();

  const newPatient = {
    id: Date.now().toString(),
    ...req.body
  };

  data.push(newPatient);
  writeData(data);

  res.json(newPatient);
});

// =========================
// 🧠 Submit Symptoms + Predict
// =========================
app.post('/submit-symptoms', (req, res) => {
  const data = readData();
  const { id, symptoms } = req.body;

  const patient = data.find(p => p.id === id);

  if (patient) {
    patient.symptoms = symptoms;

    const prediction = predictDisease(symptoms);
    patient.prediction = prediction;

    writeData(data);
    res.json(patient);
  } else {
    res.status(404).send('Patient not found');
  }
});

// =========================
// 👨‍⚕️ Doctor Update
// =========================
app.post('/doctor-update', (req, res) => {
  const data = readData();
  const { id, notes, treatment } = req.body;

  const patient = data.find(p => p.id === id);

  if (patient) {
    patient.doctorNotes = notes;
    patient.finalTreatment = treatment;

    writeData(data);
    res.json(patient);
  } else {
    res.status(404).send('Patient not found');
  }
});

// =========================
// 🔍 Get Patients
// =========================
app.get('/patients', (req, res) => {
  res.json(readData());
});

// =========================
// 🚀 Start Server
// =========================
app.listen(3000, () => {
  console.log('Server running on port 3000');
});