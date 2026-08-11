const CART_KEY = "ASTER4_CART";

const API_URL =
  "https://script.google.com/macros/s/AKfycbypJDVSs2untkfyJ1upJZQgpRfDSclLEvFCt9RbUt48QisXp5HvqMcZRmgqnB-KIKh6/exec";


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

  return (
    "NT$ " +
    Number(price || 0).toLocaleString()
  );

}


// =========================
// Google Drive 圖片
// =========================

function convertImageUrl(image) {

  if (!image) {
    return "";
  }


  let imageUrl =
    String(image).trim();


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


  return imageUrl;

}


// =========================
// 取得團次名稱
// =========================

async function getGroupName(groupId) {

  if (!groupId) {
    return "";
  }


  try {

    const response =
      await fetch(
        API_URL +
        "?action=products&group=" +
        encodeURIComponent(groupId)
      );


    const data =
      await response.json();


    if (
      data.success &&
      data.products &&
      data.products.length > 0
    ) {

      return (
        data.products[0].groupName ||
        ""
      );

    }

  } catch (error) {

    console.error(
      "取得團次名稱失敗：",
      error
    );

  }


  return "";

}


// =========================
// 顯示 Checkout
// =========================

async function displayCheckoutItems() {

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


    if (countElement) {

      countElement.textContent =
        "0 項商品";

    }


    return;

  }


  container.innerHTML = "";


  let total = 0;

  let totalQuantity = 0;


  // =========================
  // 團次名稱快取
  // =========================

  const groupNames = {};


  // =========================
  // 先取得所有團次名稱
  // =========================

  for (
    const item of cart
  ) {

    const groupId =
      item.groupId;


    if (
      groupId &&
      !groupNames[groupId]
    ) {

      groupNames[groupId] =
        await getGroupName(
          groupId
        );

    }

  }


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

      totalQuantity += quantity;


      const itemElement =
        document.createElement(
          "div"
        );


      itemElement.className =
        "checkout-item";


      // =========================
      // 商品圖片
      // =========================

      const imageUrl =
        convertImageUrl(
          item.image
        );


      let imageHTML = `

        <div class="checkout-no-image">
          ASTER4
        </div>

      `;


      if (imageUrl) {

        imageHTML = `

          <img
            src="${imageUrl}"
            alt="${item.name || "商品"}"
          >

        `;

      }


      // =========================
      // 團次名稱
      // =========================

      const groupName =
        groupNames[item.groupId] ||
        "";


      // =========================
      // 商品內容
      // =========================

      itemElement.innerHTML = `

        <div class="checkout-item-image">

          ${imageHTML}

        </div>


        <div class="checkout-item-info">


          ${
            groupName
              ? `
                <div class="checkout-item-group-name">
                  ${groupName}
                </div>
              `
              : ""
          }


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

  totalElement.textContent =
    formatPrice(total);


  if (countElement) {

    countElement.textContent =
      totalQuantity +
      " 項商品";

  }


  console.log(
    "Checkout 商品：",
    cart
  );


  console.log(
    "Checkout 總額：",
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
