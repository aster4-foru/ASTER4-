javascript
const CART_KEY = "ASTER4_CART";


// =========================
// 讀取購物車
// =========================

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


// =========================
// 金額格式
// =========================

function formatPrice(price) {

  return (
    "NT$ " +
    Number(price || 0).toLocaleString()
  );

}


// =========================
// 顯示結帳商品
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

    console.error(
      "找不到 checkout-items"
    );

    return;

  }


  if (!totalElement) {

    console.error(
      "找不到 checkout-total"
    );

  }


  // =========================
  // 購物車沒有商品
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
  // 清空原本內容
  // =========================

  container.innerHTML = "";


  let total = 0;


  // =========================
  // 建立商品
  // =========================

  cart.forEach(
    function(item) {

      const price =
        Number(item.price) || 0;


      const quantity =
        Number(item.quantity) || 0;


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
      // 商品圖片
      // =========================

      let imageHTML = "";


      if (item.image) {

        let imageUrl =
          String(
            item.image
          ).trim();


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
            alt="${item.name || ""}"
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
  // ⭐ 計算完成後直接寫入總額
  // =========================

  if (totalElement) {

    totalElement.innerHTML = `
      ${formatPrice(total)}
    `;

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


// =========================
// 頁面載入
// =========================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    displayCheckoutItems();

  }
);
alert("CHECKOUT JS 有成功載入！");
