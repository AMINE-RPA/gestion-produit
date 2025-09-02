

//
// partie de la sidebar
//
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");
const toggleIcon = toggleBtn.querySelector("i");

// Ouvrir / fermer la sidebar
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");

  if (sidebar.classList.contains("active")) {
    toggleIcon.classList.replace("fa-bars", "fa-times");
  } else {
    toggleIcon.classList.replace("fa-times", "fa-bars");
  }
});

// Fermer en cliquant sur un item du menu
document.querySelectorAll(".sidebar a").forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("active");
    toggleIcon.classList.replace("fa-times", "fa-bars");
  });
});

// Fermer en cliquant en dehors
document.addEventListener("click", (e) => {
  if (
    sidebar.classList.contains("active") &&
    !sidebar.contains(e.target) &&
    !toggleBtn.contains(e.target)
  ) {
    sidebar.classList.remove("active");
    toggleIcon.classList.replace("fa-times", "fa-bars");
  }
});

//
// fin du code de la sidebar
//

