const cartCount = document.querySelector('#cart-count');
const cartToggle = document.querySelector('#cart-toggle');
const cartDialog = document.querySelector('#cart-dialog');
const cartItemsContainer = document.querySelector('#cart-items');
const cartEmpty = document.querySelector('#cart-empty');
const cartSubtotal = document.querySelector('#cart-subtotal');
const cartClose = document.querySelector('.cart-close');
const cartContinue = document.querySelector('.cart-continue');
const checkoutForm = document.querySelector('#checkout-form');
const checkoutItems = document.querySelector('#checkout-items');
const checkoutTotal = document.querySelector('#checkout-total');
const checkoutEmpty = document.querySelector('#checkout-empty');
const checkoutSubmit = document.querySelector('#checkout-submit');
const checkoutStatus = document.querySelector('#checkout-status');
const subscriptionForm = document.querySelector('#subscription-form');
const subscriptionStatus = document.querySelector('#subscription-status');
const subscriptionSubmit = document.querySelector('#subscription-submit');
const reviewForm = document.querySelector('#review-form');
const reviewList = document.querySelector('#review-list');
const reviewEmpty = document.querySelector('#review-empty');
const reviewStatus = document.querySelector('#review-status');
const reviewAverage = document.querySelector('#review-average');
const reviewAverageStars = document.querySelector('#review-average-stars');
const reviewCount = document.querySelector('#review-count');
const selectedPlanLabel = document.querySelector('#selected-plan-label');
const selectedPlanPrice = document.querySelector('#selected-plan-price');
const addButtons = document.querySelectorAll('.add-button');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const sliderTrack = document.querySelector('.slider-track');
const prevButton = document.querySelector('.slider-button.prev');
const nextButton = document.querySelector('.slider-button.next');
const themeToggle = document.querySelector('.theme-toggle');
const siteAudio = document.querySelector('#site-audio');
const audioToggle = document.querySelector('#audio-toggle');
const audioSessionKey = 'snzipps-audio-session';

let cart = [];
try {
  cart = JSON.parse(localStorage.getItem('snzipps-cart') || '[]');
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

const allowedImageClasses = ['peach-bg', 'gold-bg', 'lilac-bg', 'mint-bg'];
const allowedSockClasses = ['coral', 'golden', 'purple', 'mint'];

const saveCart = () => {
  localStorage.setItem('snzipps-cart', JSON.stringify(cart));
};

const updateCartCount = () => {
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
};

const renderCart = () => {
  if (!cartItemsContainer || !cartEmpty || !cartSubtotal) return;

  cartItemsContainer.replaceChildren();
  cartEmpty.hidden = cart.length > 0;
  cartItemsContainer.hidden = cart.length === 0;

  cart.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'cart-item';

    const artwork = document.createElement('div');
    artwork.className = `cart-item-art product-image ${allowedImageClasses.includes(item.imageClass) ? item.imageClass : 'peach-bg'}`;
    artwork.setAttribute('aria-hidden', 'true');
    const sock = document.createElement('div');
    sock.className = `sock-figure ${allowedSockClasses.includes(item.sockClass) ? item.sockClass : 'coral'}`;
    const band = document.createElement('span');
    band.className = 'sock-band';
    const toe = document.createElement('span');
    toe.className = 'sock-toe';
    sock.append(band, toe);
    artwork.append(sock);

    const details = document.createElement('div');
    details.className = 'cart-item-details';
    const name = document.createElement('h3');
    name.textContent = item.name;
    const price = document.createElement('span');
    price.className = 'cart-item-price';
    price.textContent = `${item.price} lei / pereche`;
    details.append(name, price);

    const controls = document.createElement('div');
    controls.className = 'cart-item-controls';
    const quantity = document.createElement('div');
    quantity.className = 'cart-quantity';

    const decrease = document.createElement('button');
    decrease.type = 'button';
    decrease.textContent = '−';
    decrease.setAttribute('aria-label', `Scade cantitatea pentru ${item.name}`);
    decrease.dataset.cartAction = 'decrease';
    decrease.dataset.cartId = item.id;

    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = item.quantity;

    const increase = document.createElement('button');
    increase.type = 'button';
    increase.textContent = '+';
    increase.setAttribute('aria-label', `Mărește cantitatea pentru ${item.name}`);
    increase.dataset.cartAction = 'increase';
    increase.dataset.cartId = item.id;
    quantity.append(decrease, quantityLabel, increase);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'cart-remove';
    remove.textContent = 'Elimină';
    remove.dataset.cartAction = 'remove';
    remove.dataset.cartId = item.id;
    controls.append(quantity, remove);

    const lineTotal = document.createElement('strong');
    lineTotal.className = 'cart-item-total';
    lineTotal.textContent = `${item.price * item.quantity} lei`;

    row.append(artwork, details, controls, lineTotal);
    cartItemsContainer.append(row);
  });

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  cartSubtotal.textContent = `${new Intl.NumberFormat('ro-RO').format(subtotal)} lei`;
  updateCartCount();
};

addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    const name = card?.querySelector('.product-title')?.textContent.trim();
    const priceText = card?.querySelector('.price')?.textContent || '';
    const price = Number(priceText.match(/[\d,.]+/)?.[0].replace(',', '.'));
    if (!name || !Number.isFinite(price)) return;

    const image = card.querySelector('.product-image');
    const sock = card.querySelector('.sock-figure');
    const imageClass = [...(image?.classList || [])].find((className) => allowedImageClasses.includes(className)) || 'peach-bg';
    const sockClass = [...(sock?.classList || [])].find((className) => allowedSockClasses.includes(className)) || 'coral';
    const id = name.toLocaleLowerCase('ro-RO');
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, imageClass, sockClass, quantity: 1 });
    }

    saveCart();
    renderCart();
    const originalLabel = button.dataset.originalLabel || button.textContent;
    button.dataset.originalLabel = originalLabel;
    button.textContent = 'Adăugat';
    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 900);
  });
});

if (cartToggle && cartDialog) {
  cartToggle.addEventListener('click', () => cartDialog.showModal());
}

cartClose?.addEventListener('click', () => cartDialog?.close());
cartContinue?.addEventListener('click', () => cartDialog?.close());

cartDialog?.addEventListener('click', (event) => {
  if (event.target === cartDialog) cartDialog.close();
});

cartItemsContainer?.addEventListener('click', (event) => {
  const control = event.target.closest('[data-cart-action]');
  if (!control) return;

  const item = cart.find((cartItem) => cartItem.id === control.dataset.cartId);
  if (!item) return;

  if (control.dataset.cartAction === 'increase') item.quantity += 1;
  if (control.dataset.cartAction === 'decrease') item.quantity -= 1;
  if (control.dataset.cartAction === 'remove' || item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== item.id);
  }

  saveCart();
  renderCart();
});

renderCart();

const updateAudioToggle = () => {
  if (!siteAudio || !audioToggle) return;
  const isPlaying = !siteAudio.paused;
  audioToggle.classList.toggle('is-playing', isPlaying);
  audioToggle.setAttribute('aria-pressed', String(isPlaying));
  audioToggle.setAttribute('aria-label', isPlaying ? 'Pauzează muzica' : 'Redă muzica');
  audioToggle.title = isPlaying ? 'Pauzează muzica' : 'Redă muzica';
};

const saveAudioSession = (playing) => {
  if (!siteAudio) return;
  try {
    sessionStorage.setItem(audioSessionKey, JSON.stringify({
      playing,
      currentTime: siteAudio.currentTime || 0,
      savedAt: Date.now(),
    }));
  } catch {
    // Audio playback continues even when session storage is unavailable.
  }
};

audioToggle?.addEventListener('click', async () => {
  if (!siteAudio) return;
  if (siteAudio.paused) {
    try {
      await siteAudio.play();
      saveAudioSession(true);
    } catch {
      saveAudioSession(false);
      audioToggle.setAttribute('aria-label', 'Nu s-a putut reda audio');
      audioToggle.title = 'Nu s-a putut reda audio';
    }
  } else {
    siteAudio.pause();
    saveAudioSession(false);
  }
  updateAudioToggle();
});

siteAudio?.addEventListener('play', updateAudioToggle);
siteAudio?.addEventListener('pause', updateAudioToggle);

