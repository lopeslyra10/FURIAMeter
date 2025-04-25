/**
 * Tipos relacionados a membros da staff FURIA
 */

/**
 * Representa um membro da staff no sistema
 * @property id - Identificador único
 * @property name - Nome do membro
 * @property position - Cargo ou papel na FURIA (ex: coach, social media, manager)
 * @property image - URL da foto do membro
 */
export type Staff = {
  id: string;
  name: string;
  position: string;
  image: string;
};
