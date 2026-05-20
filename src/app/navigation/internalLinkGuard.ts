function isPlainInternalLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  const url = new URL(anchor.href, window.location.origin);
  return url.origin === window.location.origin;
}

export function registerInternalLinkMiddleClickGuard() {
  window.addEventListener(
    "auxclick",
    (event) => {
      if (event.button !== 1) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || !isPlainInternalLink(anchor)) {
        return;
      }

      event.preventDefault();
      window.open(anchor.href, "_blank", "noopener,noreferrer");
    },
    true,
  );
}
