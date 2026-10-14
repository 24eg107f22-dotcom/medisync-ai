package com.medisync.medisync_ai.controller;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MediSyncApiController {

    @Autowired(required = false)
    private ChatModel chatModel;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new Date());
        response.put("service", "MediSync AI Healthcare Backend");
        response.put("aiConfigured", isAiConfigured());
        return ResponseEntity.ok(response);
    }

    private boolean isAiConfigured() {
        return chatModel != null || (geminiApiKey != null && !geminiApiKey.isEmpty() && !geminiApiKey.contains("YOUR_GEMINI_API_KEY"));
    }

    @PostMapping("/ai/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
        String userMessage = (String) request.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
        }

        // 1. Try Spring AI ChatModel
        if (chatModel != null) {
            try {
                String aiResponse = chatModel.call(userMessage);
                return ResponseEntity.ok(Map.of("reply", aiResponse));
            } catch (Exception e) {
                // fall through to REST attempt
            }
        }

        // 2. Direct Gemini REST API call if API key provided
        if (geminiApiKey != null && !geminiApiKey.isEmpty() && !geminiApiKey.contains("YOUR_GEMINI_API_KEY")) {
            try {
                String endpoint = geminiApiUrl + (geminiApiUrl.contains("?") ? "&" : "?") + "key=" + geminiApiKey;

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("x-goog-api-key", geminiApiKey);

                Map<String, Object> part = Map.of("text", userMessage);
                Map<String, Object> content = Map.of("parts", List.of(part));
                Map<String, Object> body = Map.of("contents", List.of(content));

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
                ResponseEntity<Map> apiResponse = restTemplate.postForEntity(endpoint, entity, Map.class);

                if (apiResponse.getStatusCode().is2xxSuccessful() && apiResponse.getBody() != null) {
                    List candidates = (List) apiResponse.getBody().get("candidates");
                    if (candidates != null && !candidates.isEmpty()) {
                        Map firstCandidate = (Map) candidates.get(0);
                        Map contentMap = (Map) firstCandidate.get("content");
                        if (contentMap != null) {
                            List parts = (List) contentMap.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                Map firstPart = (Map) parts.get(0);
                                String replyText = (String) firstPart.get("text");
                                return ResponseEntity.ok(Map.of("reply", replyText));
                            }
                        }
                    }
                }
            } catch (Exception e) {
                return ResponseEntity.ok(Map.of("reply", "Gemini API Note: " + e.getMessage()));
            }
        }

        // Fallback message when API key is still the placeholder
        return ResponseEntity.ok(Map.of(
            "reply", 
            "MediSync Backend received your message: \"" + userMessage + "\". Add your real Gemini API key in application.properties under gemini.api.key to get live AI responses."
        ));
    }

    @PostMapping("/ai/analyze-symptoms")
    public ResponseEntity<Map<String, Object>> analyzeSymptoms(@RequestBody Map<String, Object> request) {
        String symptoms = (String) request.get("symptoms");
        String duration = (String) request.getOrDefault("duration", "1-2 days");
        String severity = (String) request.getOrDefault("severity", "Moderate");

        boolean isUrgent = symptoms != null && (
            symptoms.toLowerCase().contains("chest") ||
            symptoms.toLowerCase().contains("breath") ||
            symptoms.toLowerCase().contains("faint") ||
            "High".equalsIgnoreCase(severity)
        );

        Map<String, Object> triageReport = new HashMap<>();
        triageReport.put("triageId", "TRG-" + (10000 + new Random().nextInt(90000)));
        triageReport.put("timestamp", new Date());
        triageReport.put("symptomsReported", symptoms);
        triageReport.put("duration", duration);
        triageReport.put("urgencyLevel", isUrgent ? "High / Urgent Evaluation Recommended" : "Moderate / Schedule Routine Consultation");
        triageReport.put("urgencyColor", isUrgent ? "rose" : "amber");
        triageReport.put("probableConsiderations", isUrgent 
            ? List.of("Cardiovascular strain / angina", "Acute bronchial exacerbation", "Costochondritis")
            : List.of("Viral upper respiratory tract infection", "Tension fatigue or dehydration", "Mild seasonal allergic rhinitis")
        );
        triageReport.put("clinicalNextSteps", List.of(
            "Review vitals trends (SpO2 & Resting Pulse)",
            "Hydrate with electrolyte balance",
            "Avoid unverified over-the-counter NSAIDs due to allergy/asthma profile",
            isUrgent ? "Seek immediate urgent clinic evaluation if discomfort persists" : "Monitor symptoms for next 24-48 hours"
        ));
        triageReport.put("recommendedSpecialist", isUrgent ? "Cardiologist or Emergency Medicine" : "General Internal Physician");
        triageReport.put("suggestedQuestionsForDoctor", List.of(
            "Could these symptoms be linked to my existing asthma profile?",
            "Are any diagnostic lab panels or imaging indicated?",
            "What trigger warning signs should prompt immediate emergency visit?"
        ));

        return ResponseEntity.ok(triageReport);
    }
}
