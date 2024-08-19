import { AssuntoModel } from '../../models/assunto-model';
import { AssuntoService } from '../../services/assunto.service';
import { Component } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

@Component({
  selector: 'app-cadastro-assunto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
  templateUrl: './cadastro-assunto.component.html',
  styleUrl: './cadastro-assunto.component.css',
})
export class CadastroAssuntoComponent {
  assunto?: AssuntoModel;
  cadastroForm: FormGroup;

  constructor(
    public modalRef: NgbActiveModal,
    private fb: FormBuilder,
    private service: AssuntoService,
    private toastrService: ToastrService
  ) {
    this.cadastroForm = new FormGroup({
      codAs: new FormGroup(0),
      descricao: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(20)]],
    });

    if (this.assunto) {
      this.cadastroForm.patchValue(this.assunto);
    }
  }

  salvarAssunto() {
    if (this.cadastroForm.valid) {
      const novoAssunto: AssuntoModel = {
        codAs: this.assunto?.codAs ?? 0,
        descricao: this.cadastroForm.value.descricao ?? '',
      };
      this.service.salvarAssunto(novoAssunto);
      this.modalRef.close(novoAssunto);
      this.cadastroForm.reset();
      this.toastrService.success('Assunto salvo com sucesso!', 'Notificação!');
    }
  }
}
