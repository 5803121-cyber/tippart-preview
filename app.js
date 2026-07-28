const products = {
  logo: {
    title: "קורס יצירת לוגו מא׳ עד ת׳",
    price: 400,
    image: "course-logo.jpg",
    url: "course-logo.html"
  },
  retouch: {
    title: "אקשן לריטוש פנים",
    price: 5,
    image: "course-retouch.jpg",
    url: "course-retouch.html"
  }
};

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("tippart-cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("tippart-cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().length;
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = String(count);
  });
}

document.querySelectorAll("[data-add]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.add;
    if (!products[id]) return;
    const cart = getCart();
    if (!cart.includes(id)) cart.push(id);
    saveCart(cart);
    const message = document.querySelector("[data-cart-message]");
    if (message) message.textContent = "המוצר נוסף לסל.";
  });
});

function renderCart() {
  const container = document.querySelector("[data-cart-items]");
  if (!container) return;
  const cart = getCart().filter((id) => products[id]);
  if (!cart.length) {
    container.innerHTML = `
      <div class="empty">
        <h2>הסל עדיין ריק</h2>
        <p>אפשר לבחור קורס או מוצר דיגיטלי מתוך הקטלוג המשוחזר.</p>
        <a class="button" href="courses.html">לכל הקורסים</a>
      </div>`;
    return;
  }
  const total = cart.reduce((sum, id) => sum + products[id].price, 0);
  container.innerHTML = cart.map((id) => {
    const product = products[id];
    return `
      <article class="cart-item">
        <img src="${product.image}" alt="">
        <div><h3><a href="${product.url}">${product.title}</a></h3>
        <button type="button" data-remove="${id}">הסרה</button></div>
        <strong>₪${product.price}</strong>
      </article>`;
  }).join("") + `
    <div class="cart-total"><span>סה״כ</span><span>₪${total}</span></div>
    <div class="status-box checkout-note">התשלום אינו פעיל בכתובת הזמנית. הסל נשמר במכשיר הזה בלבד.</div>`;
  container.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      saveCart(getCart().filter((id) => id !== button.dataset.remove));
      renderCart();
    });
  });
}

updateCartCount();
renderCart();
