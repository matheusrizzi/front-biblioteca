import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { LivroViewModel } from '../../models/livro-model';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LivroService } from '../../services/livro.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutorService } from '../../services/autor.service';
import { AutorModel } from '../../models/autor-model';
import { AssuntoModel } from '../../models/assunto-model';
import { AssuntoService } from '../../services/assunto.service';
import { FormaCompraService } from '../../services/forma-compra.service';
import { FormaCompraModel } from '../../models/forma-compra-model';
import { LivroFormaCompraModel } from '../../models/livro-forma-compra';
import { CurrencyFormatterDirective } from '../../directives/currency-formatter.directive';

@Component({
  selector: 'app-cadastro-livro',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    CommonModule,
    CurrencyFormatterDirective,
  ],
  templateUrl: './cadastro-livro.component.html',
  styleUrl: './cadastro-livro.component.css',
})
export class CadastroLivroComponent {
  cadastroForm: FormGroup;
  livro?: LivroViewModel;

  listaAutores: AutorModel[] = [];
  autoresAdicionados: AutorModel[] = [];
  selectedAutorId?: number;

  listaAssuntos: AssuntoModel[] = [];
  assuntosAdicionados: AssuntoModel[] = [];
  selectedAssuntoId?: number;

  precos: LivroFormaCompraModel[] = [];
  listaFormasCompra: FormaCompraModel[] = [];

  constructor(
    public modalRef: NgbActiveModal,
    private fb: FormBuilder,
    private service: LivroService,
    private toastr: ToastrService,
    private autorService: AutorService,
    private assuntoService: AssuntoService,
    private formaCompraService: FormaCompraService
  ) {
    this.cadastroForm = this.fb.group({
      codl: [0],
      titulo: [''],
      editora: [''],
      edicao: [0],
      anoPublicacao: [0],
    });

    this.carregarListaAutores();
    this.carregarListaAssuntos();
    this.carregarFormasDeCompra();
  }

  async carregarFormasDeCompra() {
    this.listaFormasCompra = await this.formaCompraService.getFormasDeCompra();

    this.listaFormasCompra.forEach((f) => {
      var precoExistente = this.precos.find((x) => x.codFo == f.codFo);

      if (precoExistente == null) {
        this.precos.push({ codFo: f.codFo, descricao: f.descricao, preco: 0 });
      }
    });
  }

  formatPreco(preco: number): string {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  onPrecoBlur(item: LivroFormaCompraModel, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let rawValue = inputElement.value
      .replace(/[^0-9.,]/g, '')
      .replace(',', '.');

    rawValue = rawValue === '' ? '0' : rawValue;
    const parsedValue = parseFloat(rawValue);

    if (!isNaN(parsedValue)) {
      item.preco = parsedValue;
    }

    inputElement.value = this.formatPreco(item.preco);
  }

  onPrecoFocus(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const rawValue = inputElement.value
      .replace(/[^\d.,]/g, '')
      .replace(',', '.');

    inputElement.value = rawValue;
  }

  ngOnInit(): void {
    if (this.livro) {
      this.carregarDadosLivro(this.livro);
      console.log(this.livro);
    }
  }

  carregarDadosLivro(livro: LivroViewModel) {
    this.cadastroForm.patchValue(livro);

    this.autoresAdicionados = livro.autores;
    this.assuntosAdicionados = livro.assuntos;
    this.precos = livro.formasCompra;
  }

  async carregarListaAutores() {
    const response: AutorModel[] = await this.autorService.getAutores();
    this.listaAutores = response;
  }

  adicionarAutor(selectElement: HTMLSelectElement): void {
    const selectedAutorId = parseInt(selectElement.value, 10);

    if (selectedAutorId) {
      const autor = this.listaAutores.find((a) => a.codAu === selectedAutorId);

      if (
        autor &&
        !this.autoresAdicionados.some((a) => a.codAu === selectedAutorId)
      ) {
        this.autoresAdicionados.push(autor);
      }
    }

    selectElement.value = '';
  }

  removerAutor(autor: AutorModel): void {
    this.autoresAdicionados = this.autoresAdicionados.filter(
      (a) => a !== autor
    );
  }

  async carregarListaAssuntos() {
    const response: AssuntoModel[] = await this.assuntoService.getAssuntos();
    this.listaAssuntos = response;
  }

  adicionarAssunto(selectElement: HTMLSelectElement): void {
    const selectedAssuntoId = parseInt(selectElement.value, 10);
    if (selectedAssuntoId) {
      const assunto = this.listaAssuntos.find(
        (a) => a.codAs === selectedAssuntoId
      );

      if (
        assunto &&
        !this.assuntosAdicionados.some((a) => a.codAs === selectedAssuntoId)
      ) {
        this.assuntosAdicionados.push(assunto);
      }
    }
    selectElement.value = '';
  }

  removerAssunto(assunto: AssuntoModel): void {
    this.assuntosAdicionados = this.assuntosAdicionados.filter(
      (a) => a !== assunto
    );
  }

  salvarLivro() {
    const titulo = this.cadastroForm.value.titulo ?? '';
    const editora = this.cadastroForm.value.editora ?? '';
    const edicao = this.cadastroForm.value.edicao ?? 0;

    if(titulo === ''){
      this.toastr.warning('Informe o título do livro!');
      return;
    }

    if(editora === ''){
      this.toastr.warning('Informe a editora do livro!');
      return;
    }

    if(edicao === 0){
      this.toastr.warning('Informe a edição do livro!');
      return;
    }
    
    if (this.autoresAdicionados.length === 0) {
      this.toastr.warning('Nenhum autor adicionado!');
      return;
    }

    if (this.assuntosAdicionados.length === 0) {
      this.toastr.warning('Nenhum assunto adicionado!');
      return;
    }

    const novoLivro: LivroViewModel = {
      codl: this.livro?.codl ?? 0,
      titulo: titulo,
      editora: editora,
      edicao: edicao,
      anoPublicacao: this.cadastroForm.value.anoPublicacao ?? 0,
      imagem: '',
      assuntos: this.assuntosAdicionados,
      autores: this.autoresAdicionados,
      formasCompra: this.precos,
    };

    this.service.salvarLivro(novoLivro);
    this.modalRef.close(novoLivro);
    this.toastr.success('Livro salvo com sucesso!');
  }
}
