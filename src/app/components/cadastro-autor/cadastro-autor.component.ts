import { Component } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutorModel } from '../../models/autor-model';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AutorService } from '../../services/autor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastro-autor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './cadastro-autor.component.html',
  styleUrl: './cadastro-autor.component.css',
})
export class CadastroAutorComponent {
  itemForm: FormGroup;
  item?: AutorModel;

  constructor(
    public modalRef: NgbActiveModal,
    private fb: FormBuilder,
    private service: AutorService,
    private toastr: ToastrService
  ) {
    this.itemForm = this.fb.group({
      nome: [''],
    });
  }

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(40)]],
    });

    if (this.item) {
      this.itemForm.patchValue(this.item);
    }
  }

  salvarAutor() {
    if (this.itemForm.valid) {
      const novoAutor: AutorModel = {
        codAu: this.item?.codAu ?? 0,
        nome: this.itemForm.value.nome ?? '',
      };
      this.service.salvarAutor(novoAutor);
      this.modalRef.close(novoAutor);
      this.toastr.success('Autor salvo com sucesso!');
    }
  }
}
