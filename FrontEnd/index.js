const allWorks = new Set();
const allCategories = new Set();
const formData = new FormData();
const gallery = document.querySelector(".gallery");
const filterCategory = document.querySelector("#filter-category");
const pictureModal = document.querySelector(".picture-modal");
const containerPicture = document.querySelector(".add-img");
const containerPreviewImage = document.querySelector(".container-img");
const previewText = document.querySelector(".preview-p");
const previewLabel = document.querySelector(".preview-label");
const containerDelete = document.querySelector(".delete-picture");
const inputFile = document.getElementById("btn-add");
const image = document.querySelector(".preview-picture");
const title = document.getElementById("title");
const category = document.getElementById("liste-cat");
const buttonSubmit = document.getElementById("submit-button");
const formulaire = document.getElementById("formulaire");
const modal2 = document.querySelector(".modal2");
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
    modalTwoSecondPart();
    addPictureInModal2();
    validationInput();
    deletePicture();
    addNewPicture();
}
init();

function isAdmin() {
    document.querySelector(".edit-mode").style.display = "flex";
    document.querySelector(".edit-btn1").style.display = "flex";
    document.querySelector(".edit-btn2").style.display = "flex";
    document.querySelector(".edit-btn3").style.display = "flex";

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
async function deleteWorks(id) {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (response.ok) {
        console.log("Suppression réussie.");
        return "deleted";
    } else {
        console.error("Erreur lors de la suppression du fichier.");
        return "error";
    }
}

// for send form
async function sendWork() {
    const response = await fetch(`http://localhost:5678/api/works`, {
        method: "POST",
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (response.ok) {
        console.log("enregistrement réussi");
        return response.json();
    } else {
        console.log("erreur de téléchargement");
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
        sectionPhotos.classList.add("gallery-image");
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
    generatePictureModal();
    const modalContainer = document.querySelector(".modal-container");
    const modalTriggers = document.querySelectorAll(".modal-trigger");

    modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

    function toggleModal() {
        modalContainer.classList.toggle("active");
    }
}

// recovery of images for the modal
function generatePictureModal() {
    pictureModal.innerHTML = "";
    const fragment = document.createDocumentFragment();
    for (work of allWorks) {
        const containerPicture = document.createElement("figure");
        containerPicture.dataset.id = work.id;
        containerPicture.classList.add("photosM");
        containerPicture.setAttribute("id", "picture-" + work.id);

        const picture = document.createElement("img");
        picture.classList.add("pictures");
        picture.src = work.imageUrl;

        const textPicture = document.createElement("p");
        textPicture.src = work.title;
        textPicture.innerHTML = "éditer";
        textPicture.classList.add("edit");

        // creation trash and delete picture
        const trashPicture = document.createElement("div");
        trashPicture.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        trashPicture.classList.add("trash");
        trashPicture.addEventListener("click", async (e) => {
            const parent = e.target.closest("figure")
            const id = parent.dataset.id;
            const isDeleted = await deleteWorks(id);
            if (isDeleted == "deleted") {
                parent.remove()
                const galleryImagesToDelete = document.getElementById(`figure-${id}`);
                if (galleryImagesToDelete) {
                    galleryImagesToDelete.remove();
                }
                for (const work of allWorks) {
                    if (work.id == id) {
                        allWorks.delete(work)
                    }
                }
            }
        });

        const iconemoove = document.createElement("div");
        iconemoove.innerHTML = '<i class="fa-solid fa-up-down-left-right"></i>'

        containerPicture.appendChild(picture);
        containerPicture.appendChild(textPicture);
        containerPicture.appendChild(trashPicture);
        containerPicture.appendChild(iconemoove);
        fragment.appendChild(containerPicture);
    }
    pictureModal.appendChild(fragment);
}

/* 
--------------------
--------------------
-------MODAL N°2----
------ADD PHOTO-----
--------------------
*/

// open the modal, close the modal N°2 with arrow and return on the modal 1
function modalTwo() {
    listCategoryModal2();
    const modalTriggers = document.querySelectorAll(".modal-trigger-modal2");

    modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

    function toggleModal() {
        modal2.classList.toggle("active");
    }
}

// close the modal N°2 with X and overlay
function modalTwoSecondPart() {
    listCategoryModal2();
    const modalContainer = document.querySelector(".modal-container");
    const modalTriggers = document.querySelectorAll(".modal-trigger-xmark");

    modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));

    function toggleModal() {
        modal2.classList.remove("active");
        modalContainer.classList.remove("active");
    }
}

/************ Part Image **************/
// Add image in the modal N°2 and hide the other elements
function addPictureInModal2() {
    inputFile.addEventListener("change", (e) => {
        let curFiles = inputFile.files;
        if (sizeImage(curFiles) === false) {
            alert("La taille de l'image est trop grande : maxi 4Mo.");
            return
        }
        typeImage(curFiles);
        if (curFiles.length > 0) {
            for (let i = 0; i < curFiles.length; i++) {
                const image = document.createElement("img");
                image.classList.add("preview-picture");
                image.src = window.URL.createObjectURL(curFiles[i]);
                containerPicture.appendChild(image);
                containerPreviewImage.classList.toggle("hidden");
                previewText.classList.toggle("hidden");
                previewLabel.classList.toggle("hidden");
                containerDelete.classList.toggle("active");
            }
        }
    })

}

// delete picture if you want to upload an other
function deletePicture() {
    containerDelete.addEventListener("click", (e) => {
        const image = document.querySelector(".preview-picture");
        containerPreviewImage.classList.toggle("hidden");
        previewText.classList.toggle("hidden");
        previewLabel.classList.toggle("hidden");
        containerDelete.classList.toggle("active");
        inputFile.value = null;
        image.remove();
    })

}

// type validation
function typeImage(curFiles) {
    const allowedTypes = ['images/jpeg', 'image/png'];
    for (var i = 0; i < curFiles.length; i++) {
        if (!allowedTypes.includes(curFiles[i].type)) {
            return;
        }
    }
}

// size validation
function sizeImage(curFiles) {
    const maxSize = 4000000;
    if (curFiles[0].size > maxSize) {
        return false;
    }
    return true;
}

/**************** Part Category ************/
// list category in the modal N°2
function listCategoryModal2() {
    const containerCat = document.querySelector("select");
    containerCat.innerHTML = "";
    const emptyOption = document.createElement("option")
    emptyOption.value = "";
    emptyOption.text = "";
    containerCat.appendChild(emptyOption);
    for (const category of allCategories) {
        const optionCat = document.createElement("option");
        optionCat.value = category.id;
        optionCat.textContent = category.name;
        containerCat.appendChild(optionCat);
    };
}
/************** Validation form and add work **************/
// validation input of the modal N°2
function validationInput() {
    formulaire.addEventListener("input", (e) => {
        checkForm();
    })
}

// condition of the form
function checkForm() {
    if (title.value != "" && inputFile.value != "" && category.value != "") {
        buttonSubmit.style.cursor = "pointer";
        buttonSubmit.disabled = false;
        buttonSubmit.style.backgroundColor = "#1D6154";
    }
}

//add work in the API
function addNewPicture() {
    formulaire.addEventListener("submit", async(e) => {
        e.preventDefault();
        formData.delete("image");
        formData.delete("title");
        formData.delete("category");
        formData.append("image", inputFile.files[0]);
        formData.append("title", title.value);
        formData.append("category", category.value);
        const newWork = await sendWork();
        allWorks.add(newWork)
        deleteForm();
        generatePictureModal();
        generateImage();
        modal2.classList.remove("active");
    })
}

// delete the form
function deleteForm() {
    title.value = "";
    category.value = 0;
    inputFile.value = null;
    const image = document.querySelector(".preview-picture");
    if (image) {
        image.remove();
        containerPreviewImage.classList.toggle("hidden");
        previewText.classList.toggle("hidden");
        previewLabel.classList.toggle("hidden");
        containerDelete.classList.toggle("active");
    }
}
