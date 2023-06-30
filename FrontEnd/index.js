const allWorks = new Set()

async function init(){
    const works = await getDatabaseInfo("works")
    for (const work of works) {
        allWorks.add(work)
    }
    console.log(allWorks);
}
init()

/* 
--------------------
--------------------
--------API---------
--------------------
--------------------
*/

async function getDatabaseInfo(type){
    const response = await fetch(`http://localhost:5678/api/${type}`)
    if (response.ok) {
        return response.json()
    } else {
        console.error(response)
    }
}

// récupération des images
function genererImage(imageUrl) {
    for (let i = 0; i < imageUrl.length; i++) {
        // récupération de l'élément DOM qui accueillera les images
        const sectionPhotos = document.querySelector("#gallery")
        // récupération d'une balise figure
        const photosElement = document.createElement("figure")
        // création de l'image
        const images = document.createElement ("img")
        // on accède à l'indice i de l'image pour configurer la source
        images.src = imageUrl[i].images
        // création du sous titre
        const subtitleElement = document.createElement ("figcaption")
        sectionPhotos.appendChild (photosElement);
        photosElement.appendChild (images);
        photosElement.appendChild (subtitleElement);
    }
}

// création des boutons de filtres
for (let i = 0; i <= 4; i++) {
    const container_bouton = document.createElement ("div")
    const boutons = document.createElement(".btn-filter")
    container_bouton.appendChild (boutons)
}
// création du filtre avec la fonction filter
const boutonfiltrer = document.querySelector (".btn-filter")
*/