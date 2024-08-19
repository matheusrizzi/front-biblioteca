import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { LivroModel } from '../models/livro-model';
import { BehaviorSubject } from 'rxjs';
import { LivroViewModel } from '../models/livro-model';
import { PrecoModel } from '../models/preco-model';
import { LivroFormaCompraModel } from '../models/livro-forma-compra';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private configService: ConfigService = inject(ConfigService);
  private apiUrl = this.configService.getApiUrl();
  private livroSubject = new BehaviorSubject<LivroViewModel[]>([]);
  livros$ = this.livroSubject.asObservable();

  precoArray: PrecoModel[] = [];

  constructor() {}

  async obterLivros(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}livros`);

      if (!response.ok) {
        throw new Error('Erro ao obter os livros');
      }

      const data = await response.json();
      this.livroSubject.next(data.result ?? []);
    } catch (error) {
      console.error('Erro ao obter os livros', error);
      this.livroSubject.next([]);
    }
  }

  async salvarLivro(livro:LivroViewModel){

    const precosNovos = livro.formasCompra.map(item => ({
      codFo: item.codFo,
      preco: item.preco
    }));
    
    const novoLivro: LivroModel = {
      codl: livro.codl,
      titulo: livro.titulo,
      editora: livro.editora,
      edicao: livro.edicao,
      anoPublicacao: livro.anoPublicacao,
      imagem: '',
      assuntos: livro.assuntos.map((a) => a.codAs),
      autores: livro.autores.map((a) => a.codAu),
      precos: precosNovos
    };
    
    if (livro.codl == 0) {
      await this.criarNovoLivro(novoLivro);
    } else {
      this.atualizarLivro(novoLivro);
    }
    
    this.obterLivros();
  }

  convertToPrecoModel(formas: LivroFormaCompraModel[]): void {
    this.precoArray = formas.map(item => ({
      codFo: item.codFo,
      preco: item.preco
    }));
  }

  async criarNovoLivro(livro: LivroModel) {
    try {

      console.log("criar novo livro",JSON.stringify({ livro }));

      const response = await fetch(`${this.apiUrl}livro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ livro })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar o livro');
      }

      const data = await response.json();
      console.log('Livro adicionado com sucesso', data);
    } catch (error) {
      console.error('Erro ao adicionar o livro', error);
    }
  }

  async atualizarLivro(livro: LivroModel) {
    try {
      const response = await fetch(`${this.apiUrl}livro`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(livro),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar o livro');
      }

    } catch (error) {
      console.error('Erro ao atualizar o livro', error);
    }
  }

  async excluirLivro(id: number): Promise<void> {
    try {

      const response = await fetch(`${this.apiUrl}livro/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir o livro.');
      }

      await this.obterLivros();
    } catch (error) {
      console.error('Erro ao excluir o livro.', error);
    }
  }
}
