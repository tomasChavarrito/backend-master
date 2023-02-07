const removeProduct = async (event) =>{
    const productId = event.target.parentNode.getAttribute('id')
    const cartId = event.target.parentNode.parentNode.getAttribute('id')
    console.log(cartId)
    console.log(productId)
    await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
    })
    .then(alert('item deleted from cart'))
    .then(window.location.href = window.location.href)
}