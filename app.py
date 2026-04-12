from flask import Flask, render_template, request
import pickle

app = Flask(__name__)

model = pickle.load(open('model.pkl', 'rb'))
encoder = pickle.load(open('encoder.pkl', 'rb'))
symptoms_list = pickle.load(open('symptoms_list.pkl', 'rb'))

@app.route('/')
def home():
    return render_template('index.html', symptoms=symptoms_list)

@app.route('/predict', methods=['POST'])
def predict():
    selected_symptoms = request.form.getlist('symptoms')

    input_vector = [1 if symptom in selected_symptoms else 0 for symptom in symptoms_list]

    prediction = model.predict([input_vector])[0]
    probabilities = model.predict_proba([input_vector])[0]

    disease = encoder.inverse_transform([prediction])[0]
    confidence = round(max(probabilities) * 100, 2)

    return render_template('result.html',
                           disease=disease,
                           confidence=confidence)

if __name__ == '__main__':
    app.run(debug=True)