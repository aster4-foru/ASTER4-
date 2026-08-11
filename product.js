const API_URL =
  "https://script.google.com/macros/s/AKfycbypJDVSs2untkfyJ1upJZQgpRfDSclLEvFCt9RbUt48QisXp5HvqMcZRmgqnB-KIKh6/exec";


// =====================================================
// 取得網址中的團次 ID
// =====================================================

function getGroupId() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("group");

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
// 載入商品
// =====================================================

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

    // =================================================
    // 取得商品資料
    // =================================================

    const productResponse =
      await fetch(
        API_URL +
        "?action=products&group=" +
        encodeURIComponent(groupId)
      );


    // =================================================
    // 取得團次資料
    // =================================================

    const homeResponse =
      await fetch(
        API_URL +
        "?action=home"
      );


    const productData =
      await productResponse.json();


    const homeData =
      await homeResponse.json();


    console.log(
      "商品 API：",
      productData
    );


    console.log(
      "團次 API：",
      homeData
    );


    if (!productData.success) {

      document.getElementById(
        "group-info"
      ).innerHTML = `
        <h1>商品資料載入失敗</h1>
      `;

      return;

    }


    // =================================================
    // 找到團次名稱
    // =================================================

    let groupName =
      groupId;


    if (
      homeData.success &&
      homeData.products
    ) {

      const group =
        homeData.products.find(
          function(item) {

            return (
              String(item.groupId).trim() ===
              String(groupId).trim()
            );

          }
        );


      if (group) {

        groupName =
          group.name;

      }

    }


    displayProducts(
      productData.products,
      groupId,
      groupName
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


// =====================================================
// 顯示商品
// =====================================================

function displayProducts(
  products,
  groupId,
  groupName
) {

  const title =
    document.getElementById(
      "group-info"
    );


  const container =
    document.getElementById(
      "product-list"
    );


  // ===================================================
  // 沒有商品
  // ===================================================

  if (
    !products ||
    products.length === 0
  ) {

    title.innerHTML = `

      <h1>
        ${groupName}
      </h1>

      <p>
        目前沒有商品
      </p>

    `;

    return;

  }


  // ===================================================
  // 團次名稱
  // ===================================================

  title.innerHTML = `

    <h1>
      ${groupName}
    </h1>

    <p>
      Choose your favorite
    </p>

  `;


  container.innerHTML = "";


  // ===================================================
  // 建立商品卡片
  // ===================================================

  products.forEach(
    function(product) {


      const card =
        document.createElement(
          "div"
        );


      card.className =
        "product-item";


      // =================================================
      // 商品圖片
      // =================================================

      let imageHTML = "";


      if (product.image) {

        let imageUrl =
          String(
            product.image
          ).trim();


        // -----------------------------------------------
        // Google Drive 圖片轉換
        // -----------------------------------------------

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
            alt="${product.name || ""}"
          >

        `;

      } else {

        imageHTML = `

          <div class="no-image">
            ASTER4
          </div>

        `;

      }


      // =================================================
      // 商品狀態
      // =================================================

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


      // =================================================
      // 加入購物車按鈕
      // =================================================

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
            ${product.status || "暫停販售"}
          </div>

        `;

      }


      // =================================================
      // 商品卡片
      //
      // 圖片
      // ↓
      // 通路
      // ↓
      // 版本
      // ↓
      // 商品名稱
      // ↓
      // 價格
      // ↓
      // 加入購物車
      // =================================================

      card.innerHTML = `

        <!-- 商品圖片 -->

        <div class="product-item-image">

          ${imageHTML}

        </div>


        <!-- 商品資訊 -->

        <div class="product-item-info">


          <!-- 通路 -->

          <div class="product-channel">

            ${product.channel || ""}

          </div>


          <!-- 版本 -->

          ${
            product.version
              ? `
                <div class="product-version">
                  ${product.version}
                </div>
              `
              : ""
          }


          <!-- 商品名稱 -->

          <h2 class="product-item-name">

            ${product.name || ""}

          </h2>


          <!-- 價格 -->

          <div class="product-price">

            ${formatPrice(product.price)}

          </div>


          <!-- 商品狀態 -->

          <div
            class="product-status ${statusClass}"
          >

            ${product.status || ""}

          </div>


        </div>


        <!-- 加入購物車 -->

        <div class="product-action">

          ${buttonHTML}

        </div>

      `;


      container.appendChild(
        card
      );

    }
  );


  // ===================================================
  // 更新購物車數量
  // ===================================================

  updateCartCount();

}


// =====================================================
// 頁面載入
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadProducts();

  }
);


// =====================================================
// 加入購物車
// =====================================================

async function addToCart(
  productId
) {

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
        encodeURIComponent(
          productId
        )
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


    // =================================================
    // 檢查購物車是否已有這個商品
    // =================================================

    const existing =
      cart.find(
        function(item) {

          return (
            String(item.productId) ===
            String(product.productId)
          );

        }
      );


    if (existing) {

      existing.quantity =
        Number(
          existing.quantity || 0
        ) + 1;

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
          Number(
            product.price || 0
          ),

        image:
          product.image,

        quantity:
          1

      });

    }


    // =================================================
    // 儲存購物車
    // =================================================

    localStorage.setItem(
      "ASTER4_CART",
      JSON.stringify(cart)
    );


    // =================================================
    // 更新購物車數量
    // =================================================

    updateCartCount();


    // =================================================
    // 提示
    // =================================================

    alert(
      "已加入購物車！"
    );


  } catch (error) {

    console.error(
      "加入購物車失敗：",
      error
    );


    alert(
      "加入購物車失敗"
    );

  }

}


// =====================================================
// 更新購物車數量
// =====================================================

function updateCartCount() {

  try {

    const cart =
      JSON.parse(
        localStorage.getItem(
          "ASTER4_CART"
        ) || "[]"
      );


    const count =
      cart.reduce(
        function(total, item) {

          return (
            total +
            Number(
              item.quantity || 0
            )
          );

        },
        0
      );


    const element =
      document.getElementById(
        "cart-count"
      );


    if (element) {

      element.textContent =
        count;

    }


  } catch (error) {

    console.error(
      "購物車數量更新失敗：",
      error
    );

  }

}
