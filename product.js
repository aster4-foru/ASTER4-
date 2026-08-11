const API_URL =
  "https://script.google.com/macros/s/AKfycbypJDVSs2untkfyJ1upJZQgpRfDSclLEvFCt9RbUt48QisXp5HvqMcZRmgqnB-KIKh6/exec";


// =========================
// 取得網址中的團次 ID
// =========================

function getGroupId() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("group");

}


// =========================
// 載入商品
// =========================

async function loadProducts() {

  const groupId =
    getGroupId();


  // 沒有團次 ID
  if (!groupId) {

    document.getElementById(
      "group-info"
    ).textContent =
      "找不到團次";

    return;

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


    console.log(
      "商品 API：",
      data
    );


    if (!data.success) {

      document.getElementById(
        "group-info"
      ).textContent =
        data.message || "取得商品失敗";

      return;

    }


    displayProducts(
      data.products,
      groupId
    );


  } catch (error) {

    console.error(
      "商品 API 連線失敗：",
      error
    );


    document.getElementById(
      "group-info"
    ).textContent =
      "商品資料載入失敗";

  }

}


// =========================
// 顯示商品
// =========================

function displayProducts(
  products,
  groupId
) {

  const title =
    document.getElementById(
      "group-info"
    );


  const container =
    document.getElementById(
      "product-list"
    );


  if (!products ||
      products.length === 0) {

    title.textContent =
      groupId;

    container.innerHTML = `
      <div class="empty-message">
        目前沒有商品
      </div>
    `;

    return;

  }


  // 頁面標題
  title.innerHTML = `
    <div class="product-group-id">
      ${groupId}
    </div>

    <h1>
      ${products[0].name}
    </h1>
  `;


  container.innerHTML = "";


  products.forEach(
    function(product) {

      const card =
        document.createElement("div");


      card.className =
        "product-item";


      card.innerHTML = `

        <div class="product-item-image">

          ${
            product.image
            ? `
              <img
                src="${product.image}"
                alt="${product.name}"
              >
            `
            : `
              <div class="no-image">
                ASTER4
              </div>
            `
          }

        </div>


        <div class="product-item-info">

          <div class="product-channel">
            ${product.channel}
          </div>


          <div class="product-item-name">
            ${product.name}
          </div>


          <div class="product-version">
            ${product.version}
          </div>


          <div
            class="product-status status-${product.status}"
          >
            ${product.status}
          </div>

        </div>

      `;


      container.appendChild(card);

    }
  );

}


// =========================
// 頁面載入
// =========================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadProducts();

  }
);
