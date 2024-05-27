const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItensContainer = document.getElementById("cart-itens")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closemodalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];





//abrir modal
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    updateCartModal()
})

//fechar modal_1
cartModal.addEventListener("click", function (event){
        if(event.target === cartModal){
            cartModal.style.display = "none"
        }
})
//fechar modal_2
closemodalBtn.addEventListener("click", () => {
        cartModal.style.display = "none"
        
})


// pegar os elementos
    menu.addEventListener("click", function(event){
       let parentButton = event.target.closest(".add-to-cart-btn")
       if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
       } 
})

//adicionar ao carrinho
function addToCart(name, price){
    const existIten = cart.find(item => item.name === name)

    if(existIten){
        existIten.quantity +=1;
    }else{
        cart.push({
            name,
            price,
            quantity : 1,
        })
    }

    updateCartModal()
}

function updateCartModal(){
    cartItensContainer.innerHTML ="";
    let total = 0;

    cart.forEach(item =>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex","justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = 
        `
            <div class="flex itens-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p class="font-medium mt-2">Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$: ${item.price.toFixed(2)}</p>
                </div>

                
                <buttom class="remove-from-cart-btn" data-name = "${item.name}">
                    Remover
                </buttom>
                
            </div>
        `

        total += (item.price * item.quantity);

        cartItensContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-PT", {
        style: "currency",
        currency: "AKZ"
    });


    cartCounter.innerHTML = cart.length;   
}

//remover item do carrinho


cartItensContainer.addEventListener("click", function (event)
{
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemcart(name)
    }
})

function removeItemcart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index]

        if(item.quantity > 1){
            item.quantity -= 1;

            updateCartModal();
            
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}


addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
    

})

//finalizar carrinho
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "estamos fechados no momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar pedido para api do whatsapp
   const cartItens = cart.map((item) => {
    return(
        ` ${item.name} quantidade:(${item.quantity}) preço: AKZ(${item.price})| `
        )
   }).join("");
        const message = encodeURIComponent(cartItens)
        const phone = "992925840"

        window.open(`http://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,"_blanck")

        cart = [];
        updateCartModal();
    })

//verificar horario e manipular o card do horario
function checkRestaurantOpen(){
const data = new Date();
const hora = data.getHours();
return hora >= 8 && hora < 22; //true
}


const spanIten = document.getElementById("date-span")

const isOpen = checkRestaurantOpen();

if(isOpen){
    spanIten.classList.remove("bg-red-500")
    spanIten.classList.add("bg-green-600")
}else{
    spanIten.classList.remove("bg-green-600")
    spanIten.classList.add("bg-red-500")
}
