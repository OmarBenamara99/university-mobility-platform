import { Component, OnInit } from '@angular/core';
import { Chatmsgs } from '../models/chatmsgs';
import { ChatService } from '../service/chat.service';
import { KnowledgeBaseService } from '../service/knowledge-base.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

 messages: Chatmsgs[] = [];
  userInput = '';
  isLoading = false;
  isChatOpen = false;

  // Example questions for quick asking
  quickQuestions = [
    "What documents do I need for exchange?",
    "What are ESPRIT's partner universities?",
    "How to apply for a student visa?",
    "What are the application deadlines?"
  ];

  constructor(private chatService: ChatService, private knowledgeBaseService: KnowledgeBaseService) {}

  ngOnInit() {
    // Replace the test with full knowledge base loading
    this.knowledgeBaseService.loadKnowledgeBase().subscribe({
      next: () => {
        console.log('Knowledge base ready!');
      },
      error: (err) => {
        console.error('Failed to load knowledge base:', err);
      }
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen && this.messages.length === 0) {
      this.addBotMessage('Hello! I\'m your ESPRIT Mobility Assistant. How can I help you with exchange programs, partner universities, or visa information?');
    }
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    this.userInput = '';
    this.isLoading = true;

    this.chatService.sendMessage(userMessage).subscribe({
      next: (response) => {
        this.addBotMessage(response);
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (error) => {
        this.addBotMessage('Sorry, I\'m having trouble connecting. Please try again later.');
        this.isLoading = false;
        console.error('Chat error:', error);
        this.scrollToBottom();
      }
    });
  }

  askQuickQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }

  private addUserMessage(text: string) {
    this.messages.push({
      text,
      isUser: true,
      timestamp: new Date()
    } as Chatmsgs); // Add type assertion if needed
    this.scrollToBottom();
  }

  private addBotMessage(text: string) {
    this.messages.push({
      text,
      isUser: false,
      timestamp: new Date()
    } as Chatmsgs); // Add type assertion if needed
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  clearChat() {
    this.messages = [];
    this.addBotMessage('Hello! How can I help you with mobility programs today?');
  }
}