if (siteAudio && audioToggle) {
  let lastAudioSave = 0;
  siteAudio.addEventListener('timeupdate', () => {
    const now = Date.now();
    if (!siteAudio.paused && now - lastAudioSave >= 1000) {
      saveAudioSession(true);
      lastAudioSave = now;
    }
  });

  window.addEventListener('pagehide', () => saveAudioSession(!siteAudio.paused));

  try {
    const savedAudioSession = JSON.parse(sessionStorage.getItem(audioSessionKey) || 'null');
    const startAudio = async () => {
      if (savedAudioSession?.playing && siteAudio.duration) {
        const elapsed = Math.max(0, (Date.now() - savedAudioSession.savedAt) / 1000);
        siteAudio.currentTime = (savedAudioSession.currentTime + elapsed) % siteAudio.duration;
      }

      try {
        await siteAudio.play();
        saveAudioSession(true);
      } catch {
        saveAudioSession(false);
        updateAudioToggle();
      }
    };

    if (savedAudioSession?.playing && siteAudio.readyState < 1) {
      siteAudio.addEventListener('loadedmetadata', startAudio, { once: true });
    } else {
      startAudio();
    }
  } catch {
    sessionStorage.removeItem(audioSessionKey);
  }
}

const renderCheckout = () => {
  if (!checkoutForm || !checkoutItems || !checkoutTotal || !checkoutEmpty || !checkoutSubmit) return;

  checkoutItems.replaceChildren();
  checkoutEmpty.hidden = cart.length > 0;
  checkoutItems.hidden = cart.length === 0;
  checkoutSubmit.disabled = cart.length === 0;

  cart.forEach((item) => {
    const row = document.createElement('li');
    const artwork = document.createElement('span');
    artwork.className = 'checkout-item-art';
    artwork.setAttribute('aria-hidden', 'true');

    const name = document.createElement('span');
    name.className = 'checkout-item-name';
    name.textContent = item.name;

    const quantity = document.createElement('span');
    quantity.className = 'checkout-item-quantity';
    quantity.textContent = `× ${item.quantity}`;
    name.append(quantity);

    const price = document.createElement('strong');
    price.className = 'checkout-item-price';
    price.textContent = `${item.price * item.quantity} lei`;
    row.append(artwork, name, price);
    checkoutItems.append(row);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  checkoutTotal.textContent = `${new Intl.NumberFormat('ro-RO').format(total)} lei`;
};

renderCheckout();

checkoutForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!checkoutForm.reportValidity() || cart.length === 0 || !checkoutStatus) return;

  checkoutStatus.hidden = false;
  checkoutStatus.textContent = 'Formular completat. Datele și opțiunea de noutăți nu sunt trimise către un server în această versiune.';
});

const subscriptionPlans = {
  monthly: { label: 'Lunar', price: '€8 / lună', button: 'Continuă cu planul lunar' },
  yearly: { label: 'Anual', price: '€80 / an', button: 'Continuă cu planul anual' },
};

const updateSubscriptionPlan = () => {
  if (!subscriptionForm || !selectedPlanLabel || !selectedPlanPrice || !subscriptionSubmit) return;
  const selectedValue = subscriptionForm.querySelector('input[name="subscription-plan"]:checked')?.value;
  const plan = subscriptionPlans[selectedValue] || subscriptionPlans.monthly;
  selectedPlanLabel.textContent = plan.label;
  selectedPlanPrice.textContent = plan.price;
  subscriptionSubmit.textContent = plan.button;
};

subscriptionForm?.querySelectorAll('input[name="subscription-plan"]').forEach((input) => {
  input.addEventListener('change', updateSubscriptionPlan);
});

updateSubscriptionPlan();

subscriptionForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!subscriptionForm.reportValidity() || !subscriptionStatus) return;

  subscriptionStatus.hidden = false;
  subscriptionStatus.textContent = 'Planul este selectat, dar abonamentul nu a fost activat. Această pagină demo nu procesează plăți și nu trimite sau salvează date.';
});

const readReviews = () => {
  try {
    const reviews = JSON.parse(localStorage.getItem('snzipps-reviews') || '[]');
    return Array.isArray(reviews) ? reviews.filter((review) =>
      typeof review?.name === 'string' &&
      typeof review?.comment === 'string' &&
      Number.isInteger(review?.rating) && review.rating >= 1 && review.rating <= 5
    ) : [];
  } catch {
    return [];
  }
};

