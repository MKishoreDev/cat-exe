/**
 * CAT.EXE — Web Component Embed Script
 * A tiny cat. A long night. One more run.
 * https://github.com/MKishoreDev/cat-exe
 *
 * Quick Usage:
 *   <script src="https://mkishoredev.github.io/cat-exe/embed.js" defer></script>
 *   <cat-exe></cat-exe>
 *
 * Custom Attributes:
 *   src: Custom URL to the game (defaults to GitHub Pages deployment)
 *   max-width: Maximum container width (default: 640px)
 *   border-radius: Corner radius (default: 12px)
 */
(function () {
  'use strict';
  if (typeof customElements === 'undefined' || customElements.get('cat-exe')) return;

  class CatExeElement extends HTMLElement {
    connectedCallback() {
      if (this.querySelector('iframe')) return;

      const defaultSrc = 'https://mkishoredev.github.io/cat-exe/';
      const src = this.getAttribute('src') || defaultSrc;
      const title = this.getAttribute('title') || 'CAT.EXE — pixel-art endless runner';
      const maxWidth = this.getAttribute('max-width') || '640px';
      const radius = this.getAttribute('border-radius') || '12px';

      this.style.display = 'block';
      this.style.width = '100%';
      this.style.maxWidth = maxWidth;
      this.style.aspectRatio = '16 / 9';
      this.style.margin = this.style.margin || '0 auto';
      this.style.borderRadius = radius;
      this.style.overflow = 'hidden';
      this.style.boxShadow = this.style.boxShadow || '0 20px 50px rgba(0,0,0,0.5)';
      this.style.background = '#08090D';

      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = title;
      iframe.loading = 'lazy';
      iframe.allow = 'autoplay';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      iframe.style.display = 'block';
      iframe.style.borderRadius = 'inherit';

      this.appendChild(iframe);
    }
  }

  customElements.define('cat-exe', CatExeElement);
})();
