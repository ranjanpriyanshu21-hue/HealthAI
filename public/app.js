async function login() {
  const res = await fetch('/login', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({role:role.value, username:username.value})
  });
  alert('Logged in as ' + role.value);
}

async function register() {
  const res = await fetch('/register-patient', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({name:name.value,age:age.value,gender:gender.value,contact:contact.value})
  });
  const d = await res.json();
  alert('ID: '+d.id);
}

async function submitSymptoms() {
  const res = await fetch('/submit-symptoms', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id:patientId.value, symptoms:symptoms.value.split(',')})
  });
  const d = await res.json();
  result.innerText = d.prediction.disease + ' ('+d.prediction.confidence+')';
}

async function updateDoctor() {
  await fetch('/doctor-update', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id:docId.value, notes:notes.value, treatment:treatment.value})
  });
  alert('Updated');
}

async function searchPatients() {
  const res = await fetch('/patients');
  const data = await res.json();

  const query = search.value.toLowerCase();

  let filtered;

  if (query === "") {
    // show all patients if empty
    filtered = data;
  } else {
    filtered = data.filter(p =>
      p.name && p.name.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    patientsList.innerHTML = "<li>No patients found</li>";
    return;
  }

  patientsList.innerHTML = filtered.map(p => `
    <li>
      <strong>${p.name}</strong><br>
      Disease: ${p.prediction?.disease || 'Not analyzed'}
    </li>
  `).join('');
}