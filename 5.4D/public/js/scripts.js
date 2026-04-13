// Helper function to handle backend responses
function handleResponse(res) {
    return res.json().then(data => {
        if (!res.ok) {
            throw new Error(data.message || "Something went wrong");
        }
        return data;
    });
}

// Close modal helper
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const instance = M.Modal.getInstance(modal);
    instance.close();
    modal.remove();
}


// Load all books
function loadBooks() {

    fetch("/api/books")
    .then(handleResponse)
    .then(response => {

        let books = response.data;
        let container = document.getElementById("product-container");

        container.innerHTML = "";

        books.forEach(book => {

        let bookCard = `

        <div class="col s12">
            <div class="card hoverable book-list-card">

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

                <div class="card-action">

                    <button class="btn-small teal"
                        onclick="viewBook('${book.id}')">
                        View
                    </button>

                    <button class="btn-small orange"
                        onclick="openEditModal('${book.id}')">
                        Edit
                    </button>

                    <button class="btn-small red"
                        onclick="deleteBook('${book.id}')">
                        Delete
                    </button>

                </div>

            </div>
        </div>

        `;

        container.innerHTML += bookCard;

        });

    })
    .catch(error => {
        console.error("Error loading books:", error);
        M.toast({ html: error.message });
    });

}


// View Book
function viewBook(id) {

    fetch(`/api/books/${id}`)
    .then(handleResponse)
    .then(response => {

        let book = response.data;

        let modalHtml = `
        
        <div id="viewModal" class="modal">
            <div class="modal-content">
                <h5>${book.title}</h5>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.year}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Summary:</strong> ${book.summary}</p>
                <p><strong>Price:</strong> ${book.price} ${book.currency}</p>
            </div>
            <div class="modal-footer">
                <a class="modal-close btn teal">Close</a>
            </div>
        </div>
        
        `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);

        let modal = document.getElementById("viewModal");
        let instance = M.Modal.init(modal);
        instance.open();

    })
    .catch(error => {
        M.toast({ html: error.message });
    });
}


// Add Book Modal
function addBook(){

    let modalHtml = `

    <div id="addModal" class="modal">
        <div class="modal-content">
            <h5>Add Book</h5>

            <div class="input-field">
                <input id="id" type="text">
                <label>ID</label>
            </div>

            <div class="input-field">
                <input id="title" type="text">
                <label>Title</label>
            </div>

            <div class="input-field">
                <input id="author" type="text">
                <label>Author</label>
            </div>

            <div class="input-field">
                <input id="year" type="number">
                <label>Year</label>
            </div>

            <div class="input-field">
                <input id="genre" type="text">
                <label>Genre</label>
            </div>

            <div class="input-field">
                <textarea id="summary" class="materialize-textarea"></textarea>
                <label>Summary</label>
            </div>

            <div class="input-field">
                <input id="price" type="number">
                <label>Price</label>
            </div>

        </div>

        <div class="modal-footer">
            <button class="btn green" onclick="saveBook()">Save</button>
            <button class="btn grey modal-close">Cancel</button>
        </div>

    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    let modal = document.getElementById("addModal");
    let instance = M.Modal.init(modal);
    instance.open();

}


// Save Book
function saveBook(){

    let book = {
        id: document.getElementById("id").value,
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        year: document.getElementById("year").value,
        genre: document.getElementById("genre").value,
        summary: document.getElementById("summary").value,
        price: document.getElementById("price").value,
        currency: "AUD"
    };

    fetch("/api/books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    })
    .then(handleResponse)
    .then(data => {

        closeModal("addModal");
        M.toast({ html: "Book Added Successfully" });
        loadBooks();

    })
    .catch(error => {
        M.toast({ html: error.message });
    });

}


// Edit Modal
function openEditModal(id){

    fetch(`/api/books/${id}`)
    .then(handleResponse)
    .then(response => {

        let book = response.data;

        let modalHtml = `

        <div id="editModal" class="modal">
            <div class="modal-content">
                <h5>Edit Book</h5>

                <div class="input-field">
                    <input id="editTitle" type="text" value="${book.title}">
                    <label class="active">Title</label>
                </div>

                <div class="input-field">
                    <input id="editAuthor" type="text" value="${book.author}">
                    <label class="active">Author</label>
                </div>

                <div class="input-field">
                    <input id="editYear" type="number" value="${book.year}">
                    <label class="active">Year</label>
                </div>

                <div class="input-field">
                    <input id="editGenre" type="text" value="${book.genre}">
                    <label class="active">Genre</label>
                </div>

                <div class="input-field">
                    <textarea id="editSummary" class="materialize-textarea">${book.summary}</textarea>
                    <label class="active">Summary</label>
                </div>

                <div class="input-field">
                    <input id="editPrice" type="number" value="${book.price}">
                    <label class="active">Price</label>
                </div>

            </div>

            <div class="modal-footer">
                <button class="btn orange" onclick="updateBook('${book.id}')">Update</button>
                <button class="btn grey modal-close">Cancel</button>
            </div>

        </div>
        `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);

        let modal = document.getElementById("editModal");
        let instance = M.Modal.init(modal);
        instance.open();

    })
    .catch(error => {
        M.toast({ html: error.message });
    });

}


// Update Book
function updateBook(id){

    let book = {
        title: document.getElementById("editTitle").value,
        author: document.getElementById("editAuthor").value,
        year: document.getElementById("editYear").value,
        genre: document.getElementById("editGenre").value,
        summary: document.getElementById("editSummary").value,
        price: document.getElementById("editPrice").value
    };

    fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    })
    .then(handleResponse)
    .then(data => {

        closeModal("editModal");
        M.toast({ html: "Book Updated Successfully" });
        loadBooks();

    })
    .catch(error => {
        M.toast({ html: error.message });
    });

}


// Delete Book
function deleteBook(id){

    if(!confirm("Are you sure?")) return;

    fetch(`/api/books/${id}`, {
        method: "DELETE"
    })
    .then(handleResponse)
    .then(data => {

        M.toast({ html: "Book Deleted Successfully" });
        loadBooks();

    })
    .catch(error => {
        M.toast({ html: error.message });
    });

}


// Auto load books
// document.addEventListener("DOMContentLoaded", loadBooks);