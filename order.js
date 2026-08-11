const API_URL =
  "https://script.google.com/macros/s/AKfycbypJDVSs2untkfyJ1upJZQgpRfDSclLEvFCt9RbUt48QisXp5HvqMcZRmgqnB-KIKh6/exec";


// =========================
// 取得商品 ID
// =========================

function getProductId() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("product");

}


// =========================
// 載入商品
// =========================

async function loadOrderProduct() {

  const productId =
    getProductId();


  if (!productId) {

    document.getElementById(
      "order-product"
    ).innerHTML = `
      <h1>找不到商品</h1>
    `;

    return;

  }


  try {

    const response =
      await fetch(
        API_URL +
        "?action=product&product=" +
        encodeURIComponent(productId)
      );


    const data =
      await response.json();


    console.log(
      "訂單商品 API：",
      data
    );


    if (!data.success ||
        !data.product) {

      document.getElementById(
        "order-product"
      ).innerHTML = `
        <h1>找不到商品</h1>
      `;

      return;

    }


    displayOrderProduct(
      data.product
    );


  } catch (error) {

    console.error(
      "商品資料載入失敗：",
      error
    );


    document.getElementById(
      "order-product"
    ).innerHTML = `
      <h1>商品資料載入失敗</h1>
    `;

  }

}


// =========================
// 顯示商品
// =========================

function displayOrderProduct(
  product
) {

  document.getElementById(
    "order-product"
  ).innerHTML = `

    <div class="order-product-channel">
      ${product.channel}
    </div>


    <h1>
      ${product.name}
    </h1>


    <div class="order-product-version">
      ${product.version}
    </div>


    <div class="order-product-price">
      NT$ ${product.price}
    </div>


    <div class="order-product-status">
      ${product.status}
    </div>

  `;

}


// =========================
// 頁面載入
// =========================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadOrderProduct();

  }
);
