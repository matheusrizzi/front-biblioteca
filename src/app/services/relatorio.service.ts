import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { RelatorioAutoresModel } from '../models/relatorio-autores-model';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  private configService: ConfigService = inject(ConfigService);
  private apiUrl = this.configService.getApiUrl();

  constructor() {}

  async obterLivrosPorAutor(): Promise<RelatorioAutoresModel[]> {
    try {
      const response = await fetch(`${this.apiUrl}report/livros-por-autor`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data.result)) {
        return data.result as RelatorioAutoresModel[];
      } else {
        throw new Error('Invalid data format: "result" is not an array');
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
      return [];
    }
  }
}
