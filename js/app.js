const cards = document.getElementById('cards');
const templateCard = document.getElementById('templateCard').content;
const cartacarrito = document.querySelector('.cartacarrito').content;
const divcarrito = document.getElementById('divcarrito');
const templateCarritoTotal = document.getElementById('totalComprar').content;
const fragment = document.createDocumentFragment();
let carrito = {};


document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    iconCarrito('.navbarCarrito', 'divcarrito')
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
        pintarTotal()
    }
})

// CARRITO

const iconCarrito = (icon, lista) => {
    document.addEventListener('click', e =>{
        if(e.target.matches(icon)){
            document.getElementById(lista).classList.toggle('isActive');
        }
    })
}

// EVENT TECLADO

document.addEventListener('keyup', e => {
    if (e.target.matches('#buscador')){
        document.querySelectorAll('#dispositivo').forEach(dispositivo => {
            dispositivo.textContent.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
            ?dispositivo.classList.remove('filtro')
            :dispositivo.classList.add('filtro')
        })
    }
})

cards.addEventListener('click', e => {
    agregarAlCarrito(e)
});
divcarrito.addEventListener('click', e => {
    btnEliminar(e)
})

//CAPTURA DE DATOS DESDE EL JSON

const fetchData = async() => {
    try {
        const respuesta = await fetch('../api.json')
        const data = await respuesta.json()
        agregarCards(data)
    } catch (error) {
        console.log(error);
    }
}

//AGREGA LOS PRODUCTOS DEL JSON AL INDEX

const agregarCards = data => {
    data.forEach( producto => {
        templateCard.querySelector('h3').textContent = producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute('src', producto.img);
        templateCard.querySelector('img').setAttribute('alt', producto.title);
        templateCard.querySelector('button').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

//CAPTURA EL DIV DEL PRODUCTO

const agregarAlCarrito = e => {
    if(e.target.classList.contains('botoncompra')){
        setCarrito(e.target.parentElement.parentElement)
        agregarToast()
    }
    e.stopPropagation()
}

//SE CONVIERTE EN OBJETO Y SUMA CANTIDADES

const setCarrito = objeto => {
    const producto = {
        title: objeto.querySelector('h3').textContent,
        img: objeto.querySelector('img').src,
        precio: objeto.querySelector('p').textContent,
        id: objeto.querySelector('.botoncompra').dataset.id,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto}
    pintarCarrito()
    pintarTotal()
}

// SE AGREGAN LOS PRODUCTOS AL CARRITO DE COMPRA

const pintarCarrito = () =>{
    divcarrito.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        cartacarrito.querySelector('img').setAttribute('src', producto.img)
        cartacarrito.querySelector('img').setAttribute('alt', producto.title)
        cartacarrito.querySelector('.carritoBorrar').dataset.id = producto.id
        cartacarrito.querySelector('.trashcarro').dataset.id = producto.id
        cartacarrito.querySelector('.nombreproduc').textContent = producto.title;
        cartacarrito.querySelector('.carritoPrecio').textContent = producto.precio * producto.cantidad;
        cartacarrito.querySelector('.cantidadproduc').textContent = producto.cantidad
        const clone = cartacarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    divcarrito.appendChild(fragment)
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

// PRECIOS Y CANTIDADES

const pintarTotal = () =>{
const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
templateCarritoTotal.querySelector('.tProductos').textContent = nCantidad
templateCarritoTotal.querySelector('.tPrecio2').textContent = nPrecio
const clone = templateCarritoTotal.cloneNode(true)
fragment.appendChild(clone)
divcarrito.appendChild(fragment)

// SIMULACIÓN DE COMPRA PRODUCTOS

const comprarButton = document.getElementById('botoncompratemplate')
comprarButton.addEventListener('click' , () =>{
    carrito = {}
    pintarCarrito()
    pintarTotal()
    alertComprar()
})

//VACIAR EL CARRITO

const btnVaciarCarrito = document.querySelector('.btnborrarcarro')
btnVaciarCarrito.addEventListener('click' , () => {
    carrito = {}
    pintarCarrito()
    pintarTotal()
    eliminarTodo()
})
}

// BORRAR PRODUCTOS DEL CARRITO

const btnEliminar = e => {
    if(e.target.classList.contains('trashcarro')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
        pintarTotal()
        eliminarToast()
    }
}

//ALERTAS TOASTIFY

const agregarToast = () =>{
    Toastify({
        text: "Se agrego un nuevo producto al carrito",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "#x3b5998",
            color: "#000"
        },
    }).showToast()
}
const eliminarToast = () =>{
    Toastify({
        text: "Se elimino un producto del carrito",
        duration: 3500,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "#FF2D00",
            color: "#FFF"
        },
    }).showToast()
}
const eliminarTodo = () =>{
    Toastify({
        text: "Se eliminaron todos los productos del carrito",
        duration: 3500,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "left",
        stopOnFocus: true,
        style: {
            background: "#FF2D00",
            color: "#FFF"
        },
    }).showToast()
}

const alertComprar = () => {
    Swal.fire({
        title: 'Su compra fué exitosa.',
        text: 'Gracias por preferir Game Factory :)',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#313132',
    })
}
