const CART_KEY = "ASTER4_CART";


// =========================
// 讀取購物車
// =========================

function getCart() {

  const rawCart =
    localStorage.getItem(CART_KEY);

  console.log(
    "ASTER4_CART：",
    rawCart
  );

  if (!rawCart) {
    return [];
  }

  try {

    return JSON.parse(rawCart);

  } catch (error) {

    console.error(
      "購物車資料解析失敗：",
      error
    );

    return [];

  }

}


// =========================
// 金額格式
// =========================

function formatPrice(price) {

  return "NT$ " +
    Number(price || 0).toLocaleString();

}


// =========================
// 顯示商品
// =========================

function displayCheckoutItems() {

  const cart =
    getCart();


  const container =
    document.getElementById(
      "checkout-items"
    );


  const totalElement =
    document.getElementById(
      "checkout-total"
    );


  console.log(
    "結帳頁購物車：",
    cart
  );


  if (!container) {

    console.error(
      "找不到 checkout-items"
    );

    return;

  }


  if (!totalElement) {

    console.error(
      "找不到 checkout-total"
    );

    return;

  }


  // =========================
  // 空購物車
  // =========================

  if (
    !Array.isArray(cart) ||
    cart.length === 0
  ) {

    container.innerHTML = `

      <div class="checkout-empty">

        <p>
          購物車目前沒有商品
        </p>

        <a
          href="index.html"
          class="back-to-shop"
        >
          回到首頁
        </a>

      </div>

    `;

    totalElement.textContent =
      "NT$ 0";

    return;

  }


  container.innerHTML = "";


  let total = 0;


  // =========================
  // 商品
  // =========================

  cart.forEach(function(item) {

    const price =
      Number(item.price) || 0;


    const quantity =
      Number(item.quantity) || 0;


    const subtotal =
      price * quantity;


    total += subtotal;


    const itemElement =
      document.createElement("div");


    itemElement.className =
      "checkout-item";


    // =========================
    // 圖片
    // =========================

    let imageHTML = `

      <div class="checkout-no-image">
        ASTER4
      </div>

    `;


    if (item.image) {

      let imageUrl =
        String(item.image).trim();


      if (
        imageUrl.includes(
          "drive.google.com"
        )
      ) {

        const match =
          imageUrl.match(
            /\/d\/([^\/]+)/
          );


        if (match) {

          imageUrl =
            "https://drive.google.com/thumbnail?id=" +
            match[1] +
            "&sz=w500";

        }

      }


      imageHTML = `

        <img
          src="${imageUrl}"
          alt="${item.name || "商品"}"
        >

      `;

    }


    // =========================
    // 商品內容
    // =========================

    itemElement.innerHTML = `

      <div class="checkout-item-image">

        ${imageHTML}

      </div>


      <div class="checkout-item-info">

        <div class="checkout-item-group">
          ${item.groupId || ""}
        </div>


        <div class="checkout-item-channel">
          ${item.channel || ""}
        </div>


        <h3>
          ${item.name || ""}
        </h3>


        <div class="checkout-item-version">
          ${item.version || ""}
        </div>


        <div class="checkout-item-bottom">

          <span>
            ${formatPrice(price)}
            × ${quantity}
          </span>


          <strong>
            ${formatPrice(subtotal)}
          </strong>

        </div>

      </div>

    `;


    container.appendChild(
      itemElement
    );

  });


  // =========================
  // ⭐ 訂單總額
  // =========================

  totalElement.textContent =
    formatPrice(total);


  console.log(
    "訂單總額：",
    total
  );

}


// =========================
// 頁面載入
// =========================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    displayCheckoutItems();

  }
);
