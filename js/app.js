
const carrito = document.getElementById("carrito");
const libros = document.getElementById("lista-libros");
const listaLibros = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");

cargarEventListeners();

function cargarEventListeners() {
  libros.addEventListener("click", comprarLibro);
  carrito.addEventListener("click", eliminarLibro);
  vaciarCarritoBtn.addEventListener("click", vaciarCarrito);
  document.addEventListener("DOMContentLoaded", leerLocalStorage);
}

function comprarLibro(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const libro = e.target.parentElement.parentElement;
        leerDatosLibro(libro);
    }
}

function leerDatosLibro(libro){
    const infoLibro = {
        imagen: libro.querySelector('img').src,
        titulo: libro.querySelector('h4').textContent,
        precio: libro.querySelector('.precio span').textContent,
        id: libro.querySelector('a').getAttribute('data-id')
    }

    insertarCarrito(infoLibro);
}

function insertarCarrito(libro) {
    const row = document.createElement('tr');
    row.innerHTML = `
       <td>
           <img src="${libro.imagen}" width=100> 
       </td> 
       <td>${libro.titulo}</td>
       <td>${libro.precio}</td>
       <td>
        <a href="#" class="borrar-libro" data-id="${libro.id}">X</a>
       </td>
    `;
    listaLibros.appendChild(row);
    guardarLibroLocalStorage(libro);
}

function eliminarLibro(e) {
    e.preventDefault();

    let libro,
        libroId;
    
    if(e.target.classList.contains('borrar-libro')) {
        e.target.parentElement.parentElement.remove();
        libro = e.target.parentElement.parentElement;
        libroId = libro.querySelector('a').getAttribute('data-id');
    }
    eliminarLibroLocalStorage(libroId)
}

function vaciarCarrito(){
    while(listaLibros.firstChild){
        listaLibros.removeChild(listaLibros.firstChild);
    }
    vaciarLocalStorage();

    return false;
}

function guardarLibroLocalStorage(libro) {
    let libros;

    libros = obtenerLibrosLocalStorage();
    libros.push(libro);

    localStorage.setItem('libros', JSON.stringify(libros));
}

function obtenerLibrosLocalStorage() {
    let librosLS;

    if(localStorage.getItem('libros') === null) {
        librosLS = [];
    }else {
        librosLS = JSON.parse(localStorage.getItem('libros'));
    }
    return librosLS;
}

function leerLocalStorage() {
    let librosLS;

    librosLS = obtenerLibrosLocalStorage();

    librosLS.forEach(function(libro){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${libro.imagen}" width=100>
            </td>
            <td>${libro.titulo}</td>
            <td>${libro.precio}</td>
            <td>
                <a href="#" class="borrar-libro" data-id="${libro.id}">X</a>
            </td>
        `;
        listaLibros.appendChild(row);
    });
}

function eliminarLibroLocalStorage(libro) {
    let librosLS;
    librosLS = obtenerLibrosLocalStorage();

    librosLS.forEach(function(libroLS, index){
        if(libroLS.id === libro) {
            librosLS.splice(index, 1);
        }
    });

    localStorage.setItem('libros', JSON.stringify(librosLS));
}

function vaciarLocalStorage() {
    localStorage.clear();
}



//buscador

$(document).ready(function() {
    var item;
    var outputList = document.getElementById("resultados");
    var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
    var placeHldr = '<img src="https://via.placeholder.com/150">';
    var searchData;
  
    $("#buscar").click(function() {
      outputList.innerHTML = ""; 
      document.body.style.backgroundImage = "url('')";
       searchData = $("#buscador").val();
       if(searchData === "" || searchData === null) {
         displayError();
       }
      else {
         //console.log(searchData);
        // $.get("https://www.googleapis.com/books/v1/volumes?q="+searchData, getBookData());
         $.ajax({
            url: bookUrl + searchData,
            dataType: "json",
            success: function (response) {
               // console.log(response);
                if (response.totalItems === 0) {
                    alert("No hay resultados!.. Prueba otra vez:)");
                }
                else {
                    $("#titulo").animate({ 'margin-top': '5px' }, 1000);
                    $(".book-list").css("visibility", "visible");
                    displayResults(response);
                }
            },
            error: function () {
              alert("Algo salio mal..Prueba de nuevo!");
            }
          });
        }
        $("#buscador").val(""); 
     });
  
     //    function para mostrar los resultados en index

     function displayResults(response) {
        for (var i = 0; i < response.items.length; i+=2) {
          item = response.items[i];
          title1 = item.volumeInfo.title;
          author1 = item.volumeInfo.authors;
          publisher1 = item.volumeInfo.publisher;
          bookLink1 = item.volumeInfo.previewLink;
          bookIsbn = item.volumeInfo.industryIdentifiers[1].identifier;
          bookImg1 = (item.volumeInfo.imageLinks) ? item.volumeInfo.imageLinks.thumbnail : placeHldr ;
  
          item2 = response.items[i+1];
          title2 = item2.volumeInfo.title;
          author2 = item2.volumeInfo.authors;
          publisher2 = item2.volumeInfo.publisher;
          bookLink2 = item2.volumeInfo.previewLink;
          bookIsbn2 = item2.volumeInfo.industryIdentifiers[1].identifier;
          bookImg2 = (item2.volumeInfo.imageLinks) ? item2.volumeInfo.imageLinks.thumbnail : placeHldr ;
  
          
          outputList.innerHTML += '<div class="container">'+
                                  formatOutput(bookImg1, title1, author1, publisher1, bookLink1, bookIsbn) +
                                  formatOutput(bookImg2, title2, author2, publisher2, bookLink2, bookIsbn2) +
                                  '</div>';
  
          console.log(outputList);
        }
     }
  
     function formatOutput(bookImg, title, author, publisher, bookLink, bookIsbn) {
         
       var htmlCard = `<div class="row">
                         <div class="for columns">
                           <div class="card">
                            <img src="${bookImg}" class="img-book">
                               <div class="info-card">
                                  <h4>${title}</h4>
                                  <p>${author}</p>
                                  <img src="img/estrellas.png">
                                  <p class="precio">$50 <span class="u-pull-right">$15</span> </p>
                                  <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${bookIsbn}">Agregar al carrito</a>
                                </div>
                          </div>
                        </div>
                     </div>`;
       return htmlCard;
     }
     function displayError() {
       alert("La busqueda no puede estar vacia!")
     }
  
  });

