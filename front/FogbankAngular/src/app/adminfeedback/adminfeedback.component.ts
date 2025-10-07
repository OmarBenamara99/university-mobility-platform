import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables  } from 'chart.js';
import { FeedbackService } from '../service/feedback.service';
import { OffreService } from '../service/offre.service';
import { Offre } from '../models/offre';
Chart.register(...registerables);

@Component({
  selector: 'app-adminfeedback',
  templateUrl: './adminfeedback.component.html',
  styleUrls: ['./adminfeedback.component.css']
})
export class AdminfeedbackComponent implements OnInit{

overallStats: any = null;
  offersStats: any = null;
  allFeedbacks: any[] = [];
  selectedOfferId: number | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  isLoading: boolean = false;

  // Chart references
  overallChart: Chart | null = null;
  comparisonChart: Chart | null = null;
  offers: Offre[] = []; // Add this variable


  constructor(
    private feedbackService: FeedbackService,
    private offreService: OffreService
  ) {}

  ngOnInit(): void {
    this.loadAllOffers();
    this.loadOverallStatistics();
    this.loadOffersStatistics();
    this.loadAllFeedbacks();
  }

  loadAllOffers(): void {
  this.offreService.getAll().subscribe({
    next: (offers) => {
      this.offers = offers;
    },
    error: (error) => {
      console.error('Error loading offers:', error);
    }
  });
}

  loadOverallStatistics(): void {
    this.isLoading = true;
    this.feedbackService.getOverallFeedbackStatistics().subscribe({
      next: (data) => {
              console.log('Overall Statistics Data:', data); // ADD THIS LINE

        this.overallStats = data;
        this.isLoading = false;
        this.createOverallChart();
      },
      error: (error) => {
        console.error('Error loading overall statistics:', error);
        this.isLoading = false;
      }
    });
  }

  loadOffersStatistics(): void {
    this.feedbackService.getStatisticsForAllOffers().subscribe({
      next: (data) => {
              console.log('Offers Statistics Data:', data); // ADD THIS LINE

        this.offersStats = data;
        this.createComparisonChart();
      },
      error: (error) => {
        console.error('Error loading offers statistics:', error);
      }
    });
  }

  loadAllFeedbacks(): void {
  console.log('Loading feedbacks with page:', this.currentPage, 'size:', this.pageSize);
  
  this.feedbackService.getAllFeedbacksAdmin(this.currentPage, this.pageSize).subscribe({
    next: (data: any) => {
      console.log('Feedback data received:', data);
      
      // Check if it's a paginated response or direct array
      if (data.content) {
        // Paginated response
        this.allFeedbacks = data.content;
        this.totalItems = data.totalElements;
      } else {
        // Direct array response
        this.allFeedbacks = data;
        this.totalItems = data.length;
      }
      
      console.log('Processed feedbacks:', this.allFeedbacks);
      console.log('First feedback student after processing:', this.allFeedbacks[0]?.student);
      
      this.createSatisfactionPieChart();
    },
    error: (error) => {
      console.error('Error loading feedbacks:', error);
    }
  });
}

