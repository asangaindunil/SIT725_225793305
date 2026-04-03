function loadProducts() {

    fetch("/api/inventory")
    .then(response => response.json())
    .then(products => {

        let container = document.getElementById("product-container");
        container.innerHTML = "";

        products.forEach(product => {

            let productCard = `
            
            <div class="col s12 m6 l4">
                <div class="card product-card">

                    <div class="card-image">
                        <img src="${product.image}" alt="${product.name}">
                        <span class="card-title">${product.name}</span>
                    </div>

                    <div class="card-content">
                        <p>${product.description}</p>
                        <h6 class="price">$${product.price}</h6>
                        <p>Stock: ${product.quantity}</p>
                    </div>

                    <div class="card-action center-align">
                        <a class="btn waves-effect waves-light teal">
                            Add to Cart
                        </a>
                    </div>

                </div>
            </div>
            
            `;

            container.innerHTML += productCard;

        });

    })
    .catch(error => {
        console.error("Error loading products:", error);
        M.toast({ html: "Failed to load products" });
    });

}

document.addEventListener("DOMContentLoaded", loadProducts);