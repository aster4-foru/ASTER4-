const API_URL =
  "https://script.google.com/macros/s/AKfycbypJDVSs2untkfyJ1upJZQgpRfDSclLEvFCt9RbUt48QisXp5HvqMcZRmgqnB-KIKh6/exec";


// =========================
// ASTER4｜首頁
// =========================

async function loadHomeProducts() {

  try {

    const response = await fetch(
      API_URL + "?action=home"
    );

    const data = await response.json();

    console.log("GAS API 回傳：", data);


    if (!data.success) {

      console.error(
        "取得商品失敗：",
        data.message
      );

      return;

    }


    displayHomeProducts(data.products);


  } catch (error) {

    console.error(
      "API 連線失敗：",
      error
    );

  }

}


// =========================
// 顯示首頁商品
// =========================

function displayHomeProducts(products) {

  const container =
    document.getElementById("products");

  if (!container) {
    return;
  }


  if (!products || products.length === 0) {

    container.innerHTML = `
      <div class="empty-message">
        目前沒有開放中的團次
      </div>
    `;

    return;

  }


  container.innerHTML = "";


  products.forEach(function(product) {

    const card =
      document.createElement("a");

    card.href =
      "product.html?group=" +
      encodeURIComponent(product.groupId);

    card.className =
      "product-card";


    card.innerHTML = `

      ${
        product.image
        ? `
          <img
            class="product-image"
            src="${product.image}"
            alt="${product.name}"
          >
        `
        : `
          <div class="product-image no-image">
            ASTER4
          </div>
        `
      }

      <div class="product-info">

        <div class="product-group">
          ${product.groupId}
        </div>

        <div class="product-name">
          ${product.name}
        </div>

      </div>

    `;


    container.appendChild(card);

  });

}


// =========================
// 頁面載入
// =========================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadHomeProducts();

  }
);
