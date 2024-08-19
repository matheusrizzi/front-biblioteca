import { Routes } from '@angular/router';
import { PesquisaLivrosComponent } from './components/pesquisa-livros/pesquisa-livros.component';
import { CadastroLivroComponent } from './components/cadastro-livro/cadastro-livro.component';
import { PesquisaAutoresComponent } from './components/pesquisa-autores/pesquisa-autores.component';
import { PesquisaAssuntosComponent } from './components/pesquisa-assuntos/pesquisa-assuntos.component';
import { RelatorioAutorComponent } from './components/relatorio-autor/relatorio-autor.component';

export const routes: Routes = [{
    path: '',
    component: PesquisaLivrosComponent,
    title: 'Home Page'
},
{
    path: 'livro/:codl',
    component: CadastroLivroComponent,
    title: 'Cadastro de Livro'
},
{
    path: 'autores',
    component: PesquisaAutoresComponent,
    title: 'Pesquisa de Autores'
},
{
    path: 'assuntos',
    component: PesquisaAssuntosComponent,
    title: 'Pesquisa de Assuntos'
},
{
    path: 'relatorios/autor',
    component: RelatorioAutorComponent,
    title: 'Relatórios'
}];
