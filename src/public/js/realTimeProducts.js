const socket = io()

const form = document.getElementById('add-realtimeproducts-form')
const productListContainer = document.getElementById('product-list-container')

form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(form)
    const requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'manual'
    }

    fetch('http://localhost:8080/realtimeproducts',requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log(error))

    form.reset()
})

socket.on('getProducts', data => {
    console.log('probando 123' + data);
})

socket.on('newProduct', data => {
    const newProductFragment = document.createElement('div')
    newProductFragment.setAttribute("id", "product-item")
    
        newProductFragment.innerHTML = `
        
            <h2 id="title">${data.title}</h2>
            <p>${data.description}</p>
            <p>$${data.price}</p>
            <div class="thumbnail-container">
                <img src="../../${data.thumbnail}" alt="">
            </div>`
    
    
    productListContainer.append(newProductFragment)
})