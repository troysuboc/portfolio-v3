const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');
const body = document.body;

// Toggle menu on burger click
hamMenu.addEventListener('click', () => {
  const isActive = offScreenMenu.classList.toggle('active');
  hamMenu.classList.toggle('active', isActive);
  body.classList.toggle('no-scroll', isActive); // ✅ Toggle scroll lock
});

// Close menu on link click
document.querySelectorAll('.off-screen-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamMenu.classList.remove('active');
    offScreenMenu.classList.remove('active');
    body.classList.remove('no-scroll'); // ✅ Restore scrolling
  });
});

// Close menu on outside click/tap
document.addEventListener('click', (e) => {
  const clickedInsideMenu = offScreenMenu.contains(e.target);
  const clickedBurger = hamMenu.contains(e.target);

  if (!clickedInsideMenu && !clickedBurger && offScreenMenu.classList.contains('active')) {
    hamMenu.classList.remove('active');
    offScreenMenu.classList.remove('active');
    body.classList.remove('no-scroll'); // ✅ Restore scrolling
  }
});

// Attach to all internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  const targetId = link.getAttribute('href').substring(1);
  const targetEl = document.getElementById(targetId);

  if (!targetEl) return; // Skip if no matching ID

  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Scroll without changing the URL
    const yOffset = 0; // Adjust if you have a fixed navbar
    const y = targetEl.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({
      top: y,
    });

    // Optional: remove the hash if it’s already there
    history.replaceState(null, '', window.location.pathname);
  });
});

/*spy scroll portrait*/
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.portrait-menu-link');

  function onScroll() {
    const scrollPos = window.scrollY + window.innerHeight / 2;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll);
});

/*spy scroll landscape*/
const sections = document.querySelectorAll("section[id].content");
const navbarLinks = document.querySelectorAll(".navbar a");

function scrollTracker() {
  const currentYScroll = window.scrollY;
  const viewportHeight = window.innerHeight;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + sectionHeight;
    const id = section.getAttribute("id");
    const currentNavLink = document.querySelector(`.navbar a[href*="#${id}"]`);

    const threshold = 0.9; // 40% of the section height

    // Check if at least 40% of the section is visible in viewport
    const sectionVisibleHeight =
      Math.min(sectionBottom, currentYScroll + viewportHeight) -
      Math.max(sectionTop, currentYScroll);

    if (sectionVisibleHeight > sectionHeight * threshold) {
      currentNavLink?.classList.add("active");

      // Save both section and timestamp
      localStorage.setItem("activeSection", id);
      localStorage.setItem("activeSectionTime", Date.now());
    } else {
      currentNavLink?.classList.remove("active");
    }
  });
}

/*Home page timeout*/

window.addEventListener("scroll", scrollTracker);

window.addEventListener("load", () => {
  const savedSection = localStorage.getItem("activeSection");
  const savedTime = parseInt(localStorage.getItem("activeSectionTime"), 10);

  const TEN_MINUTES = 10 * 60 * 1000;
  const now = Date.now();

  if (savedSection && savedTime && now - savedTime < TEN_MINUTES) {
    const target = document.getElementById(savedSection);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        setTimeout(scrollTracker, 100); // ensure navbar update
      }, 200);
    }
  } else {
    localStorage.removeItem("activeSection");
    localStorage.removeItem("activeSectionTime");

    // Go back to top or a landing section
    const home = document.getElementById("home");
    if (home) {
      home.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }
});


/*video control remover*/
window.addEventListener("scroll", scrollTracker);

document.querySelector(".video-nest").addEventListener("contextmenu", (event) => {
  event.preventDefault();
      
});

