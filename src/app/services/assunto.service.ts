import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssuntoModel } from '../models/assunto-model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AssuntoService {
  private assuntosSubject = new BehaviorSubject<any[]>([]); 
  assuntos$ = this.assuntosSubject.asObservable();
  private configService:ConfigService = inject(ConfigService);
  private url = this.configService.getApiUrl();

  constructor() { }

  async obterAssuntos(): Promise<void> {
    try {
      const response = await fetch(this.url + 'assuntos');
      if (!response.ok) {
        throw new Error('Erro ao obter assuntos');
      }
      const data = await response.json();
      this.assuntosSubject.next(data.result ?? []);
    } catch (error) {
      console.error('Erro ao obter assuntos', error);
      this.assuntosSubject.next([]); 
    }
  }

  async salvarAssunto(assunto:AssuntoModel){

    if(assunto.codAs === 0){
      await this.criarAssunto(assunto.descricao);
    }else{
      await this.atualizarAssunto(assunto);
    }

    await this.obterAssuntos();
  }

  async criarAssunto(descricao: string): Promise<void> {
    try {
      const response = await fetch(this.url + 'assunto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descricao })
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar o assunto');
      }

      const data = await response.json();
      console.log('Assunto adicionado com sucesso', data);
    } catch (error) {
      console.error('Erro ao adicionar o assunto', error);
    }
  }

  async deleteAssunto(id: number): Promise<void> {
    try {

      console.log(`${this.url}assunto/${id}`);

      const response = await fetch(`${this.url}assunto/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir o assunto');
      }

      await this.obterAssuntos(); // Recarregar a lista após exclusão
    } catch (error) {
      console.error('Erro ao excluir o assunto', error);
    }
  }

  async atualizarAssunto(assunto:AssuntoModel): Promise<void> {
    try {
      const response = await fetch(`${this.url}assunto`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codAs: assunto.codAs, descricao: assunto.descricao })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar o assunto');
      }

      this.obterAssuntos();
    } catch (error) {
      console.error('Erro ao atualizar o assunto', error);
    }
  }

  async getAssuntos(): Promise<AssuntoModel[]> {
    try {
      const response = await fetch(`${this.url}assuntos`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data.result)) {
        return data.result as AssuntoModel[];
      } else {
        throw new Error('Invalid data format: "result" is not an array');
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      return []; 
    }
  }
}
