import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle

# Extended dataset
data = [
    ['fever','cough','fatigue','Flu'],
    ['fever','headache','fatigue','Flu'],
    ['cough','sneezing','Cold'],
    ['headache','nausea','Migraine'],
    ['fever','rash','Chickenpox'],
    ['cough','fever','COVID-19'],
    ['fatigue','weight_loss','Diabetes'],
    ['fever','chills','Malaria'],
    ['vomiting','diarrhea','Food Poisoning']
]

df = pd.DataFrame(data)

# Extract unique symptoms
symptoms = set()
for row in data:
    for item in row[:-1]:
        symptoms.add(item)

symptoms = sorted(list(symptoms))

# Create feature matrix
X = []
y = []

for row in data:
    row_symptoms = row[:-1]
    disease = row[-1]

    vector = [1 if symptom in row_symptoms else 0 for symptom in symptoms]
    X.append(vector)
    y.append(disease)

# Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X, y_encoded)

# Save files
pickle.dump(model, open('model.pkl', 'wb'))
pickle.dump(le, open('encoder.pkl', 'wb'))
pickle.dump(symptoms, open('symptoms_list.pkl', 'wb'))

print("Model trained and saved successfully!")