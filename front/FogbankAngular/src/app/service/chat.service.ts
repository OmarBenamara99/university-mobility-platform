import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KnowledgeBaseService } from './knowledge-base.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8087/api/gemini/ask'; // Your Spring Boot endpoint

  constructor(private http: HttpClient, private knowledgeBaseService: KnowledgeBaseService) { }

  sendMessage(message: string): Observable<string> {
    // First, find relevant knowledge chunks
    const relevantChunks = this.knowledgeBaseService.findRelevantChunks(message);
    
    let enhancedPrompt = message;
    
    if (relevantChunks.length > 0) {
      // Build context from relevant chunks
      const context = relevantChunks.map(chunk => 
        `[Source: ${chunk.source}]\n${chunk.content}`
      ).join('\n\n---\n\n');
      
      enhancedPrompt = `
CONTEXT INFORMATION:
${context}

USER QUESTION: ${message}

INSTRUCTIONS: 
- Answer based primarily on the context information provided above
- If the context contains relevant information, use it to give a precise answer
- If the context doesn't contain the specific answer, you can use your general knowledge but mention that the user should verify with the Mobility Office
- Keep answers concise and helpful
- Refer to specific details from the context when possible
`;
    }

    console.log('Enhanced prompt sent to Gemini:', enhancedPrompt);
    
    return this.http.post<string>(this.apiUrl, { prompt: enhancedPrompt }, { 
      responseType: 'text' as 'json' 
    });
  }
}
