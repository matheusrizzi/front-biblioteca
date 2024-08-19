import { inject, Injectable } from '@angular/core';
import { AutorModel } from '../models/autor-model';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AutorService {
  private configService:ConfigService = inject(ConfigService);
  private apiUrl = this.configService.getApiUrl();
  private autorSubject = new BehaviorSubject<AutorModel[]>([]);
  autores$ = this.autorSubject.asObservable();

  constructor() {}

  async obterAutores(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}autores`);

      if (!response.ok) {
        throw new Error('Erro ao obter assuntos');
      }

      const data = await response.json();
      this.autorSubject.next(data.result ?? []);
    } catch (error) {
      console.error('Erro ao obter assuntos', error);
      this.autorSubject.next([]);
    }
  }

  async getAutores(): Promise<AutorModel[]> {
    try {
      const response = await fetch(`${this.apiUrl}autores`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verifica se 'result' é um array e retorna ele
      if (Array.isArray(data.result)) {
        return data.result as AutorModel[];
      } else {
        throw new Error('Invalid data format: "result" is not an array');
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      return []; 
    }
  }

  async salvarAutor(autor: AutorModel) {
    if (autor.codAu == 0) {
      this.criarNovoAutor(autor.nome);
    } else {
      this.atualizarAutor(autor);
    }
    this.obterAutores();
  }

  async criarNovoAutor(nome: String) {
    try {
      const response = await fetch(`${this.apiUrl}autor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar o autor');
      }

      const data = await response.json();
      console.log('Assunto adicionado com sucesso', data);
    } catch (error) {
      console.error('Erro ao adicionar o autor', error);
    }
  }

  async atualizarAutor(autor: AutorModel) {
    try {
      const response = await fetch(`${this.apiUrl}autor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codAu: autor.codAu, nome: autor.nome }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar o autor');
      }

    } catch (error) {
      console.error('Erro ao atualizar o autor', error);
    }
  }

  async excluirAutor(id: number): Promise<void> {
    try {

      const response = await fetch(`${this.apiUrl}autor/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir o autor.');
      }

      await this.obterAutores(); 
    } catch (error) {
      console.error('Erro ao excluir o autor.', error);
    }
  }
}
