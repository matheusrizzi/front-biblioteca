import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './notificacao.component.html',
  styleUrl: './notificacao.component.css'
})
export class NotificacaoComponent {
   notificacaoMensagem: string = "Registro salvo com sucesso!";
}
