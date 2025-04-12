const baseURL = "https://sgh-api.onrender.com/api/announcements";
const container = document.querySelector(".container");

// Fetch Data
const getData = async () => {
    try {
        const response = await fetch(baseURL);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        updateList(data);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}
// getData();

const updateList = (data) => {
    const announcementList = document.querySelector(".announcement-list");
    announcementList.innerHTML = ``;

    data.forEach((item) => {
        const announcementBox = document.createElement("div");
        announcementBox.classList.add("announcement-boxes");

        const announcementLayer1 = document.createElement("div");
        announcementLayer1.classList.add("announcement-layer1");
        announcementBox.appendChild(announcementLayer1);

        const announcementTitle = document.createElement("div");
        announcementTitle.classList.add("announcement-title");
        announcementTitle.textContent = item.title;
        announcementBox.appendChild(announcementTitle);

        const announcementDate = document.createElement("div");
        announcementDate.classList.add("announcement-date");
        announcementDate.innerHTML = `<i class='bx bx-calendar'></i> Date: ${item.published_date}`;
        announcementBox.appendChild(announcementDate);

        const announcementInfo = document.createElement("div");
        announcementInfo.classList.add("announcement-info");
        announcementInfo.textContent = item.content;
        announcementBox.appendChild(announcementInfo);

        announcementList.appendChild(announcementBox);
    });
}

// Nav2-Right buttons
const newBtn = document.querySelector(".new-btn");
const allBtn = document.querySelector(".all-btn");

// Nav3 buttons
const nav3all = document.querySelector(".nav3-all");
const nav3imp = document.querySelector(".nav3-imp");
const nav3deadline = document.querySelector(".nav3-deadline");
const nav3events = document.querySelector(".nav3-events");

// Degree level Boxes
const degreeLevelBoxes = document.querySelectorAll(".degree-level-box");

// Filter
const searchBox = document.querySelector(".input-box");
const nav3btns = document.querySelectorAll(".nav3btns");

// Diff colors for diff degree levels
degreeLevelBoxes.forEach((box) => {
    const boxVal = box.textContent.toLowerCase();
    switch (boxVal) {
        case "important":
            box.style.backgroundColor = "#ef4444";
            break;
        case "new":
            box.style.backgroundColor = "#3b82f6";
            break;
        case "deadline":
            box.style.backgroundColor = "#f97316";
            break;
        case "event":
            box.style.backgroundColor = "#8b5cf6";
            break;
        case "update":
            box.style.backgroundColor = "#0ea5e9";
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
            noDataTitle.textContent = `No Announcements Found`;
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

// Filter and Display
const filterBoxes = (tagFilter) => {
    let visibleCount = 0;
    const announcementBoxes = document.querySelectorAll(".announcement-boxes");

    announcementBoxes.forEach((box) => {
        if (tagFilter.toLowerCase() === "all") {
            box.style.display = "block";
            visibleCount++;
            return;
        }

        const tags = Array.from(box.querySelectorAll(".degree-level-box")).map((tag) =>
            tag.textContent.toLowerCase()
        );

        // Check if any tag matches the filter
        const matchesTag = tags.includes(tagFilter.toLowerCase());

        if (matchesTag) {
            box.style.display = "block";
            visibleCount++;
        } else {
            box.style.display = "none";
        }
    });

    // Show or hide the "No Data Found" box
    handleNoDataBox(visibleCount);
};

// Search Box
const searches = () => {
    let visibleCount = 0;
    const searchQuery = searchBox.value.toLowerCase();
    const announcementBoxes = document.querySelectorAll(".announcement-boxes");

    announcementBoxes.forEach((box) => {
        const announcementTitle = box.querySelector(".announcement-title").textContent.toLowerCase();

        let matchesQuery = announcementTitle.includes(searchQuery);

        if (matchesQuery) {
            box.style.display = "block";
            visibleCount++;
        } else {
            box.style.display = "none";
        }
    });

    // Show or hide the "No Data Found" box
    handleNoDataBox(visibleCount);
};

// ----- Event Listeners -----

// Nav3 buttons
nav3all.addEventListener("click", () => {
    nav3all.classList.add("activeAll");
    nav3imp.classList.remove("activeImp");
    nav3deadline.classList.remove("activeDeadline");
    nav3events.classList.remove("activeEvents");
    filterBoxes("all");
});
nav3imp.addEventListener("click", () => {
    nav3imp.classList.add("activeImp");
    nav3all.classList.remove("activeAll");
    nav3deadline.classList.remove("activeDeadline");
    nav3events.classList.remove("activeEvents");
    filterBoxes("Important");
});
nav3deadline.addEventListener("click", () => {
    nav3deadline.classList.add("activeDeadline");
    nav3all.classList.remove("activeAll");
    nav3imp.classList.remove("activeImp");
    nav3events.classList.remove("activeEvents");
    filterBoxes("Deadline");
});
nav3events.addEventListener("click", () => {
    nav3events.classList.add("activeEvents");
    nav3all.classList.remove("activeAll");
    nav3imp.classList.remove("activeImp");
    nav3deadline.classList.remove("activeDeadline");
    filterBoxes("Event");
});


// New & All buttons
newBtn.addEventListener("click", () => {
    allBtn.classList.remove("active-all");
    newBtn.style.backgroundColor = "#3980ed";
    newBtn.style.color = "#ffffff";
    filterBoxes("New");
});
allBtn.addEventListener("click", () => {
    allBtn.classList.add("active-all");
    newBtn.style.backgroundColor = "#ffffff";
    newBtn.style.color = "#020817";
    filterBoxes("All");
});
searchBox.addEventListener("input", () => {
    searches();
});