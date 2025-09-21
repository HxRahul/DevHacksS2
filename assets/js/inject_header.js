export async function injectHeader() {
  const headerContainer = document.createElement('div');
  headerContainer.id = 'universal-header';
  document.body.insertBefore(headerContainer, document.body.firstChild);
  const resp = await fetch('/assets/js/header.html');
  headerContainer.innerHTML = await resp.text();

  // Set active nav link
  const links = headerContainer.querySelectorAll('nav.universal-nav a');
  const current = window.location.pathname.replace(/\\/g, '/');
  links.forEach(link => {
    if (link.getAttribute('href') && current.endsWith(link.getAttribute('href').replace(/^\//, ''))) {
      link.classList.add('active');
    }
  });
}
