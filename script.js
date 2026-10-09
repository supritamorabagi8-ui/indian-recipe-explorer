const recipesDiv = document.getElementById("recipes");

let reviews = {
  good: 0,
  best: 0,
  fabulous: 0
};

let userComment = "";
let currentMeal = null; // 🔑 store current recipe

/* START APP */
function startApp() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

/* GO HOME */
function goHome() {
  recipesDiv.innerHTML = "";
}

/* SEARCH RECIPE */
function searchRecipe() {
  const query = document.getElementById("search").value;
  const type = document.getElementById("type").value;

  recipesDiv.innerHTML = "Loading...";

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => {
      if (!data.meals) {
        recipesDiv.innerHTML = "No recipes found";
        return;
      }

      recipesDiv.innerHTML = "";

      data.meals.forEach(meal => {
        const isVeg = meal.strCategory
          ? meal.strCategory.toLowerCase().includes("vegetarian")
          : false;

        if (type === "veg" && !isVeg) return;
        if (type === "nonveg" && isVeg) return;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${meal.strMealThumb}">
          <h3>${meal.strMeal}</h3>
          <button onclick="viewRecipe('${meal.idMeal}')">View</button>
        `;
        recipesDiv.appendChild(card);
      });
    });
}

/* VIEW RECIPE */
function viewRecipe(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      currentMeal = data.meals[0]; // 🔑 save meal
      renderRecipe();
    });
}

/* RENDER RECIPE (USED AGAIN & AGAIN) */
function renderRecipe() {
  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    const ing = currentMeal[`strIngredient${i}`];
    const mea = currentMeal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients += `<li>${ing} - ${mea}</li>`;
    }
  }

  recipesDiv.innerHTML = `
    <div class="card">
      <button class="back-btn" onclick="searchRecipe()">⬅ Back</button>

      <img src="${currentMeal.strMealThumb}">
      <h2>${currentMeal.strMeal}</h2>

      <h3>Ingredients</h3>
      <ul>${ingredients}</ul>

      <h3>Instructions</h3>
      <p>${currentMeal.strInstructions}</p>

      <h3>Your Comment</h3>
      <textarea id="commentBox" placeholder="Write your comment...">${userComment}</textarea>
      <br><br>
      <button onclick="submitComment()">Submit Comment</button>

      <div class="review">
        <h3>Give Your Review</h3>
        <button onclick="addReview('good')">
          👍 Good (${reviews.good})
        </button>
        <button onclick="addReview('best')">
          🌟 Best (${reviews.best})
        </button>
        <button onclick="addReview('fabulous')">
          🔥 Fabulous (${reviews.fabulous})
        </button>
      </div>
    </div>
  `;
}

/* SUBMIT COMMENT */
function submitComment() {
  const box = document.getElementById("commentBox");
  if (box && box.value.trim() !== "") {
    userComment = box.value;
    box.value = ""; // clear
    showThankYou();
  }
}

/* ADD REVIEW → COUNT WORKS NOW */
function addReview(type) {
  reviews[type]++;           // ✅ count increases
  playEffect(type);          // animation
  showThankYou();            // message
  renderRecipe();            // 🔑 refresh UI with new count
}

/* THANK YOU MESSAGE */
function showThankYou() {
  const msg = document.createElement("div");
  msg.innerText = "Thank you for your valuable review! 😊";
  msg.style.position = "fixed";
  msg.style.top = "20px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.background = "#4caf50";
  msg.style.color = "white";
  msg.style.padding = "10px 20px";
  msg.style.borderRadius = "20px";
  msg.style.zIndex = "9999";
  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 2000);
}

/* EFFECTS */
function playEffect(type) {

  if (type === "good") {
    for (let i = 0; i < 8; i++) {
      let b = document.createElement("div");
      b.className = "balloon";
      b.innerText = "🎈";
      b.style.left = Math.random() * 100 + "vw";
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 4000);
    }
  }

  if (type === "best") {
    for (let i = 0; i < 50; i++) {
      let c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.top = "-10px";
      c.style.background =
        `hsl(${Math.random() * 360},100%,50%)`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3000);
    }
  }

  if (type === "fabulous") {
    for (let i = 0; i < 10; i++) {
      let h = document.createElement("div");
      h.innerText = "💖";
      h.style.position = "fixed";
      h.style.left = Math.random() * 100 + "vw";
      h.style.top = "-50px";
      h.style.fontSize = "40px";
      h.style.animation = "heartFall 3s linear";
      h.style.zIndex = "9999";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 3000);
    }
  }
}
