document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      body.classList.toggle('nav-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        body.classList.remove('nav-open');
      });
    });
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  setupOrderForm();
  setupContactForm();

  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

function setupOrderForm() {
  const orderForm = document.getElementById('orderForm');
  if (!orderForm) return;

  const message = document.getElementById('orderMessage');
  const deliveryFieldset = document.getElementById('deliveryFields');
  const pickupRadio = orderForm.querySelector('input[value="pickup"]');
  const deliveryRadio = orderForm.querySelector('input[value="delivery"]');
  const dateInput = orderForm.querySelector('input[type="date"]');

  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  const toggleDeliveryFields = () => {
    if (!deliveryFieldset) return;
    const show = deliveryRadio && deliveryRadio.checked;
    deliveryFieldset.style.display = show ? 'grid' : 'none';
  };

  [pickupRadio, deliveryRadio].forEach(radio => {
    if (radio) {
      radio.addEventListener('change', toggleDeliveryFields);
    }
  });
  toggleDeliveryFields();

  orderForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!message) return;

    const requiredFields = ['fullName', 'email', 'phone', 'occasion', 'cakeType', 'size', 'date', 'time'];
    const errors = [];

    requiredFields.forEach(id => {
      const field = orderForm.querySelector(`#${id}`);
      if (!field || !field.value.trim()) {
        errors.push(`${id} is required`);
      }
    });

    const emailValue = orderForm.email?.value || '';
    const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(emailValue);
    if (!emailValid) errors.push('Please enter a valid email');

    if (dateInput && dateInput.value) {
      const selectedDate = new Date(dateInput.value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (selectedDate < now) {
        errors.push('Date cannot be in the past');
      }
    }

    if (errors.length) {
      message.textContent = errors[0];
      message.className = 'form-message error';
      message.style.display = 'block';
      return;
    }

    message.textContent = "Thank you! Your order request has been received. We'll review it and get back to you by email.";
    message.className = 'form-message success';
    message.style.display = 'block';
    orderForm.reset();
    toggleDeliveryFields();
  });
}

function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const message = document.getElementById('contactMessage');
  const emailInput = contactForm.querySelector('input[type="email"]');

  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!message) return;

    const name = contactForm.querySelector('input[name="name"]')?.value.trim();
    const email = emailInput?.value.trim() || '';
    const text = contactForm.querySelector('textarea[name="message"]')?.value.trim();

    if (!name || !email || !text) {
      message.textContent = 'Please complete name, email, and message.';
      message.className = 'form-message error';
      message.style.display = 'block';
      return;
    }

    const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
    if (!emailValid) {
      message.textContent = 'Please use a valid email address.';
      message.className = 'form-message error';
      message.style.display = 'block';
      return;
    }

    message.textContent = 'Thank you for reaching out. We will reply shortly.';
    message.className = 'form-message success';
    message.style.display = 'block';
    contactForm.reset();
  });
}
