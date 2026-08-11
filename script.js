// =========================
// ASTER4｜JavaScript
// =========================

console.log("ASTER4 script.js 載入成功！");


// =========================
// 取得網址上的商品 ID
// =========================

const params = new URLSearchParams(window.location.search);
const productId = params.get("product");

console.log("目前商品 ID：", productId);


// =========================
// 下單頁
// =========================

if (productId) {

  const productGroup = document.querySelector(".order-title .product-group");

  if (productGroup) {
    productGroup.textContent = productId;
  }

}
