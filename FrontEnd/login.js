const formulaire = document.querySelector("form");

formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password })
  });

  const result = await response.json();

  if (response.ok) {
    localStorage.setItem("token", result.token);
    window.location.href = "index.html";
  } else {
    alert("Erreur dans l'identifiant ou le mot de passe");
  }
});
