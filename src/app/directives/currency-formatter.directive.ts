import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormatter]',
  standalone: true
})
export class CurrencyFormatterDirective {

  constructor(private el: ElementRef, private renderer: Renderer2){}

  ngOnInit() {
    // Inicialize o valor formatado
    this.initializeValue();
  }

  @HostListener('blur') onBlur() {
    const rawValue = this.el.nativeElement.value;
    const numericValue = this.parseCurrency(rawValue);
    if (!isNaN(numericValue)) {
      this.renderer.setProperty(this.el.nativeElement, 'value', this.formatCurrency(numericValue));
    } else {
      // Se o valor não for numérico, limpa o campo ou define um padrão
      this.renderer.setProperty(this.el.nativeElement, 'value', this.formatCurrency(0));
    }
  }

  @HostListener('focus') onFocus() {
    const rawValue = this.el.nativeElement.value;
    const numericValue = this.parseCurrency(rawValue);
    // Ao ganhar foco, exibe o valor numérico puro
    this.renderer.setProperty(this.el.nativeElement, 'value', isNaN(numericValue) ? '0' : numericValue.toString());
  }

  private parseCurrency(value: string): number {
    // Remove todos os caracteres não numéricos, exceto ponto e vírgula
    const numericValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');
    return parseFloat(numericValue);
  }

  private formatCurrency(value: number): string {
    if (isNaN(value)) return '0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  private initializeValue() {
    // Inicializa o campo com um valor formatado
    this.renderer.setProperty(this.el.nativeElement, 'value', this.formatCurrency(0));
  }
}
