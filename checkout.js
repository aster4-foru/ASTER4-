```javascript
const CART_KEY = "ASTER4_CART";


// =====================================================
// 讀取購物車
// =====================================================

function getCart() {

  try {

    return JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

  } catch (error) {

    console.error(
      "購物車資料讀取失敗：",
      error
    );

    return [];

  }

}


// =====================================================
// 金額格式
// =====================================================

function formatPrice(price) {

  return (
    "NT$ " +
    Number(price || 0).toLocaleString()
  );

}


// =====================================================
// 顯示訂單商品
// =====================================================

function displayCheckoutItems() {

  const cart = getCart();

  const container =
    document.getElementById(
      "checkout-items"
    );

  const totalElement =
    document.getElementById(
      "checkout-total"
    );

  const countElement =
    document.getElementById(
      "checkout-item-count"
    );


  if (!container) {

    console.error(
      "找不到 checkout-items"
    );

    return;

  }


  // ===================================================
  // 沒有商品
  // ===================================================

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


    if (countElement) {

      countElement.textContent =
        "0 件";

    }


    return;

  }


  // ===================================================
  // 清空
  // ===================================================

  container.innerHTML = "";


  let total = 0;

  let totalQuantity = 0;


  // ===================================================
  // 建立訂單明細
  // ===================================================

  cart.forEach(
    function(item) {


      const price =
        Number(item.price) || 0;


      const quantity =
        Number(item.quantity) || 0;


      const subtotal =
        price * quantity;


      total += subtotal;

      totalQuantity += quantity;


      const itemElement =
        document.createElement(
          "div"
        );


      itemElement.className =
        "checkout-item";


      itemElement.innerHTML = `

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


          ${
            item.version
              ? `
                <div class="checkout-item-version">
                  ${item.version}
                </div>
              `
              : ""
          }


          <div class="checkout-item-bottom">

            <span>
              ${formatPrice(price)}
              × ${quantity}
            </span>

          </div>


        </div>


        <div class="checkout-item-price">

          <small>
            小計
          </small>

          <strong>
            ${formatPrice(subtotal)}
          </strong>

        </div>

      `;


      container.appendChild(
        itemElement
      );

    }
  );


  // ===================================================
  // 總額
  // ===================================================

  if (totalElement) {

    totalElement.textContent =
      formatPrice(total);

  }


  // ===================================================
  // 商品數量
  // ===================================================

  if (countElement) {

    countElement.textContent =
      totalQuantity + " 件";

  }


  console.log(
    "結帳商品：",
    cart
  );


  console.log(
    "結帳總額：",
    total
  );

}


// =====================================================
// 頁面載入
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    displayCheckoutItems();

  }
);
```
