document.addEventListener('DOMContentLoaded', () => {
  fetch('design-data.json')
    .then(res => res.json())
    .then(data => {
      const tabContents = document.querySelectorAll('.carousel-container.tab-content');

      tabContents.forEach(container => {
        const tabId = container.id;
        const carousel = container.querySelector('.carousel');

        if (!carousel) return;

        // Clear existing items
        carousel.innerHTML = '';

        const tabData = data[tabId];
        if (!tabData || !tabData.length) return;

        tabData.forEach(item => {
          const carouselItem = document.createElement('div');
          carouselItem.classList.add('carousel-item');
          carouselItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="content-wrapper">
              <h2>${item.title}</h2>
              <button class="openGalleryBtn" data-gallery="${item.gallery}">view more</button>
              <div class="wrapper-overlay"></div>
            </div>
          `;
          carousel.appendChild(carouselItem);
        });

        // Reinitialize carousel when tab first becomes active
        if (container.classList.contains('active')) {
          if (typeof initCarousel === 'function') {
            const state = initCarousel(container);
            initializedTabs.set(container, state);
            activeCarousel = state;
          }
        }
      });
    })
    .catch(err => {
      console.error('Failed to load design data:', err);
    });
});