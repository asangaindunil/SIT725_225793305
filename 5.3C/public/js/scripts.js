function loadBooks() {

    fetch("/api/books")
    .then(response => response.json())
    .then(response => {
        let books = response.data;
        let container = document.getElementById("product-container");
        container.innerHTML = "";

        books.forEach(book => {
        let bookCard = `

            <div class="col s12">
                <div class="card hoverable book-list-card" 
                    onclick="viewBook('${book._id}')"
                    style="cursor:pointer">

                    <div class="card-content">
                        <div class="row" style="margin-bottom:0">
                            
                            <div class="col s8">
                                <span class="card-title">
                                    ${book.title}
                                </span>
                            </div>

                            <div class="col s4 right-align">
                                <span class="price">
                                    ${book.price} ${book.currency}
                                </span>
                            </div>

                        </div>
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
                <p><strong>Title:</strong> ${book.author}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.year}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Summery:</strong> ${book.summary}</p>
                <p><strong>Price (AUD):</strong> ${book.price}</p>
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

// document.addEventListener("DOMContentLoaded", loadBooks);