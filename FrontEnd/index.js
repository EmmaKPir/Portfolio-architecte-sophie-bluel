const allWorks = new Set();
const allCategories = new Set();
const gallery = document.querySelector(".gallery");
const filterCategory = document.querySelector("#filter-category");
let token = localStorage.getItem("token");

async function init() {
    const works = await getDatabaseInfo("works");
    for (const work of works) {
        allWorks.add(work);
    }
    const categories = await getDatabaseInfo("categories");
    for (const category of categories) {
        allCategories.add(category);
    }
    generateImage();
    if (token) {
        isAdmin();
    } else {
        addFilters();
    }
    modalOne();
    modalTwo();
}
init();

function isAdmin() {
    document.querySelector(".edit-mode").style.display = "flex";
    document.querySelector(".edit-btn1").style.display = "flex";
    document.querySelector(".edit-btn2").style.display = "flex";

    const modifBtnLogin = document.querySelector(".btn-login");
    modifBtnLogin.innerHTML = "Logout";

    modifBtnLogin.addEventListener("click", (e) => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    })
}
/* 
--------------------
--------------------
--------API---------
--------------------
--------------------
*/

// request get data base info
async function getDatabaseInfo(type) {
    const response = await fetch(`http://localhost:5678/api/${type}`);
    if (response.ok) {
        return response.json();
    } else {
        console.error(response);
    }
}

//request delete works
async function deleteWorks() {
    const response = await fetch(`http://localhost:5678/api/${type}`, {
        method: "DELETE",
        headers: {
            'content-Type': 'application/JSON',
            'Authorization': `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (result.ok) {
        console.log("Suppression réussie.");
        document.querySelectorAll("id", "figure-" + work.id).forEach(item =>{
            item.parentNode.removeChild(item);
        })
    } else {
        console.error("Erreur lors de la suppression du fichier.");
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
    gallery.innerHTML = "";
    const fragment = document.createDocumentFragment();
    let works = [];
    if (filter == "0") {
        works = allWorks;
    } else {
        filter = parseInt(filter);
        works = [...allWorks].filter(work => work.categoryId == filter);
        console.log(works);
    }
    for (const work of works) {
        // création des éléments
        const sectionPhotos = document.createElement("figure");
        const photosElement = document.createElement("img");
        const subtitleElement = document.createElement("figcaption");
        // on change la valeur de la const sectionPhotos
        sectionPhotos.setAttribute("id", "figure-" + work.id);
        // on accède à la source de chaque élement
        photosElement.src = work.imageUrl;
        subtitleElement.textContent = work.title;
        // on ajoute les noeuds
        sectionPhotos.appendChild(photosElement);
        sectionPhotos.appendChild(subtitleElement);
        fragment.appendChild(sectionPhotos);
    }
    gallery.appendChild(fragment);
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
    const fragment = document.createDocumentFragment();
    const categoryList = document.createElement("div");
    const buttonAll = document.createElement("div");
    buttonAll.textContent = "Tous";
    buttonAll.setAttribute("data-cat", "0");
    buttonAll.classList.add("active");
    buttonAll.classList.add("filter-button");
    categoryList.appendChild(buttonAll);
    for (const category of allCategories) {
        const oneButton = document.createElement("div");
        oneButton.classList.add("active");
        oneButton.classList.add("filter-button");
        oneButton.setAttribute("data-cat", category.id);
        oneButton.textContent = category.name === "Objets" ? "Objets" : category.name;
        categoryList.appendChild(oneButton);
    }
    categoryList.appendChild(fragment);
    filterCategory.appendChild(categoryList);
    filterListener();
}

function filterListener() {
    const filtersButtons = document.querySelectorAll(".filter-button");
    for (const button of filtersButtons) {
        button.addEventListener("click", (e) => {
            const clickedBtn = e.target;
            const id = clickedBtn.dataset.cat;
            document.querySelector(".active").classList.remove("active");
            clickedBtn.classList.add("active");
            generateImage(id);
        })
    }
}
/* 
--------------------
--------------------
-------MODAL--------
---GALLERY PHOTO----
--------------------
*/

// function to close and open the modal
function modalOne() {
    generatePictureModal()
    const modalContainer = document.querySelector(".modal-container");
    const modalTriggers = document.querySelectorAll(".modal-trigger");

    modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

    function toggleModal() {
        modalContainer.classList.toggle("active");
    }
}
// recovery of images for the modal
const pictureModal = document.querySelector(".picture-modal");

function generatePictureModal() {
    pictureModal.innerHTML = "";
    const fragment = document.createDocumentFragment();
    for (work of allWorks) {
        const containerPicture = document.createElement("div");
        containerPicture.classList.add("photosM");

        const picture = document.createElement("img");
        picture.classList.add("pictures");
        picture.src = work.imageUrl;

        const textPicture = document.createElement("p");
        textPicture.src = work.title;
        textPicture.innerHTML = "éditer";
        textPicture.classList.add("edit")

        const trashPicture = document.createElement("div");
        trashPicture.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        containerPicture.appendChild(picture);
        containerPicture.appendChild(textPicture);
        containerPicture.appendChild(trashPicture);
        fragment.appendChild(containerPicture);
    }
    pictureModal.appendChild(fragment);
}

// delete the pictures
function deletePicture() {
    const emptyBin = document.querySelectorAll(".fa-trash-can");
    emptyBin.forEach(deleteTrash); {
        deleteTrash.addEventListener("click", (e) => {
            e.preventDefault ();
            deleteWorks(e.target.dataset.id);
        });
    };
};



/* 
--------------------
--------------------
-------MODAL--------
------ADD PHOTO-----
--------------------
*/

function modalTwo() {
    const modal2 = document.querySelector(".modal2");
    const modalTriggers = document.querySelectorAll(".modal-trigger-modal2");

    modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

    function toggleModal() {
        modal2.classList.toggle("active");
    }
}