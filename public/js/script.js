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
  button.addEventListener("click", async () => {
    if (button.disabled) return;

    const wasFavorited = button.dataset.favorited === "true";
    const listingId = button.dataset.listingId;
    button.disabled = true;
    button.classList.add("is-loading");

    try {
      const response = await fetch(`/favorites/${listingId}`, {
        method: wasFavorited ? "DELETE" : "POST",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      });

      if (response.redirected) {
        window.location.assign(response.url);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to update favorite.");
      }

      const { favorited } = await response.json();
      button.dataset.favorited = String(favorited);
      button.setAttribute("aria-pressed", String(favorited));
      button.classList.toggle("is-favorite", favorited);

      const icon = button.querySelector("i");
      icon.classList.toggle("fa-solid", favorited);
      icon.classList.toggle("fa-regular", !favorited);

      const label = button.querySelector("span");
      if (label) {
        label.textContent = favorited ? "Saved to favorites" : "Save to favorites";
      }

      document.querySelectorAll("[data-favorites-count]").forEach((count) => {
        const currentCount = Number(count.textContent) || 0;
        count.textContent = Math.max(0, currentCount + (favorited ? 1 : -1));
      });

      if (!favorited && document.querySelector("[data-favorites-page]")) {
        window.location.reload();
      }
    } catch (error) {
      alert("We couldn't update your favorites. Please try again.");
    } finally {
      button.disabled = false;
      button.classList.remove("is-loading");
    }
  });
});
