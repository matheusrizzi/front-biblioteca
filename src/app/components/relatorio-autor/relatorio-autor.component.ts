import { Component } from '@angular/core';
import { RelatorioService } from '../../services/relatorio.service';
import { RelatorioAutoresModel } from '../../models/relatorio-autores-model';
import { CommonModule } from '@angular/common';
import { RelatorioLivroAutorModel } from '../../models/relatorio-livro-autor-model';
import { LivroModel } from '../../models/livro-model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-relatorio-autor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './relatorio-autor.component.html',
  styleUrl: './relatorio-autor.component.css',
})
export class RelatorioAutorComponent {
  relatorioViewModel: RelatorioLivroAutorModel[] = [];
  dadosRelatorio: RelatorioAutoresModel[] = [];

  constructor(private service: RelatorioService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  async carregarDados() {
    this.dadosRelatorio = await this.service.obterLivrosPorAutor();

    const autorViewModel = new Map<string, RelatorioLivroAutorModel>();

    this.dadosRelatorio.forEach((item) => {
      
      if (!autorViewModel.has(item.nomeAutor)) {
        autorViewModel.set(item.nomeAutor, {
          nomeAutor: item.nomeAutor,
          livros: [],
        });
      }

      const autor = autorViewModel.get(item.nomeAutor);

      if (autor) {
        const livroAutor: LivroModel ={ codl: 0, titulo: item.titulo, editora: item.editora, edicao: item.edicao, anoPublicacao: item.anoPublicacao, assuntos:[], autores: [], precos:[], imagem:''} ;
        autor.livros.push(livroAutor);
      }
    });

    this.relatorioViewModel = Array.from(autorViewModel.values());
  }

  exportToPDF() {
    const element = document.getElementById('relatorio');
    if (element) {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; 
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save('relatorio.pdf');
      });
    }
  }
}
