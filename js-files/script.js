// Filter
const filterBtn = document.querySelector(".filter-btn");
const filterBox = document.querySelector(".filter-box");

// Date Range
const dateRangeBtn = document.querySelector(".date-range-btn");
const dateRangeBox = document.querySelector(".date-range-box");

// View Boxes
const gridViewBtn = document.querySelector(".grid-view");
const listViewBtn = document.querySelector(".list-view");
const clgBody = document.querySelector(".clg-list");

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

// Filter college list
function filterList() {
    const searchQuery = searchBox.value.toLowerCase();
    const selectedFilters = Array.from(filterBox.querySelectorAll("input[type='checkbox']:checked")).map(
        (checkbox) => checkbox.parentElement.textContent.trim().toLowerCase()
    );
    const fromDate = document.querySelector("#from-date").value;
    const toDate = document.querySelector("#to-date").value;

    clgBoxes.forEach((box) => {
        const clgName = box.querySelector(".clg-name").textContent.toLowerCase();
        const programType = box.querySelector(".layer1-right").textContent.toLowerCase();
        const deadline = box.querySelector(".deadline").textContent.match(/\d{4}-\d{2}-\d{2}/)?.[0];

        let matchesSearch = clgName.includes(searchQuery);
        let matchesFilters = selectedFilters.length === 0 || selectedFilters.includes(programType);
        let matchesDateRange =
            (!fromDate || new Date(deadline) >= new Date(fromDate)) &&
            (!toDate || new Date(deadline) <= new Date(toDate));

        if (matchesSearch && matchesFilters && matchesDateRange) {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    });
}

// Event Listeners
searchBox.addEventListener("input", filterList);

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
    filterList();
});

dateRangeBtn.addEventListener('click', () => {
    dateRangeBox.classList.toggle('hidden');
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
