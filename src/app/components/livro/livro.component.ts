import { Component, Input } from '@angular/core';
//import { LivroModel } from '../../models/livro-model';
import { RouterModule } from '@angular/router';
import { CadastroLivroComponent } from '../cadastro-livro/cadastro-livro.component';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LivroService } from '../../services/livro.service';
import { LivroViewModel } from '../../models/livro-model';

@Component({
  selector: 'app-livro',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './livro.component.html',
  styleUrl: './livro.component.css',
})
export class LivroComponent {
  @Input() livro!: LivroViewModel;

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://boadica.com.br/assets/site/nao-disponivel.png';
  }

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private service: LivroService
  ) {}

  abrirCadastroModal(livro?: LivroViewModel) {
    const modalRef = this.modalService.open(CadastroLivroComponent, {
      modalDialogClass: 'custom-modal-width',
    });
    modalRef.componentInstance.livro = livro;

    modalRef.result.then(
      (result) => {
        this.service.obterLivros();
      }
    );
  }

  editarItem(livro: LivroViewModel) {
    this.abrirCadastroModal(livro);
  }

  async excluirLivro(id: number): Promise<void> {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      await this.service.excluirLivro(id);
      this.toastr.success('Livro excluído com sucesso!');
    }
  }
}
