const eventDate = new Date("September 14, 2026");
const countdownNumbers = document.querySelectorAll(".countdown-number");

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
  countdownNumbers[0].textContent = format(days);
  countdownNumbers[1].textContent = format(hours);
  countdownNumbers[2].textContent = format(minutes);
  countdownNumbers[3].textContent = format(seconds);
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;

  if (distance <= 0) {
    clearInterval(interval);
    render({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    return;
  }

  render(getTimeParts(distance));
}

updateCountdown();



const form = document.querySelector("#register form");


const feedback = document.createElement("div");
feedback.id = "feedback";
form.prepend(feedback);


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
  feedback.style.padding = "12px";
  feedback.style.marginBottom = "16px";
  feedback.style.borderRadius = "4px";

  if (type === "error") {
    feedback.style.color = "#b00020";
    feedback.style.background = "#ffe5e5";
  } else {
    feedback.style.color = "#0a6b3f";
    feedback.style.background = "#e6fff2";
  }
}

function saveToStorage(data) {
  const existing = JSON.parse(localStorage.getItem("registrations")) || [];
  existing.push(data);
  localStorage.setItem("registrations", JSON.stringify(existing));
}

function resetForm() {
  form.reset();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = getFormData();


  if (!data.name) {
    showMessage("Name is required", "error");
    return;
  }

  if (!isValidEmail(data.email)) {
    showMessage("Invalid email format", "error");
    return;
  }

  if (!isValidTicket(data.ticket)) {
    showMessage("Please select a ticket tier", "error");
    return;
  }

  saveToStorage(data);

  showMessage(
    `Registration successful: ${data.name} (${data.ticket})`,
    "success"
  );

  resetForm();
});


const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("main section");

function setActiveLink(id) {
  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${id}`) {
      link.classList.add("active");
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach(section => observer.observe(section));



const animatedElements = document.querySelectorAll(
  ".speaker-card, .hero-stats, #about, #tickets, #speakers, #schedule"
);

const animationObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

animatedElements.forEach(el => {
  animationObserver.observe(el);
});
