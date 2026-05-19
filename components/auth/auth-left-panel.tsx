"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const features = [
  "Dashboard consolidado com semáforos em tempo real",
  "Geração automática de TAP, RACI, TEP e relatórios via IA",
  "Controle multi-projeto por cliente e contratada",
];

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-14">
      {/* Foto de fundo */}
      <Image
        src="/hero-obra.jpg"
        alt="Obra gerenciada pela MCA"
        fill
        className="object-cover object-center"
        priority
        quality={85}
      />

      {/* Overlay: gradiente navy sobre a foto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(13,43,69,0.92) 0%, rgba(13,43,69,0.80) 40%, rgba(10,123,114,0.70) 75%, rgba(0,180,166,0.55) 100%)",
        }}
      />

      {/* Conteúdo animado */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <Image
          src="/logo-mca.png"
          alt="MCA"
          width={110}
          height={85}
          className="object-contain"
          priority
        />
      </motion.div>

      <div className="relative z-10 space-y-10">
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.25 }}
        >
          <h1 className="text-white text-[2.5rem] font-bold leading-[1.15] drop-shadow-md">
            Gestão de obras<br />com método e precisão
          </h1>
          <p className="text-white/70 text-[1.05rem] leading-relaxed max-w-[360px]">
            Plataforma PMBOK para consultores que gerenciam múltiplos projetos de construção.
          </p>
        </motion.div>

        <ul className="space-y-3.5">
          {features.map((f, i) => (
            <motion.li
              key={f}
              className="flex items-start gap-3 text-white/80 text-sm leading-snug"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.5 + i * 0.12 }}
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 shadow-[0_0_6px_#00B4A6]" />
              {f}
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.p
        className="relative z-10 text-white/30 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        © {new Date().getFullYear()} MCA Consultoria
      </motion.p>
    </div>
  );
}
