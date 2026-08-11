```javascript id="i4r8m3"
const CART_KEY = "ASTER4_CART";


// =========================
// 讀取購物車
// =========================

function getCart() {

  return JSON.parse(
    localStorage.getItem(CART_KEY) || "[]"
  );

}


// =========================
// 格式化價格
// =========================

function formatPrice(price) {

  return "NT$ " +
    Number(price).toLocaleString();

}


// =========================
// 顯示購物車商品
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


  if (!container) {
    return;
  }


  // =========================
  // 購物車是空的
  // =========================

  if (
    !cart ||
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


    if (totalElement) {

      totalElement.textContent =
        "NT$ 0";

    }


    return;

  }


  // =========================
  // 清空
  // =========================

  container.innerHTML = "";


  let total = 0;


  // =========================
  // 建立商品
  // =========================

  cart.forEach(
    function(item) {

      const quantity =
        Number(item.quantity) || 0;


      const price =
        Number(item.price) || 0;


      const subtotal =
        price * quantity;


      total += subtotal;


      const itemElement =
        document.createElement(
          "div"
        );


      itemElement.className =
        "checkout-item";


      // =========================
      // 圖片
      // =========================

      let imageHTML = "";


      if (item.image) {

        let imageUrl =
          String(
            item.image
          ).trim();


        // Google Drive
        if (
          imageUrl.indexOf(
            "drive.google.com"
          ) !== -1
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
            alt="${item.name}"
          >

        `;

      } else {

        imageHTML = `

          <div class="checkout-no-image">
            ASTER4
          </div>

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

    }
  );


  // =========================
  // 總額
  // =========================

  if (totalElement) {

    totalElement.textContent =
      formatPrice(total);

  }

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
```
