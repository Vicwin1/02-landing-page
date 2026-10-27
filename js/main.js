const menuToggle = document.querySelector(".site-header__menu-toggle");
const primaryNav = document.querySelector(".site-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    primaryNav.classList.toggle("site-nav--open", !isExpanded);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("site-nav--open");
    }
  });
}

document.querySelectorAll(".faq-item__question").forEach((question) => {
  question.addEventListener("click", () => {
    const isExpanded = question.getAttribute("aria-expanded") === "true";
    const answerId = question.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;

    if (!answer) {
      return;
    }

    question.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
  });
});

const billingOptions = document.querySelectorAll(".billing-toggle__option");
const prices = document.querySelectorAll(".pricing-card__amount");
const billingNotes = document.querySelectorAll(".pricing-card__billing");

billingOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const period = option.dataset.period;

    if (period !== "monthly" && period !== "yearly") {
      return;
    }

    billingOptions.forEach((button) => {
      const isActive = button === option;
      button.setAttribute("aria-pressed", String(isActive));
    });

    prices.forEach((price) => {
      const amount = price.dataset[period];
      if (amount) {
        price.textContent = `$${amount}`;
      }
    });

    billingNotes.forEach((note) => {
      const message = note.dataset[`${period}Note`];
      if (message) {
        note.textContent = message;
      }
    });
  });
});

document.querySelectorAll("[data-plan]").forEach((planLink) => {
  planLink.addEventListener("click", () => {
    const planSelect = document.querySelector("#plan");
    if (planSelect instanceof HTMLSelectElement) {
      const plan = planLink.getAttribute("data-plan");
      if (plan) {
        planSelect.value = plan;
      }
    }
  });
});

const signupForm = document.querySelector("#signup-form");
const formMessage = document.querySelector("#form-message");

if (signupForm instanceof HTMLFormElement && formMessage) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!signupForm.reportValidity()) {
      return;
    }

    const name = new FormData(signupForm).get("name");
    formMessage.textContent = `Thanks${typeof name === "string" && name.trim() ? `, ${name.trim()}` : ""}! Your details are validated. Connect a sign-up service to receive this request.`;
    signupForm.reset();
  });
}

const yearLabel = document.querySelector("#current-year");
if (yearLabel) {
  yearLabel.textContent = String(new Date().getFullYear());
}
