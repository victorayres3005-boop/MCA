interface LogoMcaProps {
  variant?: "white" | "teal";
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const sizes      = { sm: 32, md: 44, lg: 60 };
const textSizes  = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" };

export function LogoMca({ variant = "teal", size = "md", showWordmark = true }: LogoMcaProps) {
  const color  = variant === "white" ? "#FFFFFF" : "#00B4A6";
  const px     = sizes[size];

  return (
    <div className="flex items-center gap-3">
      {/* Marca geométrica MCA — globo / esfera técnica */}
      <svg width={px} height={px} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Círculo externo */}
        <circle cx="24" cy="24" r="20.5" stroke={color} strokeWidth="1.5" />

        {/* Meridiano central (elipse vertical) */}
        <ellipse cx="24" cy="24" rx="8" ry="20.5" stroke={color} strokeWidth="1.2" />

        {/* Paralelo equatorial */}
        <line x1="3.5" y1="24" x2="44.5" y2="24" stroke={color} strokeWidth="1.2" />

        {/* Paralelo superior */}
        <path d="M9.5 15 Q24 9.5 38.5 15" stroke={color} strokeWidth="0.9" fill="none" />

        {/* Paralelo inferior */}
        <path d="M9.5 33 Q24 38.5 38.5 33" stroke={color} strokeWidth="0.9" fill="none" />

        {/* Ponto de interseção — centro */}
        <circle cx="24" cy="24" r="2" fill={color} />
      </svg>

      {showWordmark && (
        <span
          className={`font-bold tracking-[0.2em] ${textSizes[size]}`}
          style={{ color, letterSpacing: "0.2em" }}
        >
          MCA
        </span>
      )}
    </div>
  );
}
