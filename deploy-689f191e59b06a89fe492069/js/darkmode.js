const darkModeToggle = document.getElementById('darkmode-toggle');
const themeSwitchBtn = document.getElementById('theme-switch');
const pfpElements = document.querySelectorAll('.pfp');

function applyTheme(isLight) {
  document.documentElement.classList.toggle('light-mode', isLight);
  pfpElements.forEach(el => el.classList.toggle('light-mode', isLight));
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  darkModeToggle.checked = isLight;
}

// Load theme from storage on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const isLight = savedTheme === 'light';
  applyTheme(isLight);
});

// Toggle via checkbox
darkModeToggle.addEventListener('change', () => {
  applyTheme(darkModeToggle.checked);
});

// Toggle via button
themeSwitchBtn.addEventListener('click', () => {
  const isCurrentlyLight = document.documentElement.classList.contains('light-mode');
  applyTheme(!isCurrentlyLight);
});
