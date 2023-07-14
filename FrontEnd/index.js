const allWorks = new Set()
const allCategories = new Set()
const gallery = document.querySelector(".gallery")
const filterCategory = document.querySelector("#filter-category")

async function init() {
    const works = await getDatabaseInfo("works")
    for (const work of works) {
        allWorks.add(work)
    }
    const categories = await getDatabaseInfo("categories")
    for (const category of categories) {
        allCategories.add(category)
    }
    generateImage()
    addFilters()
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
        return response.json()
    } else {
        console.error(response)
    }
}

/* 
--------------------
--------------------
--------IMAGES------
--------------------
--------------------
*/

function generateImage(filter = "0") {
    gallery.innerHTML = ""
    const fragment = document.createDocumentFragment()
    let works = []
    if(filter == "0"){
        works = allWorks
    } else{
        filter = parseInt(filter)
        works = [...allWorks].filter(work => work.categoryId == filter)
        console.log(works);
    }
    for (const work of works) {
        // création des éléments
        const sectionPhotos = document.createElement("figure")
        const photosElement = document.createElement("img")
        const subtitleElement = document.createElement("figcaption")
        // on change la valeur de la const sectionPhotos
        sectionPhotos.setAttribute("id", "figure-"+work.id)
        // on accède à la source de chaque élement
        photosElement.src = work.imageUrl
        subtitleElement.textContent = work.title
        // on ajoute les noeuds
        sectionPhotos.appendChild(photosElement)
        sectionPhotos.appendChild(subtitleElement)
        fragment.appendChild(sectionPhotos)
    }
    gallery.appendChild(fragment)
}

/* 
--------------------
--------------------
--------FILTRES-----
--------------------
--------------------

add filtres html ok
hover filtres, changement background-color & color ok
eventListener "click" sur filtre
    remove active class du précédent
    add active class sur le bouton cliquer
    get id via data-
    launch display function with filter id
*/


function addFilters() {
    const fragment = document.createDocumentFragment()
    const categoryList = document.createElement("div")
    const buttonAll = document.createElement("div")
    buttonAll.textContent = "Tous"
    buttonAll.setAttribute("data-cat", "0")
    buttonAll.classList.add("active")
    buttonAll.classList.add("filter-button")
    categoryList.appendChild(buttonAll)
    for (const category of allCategories) {
        const oneButton = document.createElement("div")
        //oneButton.classList.add("active")
        oneButton.classList.add("active")
        oneButton.classList.add("filter-button")
        oneButton.setAttribute ("data-cat", category.id)
        oneButton.textContent = category.name === "Objets" ? "Objets" : category.name
        categoryList.appendChild(oneButton)
    }
    categoryList.appendChild(fragment)
    filterCategory.appendChild(categoryList)
    filterListener()
}

function filterListener(){
    const filtersButtons = document.querySelectorAll(".filter-button")
    for (const button of filtersButtons) {
        button.addEventListener("click", (e) => {
            const clickedBtn = e.target
            const id = clickedBtn.dataset.cat
            document.querySelector(".active").classList.remove("active")
            clickedBtn.classList.add("active")
            generateImage(id)
        })
    }
}
/* 
--------------------
--------------------
--------MODAL-------
------CONNEXION-----
--------------------
*/