document.addEventListener('DOMContentLoaded', () => {
  const swiperWrapper = document.querySelector('.swiper-wrapper');

  fetch('gallery-data.json')
    .then(res => res.json())
    .then(data => {
      const images = data.gallerySet1;

      images.forEach(src => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');

        const content = document.createElement('div');
        content.classList.add('slide-content');

        const a = document.createElement('a');
        a.href = src;

        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';

        a.appendChild(img);
        content.appendChild(a);
        slide.appendChild(content);
        swiperWrapper.appendChild(slide);
      });

      const swiper = new Swiper(".swiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        loop: true,
        coverflowEffect: {
          rotate: 5,
          stretch: 0,
          depth: 50,
          modifier: 4,
          slideShadows: false,
        },
        navigation: false,
        breakpoints: {
          0: {
            slidesPerView: 1.1
          },
          560: {
            slidesPerView: 3
          },
          768: {
            slidesPerView: 3.5
          },
          1024: {
            slidesPerView: 3.5
          }
        }
      });

      document.getElementById('custom-prev').addEventListener('click', () => {
        swiper.slidePrev();
      });
      document.getElementById('custom-next').addEventListener('click', () => {
        swiper.slideNext();
      });

      let isGalleryOpen = false;

      const gallery = lightGallery(swiperWrapper, {
        selector: 'a',
        closable: true,
        download: false,
        hideBarsDelay: 900,
        counter:false
      });

      // Push history BEFORE gallery opens
      swiperWrapper.addEventListener('click', (e) => {
        const target = e.target.closest('a');
        if (!target) return;

        // Delay to give LG time to open
        setTimeout(() => {
          history.pushState({ lgOpen: true }, '');
          isGalleryOpen = true;
        }, 0);
      });

      // Back button closes gallery if open
      window.addEventListener('popstate', (e) => {
        if (isGalleryOpen) {
          gallery.closeGallery();
          isGalleryOpen = false;
        }
      });

      // After gallery closes, go back again if needed
      gallery.on('lgAfterClose', () => {
        if (history.state && history.state.lgOpen) {
          history.back(); // Clean up the extra state
        }
        isGalleryOpen = false;
      });
    })
    .catch(error => console.error("Gallery load failed:", error));
});

document.querySelectorAll('.slide-content img').forEach(img => {
  img.onload = () => {
    if (img.naturalWidth > img.naturalHeight) {
      img.classList.add('landscape');
    } else {
      img.classList.add('portrait');
    }
  };
});


const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const initializedTabs = new Map();
let activeCarousel = null;

// Activate tab
function activateTab(tabId) {
  tabButtons.forEach(btn =>
    btn.classList.toggle('active', btn.dataset.tab === tabId)
  );
  tabContents.forEach(content =>
    content.classList.toggle('active', content.id === tabId)
  );

  const tab = document.getElementById(tabId);
  if (!tab) return;

  if (!initializedTabs.has(tab)) {
    const state = initCarousel(tab);
    initializedTabs.set(tab, state);
    activeCarousel = state;
  } else {
    activeCarousel = initializedTabs.get(tab);
    activeCarousel.update(true);
  }
}

function initCarousel(container) {
  const track = container.querySelector('.carousel');
  let items = container.querySelectorAll('.carousel-item');
  if (!track || items.length < 2) return null;

  // Clone first & last slides
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  firstClone.classList.add('clone');
  lastClone.classList.add('clone');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, items[0]);

  items = container.querySelectorAll('.carousel-item');
  let currentIndex = 1;

  const update = (instant = false) => {
    const width = items[0].offsetWidth;
    track.style.transition = instant ? 'none' : 'transform 0.4s ease';
    track.style.transform = `translateX(-${currentIndex * width}px)`;
  };

  update(true);

  const shift = (step) => {
    currentIndex += step;
    update();
  };

  track.addEventListener('transitionend', () => {
    if (items[currentIndex].classList.contains('clone')) {
      currentIndex = currentIndex === items.length - 1 ? 1 : items.length - 2;
      update(true);
    }
  });

  window.addEventListener('resize', () => update(true));

  // ----- Touch swipe support -----
  let startX = 0;
  let startY = 0;
  let isSwiping = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isSwiping = false;
  });

  track.addEventListener('touchmove', (e) => {
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    if (!isSwiping && Math.abs(dx) > Math.abs(dy)) {
      isSwiping = true;
      e.preventDefault();
    }
  }, { passive: false });

  track.addEventListener('touchend', (e) => {
    if (!isSwiping) return;

    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        if (currentIndex > 0) shift(-1);
      } else {
        if (currentIndex < items.length - 1) shift(1);
      }
    }
  });

  // ----- Mouse drag support -----
  let isDragging = false;
  let mouseStartX = 0;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    mouseStartX = e.clientX;
    track.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - mouseStartX;
    // Could add live dragging visual here if desired
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = '';

    const diffX = e.clientX - mouseStartX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        if (currentIndex > 0) shift(-1);
      } else {
        if (currentIndex < items.length - 1) shift(1);
      }
    }
  });

  return {
    shiftLeft: () => {
      if (currentIndex > 0) shift(-1);
    },
    shiftRight: () => {
      if (currentIndex < items.length - 1) shift(1);
    },
    update: (instant = false) => update(instant)
  };
}

