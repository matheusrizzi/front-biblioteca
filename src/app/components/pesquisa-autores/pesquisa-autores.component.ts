import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CadastroAutorComponent } from '../cadastro-autor/cadastro-autor.component';
import { CommonModule } from '@angular/common';
import { AutorModel } from '../../models/autor-model';
import { AutorService } from '../../services/autor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pesquisa-autores',
  standalone: true,
  imports: [HeaderComponent, CadastroAutorComponent, CommonModule],
  templateUrl: './pesquisa-autores.component.html',
  styleUrl: './pesquisa-autores.component.css',
})
export class PesquisaAutoresComponent {
  listaAutores: AutorModel[] = [];

  constructor(private service: AutorService, private modalService: NgbModal, private toastr:ToastrService) {}

  ngOnInit(): void {
    this.service.autores$.subscribe((autor) => {
      this.listaAutores = autor;
    });

    this.carregarListaAutores();
  }

  async carregarListaAutores() {
    this.service.obterAutores();
  }

  abrirCadastroModal(autor?: AutorModel) {
    const modalRef = this.modalService.open(CadastroAutorComponent);
    modalRef.componentInstance.item = autor;

    modalRef.result.then(
      (result) => {
        this.carregarListaAutores();
      },
      (reason) => {
        this.toastr.error(reason, "Falha!");
        console.log('Modal dismissed with reason:', reason);
      }
    );
  }

  editarItem(autor: AutorModel){
    this.abrirCadastroModal(autor);
  }

  async excluirAutor(id: number): Promise<void> {
    if (confirm('Tem certeza que deseja excluir este autor?')) {
      await this.service.excluirAutor(id);
      this.toastr.success('Autor excluído com sucesso!');
    }
  }

}
