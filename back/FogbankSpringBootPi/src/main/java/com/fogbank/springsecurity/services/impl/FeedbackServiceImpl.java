package com.fogbank.springsecurity.services.impl;

import com.fogbank.springsecurity.Repository.FeedbackRepository;
import com.fogbank.springsecurity.Repository.OffreRepository;
import com.fogbank.springsecurity.Repository.UserRepository;
import com.fogbank.springsecurity.entities.Feedback;
import com.fogbank.springsecurity.entities.Offre;
import com.fogbank.springsecurity.entities.User;
import com.fogbank.springsecurity.services.IFeedbackService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackServiceImpl implements IFeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final OffreRepository offreRepository;

    @Override
    @Transactional
    public Feedback submitFeedback(Feedback feedback, Integer studentId, Integer offerId) {
        // Check if student already submitted feedback for this offer
        if (feedbackRepository.existsByStudentIdAndOfferId(studentId.longValue(), offerId)) {
            throw new RuntimeException("Student already submitted feedback for this offer");
        }

        // Validate ratings (1-5 stars)
        if (!feedback.isValid()) {
            throw new RuntimeException("All ratings must be between 1 and 5 stars");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Offre offer = offreRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        feedback.setStudent(student);
        feedback.setOffer(offer);

        return feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedback> getFeedbacksByOffer(Integer offerId) {
        return feedbackRepository.findByOfferId(offerId);
    }

    @Override
    public List<Feedback> getFeedbacksByStudent(Integer studentId) {
        return feedbackRepository.findByStudentId(studentId.longValue());
    }

    @Override
    public Optional<Feedback> getFeedbackByStudentAndOffer(Integer studentId, Integer offerId) {
        return feedbackRepository.findByStudentIdAndOfferId(studentId.longValue(), offerId);
    }

    @Override
    public boolean hasStudentSubmittedFeedback(Integer studentId, Integer offerId) {
        return feedbackRepository.existsByStudentIdAndOfferId(studentId.longValue(), offerId);
    }

    @Override
    public Map<String, Double> getAverageRatingsByOffer(Integer offerId) {
        Map<String, Double> averages = new HashMap<>();

        averages.put("qualityOfCourses", feedbackRepository.findAverageQualityOfCoursesByOfferId(offerId));
        averages.put("academicInfrastructure", feedbackRepository.findAverageAcademicInfrastructureByOfferId(offerId));
        averages.put("accommodation", feedbackRepository.findAverageAccommodationByOfferId(offerId));
        averages.put("campusLife", feedbackRepository.findAverageCampusLifeByOfferId(offerId));
        averages.put("culturalAdaptation", feedbackRepository.findAverageCulturalAdaptationByOfferId(offerId));
        averages.put("administrativeSupport", feedbackRepository.findAverageAdministrativeSupportByOfferId(offerId));
        averages.put("costOfLiving", feedbackRepository.findAverageCostOfLivingByOfferId(offerId));
        averages.put("locationAccessibility", feedbackRepository.findAverageLocationAccessibilityByOfferId(offerId));
        averages.put("globalSatisfaction", feedbackRepository.findAverageGlobalSatisfactionByOfferId(offerId));

        return averages.entrySet().stream()
                .filter(entry -> entry.getValue() != null)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    public Map<String, Object> getFeedbackStatistics(Integer offerId) {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalFeedbacks", feedbackRepository.countByOfferId(offerId));
        stats.put("averageRatings", getAverageRatingsByOffer(offerId));

        return stats;
    }

    @Override
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAllWithRelationships();
    }

    @Override
    public List<Feedback> getAllFeedbacksWithRelationships(int page, int size) {
        return feedbackRepository.findAllWithRelationships(); // Remove pageable for now
    }

    @Override
    public Map<String, Object> getOverallFeedbackStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFeedbacks", feedbackRepository.count());
        stats.put("averageRatings", getOverallAverageRatings());
        return stats;
    }

    @Override
    public Map<Integer, Map<String, Object>> getStatisticsForAllOffers() {
        Map<Integer, Map<String, Object>> allStats = new HashMap<>();
        List<Offre> allOffers = offreRepository.findAll();

        for (Offre offer : allOffers) {
            Map<String, Object> offerStats = new HashMap<>();
            offerStats.put("totalFeedbacks", feedbackRepository.countByOfferId(offer.getId()));
            offerStats.put("averageRatings", getAverageRatingsByOffer(offer.getId()));
            allStats.put(offer.getId(), offerStats);
        }

        return allStats;
    }

    private Map<String, Double> getOverallAverageRatings() {
        Map<String, Double> averages = new HashMap<>();
        averages.put("qualityOfCourses", feedbackRepository.findAverageQualityOfCourses());
        averages.put("academicInfrastructure", feedbackRepository.findAverageAcademicInfrastructure());
        averages.put("accommodation", feedbackRepository.findAverageAccommodation());
        averages.put("campusLife", feedbackRepository.findAverageCampusLife());
        averages.put("culturalAdaptation", feedbackRepository.findAverageCulturalAdaptation());
        averages.put("administrativeSupport", feedbackRepository.findAverageAdministrativeSupport());
        averages.put("costOfLiving", feedbackRepository.findAverageCostOfLiving());
        averages.put("locationAccessibility", feedbackRepository.findAverageLocationAccessibility());
        averages.put("globalSatisfaction", feedbackRepository.findAverageGlobalSatisfaction());

        return averages.entrySet().stream()
                .filter(entry -> entry.getValue() != null)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
