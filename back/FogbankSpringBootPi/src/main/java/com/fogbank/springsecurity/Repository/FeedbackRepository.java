package com.fogbank.springsecurity.Repository;

import com.fogbank.springsecurity.entities.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Find feedback by offer
    List<Feedback> findByOfferId(Integer offerId);

    // Find feedback by student
    List<Feedback> findByStudentId(Long studentId);

    // Find feedback by student and offer (to prevent multiple submissions)
    Optional<Feedback> findByStudentIdAndOfferId(Long studentId, Integer offerId);

    // Check if student already submitted feedback for this offer
    boolean existsByStudentIdAndOfferId(Long studentId, Integer offerId);

    // Get average ratings for an offer
    @Query("SELECT AVG(f.qualityOfCourses) FROM Feedback f WHERE f.offer.id = :offerId")
    Double findAverageQualityOfCoursesByOfferId(Integer offerId);

    // Similar methods for other criteria...
    @Query("SELECT AVG(f.academicInfrastructure) FROM Feedback f WHERE f.offer.id = :offerId")
    Double findAverageAcademicInfrastructureByOfferId(Integer offerId);

    // Count feedbacks per offer
    Long countByOfferId(Integer offerId);


    // Overall average methods (for all feedbacks)
    @Query("SELECT AVG(f.qualityOfCourses) FROM Feedback f")
    Double findAverageQualityOfCourses();

    @Query("SELECT AVG(f.academicInfrastructure) FROM Feedback f")
    Double findAverageAcademicInfrastructure();

    @Query("SELECT AVG(f.accommodation) FROM Feedback f")
    Double findAverageAccommodation();

    @Query("SELECT AVG(f.campusLife) FROM Feedback f")
    Double findAverageCampusLife();

    @Query("SELECT AVG(f.culturalAdaptation) FROM Feedback f")
    Double findAverageCulturalAdaptation();

    @Query("SELECT AVG(f.administrativeSupport) FROM Feedback f")
    Double findAverageAdministrativeSupport();

    @Query("SELECT AVG(f.costOfLiving) FROM Feedback f")
    Double findAverageCostOfLiving();

    @Query("SELECT AVG(f.locationAccessibility) FROM Feedback f")
    Double findAverageLocationAccessibility();

    @Query("SELECT AVG(f.globalSatisfaction) FROM Feedback f")
    Double findAverageGlobalSatisfaction();

    @Query("SELECT f FROM Feedback f LEFT JOIN FETCH f.student LEFT JOIN FETCH f.offer")
    List<Feedback> findAllWithRelationships();





















    // Add all average rating methods




    @Query("SELECT AVG(f.accommodation) FROM Feedback f WHERE f.offer.id = :offerId")
    Double findAverageAccommodationByOfferId(Integer offerId);

    @Query("SELECT AVG(f.campusLife) FROM Feedback f WHERE f.offer.id = :offerId")
    Double findAverageCampusLifeByOfferId(Integer offerId);

    @Query("SELECT AVG(f.culturalAdaptation) FROM Feedback f WHERE f.offer.id = :offerId")
    Double findAverageCulturalAdaptationByOfferId(Integer offerId);

    @Query("SELECT AVG(f.administrativeSupport) FROM Feedback f WHERE f.offer.id = :offerId")
    Double findAverageAdministrativeSupportByOfferId(Integer offerId);

    @Query("SELECT AVG(f.costOfLiving) FROM Feedback f WHERE f.offer.id = :offerId")
    Double findAverageCostOfLivingByOfferId(Integer offerId);

    @Query("SELECT AVG(f.locationAccessibility) FROM Feedback f WHERE f.offer.id = :offerId")
    Double findAverageLocationAccessibilityByOfferId(Integer offerId);

    @Query("SELECT AVG(f.globalSatisfaction) FROM Feedback f WHERE f.offer.id = :offerId")
    Double findAverageGlobalSatisfactionByOfferId(Integer offerId);
}
