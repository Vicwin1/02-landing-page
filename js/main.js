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
 * Preserves the existing client-side sign-up confirmation and plan selection.
 */
const initSignupForm = () => {
  const signupForm = document.querySelector("#signup-form");
  const formMessage = document.querySelector("#form-message");
  const planSelect = document.querySelector("#plan");

  document.querySelectorAll("[data-plan]").forEach((planLink) => {
    planLink.addEventListener("click", () => {
      if (planSelect instanceof HTMLSelectElement) {
        const plan = planLink.getAttribute("data-plan");
        if (plan) {
          planSelect.value = plan;
        }
      }
    });
  });

  if (!(signupForm instanceof HTMLFormElement) || !formMessage) {
    return;
  }

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!signupForm.reportValidity()) {
      return;
    }

    const name = new FormData(signupForm).get("name");
    formMessage.textContent = `Thanks${typeof name === "string" && name.trim() ? `, ${name.trim()}` : ""}! Your details are validated. Connect a sign-up service to receive this request.`;
    signupForm.reset();
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
  initSignupForm();
};

document.addEventListener("DOMContentLoaded", init);
