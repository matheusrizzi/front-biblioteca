import { LivroModel } from "./livro-model";

export interface RelatorioLivroAutorModel{
   nomeAutor: string;
   livros: LivroModel[];
}