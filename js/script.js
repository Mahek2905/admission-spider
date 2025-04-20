const baseURL = "https://sgh-api.onrender.com/api/announcements/admission-dates?randomize=true&limit=50";
const clgBody = document.querySelector(".clg-list");
// const container = document.querySelector(".container");

// Fetch Data
const getData = async () => {
    try {
        const response = await fetch(baseURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        updateList(data);
    } catch (error) {
        document.querySelector("main").innerHTML = `<p id="loading-failed">Failed to load Data...Please try again later.</p>`;
        document.querySelector("#loading-failed").style.marginTop = "5rem";
        console.error("Error fetching data: ", error);
    }
}
getData();

const updateList = (data) => {
    clgBody.innerHTML = '';

    data.forEach((item) => {
        item.programs.forEach((program) => {
            const template = document.querySelector("#date-card").content;
            const card = template.cloneNode(true);

            const programStrip = card.querySelector(".program-strip");
            programStrip.textContent = program.name;
            programStrip.style.backgroundColor = getDegreeColor(program.degree_level);

            const imgBox = card.querySelector(".img-box");
            imgBox.style.color = getDegreeColor(program.degree_level);
            imgBox.style.background = "#f1f5f9";

            const clgName = card.querySelector(".clg-name");
            clgName.textContent = item.institution.name;

            // const clgCourse = card.querySelector(".clg-course");
            // clgCourse.textContent = program.name;

            const clgDegree = card.querySelector(".layer1-right");
            clgDegree.textContent = program.degree_level;
            clgDegree.style.backgroundColor = getDegreeColor(program.degree_level);

            const deadline = card.querySelector(".deadline");
            if (item.application_deadline === null) {
                deadline.style.display = "none";
            } else {
                const deadlineDateStr = item.application_deadline;
                const today = new Date();
                const deadlineDate = deadlineDateStr ? new Date(deadlineDateStr) : null;
                const diffTime = deadlineDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if(diffDays > 0 && diffDays <= 15) {
                    deadline.innerHTML = `<i class='bx bx-calendar' ></i> Deadline: <p>${item.application_deadline} (Urgent)</p>`;
                    deadline.style.color = "#dc2626";
                    deadline.style.fontWeight = "500";
                } else if (diffDays < 0) {
                    deadline.innerHTML = `<i class='bx bx-calendar' ></i> Deadline: <p>${item.application_deadline} (Past Deadline)</p>`;
                }
                 else {
                    deadline.innerHTML = `<i class='bx bx-calendar' ></i> Deadline: <p>${item.application_deadline}</p>`;
                }
            }

            const state = card.querySelector(".state p");
            state.textContent = item.state.name;

            const infoIcon = card.querySelector(".announcement i")
            infoIcon.style.color = getDegreeColor(program.degree_level);

            const announcement = card.querySelector(".announcement-text");
            announcement.textContent = item.content;

            const viewDetails = card.querySelector(".view-details")
            viewDetails.style.color = getDegreeColor(program.degree_level);
            viewDetails.addEventListener("click", () => {
                const announcementId = item.announcement_id;
                window.location.href = `details.html?announcementId=${announcementId}`;
            });

            const clgWebsite = card.querySelector(".clg-website");
            clgWebsite.style.color = getDegreeColor(program.degree_level);
            clgWebsite.style.borderColor = getDegreeColor(program.degree_level);
            clgWebsite.addEventListener("click", () => {
                window.open(item.url);
            });

            clgBody.appendChild(card);
        });

    });
}

const getDegreeColor = (degree) => {
    switch (degree.toLowerCase()) {
        case "undergraduate":
            return " #059669"; //9b5cb2
        case "postgraduate":
            return " #8d51ff"; //d45875
        case "professional":
            return " #f6339b"; //4aa79c
        case "diploma":
            return "rgb(2, 174, 193)"; //d16aa7
        case "doctorate":
            return " #2b7efe"; //4fb97d
        default:
            return " #cc5c83"; //
    }
}

const handleNoDataBox = (visibleCount) => {
    let noDataBox = document.querySelector(".no-data-box");

    if (visibleCount === 0) {
        if (!noDataBox) {
            // Create the "No Data Found" box if it doesn't exist
            noDataBox = document.createElement("div");
            noDataBox.classList.add("no-data-box");

            const noDataTitle = document.createElement("p");
            noDataTitle.classList.add("no-data-title");
            noDataTitle.textContent = `No Results Found`;
            noDataBox.appendChild(noDataTitle);

            const noDataInfo = document.createElement("p");
            noDataInfo.classList.add("no-data-info");
            noDataInfo.textContent = `Try adjusting your search or filter criteria to find more results.`;
            noDataBox.appendChild(noDataInfo);

            document.querySelector(".container").appendChild(noDataBox);
        }
    } else {
        // Remove the "No Data Found" box if it exists and there are visible boxes
        if (noDataBox) {
            noDataBox.remove();
        }
    }
};

// Filter college list
function filterList() {
    const clgBoxes = document.querySelectorAll(".clg-box");
    const filterBox = document.querySelector(".filter-box");
    const searchQuery = document.querySelector(".input-box").value.toLowerCase();
    const selectedProgramFilters = Array.from(filterBox.querySelectorAll(".section1 input[type='checkbox']:checked")).map(
        (checkbox) => checkbox.parentElement.textContent.trim().toLowerCase()
    );
    const selectedDeadlineFilters = Array.from(filterBox.querySelectorAll(".section2 input[type='checkbox']:checked")).map(
        (checkbox) => checkbox.parentElement.textContent.trim().toLowerCase()
    );
    const fromDate = document.querySelector("#from-date").value;
    const toDate = document.querySelector("#to-date").value;

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const showUpcoming = selectedDeadlineFilters.includes("upcoming");
    const showThisMonth = selectedDeadlineFilters.includes("this month");
    const showNextMonth = selectedDeadlineFilters.includes("next month");
    const showPast = selectedDeadlineFilters.includes("past deadlines");

    let count = 0;

    clgBoxes.forEach((box) => {
        const clgName = box.querySelector(".clg-name").textContent.toLowerCase();
        const clgCourse = box.querySelector(".program-strip").textContent.toLowerCase();
        const state = box.querySelector(".state p").textContent.toLowerCase();
        const programType = box.querySelector(".layer1-right").textContent.toLowerCase();
        const deadlineStr = box.querySelector(".deadline").textContent.match(/\d{4}-\d{2}-\d{2}/)?.[0];
        const deadline = deadlineStr ? new Date(deadlineStr) : null;

        let matchesSearch = clgName.includes(searchQuery) || clgCourse.includes(searchQuery) || state.includes(searchQuery);

        // Check program type filters
        let matchesProgramFilters = selectedProgramFilters.length === 0 || selectedProgramFilters.includes(programType);

        // Check deadline filters
        let matchesDeadline = true;
        if (selectedDeadlineFilters.length > 0 && deadline) {
            const boxMonth = deadline.getMonth();
            const boxYear = deadline.getFullYear();

            matchesDeadline =
                (showUpcoming && deadline >= now) ||
                (showThisMonth && boxMonth === thisMonth && boxYear === thisYear) ||
                (showNextMonth &&
                    boxMonth === (thisMonth + 1) % 12 &&
                    (boxYear === thisYear || (thisMonth === 11 && boxYear === thisYear + 1))) ||
                (showPast && deadline < now);
        }

        // Combine conditions: If both filters are selected, both must match else match the selected one.
        const matchesFilters =
            (selectedProgramFilters.length > 0 || selectedDeadlineFilters.length > 0)
                ? matchesProgramFilters && matchesDeadline
                : matchesProgramFilters || matchesDeadline;

        let matchesDateRange =
            (!fromDate || (deadline && deadline >= new Date(fromDate))) &&
            (!toDate || (deadline && deadline <= new Date(toDate)));

        if (matchesSearch && matchesFilters && matchesDateRange) {
            box.style.display = "block";
            count++;
        } else {
            box.style.display = "none";
        }
    });

    handleNoDataBox(count);
}

// Event Listeners
document.querySelector(".input-box").addEventListener("input", () => {
    filterList();
});

document.querySelector(".filter-btn").addEventListener("click", () => {
    document.querySelector(".filter-box").classList.toggle("hidden");
    document.querySelector(".date-range-box").classList.add("hidden");
});

document.querySelector(".apply").addEventListener("click", () => {
    filterList();
    document.querySelector(".filter-box").classList.add("hidden");
});

document.querySelectorAll(".checkboxes").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        filterList();
    });
});