// Global navigation
document.querySelector('.prev')?.addEventListener('click', () => {
  activeCarousel?.shiftLeft();
});
document.querySelector('.next')?.addEventListener('click', () => {
  activeCarousel?.shiftRight();
});

// Load active tab
document.addEventListener('DOMContentLoaded', () => {
  const savedTab = localStorage.getItem('activeTab') || tabButtons[0].dataset.tab;
  activateTab(savedTab);
});

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    activateTab(tabId);
    localStorage.setItem('activeTab', tabId);
  });
});

// Modal logic
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('imageModal');
  const gallery = document.getElementById('modalGallery');
  const closeBtn = document.getElementById('closeGallery');
  const modalContent = modal.querySelector('.modal-content');
  let galleryData = {};

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting && video.dataset.autoplay === "true") {
        video.play().catch(() => {});
      } else if (video.dataset.autoplay === "true") {
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  fetch('gallery-data.json')
    .then(res => res.json())
    .then(data => {
      galleryData = data;
    });

  document.body.addEventListener('click', function (e) {
    const button = e.target.closest('.openGalleryBtn');
    if (!button || !galleryData) return;

    const galleryKey = button.dataset.gallery;
    const images = galleryData[galleryKey];
    if (!Array.isArray(images)) return;

    gallery.innerHTML = '';

    images.forEach(item => {
      let mediaElement;

    // Plain image
    if (typeof item === 'string') {
        mediaElement = document.createElement('img');
        mediaElement.src = item;
        mediaElement.loading = 'lazy';
        mediaElement.style.width = '100%';

    } 
    // Video
    else if (item.type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.src = item.src;
        mediaElement.muted = true;
        mediaElement.playsInline = true;
        mediaElement.style.width = '100%';
        if (item.controls) mediaElement.controls = true;
        if (item.loop) mediaElement.loop = true;
        if (item.autoplay) {
            mediaElement.dataset.autoplay = "true";
            videoObserver.observe(mediaElement);
        }
    } 
    // Image with button
    else if (item.type === 'imageWithButton') {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-button-wrapper';

        const btn = document.createElement('button');
        btn.className = 'overlay-button';
        btn.textContent = item.button.text;
        btn.onclick = () => window.open(item.button.action, '_blank');

        wrapper.appendChild(btn);
        mediaElement = wrapper;
    }
    // Heading or HTML block
    else if (item.type === 'html') {
        mediaElement = document.createElement('div');
        mediaElement.innerHTML = item.content; // Supports <h1>, <p>, etc.

        // Add class to any H1 inside this HTML
        const h1 = mediaElement.querySelector('h1');
        if (h1) {
            h1.classList.add('custom-heading'); // You can style this in CSS
        }

        mediaElement.style.width = '100%';
    }

    if (mediaElement) gallery.appendChild(mediaElement);

    });

    modalContent.scrollTop = 0;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    history.pushState({ modalOpen: true }, '');
  });

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    if (history.state?.modalOpen) history.back();
  }

  closeBtn.addEventListener('click', closeModal);

  let isMultiTouch = false;
  modal.addEventListener('touchstart', e => {
    isMultiTouch = e.touches.length > 1;
  }, { passive: true });

  modal.addEventListener('click', e => {
    if (isMultiTouch) {
      isMultiTouch = false;
      return;
    }
    if (e.target === modal) closeModal();
  });

  window.addEventListener('popstate', () => {
    if (modal.classList.contains('show')) closeModal();
  });

  let touchStartX = 0, touchStartY = 0, isZooming = false;
  modal.addEventListener('touchstart', e => {
    isZooming = e.touches.length > 1;
    if (!isZooming && e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartX = touch.screenX;
      touchStartY = touch.screenY;
    }
  }, { passive: true });

  modal.addEventListener('touchend', e => {
    if (isZooming || e.changedTouches.length !== 1) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.screenX - touchStartX;
    const deltaY = Math.abs(touch.screenY - touchStartY);
    const isSwipeRight = deltaX > 100 && deltaY < 50;

    const zoomed = [...modalContent.querySelectorAll('img')].some(img =>
      img.naturalWidth > img.clientWidth
    );

    if (isSwipeRight && !zoomed) closeModal();
  });

  modal.addEventListener('wheel', function (e) {
    modalContent.scrollTop += e.deltaY;
    e.preventDefault();
  }, { passive: false });

  let isDragging = false, startY, scrollTop;

  modalContent.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.pageY - modalContent.offsetTop;
    scrollTop = modalContent.scrollTop;
    modalContent.style.cursor = 'grabbing';
    e.preventDefault();
  });

  modalContent.addEventListener('mouseleave', () => {
    isDragging = false;
    modalContent.style.cursor = 'default';
  });

  modalContent.addEventListener('mouseup', () => {
    isDragging = false;
    modalContent.style.cursor = 'default';
  });

  modalContent.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const y = e.pageY - modalContent.offsetTop;
    const walk = (y - startY) * 2;
    modalContent.scrollTop = scrollTop - walk;
  });
});



