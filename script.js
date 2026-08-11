const API_URL =
  "https://script.google.com/macros/s/AKfycbypJDVSs2untkfyJ1upJZQgpRfDSclLEvFCt9RbUt48QisXp5HvqMcZRmgqnB-KIKh6/exec";


// =========================
// ASTER4｜首頁商品
// =========================

async function loadHomeProducts() {

  try {

    const response = await fetch(
      API_URL + "?action=home"
    );

    const data = await response.json();

    if (!data.success) {
      console.error("取得商品失敗：", data.message);
      return;
    }

    displayHomeProducts(data.products);

  } catch (error) {

    console.error("API 連線失敗：", error);

  }

}


// =========================
// 建立首頁商品卡片
// =========================

function displayHomeProducts(products) {

  const container =
    document.getElementById("products");

  if (!container) {
    return;
  }


  // 清空原本內容
  container.innerHTML = "";


  // 沒有商品
  if (!products || products.length === 0) {

    container.innerHTML = `
      <div class="no-products">
        目前沒有開團中的商品
      </div>
    `;

    return;
  }


  // =========================
  // 一團建立一張卡片
  // =========================

  products.forEach(function(product) {

    const card =
      document.createElement("a");


    // 點擊後進入該團次
    card.href =
      "./product.html?group=" +
      encodeURIComponent(product.groupId);


    card.className =
      "product-card";


    // 圖片
    let imageHTML = "";

    if (product.image) {

      imageHTML = `
        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name || ""}"
        >
      `;

    } else {

      imageHTML = `
        <div class="product-image no-image">
          ASTER4
        </div>
      `;

    }


    // 卡片內容
    card.innerHTML = `

      ${imageHTML}

      <div class="product-info">

        <div class="product-group">
          ${product.groupId}
        </div>

        <div class="product-name">
          ${product.name || ""}
        </div>

      </div>

    `;


    // 加入首頁
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
