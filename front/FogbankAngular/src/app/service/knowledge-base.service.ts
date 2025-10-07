import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, forkJoin, of  } from 'rxjs';


export interface KnowledgeChunk {
  content: string;
  source: string;
  relevance: number;
}

@Injectable({
  providedIn: 'root'
})
export class KnowledgeBaseService {

   private knowledgeBase: KnowledgeChunk[] = [];

  private documents = [
    'partner-universities.txt',
    'application-process.txt', 
    'required-documents.txt',
    'visa-information.txt',
    'faqs.txt'
  ];

  constructor(private http: HttpClient) {}

  // Load and process all documents
  loadKnowledgeBase(): Observable<void> {
    const loadRequests = this.documents.map(doc => 
      this.loadDocument(doc).pipe(
        map(content => this.processDocument(content, doc))
      )
    );

    return forkJoin(loadRequests).pipe(
      map(results => {
        this.knowledgeBase = results.flat();
        console.log('Knowledge base loaded with', this.knowledgeBase.length, 'chunks');
        console.log('Available chunks:', this.knowledgeBase);
      })
    );
  }

  // Process a document into chunks
  private processDocument(content: string, source: string): KnowledgeChunk[] {
    // Split by double newlines to get paragraphs/sections
    const chunks = content.split('\n\n').filter(chunk => 
      chunk.trim().length > 30 // Only keep substantial chunks
    );
    
    return chunks.map(chunk => ({
      content: chunk.trim(),
      source: source.replace('.txt', ''),
      relevance: 0
    }));
  }

  // Basic keyword matching to find relevant chunks
  findRelevantChunks(question: string, maxChunks: number = 3): KnowledgeChunk[] {
    if (this.knowledgeBase.length === 0) {
      return [];
    }

    const keywords = question.toLowerCase().split(/\s+/).filter(word => 
      word.length > 3 // Ignore short words
    );

    const scoredChunks = this.knowledgeBase.map(chunk => {
      let score = 0;
      const chunkText = chunk.content.toLowerCase();
      
      keywords.forEach(keyword => {
        if (chunkText.includes(keyword)) {
          score += 3; // Higher score for keyword matches
        }
      });

      // Also score based on document type matching
      if (question.toLowerCase().includes('document') && chunk.source.includes('document')) {
        score += 2;
      }
      if (question.toLowerCase().includes('visa') && chunk.source.includes('visa')) {
        score += 2;
      }
      if (question.toLowerCase().includes('universit') && chunk.source.includes('universit')) {
        score += 2;
      }

      return { ...chunk, relevance: score };
    });

    const relevantChunks = scoredChunks
      .filter(chunk => chunk.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, maxChunks);

    console.log('Question:', question);
    console.log('Relevant chunks found:', relevantChunks);
    
    return relevantChunks;
  }

  // Keep existing methods
  loadDocument(documentName: string): Observable<string> {
    return this.http.get(`assets/knowledge-base/${documentName}`, { 
      responseType: 'text' 
    });
  }

  getAvailableDocuments(): string[] {
    return this.documents;
  }

  // Remove the test method we added earlier
}
