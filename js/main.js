// Označi da JS radi (animacije se uključuju samo tada)
document.documentElement.classList.add('js');

// Tekuća godina u footeru
document.getElementById('godina').textContent = new Date().getFullYear();

// Svetla / tamna tema
const root = document.documentElement;
document.getElementById('tema-dugme').addEventListener('click', () => {
  const sistemTamna = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const trenutna = root.dataset.theme || (sistemTamna ? 'dark' : 'light');
  const nova = trenutna === 'dark' ? 'light' : 'dark';
  root.dataset.theme = nova;
  try { localStorage.setItem('tema', nova); } catch (e) {}
});

// Meni na telefonu
const meni = document.getElementById('meni');
const meniDugme = document.getElementById('meni-dugme');
meniDugme.addEventListener('click', () => {
  const otvoren = meni.classList.toggle('otvoren');
  meniDugme.setAttribute('aria-expanded', otvoren);
});
meni.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    meni.classList.remove('otvoren');
    meniDugme.setAttribute('aria-expanded', 'false');
  })
);

// Postepeno pojavljivanje sekcija pri skrolovanju
const elementi = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const posmatrac = new IntersectionObserver((unosi) => {
    unosi.forEach((u) => {
      if (u.isIntersecting) {
        u.target.classList.add('vidljivo');
        posmatrac.unobserve(u.target);
      }
    });
  }, { threshold: 0.12 });
  elementi.forEach((el) => posmatrac.observe(el));
} else {
  elementi.forEach((el) => el.classList.add('vidljivo'));
}
