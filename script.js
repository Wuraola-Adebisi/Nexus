const eventDate = new Date("2026-09-14T09:00:00+01:00");
const countdownNumbers = document.querySelectorAll(".countdown-number");
const form = document.querySelector("#register form");
const ticketSelect = document.querySelector("#ticket");
const ticketButtons = document.querySelectorAll("[data-ticket]");
const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("main section");
const animatedElements = document.querySelectorAll(".reveal-on-scroll");

const interval = setInterval(updateCountdown, 1000);

function format(value) {
  return String(value).padStart(2, "0");
}

function getTimeParts(distance) {
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function render({ days, hours, minutes, seconds }) {
  if (countdownNumbers.length < 4) {
    return;
  }

  countdownNumbers[0].textContent = format(days);
  countdownNumbers[1].textContent = format(hours);
  countdownNumbers[2].textContent = format(minutes);
  countdownNumbers[3].textContent = format(seconds);
}

function updateCountdown() {
  const now = Date.now();
  const distance = eventDate - now;

  if (distance <= 0) {
    clearInterval(interval);
    render({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    return;
  }

  render(getTimeParts(distance));
}

updateCountdown();

const feedback = document.createElement("div");
feedback.id = "feedback";
feedback.setAttribute("aria-live", "polite");

if (form) {
  form.prepend(feedback);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidTicket(ticket) {
  return ticket !== "";
}

function getFormData() {
  return {
    name: document.querySelector("#name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    job: document.querySelector("#jobtitle").value.trim(),
    company: document.querySelector("#company").value.trim(),
    ticket: document.querySelector("#ticket").value,
    source: document.querySelector("#source").value,
  };
}

function showMessage(message, type) {
  feedback.textContent = message;
  feedback.className = `is-visible ${type === "error" ? "is-error" : "is-success"}`;
}

function saveToStorage(data) {
  const existing = JSON.parse(localStorage.getItem("registrations")) || [];
  existing.push(data);
  localStorage.setItem("registrations", JSON.stringify(existing));
}

function resetForm() {
  if (!form) {
    return;
  }

  form.reset();
}

function selectTicket(ticketValue) {
  if (!ticketSelect) {
    return;
  }

  ticketSelect.value = ticketValue;
  ticketSelect.focus();
}

ticketButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const chosenTicket = button.dataset.ticket;

    selectTicket(chosenTicket);

    document.querySelector("#register").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    showMessage(`Selected ${chosenTicket} ticket. Complete the form to reserve your spot.`, "success");
  });
});

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = getFormData();

    if (!data.name) {
      showMessage("Name is required.", "error");
      return;
    }

    if (!isValidEmail(data.email)) {
      showMessage("Enter a valid email address.", "error");
      return;
    }

    if (!isValidTicket(data.ticket)) {
      showMessage("Please select a ticket tier.", "error");
      return;
    }

    saveToStorage(data);
    showMessage(`Registration successful: ${data.name} reserved a ${data.ticket} ticket.`, "success");
    resetForm();
  });
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");

    if (link.getAttribute("href") === `#${id}`) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach((section) => observer.observe(section));

const animationObserver = new IntersectionObserver(
  (entries, revealObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

animatedElements.forEach((element) => {
  animationObserver.observe(element);
});
