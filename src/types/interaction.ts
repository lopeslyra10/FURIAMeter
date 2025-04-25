/**
 * Tipos relacionados às interações dos fãs com a FURIA
 * Este arquivo contém todas as definições de tipos necessárias para o gerenciamento de interações
 */

/**
 * Representa uma interação entre fã e o time
 * @property id - Identificador único da interação
 * @property staffId - ID do membro da staff envolvido (se aplicável)
 * @property date - Data da interação no formato YYYY-MM-DD
 * @property time - Horário da interação no formato HH:mm
 * @property description - Descrição da interação (ex: participou de live, respondeu quiz)
 * @property status - Status da interação (realizada, pendente, cancelada)
 */
export type Interaction = {
  id: string;
  staffId: string;
  date: string;
  time: string;
  description: string;
  status: string;
};
