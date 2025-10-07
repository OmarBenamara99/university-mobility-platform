package com.fogbank.springsecurity.controller;


import com.fogbank.springsecurity.dto.ScoreUpdateDto;
import com.fogbank.springsecurity.entities.*;
import com.fogbank.springsecurity.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge=3600)
    
public class AdminController {
    @Autowired
    private AuthenticationService authenticationService ;

    @Autowired
    IOffreService offreService;
    @Autowired
    IAdministrativeFileService administrativeFileService;
    @Autowired
    IMobilityProcessService mobilityProcessService;
    @Autowired
    ICandidatureService candidatureService;
    @Autowired
    IAcceptanceProofService acceptanceProofService;
    @Autowired
    IMessageService messageService;
    @Autowired
    IOrdreMissionService ordreMissionService;
    @Autowired
    IFeedbackService feedbackService;
    @Autowired
    IReclamationService reclamationService;
    @Autowired
    IEquivalenceService equivalenceService;
    @Autowired
    IExtensionRequestService extensionRequestService;



    @Autowired
   private UserService userService ;


    @Autowired
    private ProfileService profileService ;



    @GetMapping
    public ResponseEntity<String> sayHello()
    {
        User user= authenticationService.getuserfromauthentication();

        return ResponseEntity.ok(user.toString()) ;

    }


    



    @GetMapping("/getAllUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/getUser/{id}")
    public User getUser(@PathVariable("id") Integer id) {
        return userService.getUser(id);
    }

    @DeleteMapping("/delete/{userId}")
    public void deleteUser(@PathVariable("userId") Integer userId) {
        userService.removeUser(userId);
    }































    @PostMapping("/addOffre")
    public Offre addOffre(@RequestBody Offre offre) { return offreService.addOffre(offre); }
    @PutMapping("/updateOffre")
    public Offre updateOffre(@RequestBody Offre offre) { return offreService.updateOffre(offre);}
    @DeleteMapping("/deleteOffre/{id}")
    public void deleteOffre(@PathVariable("id") Integer id){ offreService.deleteOffre(id); }
    @GetMapping("/offres")
    public List<Offre> getAllOffres() { return offreService.getAllOffres(); }
    @GetMapping("/retrieveOffer/{id}")
    public Offre getOffreById(@PathVariable("id") Integer id) { return offreService.getOffreById(id); }
    @GetMapping("/with-candidatures")
    public List<Offre> getOffresWithCandidatures() { return offreService.getAllOffresWithCandidatures(); }

