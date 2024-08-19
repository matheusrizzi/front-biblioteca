import { AssuntoModel } from "./assunto-model";
import { AutorModel } from "./autor-model";
import { LivroFormaCompraModel } from "./livro-forma-compra";
import { PrecoModel } from "./preco-model";

export interface LivroModel {
    codl : number,
    titulo: string,
    editora: string,
    edicao: number,
    anoPublicacao: number,
    imagem: string,
    assuntos: number[],
    autores: number[],
    precos: PrecoModel[]
}

export interface LivroViewModel{
    codl : number,
    titulo: string,
    editora: string,
    edicao: number,
    anoPublicacao: number,
    imagem: string,
    assuntos: AssuntoModel[],
    autores: AutorModel[],
    formasCompra: LivroFormaCompraModel[]
}