import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssuntoService } from '../../services/assunto.service';
import { AssuntoModel } from '../../models/assunto-model';
import { CadastroAssuntoComponent } from '../cadastro-assunto/cadastro-assunto.component';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-pesquisa-assuntos',
  standalone: true,
  imports: [CadastroAssuntoComponent, CommonModule],
  templateUrl: './pesquisa-assuntos.component.html',
  styleUrl: './pesquisa-assuntos.component.css',
})
export class PesquisaAssuntosComponent {
  listaAssunto: AssuntoModel[] = [];
  selectedAssunto: AssuntoModel | null = null;

  constructor(public service:AssuntoService, private modalService: NgbModal, private toastr:ToastrService) {}

  ngOnInit(): void {
    this.service.assuntos$.subscribe((assuntos) => {
      this.listaAssunto = assuntos;
    });

    this.service.obterAssuntos();
  }

  async deleteAssunto(id: number): Promise<void> {
    if (confirm('Tem certeza que deseja excluir este assunto?')) {
      await this.service.deleteAssunto(id);
      this.toastr.success('Assunto excluído com sucesso!');
    }
  }

  editarItem(assunto: AssuntoModel){
    this.abrirCadastroModal(assunto);
  }

  abrirCadastroModal(assunto?: AssuntoModel) {
    const modalRef = this.modalService.open(CadastroAssuntoComponent);
    modalRef.componentInstance.assunto = assunto;

    modalRef.result.then(
      (result) => {
        this.service.obterAssuntos();
        console.log('Modal closed with result:', result);
      },
      (reason) => {
        console.log('Modal dismissed with reason:', reason);
      }
    );
  }
}
