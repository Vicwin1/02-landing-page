/**
 * Initializes the responsive navigation and its keyboard behavior.
 */
const initMobileMenu = () => {
  const menuToggle = document.querySelector(".site-header__menu-toggle");
  const navigation = document.querySelector(".site-nav");

  if (!menuToggle || !navigation) {
    return;
  }

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("site-nav--open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navigation.classList.toggle("site-nav--open", !isExpanded);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });
};

/**
 * Initializes the single-open FAQ accordion with animated panel heights.
 */
const initAccordion = () => {
  const questions = document.querySelectorAll(".faq-item__question");

  const afterHeightTransition = (panel, callback) => {
    const handleTransitionEnd = (event) => {
      if (event.target !== panel || event.propertyName !== "height") {
        return;
      }

      panel.removeEventListener("transitionend", handleTransitionEnd);
      callback();
    };

    panel.addEventListener("transitionend", handleTransitionEnd);
  };

  const closePanel = (question, panel) => {
    question.setAttribute("aria-expanded", "false");
    panel.style.height = `${panel.scrollHeight}px`;
    panel.offsetHeight;
    panel.style.height = "0px";

    afterHeightTransition(panel, () => {
      if (question.getAttribute("aria-expanded") === "false") {
        panel.hidden = true;
        panel.style.height = "";
      }
    });
  };

  const openPanel = (question, panel) => {
    panel.hidden = false;
    panel.style.height = "0px";
    question.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => {
      panel.style.height = `${panel.scrollHeight}px`;
    });

    afterHeightTransition(panel, () => {
      if (question.getAttribute("aria-expanded") === "true") {
        panel.style.height = "auto";
      }
    });
  };

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const panelId = question.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      if (!panel) {
        return;
      }

      const isExpanded = question.getAttribute("aria-expanded") === "true";
      questions.forEach((openQuestion) => {
        if (openQuestion === question || openQuestion.getAttribute("aria-expanded") !== "true") {
          return;
        }

        const openPanelId = openQuestion.getAttribute("aria-controls");
        const openPanelElement = openPanelId ? document.getElementById(openPanelId) : null;
        if (openPanelElement) {
          closePanel(openQuestion, openPanelElement);
        }
      });

      if (isExpanded) {
        closePanel(question, panel);
      } else {
        openPanel(question, panel);
      }
    });
  });
};

/**
 * Initializes monthly/yearly pricing and the yearly-savings badge.
 */
const initPricingToggle = () => {
  const options = document.querySelectorAll(".billing-toggle__option");
  const prices = document.querySelectorAll(".pricing-card__amount");
  const billingNotes = document.querySelectorAll(".pricing-card__billing");
  const savingsBadge = document.querySelector(".billing-toggle__savings");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const period = option.dataset.period;

      if (period !== "monthly" && period !== "yearly") {
        return;
      }

      options.forEach((billingOption) => {
        billingOption.setAttribute("aria-pressed", String(billingOption === option));
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

      if (savingsBadge) {
        savingsBadge.hidden = period !== "yearly";
      }
    });
  });
};

/**
 * Adds a visual shadow to the sticky header after scrolling past 10px.
 */
const initHeaderShadow = () => {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const updateHeaderShadow = () => {
    header.classList.toggle("site-header--scrolled", window.scrollY > 10);
  };

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  updateHeaderShadow();
};

/**
 * Sets the displayed copyright year to the current year.
 */
const initFooterYear = () => {
  const yearLabel = document.querySelector("#current-year");
  if (yearLabel) {
    yearLabel.textContent = String(new Date().getFullYear());
  }
};

/**
 * Applies the saved color theme and persists changes made with the theme button.
 */
const initDarkModeToggle = () => {
  const toggle = document.querySelector(".theme-toggle");
  const toggleLabel = toggle?.querySelector(".theme-toggle__label");

  if (!(toggle instanceof HTMLButtonElement) || !toggleLabel) {
    return;
  }

  let isDarkMode = false;

  try {
    isDarkMode = localStorage.getItem("vicwin-theme") === "dark";
  } catch (error) {
    console.error("Unable to read the saved color theme.", error);
  }

  const applyTheme = () => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
    toggle.setAttribute("aria-pressed", String(isDarkMode));
    toggleLabel.textContent = isDarkMode ? "Light mode" : "Dark mode";
  };

  applyTheme();

  toggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    applyTheme();

    try {
      localStorage.setItem("vicwin-theme", isDarkMode ? "dark" : "light");
    } catch (error) {
      console.error("Unable to save the selected color theme.", error);
    }
  });
};

