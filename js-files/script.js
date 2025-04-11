const baseURL = "https://sgh-api.onrender.com/api/announcements/admission-dates";
const clgBody = document.querySelector(".clg-list");
const container = document.querySelector(".container");

// Fetch Data
const getData = async () => {
    try {
        const response = await fetch(baseURL);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateList(data);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}
// getData();

const updateList = (data) => {
    clgBody.innerHTML = '';

    data.forEach((item) => {
        item.programs.forEach((program) => {

            const clgBox = document.createElement("div");
            clgBox.classList.add("clg-box");

            const clgLayer1 = document.createElement("div");
            clgLayer1.classList.add("clg-layer1");
            clgBox.appendChild(clgLayer1);

            const layer1Left = document.createElement("div");
            layer1Left.classList.add("layer1-left");
            clgLayer1.appendChild(layer1Left);

            const imgBox = document.createElement("div");
            imgBox.classList.add("img-box");
            imgBox.innerHTML = `<i class="fa-solid fa-graduation-cap"></i>`;
            layer1Left.appendChild(imgBox);

            const nameCourse = document.createElement("div");
            nameCourse.classList.add("name-course");
            nameCourse.innerHTML = `<p class="clg-name">${item.institution.name}</p><p class="clg-course">${program.name}</p>`;
            layer1Left.appendChild(nameCourse);

            const layer1Right = document.createElement("div");
            layer1Right.classList.add("layer1-right");
            layer1Right.textContent = program.degree_level;
            clgLayer1.appendChild(layer1Right);

            const deadline = document.createElement("div");
            deadline.classList.add("deadline");
            deadline.innerHTML = `<i class='bx bx-calendar' ></i> Deadline: <p>${item.application_deadline}</p>`;
            clgBox.appendChild(deadline);

            const state = document.createElement("div");
            state.classList.add("state");
            state.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1rem" viewBox="0 -960 960 960" width="1rem" fill="#4b5563"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg> ${item.state.name}`;
            clgBox.appendChild(state);

            const announcement = document.createElement("div");
            announcement.classList.add("announcement");
            announcement.innerHTML = `<i class='bx bx-info-circle' ></i> ${item.content}`;
            clgBox.appendChild(announcement);

            const lowerBox = document.createElement("div");
            lowerBox.classList.add("lower-box");
            clgBox.appendChild(lowerBox);

            const clgWebsite = document.createElement("button");
            clgWebsite.classList.add("clg-website");
            clgWebsite.addEventListener("click", () => {
                window.open(item.url);
            });
            lowerBox.appendChild(clgWebsite);

            clgBody.appendChild(clgBox);
        });
        
    });
}

// Filter
const filterBtn = document.querySelector(".filter-btn");
const filterBox = document.querySelector(".filter-box");

// Date Range
const dateRangeBtn = document.querySelector(".date-range-btn");
const dateRangeBox = document.querySelector(".date-range-box");

// View Boxes
const gridViewBtn = document.querySelector(".grid-view");
const listViewBtn = document.querySelector(".list-view");

// Degree level -> change the color of the box
const degreeLevels = document.querySelectorAll(".layer1-right");

// Filtering the data
const searchBox = document.querySelector(".input-box");
const filterApplyBtn = document.querySelector(".apply");
const filterClearBtn = document.querySelector(".clear");
const clgBoxes = document.querySelectorAll(".clg-box");

// change color of degree level
degreeLevels.forEach((level) => {
    const levelVal = level.textContent.toLowerCase();
    
    switch (levelVal) {
        case "undergraduate":
            level.style.backgroundColor = "#3b82f6";
            break;
        case "postgraduate":
            level.style.backgroundColor = "#0ea5e9";
            break;
        case "phd":
            level.style.backgroundColor = "#8b5cf6";
            break;
        case "professional":
            level.style.backgroundColor = "#38bdf8";
            break;
        case "diploma":
            level.style.backgroundColor = "#6366f1";
            break;
        default:
            break;
    }
});

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

            container.appendChild(noDataBox);
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
    const searchQuery = searchBox.value.toLowerCase();
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
        const clgCourse = box.querySelector(".clg-course").textContent.toLowerCase();
        const programType = box.querySelector(".layer1-right").textContent.toLowerCase();
        const deadlineStr = box.querySelector(".deadline").textContent.match(/\d{4}-\d{2}-\d{2}/)?.[0];
        const deadline = deadlineStr ? new Date(deadlineStr) : null;

        let matchesSearch = clgName.includes(searchQuery) || clgCourse.includes(searchQuery);

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
searchBox.addEventListener("input", () => {
    filterList();
});

filterBtn.addEventListener("click", () => {
    filterBox.classList.toggle("hidden");
    dateRangeBox.classList.add("hidden");
});

filterApplyBtn.addEventListener("click", () => {
    filterList();
    filterBox.classList.add("hidden");
});

filterClearBtn.addEventListener("click", () => {
    filterBox.querySelectorAll("input[type='checkbox']").forEach((checkbox) => (checkbox.checked = false));
    searchBox.value = "";
    document.querySelector("#from-date").value = "";
    document.querySelector("#to-date").value = "";
    filterBox.classList.toggle("hidden");

    // Show all boxes
    clgBoxes.forEach((box) => {
        box.style.display = "block";
    });
});

dateRangeBtn.addEventListener("click", () => {
    dateRangeBox.classList.toggle("hidden");
    filterBox.classList.add("hidden");
});

document.querySelector(".apply-date-btn").addEventListener("click", () => {
    filterList();
    dateRangeBox.classList.add("hidden");
});

gridViewBtn.addEventListener("click", () => {
    clgBody.classList.remove("clg-list-flex");
    clgBody.classList.add("clg-list");
    listViewBtn.classList.remove("active");
    gridViewBtn.classList.add("active");
});

listViewBtn.addEventListener("click", () => {
    clgBody.classList.remove("clg-list");
    clgBody.classList.add("clg-list-flex");
    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
});

document.addEventListener("click", (e) => {
    if (!filterBox.contains(e.target) && !filterBtn.contains(e.target)) {
      filterBox.classList.add("hidden");
    }
    if(!dateRangeBox.contains(e.target) && !dateRangeBtn.contains(e.target)) {
        dateRangeBox.classList.add("hidden");
    }
});
