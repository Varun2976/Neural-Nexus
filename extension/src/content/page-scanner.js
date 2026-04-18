// Shield Extension - Page Scanner Content Script

/**
 * Scan the current page for potential threats
 */
function scanPage() {
  const links = document.querySelectorAll('a[href]');
  const urls = Array.from(links).map(link => link.href);

  // TODO: Send URLs to background for analysis
  console.log(`Shield: Found ${urls.length} links on page`);
}

// Run scan when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scanPage);
} else {
  scanPage();
}