/**
 * Validates sign-up details and persists successful submissions in localStorage.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");
  const planSelect = document.querySelector("#plan");
  const nameInput = document.querySelector("#full-name");
  const emailInput = document.querySelector("#email");
  const termsInput = document.querySelector("#terms");

  if (
    !(signupForm instanceof HTMLFormElement) ||
    !(nameInput instanceof HTMLInputElement) ||
    !(emailInput instanceof HTMLInputElement) ||
    !(planSelect instanceof HTMLSelectElement) ||
    !(termsInput instanceof HTMLInputElement) ||
    !formMessage
  ) {
    return;
  }

  document.querySelectorAll("[data-plan]").forEach((planLink) => {
    planLink.addEventListener("click", () => {
      const plan = planLink.getAttribute("data-plan");
      if (plan) {
        planSelect.value = plan;
        planSelect.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });

  const fields = [
    {
      input: nameInput,
      error: document.querySelector("#name-error"),
      validate: () => nameInput.value.trim().length >= 25
        ? ""
        : "Please enter your full name using at least 25 characters.",
    },
    {
      input: emailInput,
      error: document.querySelector("#email-error"),
      validate: () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailInput.value.trim())
        ? ""
        : "Please enter a valid email address.",
    },
    {
      input: planSelect,
      error: document.querySelector("#plan-error"),
      validate: () => planSelect.value
        ? ""
        : "Please select a membership plan.",
    },
    {
      input: termsInput,
      error: document.querySelector("#terms-error"),
      validate: () => termsInput.checked
        ? ""
        : "Please agree to the terms to continue.",
    },
  ];

  const validateField = (field) => {
    if (!(field.error instanceof HTMLElement)) {
      return false;
    }

    const message = field.validate();
    field.error.textContent = message;
    field.input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  };

  fields.forEach((field) => {
    const eventName = field.input instanceof HTMLInputElement && field.input.type !== "checkbox"
      ? "input"
      : "change";

    field.input.addEventListener(eventName, () => {
      validateField(field);
      formMessage.textContent = "";
    });
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = fields.reduce((valid, field) => validateField(field) && valid, true);
    if (!isValid) {
      formMessage.textContent = "";
      fields.find((field) => field.input.getAttribute("aria-invalid") === "true")?.input.focus();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const plan = planSelect.value;

    try {
      const savedSignups = localStorage.getItem("signups");
      const signups = savedSignups ? JSON.parse(savedSignups) : [];

      if (!Array.isArray(signups)) {
        throw new TypeError('The "signups" localStorage value must be an array.');
      }

      const hasSignedUp = signups.some((signup) =>
        signup &&
        typeof signup.email === "string" &&
        signup.email.trim().toLowerCase() === email.toLowerCase()
      );

      if (hasSignedUp) {
        formMessage.textContent = "You've already signed up";
        return;
      }

      signups.push({ name, email, plan, createdAt: new Date().toISOString() });
      localStorage.setItem("signups", JSON.stringify(signups));
      signupForm.reset();
      fields.forEach((field) => {
        field.error.textContent = "";
        field.input.removeAttribute("aria-invalid");
      });
      formMessage.textContent = `Thanks, ${name}! Your sign-up has been saved.`;
    } catch (error) {
      console.error("Unable to save the sign-up in localStorage.", error);
      formMessage.textContent = "We couldn't save your sign-up. Please check your browser storage settings and try again.";
    }
  });
};

/**
 * Initializes all page interactions after the document has been parsed.
 */
const init = () => {
  initMobileMenu();
  initAccordion();
  initPricingToggle();
  initHeaderShadow();
  initFooterYear();
  initDarkModeToggle();
  initSignupForm();
};

document.addEventListener("DOMContentLoaded", init);
