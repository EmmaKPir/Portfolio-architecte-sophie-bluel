const allWorks = new Set();
const allCategories = new Set();
const gallery = document.querySelector("gallery");

async function init() {
    const works = await getDatabaseInfo("works")
    for (const work of works) {
        allWorks.add(work);
    }
    const categories = await getDatabaseInfo("categories");
    for (const category of categories) {
        allCategories.add(category);
    }
}
init()

/* 
--------------------
--------------------
--------API---------
--------------------
--------------------
*/

async function getDatabaseInfo(type) {
    const response = await fetch(`http://localhost:5678/api/${type}`)
    if (response.ok) {
        return response.json();
    } else {
        console.error(response);
    }
}

/* 
--------------------
--------------------
--------IMAGES------
--------------------
--------------------
*/

function genererImage(container, Works) {
    const fragment = document.createDocumentFragment();
    for (const work of Works) {
        // création des éléments
        const sectionPhotos = document.createElement("figure");
        const photosElement = document.createElement("img");
        const subtitleElement = document.createElement("figcaption");
        // on change la valeur de la const sectionPhotos
        sectionPhotos.setAttribute("data-id", work.id);
        // on accède à la source de chaque élement
        photosElement.src = work.imageUrl;
        subtitleElement.textContent = work.title;
        // on ajoute les noeuds
        sectionPhotos.appendChild(photosElement);
        sectionPhotos.appendChild(subtitleElement);
        fragment.appendChild(sectionPhotos);
    }
    container.innerHTML = "";
    container.appendChild(fragment);
    gallery.appendChild(container);
}

/* 
--------------------
--------------------
--------FILTRES-----
--------------------
--------------------
*/

function filterImages() {
    const fragment = document.createDocumentFragment();
    for (const category of allCategories) {
        const categoryList = document.createElement("div");
        const buttonCategories = document.createElement("button");
        buttonCategories.setAttribute("data-cat-id", "0")
        buttonCategories.appendChild(categoryList)
    }
    categoryList.appendChild(fragment)
    listenerFilterImages ();
}

function listenerFilterImages (){
    
}