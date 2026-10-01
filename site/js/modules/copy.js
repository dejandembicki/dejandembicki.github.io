/**
 * "Copy" button next to the email address: copies data-copy to the clipboard
 * and briefly shows the data-copied text ("Copied!") as confirmation.
 */
export function initCopyButtons(root = document) {
  root.querySelectorAll('[data-copy]').forEach((button) => {
    const label = button.querySelector('[data-i18n]') ?? button;

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
      } catch {
        // Clipboard blocked (old browser, no HTTPS): the address is still visible to copy by hand.
        return;
      }
      const original = label.textContent;
      label.textContent = button.dataset.copied;
      button.classList.add('is-copied');
      setTimeout(() => {
        // Only restore if the language switcher has not replaced the text meanwhile.
        if (label.textContent === button.dataset.copied) label.textContent = original;
        button.classList.remove('is-copied');
      }, 2000);
    });
  });
}
