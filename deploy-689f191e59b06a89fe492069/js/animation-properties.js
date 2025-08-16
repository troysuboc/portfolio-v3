
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible'); // Start animation
    } else {
      entry.target.classList.remove('visible'); // Reset animation
    }
  });
}, {
  threshold: 0.1 // Trigger when at least 10% is visible
});

// Observe all elements with the animation class
document.querySelectorAll('.animate-slide-up').forEach(el => observer.observe(el));


  // Add loading class before anything else
  document.documentElement.classList.add('js');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    // Remove loading screen visually
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.classList.add('hidden');

    // Re-enable scroll after a delay (match your CSS transition)
    setTimeout(() => {
      document.body.classList.remove('loading');
    }, 600); // Adjust if your fade-out takes longer
  });

const list = document.getElementById("scrollList");
const itemHeight = 80;
const totalItems = list.children.length;

// Clone the first item and append to the end for seamless looping
const firstClone = list.children[0].cloneNode(true);
list.appendChild(firstClone);

let currentIndex = 0;

function scrollNext() {
  currentIndex++;
  list.style.transition = "transform 0.5s ease";
  list.style.transform = `translateY(-${currentIndex * itemHeight}px)`;

  if (currentIndex === totalItems) {
    setTimeout(() => {
      list.style.transition = "none";
      list.style.transform = "translateY(0)";
      currentIndex = 0;
    }, 500); // match transition duration
  }
}

setInterval(scrollNext, 1000);

document.addEventListener("DOMContentLoaded", function () {
    const messages = [
        "enjoying your stay?",
        "coldest artist 🧊",
        "take your time...",
        "you still looking?",
        "welcome visitor 💛",
        "🍦🍦🍦 goes hard",
        "thanks for the visit xoxo",
        "gkmc = fav album"
    ];

    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popupMessage");

    function showRandomPopup() {
        // Pick random message
        const randomIndex = Math.floor(Math.random() * messages.length);
        popupMessage.textContent = messages[randomIndex];

        // Show popup
        popup.classList.add("show");

        // Hide after 3 seconds
        setTimeout(() => {
            popup.classList.remove("show");
        }, 3000);
    }

    // Show every 8 seconds
    setInterval(showRandomPopup, 15000);
});
