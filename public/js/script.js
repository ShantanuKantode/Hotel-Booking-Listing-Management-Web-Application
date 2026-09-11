// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


document.querySelectorAll("[data-favorite-button]").forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (button.disabled) return;

    const wasFavorited = button.dataset.favorited === "true";
    const listingId = button.dataset.listingId;

    button.disabled = true;
    button.classList.add("is-loading");

    try {
      const response = await fetch(`/favorites/${listingId}`, {
        method: wasFavorited ? "DELETE" : "POST",
        headers: {
          Accept: "application/json"
        },
        credentials: "same-origin"
      });

      if (response.redirected) {
        window.location.assign(response.url);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to update favorite.");
      }

      const data = await response.json();

      const favorited = data.favorited === true;

      button.dataset.favorited = String(favorited);
      button.setAttribute("data-favorited", String(favorited));
      button.setAttribute("aria-pressed", String(favorited));

      button.classList.toggle("is-favorite", favorited);

      const icon = button.querySelector("i");

      if (icon) {
        icon.classList.remove("fa-solid", "fa-regular");
        icon.classList.add(favorited ? "fa-solid" : "fa-regular");
      }

      const label = button.querySelector("span");

      if (label) {
        label.textContent = favorited
          ? "Saved to favorites"
          : "Save to favorites";
      }

      document.querySelectorAll("[data-favorites-count]").forEach((count) => {
        const currentCount = Number(count.textContent.trim()) || 0;

        if (favorited && !wasFavorited) {
          count.textContent = currentCount + 1;
        } else if (!favorited && wasFavorited) {
          count.textContent = Math.max(0, currentCount - 1);
        }
      });

      if (!favorited && document.querySelector("[data-favorites-page]")) {
        const card = button.closest(".col");

        if (card) {
          card.remove();
        }

        const remainingButtons =
          document.querySelectorAll("[data-favorite-button]").length;

        if (remainingButtons === 0) {
          window.location.reload();
        }
      }

    } catch (error) {
      console.error(error);
      alert("We couldn't update your favorites. Please try again.");
    } finally {
      button.disabled = false;
      button.classList.remove("is-loading");
    }
  });
});