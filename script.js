// =========================
// ASTER4｜JavaScript
// =========================

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
