async function getReponse (e) {
const reponse = await fetch ("http://localhost:5678/api/works");
const json = await reponse.json ();
}