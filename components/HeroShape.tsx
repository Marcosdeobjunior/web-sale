/**
 * Formas fluidas estáticas atrás do hero da home, nos tons do accent azul.
 * Decorativo: fica atrás do texto e não recebe cliques.
 */
export function HeroShape() {
  const stop = (offset: string, color: string, opacity = 1) => (
    <stop offset={offset} style={{ stopColor: `var(${color})`, stopOpacity: opacity }} />
  );
  return (
    <div className="hero-shape" aria-hidden="true">
      <svg viewBox="0 0 600 560" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="hs-main" cx="38%" cy="32%" r="75%">
            {stop("0%", "--color-accent-300", 0.95)}
            {stop("45%", "--color-accent-600")}
            {stop("100%", "--color-accent-900")}
          </radialGradient>
          <radialGradient id="hs-deep" cx="60%" cy="35%" r="80%">
            {stop("0%", "--color-accent-500")}
            {stop("100%", "--color-accent-900")}
          </radialGradient>
          <radialGradient id="hs-glow" cx="50%" cy="50%" r="50%">
            {stop("0%", "--color-accent-200", 0.55)}
            {stop("100%", "--color-accent-200", 0)}
          </radialGradient>
          <linearGradient id="hs-light" x1="0" y1="0" x2="1" y2="1">
            {stop("0%", "--color-accent-100")}
            {stop("55%", "--color-accent-300")}
            {stop("100%", "--color-accent-600")}
          </linearGradient>
        </defs>

        {/* blob principal */}
        <path
          d="M300,60 C390,40 470,90 500,170 C530,250 560,300 520,380 C480,460 390,500 300,480 C210,460 140,500 100,420 C60,340 90,280 110,210 C130,140 210,80 300,60 Z"
          fill="url(#hs-main)"
          stroke="var(--color-accent-300)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <ellipse cx="270" cy="230" rx="140" ry="110" fill="url(#hs-glow)" />

        {/* blobs secundários sobrepostos */}
        <path
          d="M220,20 C262,2 302,32 292,82 C282,132 230,150 205,110 C180,70 182,38 220,20 Z"
          fill="url(#hs-deep)"
          stroke="var(--color-accent-300)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <path
          d="M150,380 C202,350 272,370 282,430 C292,492 230,532 168,516 C108,500 98,410 150,380 Z"
          fill="url(#hs-deep)"
          stroke="var(--color-accent-300)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <path
          d="M540,280 C566,276 584,300 576,324 C568,348 538,352 524,332 C510,312 518,284 540,280 Z"
          fill="url(#hs-deep)"
          stroke="var(--color-accent-300)"
          strokeOpacity="0.6"
          strokeWidth="1.2"
        />
        <path
          d="M470,420 C500,404 534,418 530,450 C526,482 490,494 470,474 C452,456 450,430 470,420 Z"
          fill="url(#hs-deep)"
          stroke="var(--color-accent-300)"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />

        {/* triângulos arredondados claros */}
        <g strokeLinejoin="round">
          <polygon points="462,98 528,120 486,170" fill="url(#hs-light)" stroke="url(#hs-light)" strokeWidth="22" />
          <polygon points="330,318 372,332 344,366" fill="url(#hs-light)" stroke="url(#hs-light)" strokeWidth="16" />
          <polygon points="58,232 98,214 92,262" fill="url(#hs-light)" stroke="url(#hs-light)" strokeWidth="14" />
        </g>
      </svg>
    </div>
  );
}
