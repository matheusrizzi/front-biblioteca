import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { LivroComponent } from "../livro/livro.component";
import { LivroViewModel } from '../../models/livro-model';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdicionarLivroModalComponent } from '../adicionar-livro-modal/adicionar-livro-modal.component';
import { LivroService } from '../../services/livro.service';
import { ToastrService } from 'ngx-toastr';
import { CadastroLivroComponent } from '../cadastro-livro/cadastro-livro.component';

@Component({
  selector: 'app-pesquisa-livros',
  standalone: true,
  imports: [HeaderComponent, LivroComponent, CommonModule, NgbModule, AdicionarLivroModalComponent],
  templateUrl: './pesquisa-livros.component.html',
  styleUrl: './pesquisa-livros.component.css'
})
export class PesquisaLivrosComponent {
   livroLista:LivroViewModel[]=[];

  constructor(private service: LivroService, private modalService: NgbModal,private toastr:ToastrService){
  }

  ngOnInit(): void {
    this.service.livros$.subscribe((livro) => {
      this.livroLista = livro;
    });

    this.service.obterLivros();
  }

  abrirCadastroModal(livro?: LivroViewModel) {
    const modalRef = this.modalService.open(CadastroLivroComponent);
    
    modalRef.componentInstance.livro = livro;

    modalRef.result.then(
      (result) => {
        this.service.obterLivros();
      },
      (reason) => {
      }
    );
  }

  editarItem(livro: LivroViewModel){
    this.abrirCadastroModal(livro);
  }
}
