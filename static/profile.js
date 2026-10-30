document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profileForm");
    const reviewModal = document.getElementById("reviewModal");
    const reviewContent = document.getElementById("reviewContent");
    const editBtn = document.getElementById("editBtn");
    const confirmBtn = document.getElementById("confirmBtn");

    if (!profileForm) return;

    // 1. Intercept the submit event
    profileForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Stop default immediate submission

        // 2. Validate whole form using native rules
        if (!profileForm.reportValidity()) {
            return; // Stops execution if invalid data exists
        }

        // 3. Build Read-Only Summary
        const formData = new FormData(profileForm);
        let summaryHTML = "<div class='review-grid'>";

        // Standard Text & Choice Inputs
        const labelMap = {
            student_id: "Student ID",
            fullname: "Full Name",
            email: "USEK Email",
            phone: "Mobile Number",
            birthdate: "Date of Birth",
            portfolio: "GitHub Portfolio",
            gin446: "GIN446 Website",
            major: "Engineering Major",
            gpa: "Current GPA",
            credits: "Credits Completed",
            graduation: "Expected Graduation",
            graduation_month: "Graduation Month/Year",
            internship_completed: "Internship Completed",
            language: "Primary Language",
            project_title: "Project Title",
            project_area: "Project Area",
            description: "Project Description",
            team_size: "Preferred Team Size",
            project_color: "Dashboard Color",
            meeting_date: "Preferred Meeting Date",
            meeting_time: "Preferred Meeting Time"
        };

        for (const [key, label] of Object.entries(labelMap)) {
            const val = formData.get(key);
            if (val) {
                summaryHTML += `
                    <div class="review-item">
                        <strong>${label}:</strong> 
                        <span>${escapeHTML(val)}</span>
                    </div>`;
            }
        }

        // Handle multi-value checkboxes (Skills)
        const selectedSkills = formData.getAll("skills");
        if (selectedSkills.length > 0) {
            summaryHTML += `
                <div class="review-item full-width">
                    <strong>Areas of Experience:</strong> 
                    <span>${selectedSkills.map(escapeHTML).join(", ")}</span>
                </div>`;
        }

        // Handle multi-select options (Software)
        const selectedSoftware = formData.getAll("software");
        if (selectedSoftware.length > 0) {
            summaryHTML += `
                <div class="review-item full-width">
                    <strong>Engineering Software:</strong> 
                    <span>${selectedSoftware.map(escapeHTML).join(", ")}</span>
                </div>`;
        }

        summaryHTML += "</div>";

        // Render data and display panel
        reviewContent.innerHTML = summaryHTML;
        reviewModal.style.display = "flex";
    });

    // 4. Edit Button: Return to form without page reload or loss of data
    editBtn.addEventListener("click", function () {
        reviewModal.style.display = "none";
    });

    // 5. Confirm & Submit: Programmatically submit form without looping
    confirmBtn.addEventListener("click", function () {
        profileForm.submit(); // Direct HTMLFormElement.prototype.submit() avoids re-triggering 'submit' event
    });

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }
});