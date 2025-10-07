package com.fogbank.springsecurity.services;

import com.fogbank.springsecurity.entities.Feedback;

import java.util.List;
import java.util.Optional;

public interface IFeedbackService {

    Feedback submitFeedback(Feedback feedback, Integer studentId, Integer offerId);

    List<Feedback> getFeedbacksByOffer(Integer offerId);

    List<Feedback> getFeedbacksByStudent(Integer studentId);

    Optional<Feedback> getFeedbackByStudentAndOffer(Integer studentId, Integer offerId);

    boolean hasStudentSubmittedFeedback(Integer studentId, Integer offerId);

    java.util.Map<String, Double> getAverageRatingsByOffer(Integer offerId);

    java.util.Map<String, Object> getFeedbackStatistics(Integer offerId);

    List<Feedback> getAllFeedbacks();

    java.util.Map<String, Object> getOverallFeedbackStatistics();
    java.util.Map<Integer, java.util.Map<String, Object>> getStatisticsForAllOffers();
    List<Feedback> getAllFeedbacksWithRelationships(int page, int size);
}
