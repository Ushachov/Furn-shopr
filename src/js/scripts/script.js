import {_removeClasses, isMobile} from "./functions.js";

window.onload = function () {
    document.addEventListener("click", documentActions);

    function documentActions(event) {
        const targetEl = event.target;

        if(window.innerWidth > 768 && isMobile.any()){
            if (targetEl.classList.contains("menu__arrow")){
                targetEl.closest(".menu__item").classList.toggle('_hover');
            }else if(!targetEl.closest(".menu__item") && document.querySelectorAll(".menu__item._hover").length > 0){
                _removeClasses(document.querySelectorAll(".menu__item._hover"), "_hover");
            }
        }

        if(targetEl.classList.contains("search-form__icon")){
            document.querySelector(".search-form").classList.toggle("_active");
        }else if(!targetEl.closest(".search-form") && document.querySelector(".search-form._active")){
            document.querySelector(".search-form").classList.remove('_active');
        }

        if(targetEl.closest(".icon-menu")){
            document.querySelector(".icon-menu").classList.toggle("_active");
            document.querySelector(".menu__body").classList.toggle("_active");
        }

        if (targetEl.classList.contains('products__more')) {
            event.preventDefault();
            getProducts(targetEl);
        }

        if(targetEl.classList.contains('actions-product__btn')){
            event.preventDefault()
            const id = targetEl.closest(".item-product").dataset.productId;
            console.log(id)
            addToCartProduct(targetEl, id);
        }

        if(targetEl.classList.contains("cart-header__icon") || targetEl.closest(".cart-header__icon")){
            event.preventDefault()
            if(document.querySelector(".cart-list").children.length > 0){
                document.querySelector(".cart-header").classList.toggle("_active");
            }
        }else if(!targetEl.closest(".cart-header") && !targetEl.classList.contains("actions-product__btn")){
            document.querySelector(".cart-header").classList.remove("_active");
        }

        if(targetEl.classList.contains("cart-list__delete")){
            event.preventDefault()
            const id = targetEl.closest(".cart-list__item").dataset.cartId;
            console.log(id)
            updateCart(targetEl, id, false)
        }
    }

    // For Header
    const headerElement = document.querySelector(".header");

    const callback = (entries, observer) =>{
        if(entries[0].isIntersecting){
            headerElement.classList.remove("_scroll");
        }else {
            headerElement.classList.add("_scroll");
        }
    }

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerElement);


    // Load product
    async function getProducts(button) {
        if(!button.classList.contains("_loading")) {
            button.classList.add("_loading");
            const file = "json/products.json"
            let response = await fetch(file, {
                method: "GET"
            })

            if(response.ok){
                let result = await response.json();
                loadProducts(result);
                button.classList.remove("_loading");
                button.remove();
            }
        }
    }

    const loadProducts = (data) =>{

        data.products.forEach(item => {
            const {id, url, image, title, text, price, priceOld, shareUrl, likeUrl, labels} = item;


            let productTemplateLabels = ``;
            if (labels) {
                let productTemplateLabelsContent = '';

                labels.forEach(labelItem => {
                    productTemplateLabelsContent += `<div class="item-product__label item-product__label-${labelItem.type}">${labelItem.value}</div>`;
                });

                productTemplateLabels = `<div class="item-product__labels">${productTemplateLabelsContent}</div>`
            }

            let priceOldEl = priceOld ? `<div class="item-product__price-old">${priceOld}</div>` : "";

            const productItem = `<div data-product-id="${id}" class="products__item item-product">

                        ${productTemplateLabels}

                        <a href="${url}" class="item-product__img _ibg">
                            <img src="./img/products/${image}" alt="${title}">
                        </a>

                        <div class="item-product__body">
                            <div class="item-product__content">
                                <h3 class="item-product__title">${title}</h3>
                                <p class="item-product__text">${text}</p>
                            </div>
                            <div class="item-product__prices">
                                <div class="item-product__price">${price}</div>
                                ${priceOldEl}
                            </div>
                            <div class="item-product__actions actions-product">
                                <div class="actions-product__body">
                                    <a href="" class="actions-product__btn btn">Add to cart</a>
                                    <a href="${shareUrl}" class="actions-product__link _icon-share">Share</a>
                                    <a href="${likeUrl}" class="actions-product__link _icon-favorite">Like</a>
                                </div>
                            </div>
                        </div>
                    </div>`

            document.querySelector('.products__items').insertAdjacentHTML('beforeend', productItem);

        })
    }

    
    // Add product to cart
    const addToCartProduct = (productBtn, id) => {
      if(!productBtn.classList.contains("_hold")){
          productBtn.classList.add("_hold");
          updateCart(productBtn, id)
      }
    }

    const updateCart = (productBtn, id, productAdd = true) => {
        const cart = document.querySelector(".cart-header");
        const cartIcon = document.querySelector('.cart-header__icon');
        const cartQuantity = document.querySelector('.cart-header__icon > span');
        const cartProduct = document.querySelector(`[data-cart-id="${id}"]`);
        const cartList = document.querySelector('.cart-list');

        if(productAdd){
            if(cartQuantity){
                cartQuantity.innerHTML = ++cartQuantity.innerHTML;
            }else{
                cartIcon.insertAdjacentHTML("beforeend", `<span>1</span>`);
            }

            if(!cartProduct){
                const product = document.querySelector(`[data-product-id="${id}"]`);
                const cartProductImage = product.querySelector(".item-product__img").innerHTML;
                const cartProductTitle = product.querySelector(".item-product__title").innerHTML;
                const cartProductContent = `
                <li data-cart-id="${id}" class="cart-list__item">
                    <a href="" class="cart-list__img _ibg">${cartProductImage}</a>
                    <div class="cart-list__body">
                        <a href="" class="cart-list__title">${cartProductTitle}</a>
                        <p class="cart-list__quantity">Quantity: <span>1</span></p>
                        <a href="" class="cart-list__delete">Delete</a>
                    </div>
                </li>`;
                cartList.insertAdjacentHTML("beforeend", cartProductContent);
            }else{
                const cartProductQuantity = cartProduct.querySelector(".cart-list__quantity span");
                cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
            }

            productBtn.classList.remove("_hold");
        }else {
            const cartProductQuantity = cartProduct.querySelector(".cart-list__quantity span");
            cartProductQuantity.innerHTML = --cartProductQuantity.innerText;
            if (!parseInt(cartProductQuantity.innerHTML)) {
                cartProduct.remove();
            }

            const cartQuantityValue = --cartQuantity.innerHTML;

            if (cartQuantityValue) {
                cartQuantity.innerHTML = cartQuantityValue;
            } else {
                cartQuantity.remove();
                cart.classList.remove('_active');
            }
        }
    }



}

