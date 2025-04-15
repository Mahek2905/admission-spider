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
        // console.log(data);
        updateList(data);
    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}
getData();

const updateList = (data) => {
    const announcementList = document.querySelector(".announcement-list");
    announcementList.innerHTML = ``;

    data.forEach((item) => {
        const announcementBox = document.createElement("div");
        announcementBox.classList.add("announcement-boxes");

        const announcementLayer1 = document.createElement("div");
        announcementLayer1.classList.add("announcement-layer1");
        announcementBox.appendChild(announcementLayer1);

        if(item.tags !== null) {
            item.tags.forEach((tag) => {
                const degreeLevelBox = document.createElement("div");
                degreeLevelBox.classList.add("degree-level-box");
                degreeLevelBox.textContent = tag;
                announcementLayer1.appendChild(degreeLevelBox);
            });
        }

        if(item.announcement_type !== null) {
            const announcementTypeBox = document.createElement("div");
            announcementTypeBox.classList.add("degree-level-box");

            if(item.announcement_type.includes("admission")) {               
                announcementTypeBox.textContent = "Admission";    
            } else if (item.announcement_type.includes("result")) {
                announcementTypeBox.textContent = "Result";
            } else if (item.announcement_type === "general") {
                announcementTypeBox.textContent = "General";
            } else {
                announcementTypeBox.textContent = "General";
            }

            announcementLayer1.appendChild(announcementTypeBox)
        }    
            
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
        changeLevelColor();
    });
}


// Diff colors for diff degree levels
const changeLevelColor = () => {
    document.querySelectorAll(".degree-level-box").forEach((box) => {
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
            case "general":
                box.style.backgroundColor = "#10b981";
                break;
            case "admission":
                box.style.backgroundColor = "#ec4899";
                break;
            case "result":
                box.style.backgroundColor = "#f59e0b";
                break;
            default:
                box.style.backgroundColor = "#10b981";
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
    const searchQuery = document.querySelector(".input-box").value.toLowerCase();
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
document.querySelectorAll(".nav3btns").forEach((btn) => {
    btn.addEventListener("click", () => {

        document.querySelectorAll(".nav3btns").forEach((b) => {
            b.classList.remove("activeAll", "activeImp", "activeDeadline", "activeEvents", "activeGeneral", "activeAdmission", "activeResult");

            if(btn.classList.contains("nav3-all")) {
                btn.classList.add("activeAll");
            } else if (btn.classList.contains("nav3-imp")) {
                btn.classList.add("activeImp");
            } else if (btn.classList.contains("nav3-deadline")) {
                btn.classList.add("activeDeadline");
            } else if (btn.classList.contains("nav3-events")) {
                btn.classList.add("activeEvents");
            } else if (btn.classList.contains("nav3-general")) {
                btn.classList.add("activeGeneral");
            } else if (btn.classList.contains("nav3-admission")) {
                btn.classList.add("activeAdmission");
            } else if (btn.classList.contains("nav3-result")) {
                btn.classList.add("activeResult");
            }

            filterBoxes(btn.dataset.type);
        });
    })
})


// New & All buttons
document.querySelector(".new-btn").addEventListener("click", () => {
    document.querySelector(".all-btn").classList.remove("active-all");
    document.querySelector(".new-btn").style.backgroundColor = "#3980ed";
    document.querySelector(".new-btn").style.color = "#ffffff";
    filterBoxes("New");
});
document.querySelector(".all-btn").addEventListener("click", () => {
    document.querySelector(".all-btn").classList.add("active-all");
    document.querySelector(".new-btn").style.backgroundColor = "#ffffff";
    document.querySelector(".new-btn").style.color = "#020817";
    filterBoxes("All");
});
document.querySelector(".input-box").addEventListener("input", () => {
    searches();
});