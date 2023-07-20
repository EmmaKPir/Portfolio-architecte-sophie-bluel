// aller chercher les éléments dans l'API avec une fonction asynchrone
// stocker le token dans le localstorage
// utiliser un addEventListener sur le boutton submit pour lancer le formulaire
// afficher le message d'erreur "Erreur dans l'identifiant ou le mot de passe"
// renvoie sur la page d'accueil avec les bouttons de modification
const formulaire = document.querySelector("form");
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;


formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email: email,password: password})
  })
  const result = await response.json(); 

  if (response.hasOwnProperty("token")) {
    window.location.replace("index.html");
    LocalStorage;setItem("token", result.token);
  } else {
      alert("Erreur dans l'identifiant ou le mot de passe");
   }
});
