const CHAVE = "perguntas-ao-vivo:voter-id";

let idEmMemoria: string | null = null;

function gerarId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

// Id anonimo deste navegador, guardado no localStorage.
export function getVoterId(): string {
  try {
    const salvo = window.localStorage.getItem(CHAVE);
    if (salvo) return salvo;
    const novo = gerarId();
    window.localStorage.setItem(CHAVE, novo);
    return novo;
  } catch {
    // localStorage bloqueado: usa um id valido enquanto a aba estiver aberta
    if (!idEmMemoria) idEmMemoria = gerarId();
    return idEmMemoria;
  }
}