/*Video Switcher*/
fetch('video-data.json')
  .then(res => res.json())
  .then(data => {
    const listContainer = document.getElementById('videoList');
    const mainVideo = document.querySelector('.main-video video');
    const mainTitle = document.querySelector('.main-video .title');
    const videoWrap = document.querySelector('.video-wrap'); // added here

    data.forEach((videoData, index) => {
      const vid = document.createElement('div');
      vid.className = 'vid';
      if (index === 0) vid.classList.add('active');

      vid.innerHTML = `
        <video src="${videoData.src}" muted poster="${videoData.thumbnail}"></video>
        <h3 class="title">${videoData.title}</h3>
      `;

      vid.addEventListener('click', () => {
        document.querySelectorAll('.video-list .vid').forEach(v => v.classList.remove('active'));
        vid.classList.add('active');

        // ✨ Fade out main video container
        videoWrap.style.opacity = '0';

        setTimeout(() => {
          mainVideo.src = videoData.src;
          mainTitle.textContent = videoData.title;

          // ✨ Fade in
          videoWrap.style.opacity = '1';
        }, 300); // match the CSS transition duration
      });

      listContainer.appendChild(vid);

      if (index === 0) {
        mainVideo.src = videoData.src;
        mainTitle.textContent = videoData.title;
      }
    });
  })
  .catch(error => console.error('Failed to load gallery data:', error));


/*Video Player*/
  const player = new Plyr('#player');

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    setTimeout(() => {
      const target = document.getElementById('videos');
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 50);
  }
});


const openBtn = document.getElementById("openModalBtnAbt");
const modal = document.getElementById("customModal");
const closeBtn = modal.querySelector(".close-btn-about");
const modalContent = document.getElementById("modalContent") || modal.querySelector(".modal-content-about");
const warningBox = document.getElementById("inactivityWarning");
const countdownEl = document.getElementById("countdown");

let isDragging = false;
let offsetX = 0, offsetY = 0;
let initialX = 0, initialY = 0;
let isModalOpen = false;
let animationFrameId = null;
let pendingEvent = null;

let inactivityTimer = null;
let warningCountdownTimer = null;
let countdownValue = 15; // seconds

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes
const WARNING_TIME = 15 * 1000; // 15 seconds

// ---- FADE HANDLERS ----
function showModal() {
  modal.classList.add("show");
  document.body.classList.add("no-scroll");

  modalContent.style.left = "50%";
  modalContent.style.top = "50%";
  modalContent.style.transform = "translate(-50%, -50%)";
  modal.scrollTop = 0;

  if (!history.state?.modalOpen) {
    history.pushState({ modalOpen: true }, "");
  }

  isModalOpen = true;
  startInactivityTimer();
}

function closeModal(skipHistoryBack = false) {
  modal.classList.remove("show");
  document.body.classList.remove("no-scroll");
  isModalOpen = false;

  clearTimeout(inactivityTimer);
  clearInterval(warningCountdownTimer);
  hideWarning();

  if (!skipHistoryBack && history.state?.modalOpen) {
    history.back();
  }
}