const renderReviews = () => {
  if (!reviewList) return;

  reviewList.querySelectorAll('.customer-review').forEach((card) => card.remove());
  const reviews = readReviews();
  if (reviewEmpty) reviewEmpty.hidden = reviews.length > 0;

  if (reviewAverage && reviewAverageStars && reviewCount) {
    const average = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    reviewAverage.textContent = reviews.length
      ? new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 1 }).format(average)
      : '—';
    reviewAverageStars.textContent = `${'★'.repeat(Math.round(average))}${'☆'.repeat(5 - Math.round(average))}`;
    reviewCount.textContent = reviews.length === 1
      ? '1 recenzie'
      : `${reviews.length} recenzii`;
  }

  const limit = Number(reviewList.dataset.reviewLimit);
  const visibleReviews = Number.isInteger(limit) && limit > 0 ? reviews.slice(0, limit) : reviews;
  visibleReviews.forEach((review) => {
    const card = document.createElement('article');
    card.className = 'testimonial-card customer-review';

    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`;
    stars.setAttribute('aria-label', `${review.rating} din 5 stele`);

    const comment = document.createElement('p');
    comment.textContent = `„${review.comment}”`;

    const author = document.createElement('strong');
    author.textContent = `— ${review.name}`;

    card.append(stars, comment, author);
    reviewList.append(card);
  });
};

renderReviews();
window.addEventListener('storage', (event) => {
  if (event.key === 'snzipps-reviews' || event.key === null) renderReviews();
});

reviewForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!reviewForm.reportValidity() || !reviewStatus) return;

  const formData = new FormData(reviewForm);
  const review = {
    name: String(formData.get('name')).trim(),
    rating: Number(formData.get('rating')),
    comment: String(formData.get('comment')).trim(),
  };
  if (!review.name || !review.comment) return;

  try {
    const reviews = readReviews();
    reviews.unshift(review);
    localStorage.setItem('snzipps-reviews', JSON.stringify(reviews));
    renderReviews();
    reviewForm.reset();
    reviewStatus.textContent = 'Recenzia a fost adăugată și este vizibilă pe pagina Recenzii în acest browser.';
  } catch {
    reviewStatus.textContent = 'Recenzia nu a putut fi salvată în acest browser.';
  }
  reviewStatus.hidden = false;
});

const applyTheme = (isDark) => {
  document.body.classList.toggle('dark-mode', isDark);
  if (themeToggle) {
    themeToggle.textContent = isDark ? 'Mod luminos' : 'Mod întunecat';
    themeToggle.setAttribute('aria-label', isDark ? 'Comută la mod luminos' : 'Comută la mod întunecat');
  }
  localStorage.setItem('snzipps-theme', isDark ? 'dark' : 'light');
};

const savedTheme = localStorage.getItem('snzipps-theme');
if (savedTheme === 'dark') {
  applyTheme(true);
} else {
  applyTheme(false);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    applyTheme(!document.body.classList.contains('dark-mode'));
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (sliderTrack && prevButton && nextButton) {
  const slides = Array.from(sliderTrack.children);
  let currentSlide = 0;

  const getSlideWidth = () => {
    const firstSlide = slides[0];
    if (!firstSlide) return 0;
    const style = window.getComputedStyle(sliderTrack);
    const gap = parseFloat(style.gap || '0');
    return firstSlide.getBoundingClientRect().width + gap;
  };

  const getMaxOffset = () => Math.max(0, sliderTrack.scrollWidth - sliderTrack.parentElement.clientWidth);

  const updateSlider = () => {
    const slideWidth = getSlideWidth();
    const maxOffset = getMaxOffset();
    const maxSlide = slideWidth > 0 ? Math.ceil(maxOffset / slideWidth) : 0;
    currentSlide = Math.min(Math.max(currentSlide, 0), maxSlide);
    const offset = Math.min(currentSlide * slideWidth, maxOffset);
    sliderTrack.style.transform = `translateX(-${offset}px)`;
    prevButton.disabled = offset === 0;
    nextButton.disabled = offset >= maxOffset - 1;
  };

  prevButton.addEventListener('click', () => {
    currentSlide -= 1;
    updateSlider();
  });

  nextButton.addEventListener('click', () => {
    currentSlide += 1;
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);
  updateSlider();
}

const yearTarget = document.querySelector('#year');
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}
