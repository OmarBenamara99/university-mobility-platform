import { Component, OnInit } from '@angular/core';
import { MessageService } from '../service/message.service';
import { AuthServiceService } from '../service/user/auth-service.service';
import { OffreService } from '../service/offre.service';
import { Offre } from '../models/offre';

@Component({
  selector: 'app-studentmsgs',
  templateUrl: './studentmsgs.component.html',
  styleUrls: ['./studentmsgs.component.css']
})
export class StudentmsgsComponent implements OnInit {
  messages: any[] = [];
  newMessageContent: string = '';
  currentUser: any;
  userOffer: Offre | null = null;
  loading = true;

  constructor(
    private messageService: MessageService,
    private authService: AuthServiceService,
    private offreService: OffreService // Add this
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.id) {
      this.loadUserOffer().then(() => {
        if (this.userOffer?.id) {
          this.loadOfferMessages(); // Load messages for specific offer
          this.startPolling();
        }
      });
    }
  }

  // Load user's offer first
  loadUserOffer(): Promise<void> {
    return new Promise((resolve) => {
      this.offreService.getOffresWithUserCandidatures(this.currentUser.id).subscribe({
        next: (offres) => {
          if (offres && offres.length > 0) {
            this.userOffer = offres[0];
            console.log('User offer:', this.userOffer);
          } else {
            console.error('No offer found for user');
          }
          this.loading = false;
          resolve();
        },
        error: (err) => {
          console.error('Error loading user offer:', err);
          this.loading = false;
          resolve();
        }
      });
    });
  }

  // Load messages for specific offer
  loadOfferMessages() {
    if (this.userOffer?.id) {
      this.messageService.getOfferMessages(this.userOffer.id).subscribe({
        next: (msgs) => {
          this.messages = msgs;
          console.log('Offer messages retrieved:', msgs);
        },
        error: (err) => console.error('Error getting offer messages:', err)
      });
    }
  }

  // Polling for real-time updates
  startPolling() {
    setInterval(() => {
      this.loadOfferMessages(); // Changed to load offer messages
    }, 3000);
  }

  // Send message to specific offer group
  sendMessage() {
  if (!this.newMessageContent.trim() || !this.currentUser || !this.userOffer || !this.userOffer.id) return;

  const message = {
    content: this.newMessageContent,
    sender: { id: this.currentUser.id }
  };

  // Use non-null assertion (!) since we checked above
  this.messageService.sendMessageToOffer(message, this.userOffer.id!).subscribe({
    next: (msg) => {
      console.log('Message sent successfully to offer group:', msg);
      this.newMessageContent = '';
      this.loadOfferMessages();
    },
    error: (err) => {
      console.error('Error sending message:', err);
    }
  });
}
}