// ---- INACTIVITY TIMER ----
function startInactivityTimer() {
  clearTimeout(inactivityTimer);
  clearInterval(warningCountdownTimer);
  hideWarning();

  inactivityTimer = setTimeout(() => {
    startWarningCountdown();
  }, INACTIVITY_LIMIT - WARNING_TIME);
}

function resetInactivityTimer() {
  if (isModalOpen) startInactivityTimer();
}

function startWarningCountdown() {
  countdownValue = 15;
  showWarning();
  updateCountdown();

  warningCountdownTimer = setInterval(() => {
    countdownValue--;
    updateCountdown();

    if (countdownValue <= 0) {
      clearInterval(warningCountdownTimer);
      closeModal();
    }
  }, 1000);
}

function showWarning() {
  if (warningBox) warningBox.style.display = "block";
}

function hideWarning() {
  if (warningBox) warningBox.style.display = "none";
}

function updateCountdown() {
  if (countdownEl) countdownEl.textContent = countdownValue;
}

// ---- DRAG FUNCTIONS ----
function startDrag(e) {
  if (e.target.closest(".close-btn-about")) return;

  const rect = modalContent.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  initialX = e.clientX;
  initialY = e.clientY;
  isDragging = false;

  document.body.style.userSelect = "none";
  document.addEventListener("mousemove", queueDrag);
  document.addEventListener("mouseup", stopDrag);
}

function queueDrag(e) {
  pendingEvent = e;
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(processDrag);
  }
}

function processDrag() {
  const e = pendingEvent;
  if (!e) return;

  const deltaX = Math.abs(e.clientX - initialX);
  const deltaY = Math.abs(e.clientY - initialY);

  if (!isDragging && (deltaX > 3 || deltaY > 3)) {
    isDragging = true;
    const rect = modalContent.getBoundingClientRect();
    modalContent.style.left = `${rect.left}px`;
    modalContent.style.top = `${rect.top}px`;
    modalContent.style.transform = "none";
  }

  if (isDragging) {
    const modalWidth = modalContent.offsetWidth;
    const modalHeight = modalContent.offsetHeight;

    const maxLeft = window.innerWidth - modalWidth;
    const maxTop = window.innerHeight - modalHeight;

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    modalContent.style.left = `${newLeft}px`;
    modalContent.style.top = `${newTop}px`;
  }

  animationFrameId = null;
}

function stopDrag() {
  isDragging = false;
  pendingEvent = null;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  document.body.style.userSelect = "auto";
  document.removeEventListener("mousemove", queueDrag);
  document.removeEventListener("mouseup", stopDrag);
}

// ---- EVENT BINDINGS ----
openBtn.addEventListener("click", showModal);

closeBtn.addEventListener("click", () => {
  closeModal();
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

window.addEventListener("popstate", () => {
  if (isModalOpen) {
    closeModal(true);
  } else {
    document.body.classList.remove("no-scroll");
  }
});

modalContent.addEventListener("mousedown", startDrag);

// Reset inactivity on interaction
['mousemove', 'keydown', 'click', 'scroll'].forEach(evt => {
  modal.addEventListener(evt, resetInactivityTimer);
});

// ---- EXPERIENCE DATA LOADING ----
fetch('experience.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('experienceContainer');
    container.innerHTML = ''; // Clear existing content

    data.forEach((entry, index) => {
      const timelineNest = document.createElement('div');
      timelineNest.classList.add('timeline-nest');
      if (index % 2 === 1) timelineNest.classList.add('timeline--alt');

      const wrapper = document.createElement('div');
      wrapper.classList.add('experience-item');

      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-texts');
      leftDiv.innerHTML = `<h1>${entry.left.title}</h1><h3>${entry.left.date}</h3>`;

      const rightDiv = document.createElement('div');
      rightDiv.classList.add('right-texts');
      rightDiv.innerHTML = `<p>${entry.right.description}</p>`;

      wrapper.appendChild(leftDiv);
      wrapper.appendChild(rightDiv);
      timelineNest.appendChild(wrapper);
      container.appendChild(timelineNest);
    });

    document.querySelectorAll('.timeline-nest').forEach(el => observer.observe(el));
  })
  .catch(error => console.error('Error loading experience data:', error));


  
  









