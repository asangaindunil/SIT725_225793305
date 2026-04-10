function loadBooks() {

    fetch("/api/books")
    .then(response => response.json())
    .then(response => {
        let books = response.data;
        let container = document.getElementById("product-container");
        container.innerHTML = "";

        books.forEach(book => {

            let bookCard = `
            
            <div class="col s12 m6 l4">
                <div class="card product-card">

                    <div class="card-content">
                        <span class="card-title">${book.title}</span>

                        <p><strong>Author:</strong> ${book.author}</p>
                        <p><strong>Year:</strong> ${book.year}</p>
                        <p><strong>Genre:</strong> ${book.genre}</p>

                        <p class="summary">${book.summary}</p>
                    </div>

                    <div class="card-action center-align">
                        <a class="btn waves-effect waves-light teal"
                           onclick="viewBook('${book.id}')">
                            View Details
                        </a>
                    </div>

                </div>
            </div>
            
            `;

            container.innerHTML += bookCard;

        });

    })
    .catch(error => {
        console.error("Error loading books:", error);
        M.toast({ html: "Failed to load books" });
    });

}


function viewBook(id) {

    fetch(`/api/books/${id}`)
    .then(res => res.json())
    .then(response => {
        let book = response.data;
        M.Modal.init(document.querySelectorAll('.modal'));

        let modalHtml = `
        
        <div id="bookModal" class="modal open">
            <div class="modal-content">
                <h5>${book.title}</h5>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.year}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p>${book.summary}</p>
            </div>
            <div class="modal-footer">
                <a class="modal-close btn teal">Close</a>
            </div>
        </div>
        
        `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);

        let modal = document.getElementById("bookModal");
        let instance = M.Modal.init(modal);
        instance.open();

    });

}

document.addEventListener("DOMContentLoaded", loadBooks);