document.querySelector(".clear").addEventListener("click", () => {
    const filterBox = document.querySelector(".filter-box");
    filterBox.querySelectorAll("input[type='checkbox']").forEach((checkbox) => (checkbox.checked = false));
    document.querySelector(".input-box").value = "";
    document.querySelector("#from-date").value = "";
    document.querySelector("#to-date").value = "";
    filterBox.classList.toggle("hidden");

    // Show all boxes
    const clgBoxes = document.querySelectorAll(".clg-box");
    clgBoxes.forEach((box) => {
        box.style.display = "block";
    });
});

document.querySelector(".date-range-btn").addEventListener("click", () => {
    document.querySelector(".date-range-box").classList.toggle("hidden");
    document.querySelector(".filter-box").classList.add("hidden");
});

document.querySelector(".apply-date-btn").addEventListener("click", () => {
    filterList();
    document.querySelector(".date-range-box").classList.add("hidden");
});

document.querySelector(".grid-view").addEventListener("click", () => {
    clgBody.classList.remove("clg-list-flex");
    clgBody.classList.add("clg-list");
    document.querySelector(".list-view").classList.remove("active");
    document.querySelector(".grid-view").classList.add("active");
});

document.querySelector(".list-view").addEventListener("click", () => {
    clgBody.classList.remove("clg-list");
    clgBody.classList.add("clg-list-flex");
    document.querySelector(".list-view").classList.add("active");
    document.querySelector(".grid-view").classList.remove("active");
});

document.addEventListener("click", (e) => {
    const filterBox = document.querySelector(".filter-box");
    if (!filterBox.contains(e.target) && !document.querySelector(".filter-btn").contains(e.target)) {
        filterBox.classList.add("hidden");
    }

    const dateRangeBox = document.querySelector(".date-range-box");
    if (!dateRangeBox.contains(e.target) && !document.querySelector(".date-range-btn").contains(e.target)) {
        dateRangeBox.classList.add("hidden");
    }
});