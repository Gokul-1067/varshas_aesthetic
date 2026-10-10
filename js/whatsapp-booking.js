/**
 * DR. VARSHA'S AYURVEDIC TREATMENT CENTER
 * WhatsApp Direct Dispatch & Consultation Modal System
 */

const CLINIC_WHATSAPP = "917012135309";
const CLINIC_PHONE_DISPLAY = "+91 7012135309";
const CLINIC_EMAIL = "drvarshasayurveda@gmail.com";

let lastFocusedElement = null;

/**
 * Open the Consultation / "Start Your Ayurvedic Care" Modal
 * @param {Object} options Optional pre-filled data
 */
function openBookingModal(options = {}) {
  const modal = document.getElementById("consultationModal");
  if (!modal) return;

  lastFocusedElement = document.activeElement;

  // Pre-fill or select fields if provided
  if (options.treatment) {
    const concernInput = document.getElementById("modalConcern");
    if (concernInput) concernInput.value = `Enquiry about ${options.treatment}`;
  }
  if (options.branch) {
    const branchSelect = document.getElementById("modalBranch");
    if (branchSelect) branchSelect.value = options.branch;
  }
  if (options.mode) {
    const modeSelect = document.getElementById("modalMode");
    if (modeSelect) modeSelect.value = options.mode;
  }

  modal.classList.add("is-active");
  document.body.style.overflow = "hidden"; // Prevent background scrolling

  // Focus the first form input
  setTimeout(() => {
    const firstInput = modal.querySelector("input, select, textarea");
    if (firstInput) firstInput.focus();
  }, 100);
}

/**
 * Close the Consultation Modal
 */
function closeBookingModal() {
  const modal = document.getElementById("consultationModal");
  if (!modal) return;

  modal.classList.remove("is-active");
  document.body.style.overflow = "";

  // Reset errors
  const errorGroups = modal.querySelectorAll(".has-error");
  errorGroups.forEach(group => group.classList.remove("has-error"));

  // Restore previous focus
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

/**
 * Handle Booking Form Submission & WhatsApp URL Dispatch
 * @param {Event} e 
 */
function handleBookingSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById("modalName");
  const phoneInput = document.getElementById("modalPhone");
  const branchSelect = document.getElementById("modalBranch");
  const concernInput = document.getElementById("modalConcern");
  const timingInput = document.getElementById("modalTiming");

  let isValid = true;

  // Validate Name
  if (!nameInput.value.trim()) {
    setError(nameInput, "Please provide your full name");
    isValid = false;
  } else {
    clearError(nameInput);
  }

  // Validate Phone
  const phoneRegex = /^[0-9+\s-]{8,15}$/;
  if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
    setError(phoneInput, "Please enter a valid 10-digit contact number");
    isValid = false;
  } else {
    clearError(phoneInput);
  }

  // Validate Branch
  if (!branchSelect.value) {
    setError(branchSelect, "Please select your preferred clinic or online consultation");
    isValid = false;
  } else {
    clearError(branchSelect);
  }

  if (!isValid) return;

  // Construct message
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const branch = branchSelect.options[branchSelect.selectedIndex].text;
  const concern = concernInput.value.trim() || "General Ayurvedic Consultation";
  const timing = timingInput ? timingInput.value.trim() : "Earliest Available";

  const messageText = 
`Namaste Dr. Varsha's Ayurvedic Treatment Center,

I would like to request an Ayurvedic consultation.

• Name: ${name}
• Phone / WhatsApp: ${phone}
• Consultation Preference: ${branch}
• Health Concern / Plan: ${concern}
• Preferred Timing: ${timing || "Earliest available slot"}

Please let me know doctor's availability and appointment confirmation steps.`;

  const waUrl = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(messageText)}`;

  // Provide immediate client-side visual feedback
  const submitBtn = e.target.querySelector("button[type='submit']");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span>Opening WhatsApp...</span>`;
  submitBtn.disabled = true;

  setTimeout(() => {
    window.open(waUrl, "_blank", "noopener,noreferrer");
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    closeBookingModal();
  }, 400);
}

function setError(inputElement, message) {
  const group = inputElement.closest(".form-group");
  if (group) {
    group.classList.add("has-error");
    const errorEl = group.querySelector(".form-error");
    if (errorEl) errorEl.textContent = message;
  }
}

function clearError(inputElement) {
  const group = inputElement.closest(".form-group");
  if (group) {
    group.classList.remove("has-error");
  }
}

/**
 * Direct WhatsApp Helper for Treatment Card Enquiry
 * @param {string} treatmentTitle 
 * @param {string} branchNote 
 */
function enquireTreatmentWhatsApp(treatmentTitle, branchNote = "Thodiyoor / Mynagappally") {
  const message = 
`Namaste Dr. Varsha's Ayurvedic Treatment Center,

I would like to enquire about the "${treatmentTitle}" treatment plan.

• Branch Note: ${branchNote}
• Please share appointment availability, procedure schedule, and indicative fees.

Thank you!`;

  const url = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Direct WhatsApp Helper for Thodiyoor Accommodation Enquiry
 */
function enquireAccommodationWhatsApp() {
  const message = 
`Namaste Dr. Varsha's Ayurvedic Treatment Center,

I am interested in Inpatient Accommodation & Residential Ayurvedic Treatment at your Thodiyoor main branch.

Could you please share details regarding room availability, doctor-monitored dietary plans, and residential Panchakarma packages?

Thank you!`;

  const url = `https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Global Event Listeners for Modal controls
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("consultationModal");
  if (!modal) return;

  // Close on Backdrop Click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeBookingModal();
    }
  });

  // Close on Escape Key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeBookingModal();
    }
  });

  // Hook form submit
  const form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", handleBookingSubmit);
  }

  // Support direct URL parameter trigger (e.g., index.html?consultation=open)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("consultation") === "open" || window.location.hash === "#bookConsultation") {
    const treatment = urlParams.get("treatment");
    const branch = urlParams.get("branch");
    const mode = urlParams.get("mode");
    setTimeout(() => {
      openBookingModal({ treatment, branch, mode });
    }, 150);
  }
});
