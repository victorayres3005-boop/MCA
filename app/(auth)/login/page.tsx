"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { signIn, signUp } from "@/app/actions/auth";

/* ─── schemas ─── */
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
const signupSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type LoginData  = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

/* ─── variantes ─── */
const ease = [0.22, 1, 0.36, 1] as const;

// Entrada da página — apenas o container externo, uma vez
const pageVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};


/* ─── componente principal ─── */
export default function LoginPage() {
  const [tab, setTab]       = useState<"login" | "signup">("login");
  const [serverMsg, setMsg] = useState<{ error?: string; success?: string } | null>(null);

  const loginForm  = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  function switchTab(t: "login" | "signup") {
    setTab(t);
    setMsg(null);
  }

  async function onLogin(data: LoginData) {
    setMsg(null);
    const fd = new FormData();
    fd.set("email", data.email);
    fd.set("password", data.password);
    const res = await signIn(fd);
    if (res?.error) setMsg({ error: res.error });
  }

  async function onSignup(data: SignupData) {
    setMsg(null);
    const fd = new FormData();
    fd.set("nome", data.nome);
    fd.set("email", data.email);
    fd.set("password", data.password);
    const res = await signUp(fd);
    if (res?.error)   setMsg({ error: res.error });
    if (res?.success) { setMsg({ success: res.success }); signupForm.reset(); }
  }

  return (
    // Animação de entrada única, roda apenas ao montar
    <motion.div
      className="w-full max-w-[400px] space-y-8"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Cabeçalho estático — sem AnimatePresence aninhado */}
      <div className="space-y-1">
        <h2 className="text-[1.65rem] font-bold text-text-primary">
          {tab === "login" ? "Bem-vindo de volta" : "Criar acesso"}
        </h2>
        <p className="text-text-secondary text-sm">
          {tab === "login"
            ? "Acesse sua carteira de obras"
            : "Preencha os dados para criar seu acesso"}
        </p>
      </div>

      {/* Abas */}
      <div className="flex border-b border-surface-border">
        {(["login", "signup"] as const).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`relative pb-2.5 px-1 mr-6 text-sm font-medium transition-colors duration-200 ${
              tab === t ? "text-brand-500" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t === "login" ? "Entrar" : "Criar conta"}
            {tab === t && (
              <motion.span
                layoutId="tab-bar"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full"
                transition={{ duration: 0.25, ease }}
              />
            )}
          </button>
        ))}
      </div>

      {/* min-h acomoda o form maior (signup/3 campos) — sem salto de altura */}
      <div className="min-h-[340px]">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "login" ? (
            <motion.form
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="space-y-5"
            >
              <Field
                label="E-mail"
                error={loginForm.formState.errors.email?.message}
                icon={<Mail className="w-4 h-4 text-text-disabled" />}
              >
                <input
                  {...loginForm.register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com.br"
                  className={inputCls}
                />
              </Field>

              <PasswordField
                label="Senha"
                error={loginForm.formState.errors.password?.message}
                register={loginForm.register("password")}
                autoComplete="current-password"
                placeholder="••••••••"
              />

              <FeedbackBanner msg={serverMsg} />

              <SubmitBtn
                loading={loginForm.formState.isSubmitting}
                label="Entrar na plataforma"
                loadingLabel="Entrando..."
              />
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onSubmit={signupForm.handleSubmit(onSignup)}
              className="space-y-5"
            >
              <Field
                label="Nome completo"
                error={signupForm.formState.errors.nome?.message}
                icon={<User className="w-4 h-4 text-text-disabled" />}
              >
                <input
                  {...signupForm.register("nome")}
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome"
                  className={inputCls}
                />
              </Field>

              <Field
                label="E-mail"
                error={signupForm.formState.errors.email?.message}
                icon={<Mail className="w-4 h-4 text-text-disabled" />}
              >
                <input
                  {...signupForm.register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com.br"
                  className={inputCls}
                />
              </Field>

              <PasswordField
                label="Senha"
                error={signupForm.formState.errors.password?.message}
                register={signupForm.register("password")}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
              />

              <FeedbackBanner msg={serverMsg} />

              <SubmitBtn
                loading={signupForm.formState.isSubmitting}
                label="Criar minha conta"
                loadingLabel="Criando..."
              />
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-text-disabled pt-1">
        Problemas de acesso? Fale com o administrador.
      </p>
    </motion.div>
  );
}

/* ─── sub-componentes ─── */

const inputCls =
  "w-full pl-9 pr-3 py-2.5 bg-surface-input border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200";

function Field({
  label,
  error,
  icon,
  children,
}: {
  label: string;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {icon}
        </span>
        {children}
      </div>
      {/* CSS transition — sem AnimatePresence aninhado */}
      <p
        className={`text-xs text-status-red transition-all duration-200 overflow-hidden ${
          error ? "max-h-6 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {error ?? " "}
      </p>
    </div>
  );
}

function PasswordField({
  label,
  error,
  register,
  autoComplete,
  placeholder,
}: {
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
  autoComplete: string;
  placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-text-secondary uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Lock className="w-4 h-4 text-text-disabled" />
        </span>
        <input
          {...register}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`${inputCls} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-secondary transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <p
        className={`text-xs text-status-red transition-all duration-200 overflow-hidden ${
          error ? "max-h-6 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {error ?? " "}
      </p>
    </div>
  );
}

function FeedbackBanner({ msg }: { msg: { error?: string; success?: string } | null }) {
  if (!msg?.error && !msg?.success) return null;
  const isError = !!msg.error;
  return (
    <div
      className={`p-3 rounded-lg text-sm transition-all duration-250 ${
        isError
          ? "bg-red-50 border border-red-200 text-status-red"
          : "bg-green-50 border border-green-200 text-status-green"
      }`}
    >
      {isError ? msg.error : msg.success}
    </div>
  );
}

function SubmitBtn({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    // CSS active/hover — sem Framer Motion (evita re-render durante animação do form)
    <button
      type="submit"
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-lg text-sm shadow-md shadow-brand-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity duration-200 active:scale-[0.98] hover:brightness-110"
      style={{ background: "linear-gradient(135deg, #0A7B72 0%, #00B4A6 100%)" }}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {loading ? loadingLabel : label}
    </button>
  );
}
