import {
  __name
} from "../chunk-Y5CWL2B3.js";

// js/feedback.ts
var lastFeedbackItemId = null;
var feedbackYes = document.getElementById("feedback-yes");
var feedbackNo = document.getElementById("feedback-no");
var feedbackForm = document.getElementById("feedback-form");
var feedbackSection = document.getElementById("feedback-section");
feedbackYes?.addEventListener("click", () => {
  sendFeedback({
    sentiment: "yes"
  });
});
feedbackNo?.addEventListener("click", () => {
  sendFeedback({
    sentiment: "no"
  });
});
feedbackForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(feedbackForm);
  const form = Object.fromEntries(formData.entries());
  sendFeedback({
    sentiment: form["feedback-vote"],
    comment: form["feedback-comment"],
    contact: form["feedback-contact"]
  });
  if (feedbackSection) {
    feedbackSection.innerHTML = "<p>Thank you for helping make the Deno docs awesome!</p>";
  }
});
async function sendFeedback(feedback) {
  feedback.path = feedback.path || new URL(window.location.href).pathname;
  feedback.id = lastFeedbackItemId ? lastFeedbackItemId : null;
  const result = await fetch("/_api/send-feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(feedback)
  });
  const responseBody = await result.json();
  lastFeedbackItemId = responseBody.id;
  if (!result.ok) {
    console.error("Failed to send feedback", responseBody);
  }
}
__name(sendFeedback, "sendFeedback");
