const eventDate = new Date("2026-09-14T09:00:00+01:00");
const countdownNumbers = document.querySelectorAll(".countdown-number");
const form = document.querySelector("#register form");
const ticketSelect = document.querySelector("#ticket");
const ticketButtons = document.querySelectorAll("[data-ticket]");
const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("main section");
const animatedElements = document.querySelectorAll(".reveal-on-scroll");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  try {
    const existing = JSON.parse(localStorage.getItem("registrations")) || [];
    existing.push({ ...data, registeredAt: new Date().toISOString() });
    localStorage.setItem("registrations", JSON.stringify(existing));
    return true;
  } catch (error) {
    return false;
  }
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
      behavior: prefersReducedMotion ? "auto" : "smooth",
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

    const saved = saveToStorage(data);
    const storageNote = saved ? "" : " Your browser blocked local saving, but this demo form still accepted the entry.";

    showMessage(`Registration successful: ${data.name} reserved a ${data.ticket} ticket.${storageNote}`, "success");
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

if (prefersReducedMotion) {
  animatedElements.forEach((element) => element.classList.add("visible"));
} else {
  animatedElements.forEach((element) => {
    animationObserver.observe(element);
  });
}

document.addEventListener("keydown", (event) => {
  const modalHashes = ["#programme", "#conduct"];

  if (event.key === "Escape" && modalHashes.includes(window.location.hash)) {
    window.location.hash = "hero";
  }
});
