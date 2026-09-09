(() => {
  "use strict";

  const GST_RATE = 0.18;
  const STORAGE_KEY = "includeGST";

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  });

  function formatCurrency(amount) {
    return currencyFormatter.format(amount);
  }

  function calculateGST(basePrice) {
    return basePrice * GST_RATE;
  }

  function calculateTotal(basePrice) {
    return basePrice + calculateGST(basePrice);
  }

  function updateListingPrice(container, includeGST) {
    const priceElement = container.querySelector("[data-price]");
    const gstElement = container.querySelector("[data-gst-info]");

    if (!priceElement) {
      return;
    }

    const basePrice = Number(container.dataset.basePrice);

    if (!Number.isFinite(basePrice)) {
      return;
    }

    if (!includeGST) {
      priceElement.textContent = formatCurrency(basePrice);

      if (gstElement) {
        gstElement.textContent = "";
        gstElement.hidden = true;
      }

      return;
    }

    const gstAmount = calculateGST(basePrice);
    const totalPrice = calculateTotal(basePrice);

    priceElement.textContent = formatCurrency(totalPrice);

    if (gstElement) {
      gstElement.textContent = `incl. ${formatCurrency(gstAmount)} GST`;
      gstElement.hidden = false;
    }
  }

  function updateAllListingPrices(includeGST) {
    const priceContainers =
      document.querySelectorAll("[data-price-container]");

    priceContainers.forEach((container) => {
      updateListingPrice(container, includeGST);
    });
  }

  function getGSTState() {
    return localStorage.getItem(STORAGE_KEY) === "true";
  }

  function saveGSTState(includeGST) {
    localStorage.setItem(
      STORAGE_KEY,
      String(includeGST)
    );
  }

  function updateToggleUI(includeGST) {
    const toggles =
      document.querySelectorAll("#gstToggle");

    toggles.forEach((toggle) => {
      toggle.checked = includeGST;
    });
  }

  function applyGSTState() {
    const includeGST = getGSTState();

    updateToggleUI(includeGST);
    updateAllListingPrices(includeGST);
  }

  function handleToggleChange(event) {
    const includeGST = event.target.checked;

    saveGSTState(includeGST);
    updateAllListingPrices(includeGST);
    updateToggleUI(includeGST);
  }

  function initializeGST() {
    const toggles =
      document.querySelectorAll("#gstToggle");

    toggles.forEach((toggle) => {
      toggle.addEventListener(
        "change",
        handleToggleChange
      );
    });

    applyGSTState();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeGST
    );
  } else {
    initializeGST();
  }

  window.GST = {
    rate: GST_RATE,
    calculateGST,
    calculateTotal,
    formatCurrency,
    updateAllListingPrices,
    applyGSTState
  };

})();