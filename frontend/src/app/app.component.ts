import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  response: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

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
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
  
        // Assume each line is a JSON object
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            this.response += json.response || '';
          } catch (err) {
            console.error('Invalid chunk:', line);
          }
        }
      }
    }).finally(() => {
      this.loading = false;
    });
  }
  
}


