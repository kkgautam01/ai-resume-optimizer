import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  inputText: string = '';
  selectedOption: string = 'format';
  keywords: string = '';
  response: SafeHtml = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  submit() {
    this.response = '';
    this.loading = true;

    const payload: any = {
      text: this.inputText,
      keywords: this.keywords,
      action: this.selectedOption
    };

    fetch('http://localhost:3000/v1/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(async res => {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let rawHtml = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            const text = this.decodeUnicodeSafe(json.response);
            rawHtml += text || '';
          } catch (err) {
            console.error('Invalid chunk:', line);
          }
        }
      }

      // Convert markdown-style **bold** to HTML <strong>
      rawHtml = rawHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Sanitize the HTML
      this.response = this.sanitizer.bypassSecurityTrustHtml(rawHtml);

    }).finally(() => {
      this.loading = false;
    });
  }

  decodeUnicodeSafe(text: string): string {
    try {
      return decodeURIComponent(escape(text));
    } catch (e) {
      return text;
    }
  }
}
