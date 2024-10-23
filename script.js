let dessert;
const dessertContainer = document.querySelector(".product-container");

let cart = [];
async function loadData() {
  try {
    const response = await fetch("./data.json"); // Wait for the fetch to complete
    const data = await response.json(); // Wait for the data to be parsed as JSON
    data.map((product) => {
      const productCard = document.createElement("div");
      const addBagDiv = document.createElement("div");
      const imageProduct = document.createElement("img");
      const imageAddBag = document.createElement("img");
      const productName = document.createElement("span");
      const productDescription = document.createElement("span");
      const productPrice = document.createElement("span");
      const productBtn = document.createElement("div");

      dessertContainer.appendChild(productCard);
      productCard.classList.add("product-card");

      productCard.appendChild(imageProduct);
      imageProduct.classList.add("product-img");
      imageProduct.src = product.image.desktop;
      productCard.appendChild(productName);

      productName.classList.add("product-name");
      productName.classList.add("product-subheading");
      productName.textContent = product.category;

      productCard.appendChild(productBtn);
      productBtn.classList.add("product-btn");
      productBtn.appendChild(imageAddBag);
      imageAddBag.src = "./assets/images/icon-add-to-cart.svg";
      productBtn.appendChild(addBagDiv);
      addBagDiv.textContent = "Add to Cart";

      productCard.appendChild(productDescription);
      productDescription.classList.add("product-description");
      productDescription.classList.add("product-subheading");
      productDescription.textContent = product.name;

      productCard.appendChild(productPrice);
      productPrice.classList.add("product-price");
      productPrice.classList.add("product-subheading");
      productPrice.textContent = product.price + "$";

      productBtn.addEventListener("click", (e) => {
        const productBtn = e.target;
        const productCard = e.target.parentElement;

        if (productBtn.classList.value != "product-btn") return;
        productBtn.classList.add("hide");
        const productQuantity = document.createElement("div");
        const decrementBtn = document.createElement("span");
        const incrementBtn = document.createElement("span");
        const quantityNumber = document.createElement("span");
        productCard.insertBefore(productQuantity, productCard.firstChild);
        // productCard.appendChild(productQuantity);
        productQuantity.classList.add("product-quantity");

        productQuantity.appendChild(decrementBtn);
        decrementBtn.classList.add("decrement");
        decrementBtn.innerHTML = "&minus;";

        decrementBtn.addEventListener("click", (e) => {
          quantityNumber.textContent = adjustQuantity(
            e,
            Number(quantityNumber.textContent),
            item
          );
        });

        productQuantity.appendChild(quantityNumber);
        quantityNumber.classList.add("quantity");
        quantityNumber.textContent = 1;
        const quantity = Number(quantityNumber.textContent);
        const item = {
          ...product,
          quantity,
        };

        productQuantity.appendChild(incrementBtn);
        incrementBtn.classList.add("increment");
        incrementBtn.innerHTML = "&plus;";
        incrementBtn.addEventListener("click", (e) => {
          quantityNumber.textContent = adjustQuantity(
            e,
            Number(quantityNumber.textContent),
            item
          );
        });

        addToCart(item, e);
      });
    });
    // Log after data is
    dessert = data;
  } catch (error) {
    console.error("Error fetching the JSON file:", error);
  }
}
function addToCart(product, e) {
  const itemExiste = cart.find((item) => item.name === product.name);

  if (itemExiste) {
    itemExiste.quantity = product.quantity;
  } else {
    cart.push(product);
  }
  updateCartDisplay();
}
function updateCartDisplay() {
  const cartBody = document.querySelector(".cart-body");
  const cartTotal = document.createElement("div");
  const cartTotalText = document.createElement("div");
  const cartTotalPrice = document.createElement("div");
  const cartConfirm = document.createElement("div");

  cartBody.innerHTML = "";

  let somme = 0;

  cart.map((product) => {
    const { name, quantity, price } = product;
    const cartItem = document.createElement("div");

    somme += quantity * price;
    cartItem.classList.add("cart-item");
    cartBody.appendChild(cartItem);

    const cartDiv = document.createElement("div");
    const cartItemName = document.createElement("div");
    const cartItemDetails = document.createElement("div");
    const cartItemQuantity = document.createElement("div");
    const cartItemPrice = document.createElement("div");
    const cartItemTotal = document.createElement("div");
    const cartRemoveItemBtn = document.createElement("div");
    const imgRemove = document.createElement("img");

    // Add the cart item content
    cartItem.appendChild(cartDiv);
    cartDiv.appendChild(cartItemName);
    cartItemName.classList.add("cart-item-name");
    cartItemName.textContent = name;

    cartDiv.appendChild(cartItemDetails);
    cartItemDetails.classList.add("cart-item-details");

    cartItemDetails.appendChild(cartItemQuantity);
    cartItemQuantity.classList.add("cart-item-quantity");
    cartItemQuantity.textContent = quantity;

    cartItemDetails.appendChild(cartItemPrice);
    cartItemPrice.classList.add("cart-item-price");
    cartItemPrice.textContent = price;

    cartItemDetails.appendChild(cartItemTotal);
    cartItemTotal.classList.add("cart-item-total");

    cartItemTotal.textContent = price * cartItemQuantity.textContent + " $";
    cartItem.appendChild(cartRemoveItemBtn);
    imgRemove.src = "./assets/images/icon-remove-item.svg";
    cartRemoveItemBtn.appendChild(imgRemove);
    cartRemoveItemBtn.classList.add("cart-remove-item");
    cartRemoveItemBtn.addEventListener("click", () => deleteItem(product));
  });
  cartBody.appendChild(cartTotal);

  cartTotal.classList.add("cart-total");
  cartTotal.appendChild(cartTotalText);
  cartTotal.appendChild(cartTotalPrice);
  cartTotalText.classList.add("cart-total-text");
  cartTotalPrice.classList.add("cart-total-price");
  cartTotalText.textContent = "Order Total";
  cartTotalPrice.textContent = somme + " $";
  cartBody.appendChild(cartConfirm);
  cartConfirm.classList.add("cart-confirm-btn");
  cartConfirm.textContent = "Confirm Order";
  const modalCartItemList = document.querySelector(".modal-cart-item-list");
  cartConfirm.addEventListener("click", () => {
    showModal(modalCartItemList);
  });
}
function adjustQuantity(e, quantity, product) {
  const target = e.target.classList.value;

  if (target === "increment") {
    quantity += 1;
  } else if (target === "decrement") {
    quantity = quantity - 1 || 1;
  }
  const cartItem = cart.find((item) => item.name === product.name);
  if (cartItem) {
    cartItem.quantity = quantity;
    updateCartDisplay();
  }
  return quantity;
}
function deleteItem(product) {
  cart = cart.filter((item) => item.name != product.name);
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    console.log(card);
    const productName = card.querySelector(".product-description").textContent;
    if (productName === product.name) {
      const addToCartBtn = card.querySelector(".product-btn");
      const quantityControls = card.querySelector(".product-quantity");

      addToCartBtn.classList.remove("hide"); // Show "Add to Cart" button
      if (quantityControls) {
        quantityControls.remove(); // Hide quantity controls by removing them
      }
    }
  });
  updateCartDisplay(); // Refresh the cart display
}
loadData();
function showModal(modalCartItemList) {
  const modal = document.querySelector(".modal");
  modal.classList.remove("hide");
  console.log(modalCartItemList);
  cart.map((order) => {
    const { image, name, price, quantity } = order;
    const modalCartItem = document.createElement("div");
    modalCartItem.classList.add("modal-cart-item");
    modalCartItemList.appendChild(modalCartItem);
    const modalCartItemLeft = document.createElement("div");
    modalCartItemLeft.classList.add("modal-cart-item-left");
    modalCartItem.appendChild(modalCartItemLeft);

    const modalCartItemThumbnail = document.createElement("div");
    modalCartItemThumbnail.classList.add("modal-cart-item-thumbnail");
    modalCartItemLeft.appendChild(modalCartItemThumbnail);
    const thumbnailImg = document.createElement("img");
    thumbnailImg.src = "./assets/images/image-waffle-desktop.jpg";
    modalCartItemThumbnail.appendChild(thumbnailImg);
    const modalCartItemDetails = document.createElement("div");
    modalCartItemDetails.classList.add("modal-cart-item-details");
    modalCartItemLeft.appendChild(modalCartItemDetails);

    const modalCartItemName = document.createElement("div");
    modalCartItemName.textContent = name;
    modalCartItemName.classList.add("modal-cart-item-name");

    modalCartItemDetails.appendChild(modalCartItemName);
    const modalCartItemData = document.createElement("div");
    modalCartItemData.classList.add("modal-cart-item-data");
    modalCartItemDetails.appendChild(modalCartItemData);

    const modalCartItemQuantity = document.createElement("div");
    modalCartItemQuantity.classList.add("modal-cart-item-quantity");
    modalCartItemQuantity.textContent = quantity;
    modalCartItemData.appendChild(modalCartItemQuantity);

    const modalCartItemPrice = document.createElement("div");
    modalCartItemPrice.classList.add("modal-cart-item-price");
    modalCartItemPrice.textContent = price;

    modalCartItemData.appendChild(modalCartItemPrice);
    const modalCartItemRight = document.createElement("div");
    modalCartItemRight.classList.add("modal-cart-item-right");
    modalCartItemRight.textContent = quantity * price;

    modalCartItem.appendChild(modalCartItemRight);

    const modalCartTotal = document.createElement("div");
    modalCartTotal.classList.add("modal-cart-total");

    //here modal cart item lists

    const modalCartTotalText = document.createElement("div");
    modalCartTotalText.classList.add("modal-cart-total-text");
    modalCartTotalText.textContent = "Order Total";
    modalCartTotal.appendChild(modalCartTotalText);

    const modalCartTotalPrice = document.createElement("div");
    modalCartTotalPrice.classList.add("modal-cart-total-price");
    modalCartTotalPrice.textContent = "54.00";
    modalCartTotal.appendChild(modalCartTotalPrice);
  });
}
