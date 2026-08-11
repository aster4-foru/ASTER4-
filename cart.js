// =========================
// 取得購物車
// =========================

function getCart() {

  const cart =
    localStorage.getItem(
      "ASTER4_CART"
    );


  if (!cart) {

    return [];

  }


  try {

    return JSON.parse(cart);

  } catch (error) {

    return [];

  }

}


// =========================
// 儲存購物車
// =========================

function saveCart(cart) {

  localStorage.setItem(
    "ASTER4_CART",
    JSON.stringify(cart)
  );

}


// =========================
// 顯示購物車
// =========================

function renderCart() {

  const cart =
    getCart();


  const container =
    document.getElementById(
      "cart-list"
    );


  const summary =
    document.getElementById(
      "cart-summary"
    );


  const count =
    document.getElementById(
      "cart-count"
    );


  // =========================
  // 購物車件數
  // =========================

  const totalQuantity =
    cart.reduce(
      function(total, item) {

        return total +
          Number(item.quantity);

      },
      0
    );


  count.textContent =
    totalQuantity;


  // =========================
  // 空購物車
  // =========================

  if (cart.length === 0) {

    container.innerHTML = `

      <div class="empty-cart">

        <div class="empty-cart-icon">
          🛒
        </div>

        <h2>
          購物車是空的
        </h2>

        <p>
          還沒有選擇任何商品
        </p>

        <a
          href="index.html"
          class="continue-button"
        >
          繼續逛逛
        </a>

      </div>

    `;


    summary.innerHTML = "";


    return;

  }


  // =========================
  // 商品列表
  // =========================

  container.innerHTML = "";


  cart.forEach(
    function(item, index) {

      const itemElement =
        document.createElement(
          "div"
        );


      itemElement.className =
        "cart-item";


      const subtotal =
        Number(item.price) *
        Number(item.quantity);


      itemElement.innerHTML = `

        <div class="cart-item-image">

          ${
            item.image
            ? `
              <img
                src="${item.image}"
                alt="${item.name}"
              >
            `
            : `
              <div class="no-image">
                ASTER4
              </div>
            `
          }

        </div>


        <div class="cart-item-info">

          <div class="cart-item-channel">
            ${item.channel}
          </div>


          <h2>
            ${item.name}
          </h2>


          <div class="cart-item-version">
            ${item.version}
          </div>


          <div class="cart-item-price">
            NT$ ${Number(item.price).toLocaleString()}
          </div>


          <div class="cart-item-bottom">

            <div class="quantity-control">

              <button
                type="button"
                onclick="changeQuantity(${index}, -1)"
              >
                −
              </button>


              <span>
                ${item.quantity}
              </span>


              <button
                type="button"
                onclick="changeQuantity(${index}, 1)"
              >
                ＋
              </button>

            </div>


            <div class="cart-item-subtotal">

              NT$
              ${subtotal.toLocaleString()}

            </div>


            <button
              type="button"
              class="remove-button"
              onclick="removeItem(${index})"
            >
              移除
            </button>

          </div>

        </div>

      `;


      container.appendChild(
        itemElement
      );

    }
  );


  // =========================
  // 總計
  // =========================

  const total =
    cart.reduce(
      function(sum, item) {

        return sum +
          Number(item.price) *
          Number(item.quantity);

      },
      0
    );


  summary.innerHTML = `

    <div class="cart-summary-inner">

      <div>

        <div class="cart-total-label">
          商品總額
        </div>

        <div class="cart-total">
          NT$ ${total.toLocaleString()}
        </div>

      </div>


      <a
        href="checkout.html"
        class="checkout-button"
      >
        前往結帳
      </a>

    </div>

  `;

}


// =========================
// 修改數量
// =========================

function changeQuantity(
  index,
  amount
) {

  const cart =
    getCart();


  if (!cart[index]) {

    return;

  }


  cart[index].quantity =
    Number(cart[index].quantity) +
    amount;


  if (
    cart[index].quantity <= 0
  ) {

    cart.splice(
      index,
      1
    );

  }


  saveCart(cart);

  renderCart();

}


// =========================
// 移除商品
// =========================

function removeItem(index) {

  const cart =
    getCart();


  cart.splice(
    index,
    1
  );


  saveCart(cart);

  renderCart();

}


// =========================
// 初始化
// =========================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    renderCart();

  }
);
