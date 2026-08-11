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


  if (!groupId) {

    document.getElementById(
      "group-info"
    ).innerHTML = `
      <h1>找不到團次</h1>
    `;

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
      ).innerHTML = `
        <h1>商品資料載入失敗</h1>
      `;

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
    ).innerHTML = `
      <h1>商品資料載入失敗</h1>
    `;

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

    title.innerHTML = `
      <div class="group-id">
        ${groupId}
      </div>

      <h1>
        目前沒有商品
      </h1>
    `;

    return;

  }


  // =========================
  // 團次標題
  // =========================

  title.innerHTML = `

    <div class="group-id">
      ${groupId}
    </div>

    <h1>
      ${products[0].name}
    </h1>

    <p>
      Choose your version
    </p>

  `;


  container.innerHTML = "";


  // =========================
  // 商品卡片
  // =========================

  products.forEach(
    function(product) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "product-item";


      // =========================
      // 商品圖片
      // =========================

      let imageHTML = "";


      if (product.image) {

        let imageUrl =
          String(product.image)
            .trim();


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
              "&sz=w1000";

          }

        }


        imageHTML = `
          <img
            src="${imageUrl}"
            alt="${product.name}"
          >
        `;

      } else {

        imageHTML = `
          <div class="no-image">
            ASTER4
          </div>
        `;

      }


      // =========================
      // 狀態
      // =========================

      let statusClass =
        "";


      if (
        product.status === "開放"
      ) {

        statusClass =
          "is-open";

      } else {

        statusClass =
          "is-closed";

      }


      // =========================
      // 購買按鈕
      // =========================

      let buttonHTML = "";


      if (
        product.status === "開放"
      ) {

buttonHTML = `
  <button
    type="button"
    class="buy-button"
    onclick="addToCart('${product.productId}')"
  >
    加入購物車
  </button>
`;

      } else {

        buttonHTML = `
          <div class="disabled-button">
            ${product.status}
          </div>
        `;

      }


      // =========================
      // 卡片內容
      // =========================

      card.innerHTML = `

        <div class="product-item-image">

          ${imageHTML}

        </div>


        <div class="product-item-info">

          <div class="product-channel">
            ${product.channel}
          </div>


          <h2 class="product-item-name">
            ${product.name}
          </h2>


          <div class="product-version">
            ${product.version}
          </div>


          <div
            class="product-status ${statusClass}"
          >
            ${product.status}
          </div>


          <div class="product-action">

            ${buttonHTML}

          </div>

        </div>

      `;


      container.appendChild(
        card
      );

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
async function addToCart(productId) {

  const cart =
    JSON.parse(
      localStorage.getItem(
        "ASTER4_CART"
      ) || "[]"
    );


  try {

    const response =
      await fetch(
        API_URL +
        "?action=product&product=" +
        encodeURIComponent(productId)
      );


    const data =
      await response.json();


    if (
      !data.success ||
      !data.product
    ) {

      alert(
        "商品資料取得失敗"
      );

      return;

    }


    const product =
      data.product;


    // =========================
    // 檢查是否已在購物車
    // =========================

    const existing =
      cart.find(
        function(item) {

          return item.productId ===
            product.productId;

        }
      );


    if (existing) {

      existing.quantity =
        Number(existing.quantity) + 1;

    } else {

      cart.push({

        productId:
          product.productId,

        groupId:
          product.groupId,

        channel:
          product.channel,

        name:
          product.name,

        version:
          product.version,

        price:
          Number(product.price),

        image:
          product.image,

        quantity:
          1

      });

    }


    // =========================
    // 儲存
    // =========================

    localStorage.setItem(
      "ASTER4_CART",
      JSON.stringify(cart)
    );


    // =========================
    // 提示
    // =========================

    alert(
      "已加入購物車！"
    );


  } catch (error) {

    console.error(
      error
    );


    alert(
      "加入購物車失敗"
    );

  }

}
onclick="addToCart('${product.productId}')"