    // Message Endpoints
    @PostMapping("/message/send")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        Message savedMessage = messageService.sendMessage(message);
        return ResponseEntity.ok(savedMessage);
    }







    // NEW ENDPOINTS FOR COMMON GROUP
    @GetMapping("/messages") // GET ALL MESSAGES (no group ID needed)
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.getAllMessages(); // You need to implement this method
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/message/send/common")
    public ResponseEntity<Message> sendMessageToCommonGroup(@RequestBody Message message) {
        Message savedMessage = messageService.sendMessageToCommonGroup(message);
        return ResponseEntity.ok(savedMessage);
    }





    // Offer-specific message endpoints
    @GetMapping("/offer/{offerId}/messages")
    public ResponseEntity<List<Message>> getOfferMessages(@PathVariable Long offerId) {
        List<Message> messages = messageService.getMessagesByOfferId(offerId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/offer/{offerId}/message/send")
    public ResponseEntity<Message> sendMessageToOffer(@PathVariable Long offerId, @RequestBody Message message) {
        Message savedMessage = messageService.sendMessageToOfferGroup(message, offerId);
        return ResponseEntity.ok(savedMessage);
    }

    @PostMapping(value = "/offer/{offerId}/ordre-mission/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<OrdreMission> uploadOrdreMission(
            @PathVariable Integer offerId, // Change Long to Integer
            @RequestParam("file") MultipartFile file) throws IOException {

        OrdreMission ordreMission = ordreMissionService.uploadOrdreMission(offerId, file);
        return ResponseEntity.ok(ordreMission);
    }

    @GetMapping("/offer/{offerId}/ordre-mission")
    public ResponseEntity<OrdreMission> getOrdreMission(@PathVariable Integer offerId) { // Change Long to Integer
        Optional<OrdreMission> ordreMission = ordreMissionService.getOrdreMissionByOfferId(offerId);
        return ordreMission.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/offer/{offerId}/ordre-mission/download")
    public ResponseEntity<byte[]> downloadOrdreMission(@PathVariable Integer offerId) { // Change Long to Integer
        return ordreMissionService.downloadOrdreMission(offerId);
    }

    @GetMapping("/offer/{offerId}/ordre-mission/exists")
    public ResponseEntity<Boolean> checkOrdreMissionExists(@PathVariable Integer offerId) { // Change Long to Integer
        boolean exists = ordreMissionService.existsByOfferId(offerId);
        return ResponseEntity.ok(exists);
    }



    @PostMapping("/addCandidature")
    public Candidature addCandidature(@RequestBody Candidature candidature) { return candidatureService.addCandidature(candidature); }
    @PutMapping("/updateCandidature")
    public Candidature updateCandidature(@RequestBody Candidature candidature) { return candidatureService.updateCandidature(candidature);}
    @DeleteMapping("/deleteCandidature/{id}")
    public void deleteCandidature(@PathVariable("id") Integer id){ candidatureService.deleteCandidature(id); }
    @GetMapping("/candidatures")
    public List<Candidature> getAllCandidatures() { return candidatureService.getAllCandidatures(); }
    @GetMapping("/retrieveCandidature/{id}")
    public Candidature getCandidatureById(@PathVariable("id") Integer id) { return candidatureService.getCandidatureById(id); }
    @GetMapping("/user/{userId}/candidatures")
    public List<Candidature> getCandidaturesByUser(@PathVariable("userId") Long userId) {
        return candidatureService.getCandidaturesByUserId(userId);
    }
    @GetMapping("/with-candidatures/user/{userId}")
    public List<Offre> getOffresWithCandidaturesByUser(@PathVariable("userId") Long userId) {
        return offreService.getOffresWithCandidaturesByUser(userId);
    }
    @PostMapping(value = "/{id}/files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadFiles(
            @PathVariable Integer id,
            @RequestParam("cv") MultipartFile cvFile,
            @RequestParam(value = "lettreMotivation", required = false) MultipartFile lettreMotivationFile,
            @RequestParam(value = "autreDocs", required = false) MultipartFile autreDocsFile) throws IOException {

        candidatureService.addFilesToCandidature(id, cvFile, lettreMotivationFile, autreDocsFile);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/update-scores")
    public ResponseEntity<Void> updateScores(@RequestBody List<ScoreUpdateDto> updates) {
        System.out.println("Received updates: " + updates); // Debug log
        candidatureService.updateScores(updates);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/all")
    public ResponseEntity<Void> deleteAllUserCandidatures(@PathVariable Long userId) {
        candidatureService.deleteAllUserCandidatures(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{userId}/confirm/{candidatureId}")
    public ResponseEntity<Void> confirmSingleCandidature(
            @PathVariable Long userId,
            @PathVariable Integer candidatureId) {
        candidatureService.confirmSingleCandidature(userId, candidatureId);
        return ResponseEntity.ok().build();
    }




    @PostMapping("/candidature/{candidatureId}/create-admin-file")
    public ResponseEntity<AdministrativeFile> createAdminFileForCandidature(@PathVariable Integer candidatureId) {
        // 1. Get the candidature by its ID
        Candidature candidature = candidatureService.getCandidatureById(candidatureId);
        // 2. Create the administrative file for this candidature
        AdministrativeFile newFile = administrativeFileService.createAdministrativeFile(candidature);
        return ResponseEntity.ok(newFile);
    }

    @GetMapping("/candidature/{candidatureId}/admin-file")
    public ResponseEntity<AdministrativeFile> getAdminFileForCandidature(@PathVariable Integer candidatureId) {
        Candidature candidature = candidatureService.getCandidatureById(candidatureId);
        Optional<AdministrativeFile> file = administrativeFileService.getByCandidature(candidature);
        return file.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/admin-file/{fileId}/payment-method")
    public ResponseEntity<AdministrativeFile> updatePaymentMethod(
            @PathVariable Integer fileId,
            @RequestParam PaymentMethod paymentMethod) {
        AdministrativeFile updatedFile = administrativeFileService.updatePaymentMethod(fileId, paymentMethod);
        return ResponseEntity.ok(updatedFile);
    }

    @PostMapping(value = "/admin-file/{fileId}/upload-receipt", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdministrativeFile> uploadPaymentReceipt(
            @PathVariable Integer fileId,
            @RequestParam("receipt") MultipartFile receiptFile) throws IOException {
        AdministrativeFile updatedFile = administrativeFileService.uploadPaymentReceipt(fileId, receiptFile);
        return ResponseEntity.ok(updatedFile);
    }

    @PostMapping(value = "/admin-file/{fileId}/upload-cheques", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdministrativeFile> uploadCheques(
            @PathVariable Integer fileId,
            @RequestParam("cheques") MultipartFile chequesFile) throws IOException {
        AdministrativeFile updatedFile = administrativeFileService.uploadCheques(fileId, chequesFile);
        return ResponseEntity.ok(updatedFile);
    }

    @GetMapping("/user/{userId}/admin-files")
    public ResponseEntity<List<AdministrativeFile>> getUserAdminFiles(@PathVariable Long userId) {
        // You'll need to implement this method in your service
        // It should get all admin files for a user's candidatures
        List<AdministrativeFile> files = administrativeFileService.getAdminFilesByUserId(userId);
        return ResponseEntity.ok(files);
    }

    @PatchMapping("/admin-file/{fileId}/status")
    public ResponseEntity<AdministrativeFile> updateFileStatus(
            @PathVariable Integer fileId,
            @RequestParam FileStatus newStatus) {
        // You'll need to implement this status update method in your service
        AdministrativeFile updatedFile = administrativeFileService.updateStatus(fileId, newStatus);
        return ResponseEntity.ok(updatedFile);
    }

    @PostMapping("/candidature/{candidatureId}/create-acceptance-proof")
    public ResponseEntity<AcceptanceProof> createAcceptanceProofForCandidature(@PathVariable Integer candidatureId) {
        Candidature candidature = candidatureService.getCandidatureById(candidatureId);
        AcceptanceProof newProof = acceptanceProofService.createAcceptanceProof(candidature);
        return ResponseEntity.ok(newProof);
    }

    @GetMapping("/candidature/{candidatureId}/acceptance-proof")
    public ResponseEntity<AcceptanceProof> getAcceptanceProofForCandidature(@PathVariable Integer candidatureId) {
        Candidature candidature = candidatureService.getCandidatureById(candidatureId);
        Optional<AcceptanceProof> proof = acceptanceProofService.getByCandidature(candidature);
        return proof.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/acceptance-proof/{proofId}/upload-document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AcceptanceProof> uploadAcceptanceDocument(
            @PathVariable Integer proofId,
            @RequestParam("document") MultipartFile documentFile) throws IOException {
        AcceptanceProof updatedProof = acceptanceProofService.uploadAcceptanceDocument(proofId, documentFile);
        return ResponseEntity.ok(updatedProof);
    }

    @GetMapping("/user/{userId}/acceptance-proofs")
    public ResponseEntity<List<AcceptanceProof>> getUserAcceptanceProofs(@PathVariable Long userId) {
        List<AcceptanceProof> proofs = acceptanceProofService.getProofsByUserId(userId);
        return ResponseEntity.ok(proofs);
    }

    @PatchMapping("/acceptance-proof/{proofId}/status")
    public ResponseEntity<AcceptanceProof> updateProofStatus(
            @PathVariable Integer proofId,
            @RequestParam ProofStatus newStatus) {
        AcceptanceProof updatedProof = acceptanceProofService.updateStatus(proofId, newStatus);
        return ResponseEntity.ok(updatedProof);
    }

    @GetMapping("/admin-files")
    public ResponseEntity<List<AdministrativeFile>> getAllAdminFiles() {
        List<AdministrativeFile> files = administrativeFileService.getAllAdminFiles();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/admin-file/{fileId}/download-receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Integer fileId) {
        AdministrativeFile file = administrativeFileService.getById(fileId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getPaymentReceiptFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file.getPaymentReceiptData());
    }

    @GetMapping("/admin-file/{fileId}/download-cheques")
    public ResponseEntity<byte[]> downloadCheques(@PathVariable Integer fileId) {
        AdministrativeFile file = administrativeFileService.getById(fileId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getChequesFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file.getChequesData());
    }


    // Get ALL acceptance proofs (for admin dashboard)
    @GetMapping("/acceptance-proofs")
    public ResponseEntity<List<AcceptanceProof>> getAllAcceptanceProofs() {
        List<AcceptanceProof> proofs = acceptanceProofService.getAllAdminProofs();
        return ResponseEntity.ok(proofs);
    }

    // Download acceptance document
    @GetMapping("/acceptance-proof/{proofId}/download-document")
    public ResponseEntity<byte[]> downloadAcceptanceDocument(@PathVariable Integer proofId) {
        AcceptanceProof proof = acceptanceProofService.getById(proofId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + proof.getDocumentFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(proof.getAcceptanceDocumentData());
    }

    // Mobility Process Endpoints
    @PostMapping("/candidature/{candidatureId}/create-mobility-process")
    public ResponseEntity<MobilityProcess> createMobilityProcess(@PathVariable Integer candidatureId) {
        MobilityProcess newProcess = mobilityProcessService.createMobilityProcess(candidatureId);
        return ResponseEntity.ok(newProcess);
    }

    @GetMapping("/user/{userId}/has-mobility-access")
    public ResponseEntity<Boolean> checkStudentAccess(@PathVariable Long userId) {
        boolean hasAccess = mobilityProcessService.checkStudentAccess(userId);
        return ResponseEntity.ok(hasAccess);
    }

    @GetMapping("/candidature/{candidatureId}/mobility-process")
    public ResponseEntity<MobilityProcess> getMobilityProcessByCandidature(@PathVariable Integer candidatureId) {
        Optional<MobilityProcess> process = mobilityProcessService.getByCandidatureId(candidatureId);
        return process.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}/mobility-process")
    public ResponseEntity<MobilityProcess> getMobilityProcessByUserId(@PathVariable Long userId) {
        // Get all user's candidatures
        List<Candidature> userCandidatures = candidatureService.getCandidaturesByUserId(userId);

        // Check if any candidature has a mobility process
        for (Candidature candidature : userCandidatures) {
            Optional<MobilityProcess> process = mobilityProcessService.getByCandidatureId(candidature.getId());
            if (process.isPresent()) {
                return ResponseEntity.ok(process.get()); // .get() to extract from Optional
            }
        }

        return ResponseEntity.notFound().build();
    }


    // Feedback Endpoints
    @PostMapping("/offer/{offerId}/feedback")
    public ResponseEntity<Feedback> submitFeedback(
            @PathVariable Integer offerId,
            @RequestBody Feedback feedback,
            @RequestParam Integer studentId) {

        Feedback savedFeedback = feedbackService.submitFeedback(feedback, studentId, offerId);
        return ResponseEntity.ok(savedFeedback);
    }

    @GetMapping("/offer/{offerId}/feedbacks")
    public ResponseEntity<List<Feedback>> getOfferFeedbacks(@PathVariable Integer offerId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByOffer(offerId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/student/{studentId}/feedbacks")
    public ResponseEntity<List<Feedback>> getStudentFeedbacks(@PathVariable Integer studentId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByStudent(studentId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/offer/{offerId}/feedback/student/{studentId}")
    public ResponseEntity<Feedback> getStudentFeedbackForOffer(
            @PathVariable Integer offerId,
            @PathVariable Integer studentId) {

        Optional<Feedback> feedback = feedbackService.getFeedbackByStudentAndOffer(studentId, offerId);
        return feedback.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/offer/{offerId}/feedback/student/{studentId}/exists")
    public ResponseEntity<Boolean> hasStudentSubmittedFeedback(
            @PathVariable Integer offerId,
            @PathVariable Integer studentId) {

        boolean exists = feedbackService.hasStudentSubmittedFeedback(studentId, offerId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/offer/{offerId}/feedback/statistics")
    public ResponseEntity<java.util.Map<String, Object>> getFeedbackStatistics(@PathVariable Integer offerId) {
        java.util.Map<String, Object> statistics = feedbackService.getFeedbackStatistics(offerId);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/offer/{offerId}/feedback/averages")
    public ResponseEntity<java.util.Map<String, Double>> getAverageRatings(@PathVariable Integer offerId) {
        java.util.Map<String, Double> averages = feedbackService.getAverageRatingsByOffer(offerId);
        return ResponseEntity.ok(averages);
    }

    @GetMapping("/feedbacks")
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedbacks);
    }

    // Get overall statistics across ALL feedback (for admin dashboard)
    @GetMapping("/statistics/overall")
    public ResponseEntity<java.util.Map<String, Object>> getOverallFeedbackStatistics() {
        java.util.Map<String, Object> statistics = feedbackService.getOverallFeedbackStatistics();
        return ResponseEntity.ok(statistics);
    }

    // Get statistics for ALL offers (for comparison charts)
    @GetMapping("/statistics/all-offers")
    public ResponseEntity<java.util.Map<Integer, java.util.Map<String, Object>>> getStatisticsForAllOffers() {
        java.util.Map<Integer, java.util.Map<String, Object>> statistics = feedbackService.getStatisticsForAllOffers();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/feedback/all-with-relationships")
    public ResponseEntity<List<Feedback>> getAllFeedbacksWithRelationships(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Feedback> feedbacks = feedbackService.getAllFeedbacksWithRelationships(page, size);
        return ResponseEntity.ok(feedbacks);
    }

    // Student submits a reclamation
    @PostMapping("/student/{studentId}")
    public ResponseEntity<Reclamation> submitReclamation(
            @PathVariable Integer studentId,
            @RequestBody Reclamation reclamation) {
        Reclamation savedReclamation = reclamationService.submitReclamation(reclamation, studentId);
        return ResponseEntity.ok(savedReclamation);
    }

    // Get student's reclamations
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Reclamation>> getStudentReclamations(@PathVariable Integer studentId) {
        List<Reclamation> reclamations = reclamationService.getStudentReclamations(studentId);
        return ResponseEntity.ok(reclamations);
    }

    // Admin gets unresolved reclamations
    @GetMapping("/admin/unresolved")
    public ResponseEntity<List<Reclamation>> getUnresolvedReclamations() {
        List<Reclamation> reclamations = reclamationService.getUnresolvedReclamations();
        return ResponseEntity.ok(reclamations);
    }

    // Admin gets resolved reclamations
    @GetMapping("/admin/resolved")
    public ResponseEntity<List<Reclamation>> getResolvedReclamations() {
        List<Reclamation> reclamations = reclamationService.getResolvedReclamations();
        return ResponseEntity.ok(reclamations);
    }

    // Admin responds to a reclamation
    @PostMapping("/admin/{reclamationId}/respond")
    public ResponseEntity<Reclamation> respondToReclamation(
            @PathVariable Long reclamationId,
            @RequestParam String response) {
        Reclamation updatedReclamation = reclamationService.respondToReclamation(reclamationId, response);
        return ResponseEntity.ok(updatedReclamation);
    }

    // Get count of unresolved reclamations (for admin dashboard)
    @GetMapping("/admin/unresolved-count")
    public ResponseEntity<Long> getUnresolvedCount() {
        Long count = reclamationService.getUnresolvedCount();
        return ResponseEntity.ok(count);
    }

    // Student submits exam choice
    @PostMapping("/equivalence/choice/student/{studentId}/offer/{offerId}")
    public ResponseEntity<ExamChoice> submitExamChoice(
            @PathVariable Integer studentId,
            @PathVariable Integer offerId,
            @RequestBody ExamChoice examChoice) {
        ExamChoice savedChoice = equivalenceService.submitExamChoice(examChoice, studentId, offerId);
        return ResponseEntity.ok(savedChoice);
    }

    // Get student's exam choices
    @GetMapping("/equivalence/choice/student/{studentId}")
    public ResponseEntity<List<ExamChoice>> getStudentExamChoices(@PathVariable Integer studentId) {
        List<ExamChoice> choices = equivalenceService.getStudentExamChoices(studentId);
        return ResponseEntity.ok(choices);
    }

    // Get exam choices for an offer (admin view)
    @GetMapping("/equivalence/choice/offer/{offerId}")
    public ResponseEntity<List<ExamChoice>> getOfferExamChoices(@PathVariable Integer offerId) {
        List<ExamChoice> choices = equivalenceService.getOfferExamChoices(offerId);
        return ResponseEntity.ok(choices);
    }

    // Get student's specific choice for an offer
    @GetMapping("/equivalence/choice/student/{studentId}/offer/{offerId}")
    public ResponseEntity<ExamChoice> getStudentExamChoiceForOffer(
            @PathVariable Integer studentId,
            @PathVariable Integer offerId) {
        ExamChoice choice = equivalenceService.getStudentExamChoiceForOffer(studentId, offerId);
        return choice != null ? ResponseEntity.ok(choice) : ResponseEntity.notFound().build();
    }

    // Check if student already submitted choice for an offer
    @GetMapping("/equivalence/choice/student/{studentId}/offer/{offerId}/exists")
    public ResponseEntity<Boolean> hasStudentSubmittedChoice(
            @PathVariable Integer studentId,
            @PathVariable Integer offerId) {
        boolean exists = equivalenceService.hasStudentSubmittedChoice(studentId, offerId);
        return ResponseEntity.ok(exists);
    }

    // Keep the original admin upload method (without student)
    @PostMapping(value = "/document/admin/offer/{offerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EquivalenceDocument> uploadAdminDocument(
            @PathVariable Integer offerId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("originalFileName") String originalFileName) {

        EquivalenceDocument document = equivalenceService.uploadDocument(file, offerId, originalFileName, DocumentType.ADMIN_EQUIVALENCE_GRID, null);
        return ResponseEntity.ok(document);
    }

    // Add new student transcript upload method
    @PostMapping(value = "/equivalence/document/student/{studentId}/offer/{offerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EquivalenceDocument> uploadStudentDocument(
            @PathVariable Integer studentId,
            @PathVariable Integer offerId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("originalFileName") String originalFileName) {

        EquivalenceDocument document = equivalenceService.uploadStudentTranscript(file, studentId, offerId, originalFileName);
        return ResponseEntity.ok(document);
    }

    // Get documents for an offer
    @GetMapping("/equivalence/document/offer/{offerId}")
    public ResponseEntity<List<EquivalenceDocument>> getDocumentsByOffer(@PathVariable Integer offerId) {
        List<EquivalenceDocument> documents = equivalenceService.getDocumentsByOffer(offerId);
        return ResponseEntity.ok(documents);
    }

    // Download a document
    @GetMapping("/equivalence/document/{documentId}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long documentId) {
        byte[] fileContent = equivalenceService.downloadDocument(documentId);
        EquivalenceDocument document = equivalenceService.getDocumentById(documentId); // You'll need to add this method

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", document.getOriginalFileName());

        return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
    }

    // Delete a document
    @DeleteMapping("/equivalence/document/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId) {
        equivalenceService.deleteDocument(documentId);
        return ResponseEntity.noContent().build();
    }

    // Get all exam choices (for admin view)
    @GetMapping("/equivalence/choice/all")
    public ResponseEntity<List<ExamChoice>> getAllExamChoices() {
        List<ExamChoice> choices = equivalenceService.getAllExamChoices();
        return ResponseEntity.ok(choices);
    }


    // Student uploads grade transcript
    @PostMapping(value = "/student/{studentId}/offer/{offerId}/transcript", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EquivalenceDocument> uploadStudentTranscript(
            @PathVariable Integer studentId,
            @PathVariable Integer offerId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("originalFileName") String originalFileName) {
        EquivalenceDocument document = equivalenceService.uploadStudentTranscript(file, studentId, offerId, originalFileName);
        return ResponseEntity.ok(document);
    }

    // Get student's transcripts
    @GetMapping("/student/{studentId}/transcripts")
    public ResponseEntity<List<EquivalenceDocument>> getStudentTranscripts(@PathVariable Integer studentId) {
        List<EquivalenceDocument> transcripts = equivalenceService.getStudentTranscripts(studentId);
        return ResponseEntity.ok(transcripts);
    }

    // Admin gets all student transcripts
    @GetMapping("/equivalence/admin/transcripts")
    public ResponseEntity<List<EquivalenceDocument>> getAllStudentTranscripts() {
        List<EquivalenceDocument> transcripts = equivalenceService.getAllStudentTranscripts();
        return ResponseEntity.ok(transcripts);
    }

    // Get transcripts for a specific offer
    @GetMapping("/admin/offer/{offerId}/transcripts")
    public ResponseEntity<List<EquivalenceDocument>> getStudentTranscriptsByOffer(@PathVariable Integer offerId) {
        List<EquivalenceDocument> transcripts = equivalenceService.getStudentTranscriptsByOffer(offerId);
        return ResponseEntity.ok(transcripts);
    }

    // Student creates extension request
    @PostMapping(value = "/extension-requests/student/{studentId}", consumes = {"multipart/form-data"})
    public ResponseEntity<ExtensionRequest> createExtensionRequest(
            @PathVariable Integer studentId,
            @RequestPart ExtensionRequest request,
            @RequestPart(required = false) MultipartFile file) {

        ExtensionRequest createdRequest = extensionRequestService.createExtensionRequest(request, studentId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
    }

    // Get student's extension requests
    @GetMapping("/extension-requests/student/{studentId}")
    public ResponseEntity<List<ExtensionRequest>> getStudentExtensionRequests(@PathVariable Integer studentId) {
        List<ExtensionRequest> requests = extensionRequestService.getStudentExtensionRequests(studentId);
        return ResponseEntity.ok(requests);
    }

    // Admin gets all extension requests
    @GetMapping("/extension-requests/admin/all")
    public ResponseEntity<List<ExtensionRequest>> getAllExtensionRequests() {
        List<ExtensionRequest> requests = extensionRequestService.getAllExtensionRequests();
        return ResponseEntity.ok(requests);
    }

    // Get requests by status
    @GetMapping("/extension-requests/admin/status/{status}")
    public ResponseEntity<List<ExtensionRequest>> getExtensionRequestsByStatus(@PathVariable ExtensionStatus status) {
        List<ExtensionRequest> requests = extensionRequestService.getExtensionRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }

    // Get single request
    @GetMapping("/extension-requests/{requestId}")
    public ResponseEntity<ExtensionRequest> getExtensionRequestById(@PathVariable Long requestId) {
        ExtensionRequest request = extensionRequestService.getExtensionRequestById(requestId);
        return ResponseEntity.ok(request);
    }

    // Admin updates request status
    @PatchMapping("/extension-requests/admin/{requestId}/status")
    public ResponseEntity<ExtensionRequest> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam ExtensionStatus status,
            @RequestParam(required = false) String adminResponse) {

        ExtensionRequest updatedRequest = extensionRequestService.updateRequestStatus(requestId, status, adminResponse);
        return ResponseEntity.ok(updatedRequest);
    }

    // Download attached file
    @GetMapping("/extension-requests/{requestId}/download")
    public ResponseEntity<byte[]> downloadRequestFile(@PathVariable Long requestId) {
        byte[] fileContent = extensionRequestService.downloadRequestFile(requestId);
        ExtensionRequest request = extensionRequestService.getExtensionRequestById(requestId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", request.getOriginalFileName());

        return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
    }

    // Delete extension request
    @DeleteMapping("/extension-requests/{requestId}")
    public ResponseEntity<Void> deleteExtensionRequest(@PathVariable Long requestId) {
        extensionRequestService.deleteExtensionRequest(requestId);
        return ResponseEntity.noContent().build();
    }















































}
