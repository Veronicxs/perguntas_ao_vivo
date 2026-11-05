export type Participante = {
  nome: string;
  faculdade: string;
};

export const equipe: Participante[] = [
  {
    nome: "Veronica Ferreira do Nascimento",
    faculdade: "IFRO Campus Porto Velho Calama",
  },
];

export function formatarParticipante({ nome, faculdade }: Participante): string {
  return `${nome} (${faculdade})`;
}
