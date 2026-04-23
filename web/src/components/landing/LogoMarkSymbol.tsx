/* SVG symbol (reticle / altimeter) partagé — rendu une fois dans le DOM, réutilisé via <use href="#mark"> */
export function LogoMarkSymbol() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="mark" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <line x1="12" y1="1" x2="12" y2="3.2" stroke="currentColor" strokeWidth="1.1" />
        <line x1="23" y1="12" x2="20.8" y2="12" stroke="currentColor" strokeWidth="1.1" />
        <line x1="12" y1="23" x2="12" y2="20.8" stroke="currentColor" strokeWidth="1.1" />
        <line x1="1" y1="12" x2="3.2" y2="12" stroke="currentColor" strokeWidth="1.1" />
        <path d="M12 12 L17.2 7.2" stroke="#C26337" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M15.5 7 L17.5 7 L17.5 9" stroke="#C26337" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <circle cx="12" cy="12" r="1.4" fill="#C26337" />
      </symbol>
    </svg>
  );
}