  createOverallChart(): void {
  if (!this.overallStats?.averageRatings) return;

  // Add timeout like in your club component
  setTimeout(() => {
    const ctx = document.getElementById('overallChart') as HTMLCanvasElement;
    if (ctx) {
      if (this.overallChart) {
        this.overallChart.destroy();
      }

      const labels = Object.keys(this.overallStats.averageRatings).map(key => 
        this.formatLabel(key)
      );
      
      const data = Object.values(this.overallStats.averageRatings).map(value => Number(value));

      // Use the same simple approach as your club component
      this.overallChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Note Moyenne',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              title: {
                display: true,
                text: 'Note (1-5)'
              }
            }
          }
        }
      });
    }
  }, 500); // 500ms delay like in your club component
}

  createComparisonChart(): void {
  if (!this.offersStats) return;

  setTimeout(() => {
    const ctx = document.getElementById('comparisonChart') as HTMLCanvasElement;
    if (ctx) {
      if (this.comparisonChart) {
        this.comparisonChart.destroy();
      }

      const offerIds = Object.keys(this.offersStats).filter(id => this.offersStats[id].totalFeedbacks > 0);
      
      console.log('Offers with feedback:', offerIds); // DEBUG
      
      this.loadOffersForComparison(offerIds).then(offerUniversities => {
        const labels = offerIds.map(id => offerUniversities[id] || `Offre ${id}`);
        
        console.log('Labels:', labels); // DEBUG
        
        // Get ALL criteria manually
        let allCriteria: string[] = [];
        offerIds.forEach(id => {
          const offerCriteria = Object.keys(this.offersStats[id]?.averageRatings || {});
          console.log(`Offer ${id} criteria:`, offerCriteria); // DEBUG
          allCriteria = [...allCriteria, ...offerCriteria];
        });
        
        // Remove duplicates
        const uniqueCriteria = allCriteria.filter((item, index) => allCriteria.indexOf(item) === index);
        
        console.log('Unique criteria:', uniqueCriteria); // DEBUG

        const datasets = uniqueCriteria.map((criterion, index) => {
          const data = offerIds.map(offerId => {
            const value = this.offersStats[offerId]?.averageRatings?.[criterion];
            return value !== undefined ? Number(value) : 0;
          });
          
          console.log(`Data for ${criterion}:`, data); // DEBUG
          
          return {
            label: this.formatLabel(criterion),
            data: data,
            backgroundColor: this.getColor(index),
            borderColor: this.getColor(index),
            borderWidth: 1
          };
        });

        console.log('Final datasets:', datasets); // DEBUG

        if (datasets.length > 0) {
          this.comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: datasets
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 5,
                  title: {
                    display: true,
                    text: 'Note Moyenne'
                  }
                }
              }
            }
          });
        } else {
          console.warn('No datasets to display in comparison chart');
        }
      });
    }
  }, 500);
}

// Add this method to load offers
async loadOffersForComparison(offerIds: string[]): Promise<{[key: string]: string}> {
  const offerUniversities: {[key: string]: string} = {};
  
  // You'll need to implement this method in your OffreService
  for (const offerId of offerIds) {
    try {
      const offer = await this.offreService.getOffreById(Number(offerId)).toPromise();
      offerUniversities[offerId] = offer?.universite || `Offre ${offerId}`;
    } catch (error) {
      console.error('Error loading offer:', error);
      offerUniversities[offerId] = `Offre ${offerId}`;
    }
  }
  
  return offerUniversities;
}

  formatLabel(key: string): string {
    const labels: { [key: string]: string } = {
      qualityOfCourses: 'Qualité des Cours',
      academicInfrastructure: 'Infrastructure Académique',
      accommodation: 'Logement',
      campusLife: 'Vie sur Campus',
      culturalAdaptation: 'Adaptation Culturelle',
      administrativeSupport: 'Support Administratif',
      costOfLiving: 'Coût de la Vie',
      locationAccessibility: 'Accessibilité',
      globalSatisfaction: 'Satisfaction Globale'
    };
    return labels[key] || key;
  }

  getColor(index: number): string {
    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(199, 199, 199, 0.8)',
      'rgba(83, 102, 255, 0.8)',
      'rgba(255, 99, 255, 0.8)'
    ];
    return colors[index % colors.length];
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAllFeedbacks();
  }

  onOfferSelect(offerId: number): void {
    this.selectedOfferId = offerId;
    // Load feedbacks for specific offer if needed
  }

  getTotalPages(): number {
  return Math.ceil(this.totalItems / this.pageSize);
}


createSatisfactionPieChart(): void {
  if (!this.allFeedbacks || this.allFeedbacks.length === 0) return;

  setTimeout(() => {
    const ctx = document.getElementById('satisfactionPieChart') as HTMLCanvasElement;
    if (ctx) {
      // Count satisfaction levels
      const satisfactionCounts = {
        high: this.allFeedbacks.filter(f => f.globalSatisfaction >= 4).length,
        medium: this.allFeedbacks.filter(f => f.globalSatisfaction === 3).length,
        low: this.allFeedbacks.filter(f => f.globalSatisfaction <= 2).length
      };

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Satisfait (4-5)', 'Moyen (3)', 'Insatisfait (1-2)'],
          datasets: [{
            data: [satisfactionCounts.high, satisfactionCounts.medium, satisfactionCounts.low],
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(255, 206, 86, 0.8)', 
              'rgba(255, 99, 132, 0.8)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Niveaux de Satisfaction Globale'
            }
          }
        }
      });
    }
  }, 500);
}
}
