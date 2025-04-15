const baseURL = "https://sgh-api.onrender.com/api/announcements/admission-dates";
const clgBody = document.querySelector(".clg-list");
// const container = document.querySelector(".container");

// Fetch Data
const getData = async () => {
    try {
        const response = await fetch(baseURL);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        updateList(data);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}
getData();

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
            state.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1rem" viewBox="0 -960 960 960" width="1rem" fill="#4b5563"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg> <p>${item.state.name}</p>`;
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
            clgWebsite.innerHTML = `Visit Website <i class="fa-solid fa-arrow-up-right-from-square"></i>`;
            clgWebsite.addEventListener("click", () => {
                window.open(item.url);
            });
            lowerBox.appendChild(clgWebsite);

            clgBody.appendChild(clgBox);
            changeLevelColor();
        });
        
    });
}

// change color of degree level
const changeLevelColor = () => {
    document.querySelectorAll(".layer1-right").forEach((level) => {
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
            case "doctorate":
                level.style.backgroundColor = "#4586c3";
                break;
            default:
                break;
        }
    });
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
        const clgCourse = box.querySelector(".clg-course").textContent.toLowerCase();
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
    if(!dateRangeBox.contains(e.target) && !document.querySelector(".date-range-btn").contains(e.target)) {
        dateRangeBox.classList.add("hidden");
    }
});
