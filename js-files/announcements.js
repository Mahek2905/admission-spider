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
const announcementBoxes = document.querySelectorAll(".announcement-boxes");
const searchBox = document.querySelector(".input-box");

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

// Filter and Display
const filterBoxes = () => {
    const searchQuery = searchBox.value.toLowerCase();

    announcementBoxes.forEach((box) => {
        const announcementTitle = box.querySelector(".announcement-title").textContent.toLowerCase();
        // const degreeLvlBoxVal = box.querySelectorAll(".degree-level-box").textContent.toLowerCase();
        // const degreeLevels = Array.from();
        // console.log(degreeLevels);

        let matchesQuery = announcementTitle.includes(searchQuery);
        // let matchesImp = degreeLevels.includes(nav3imp.textContent.toLowerCase());

        if(matchesQuery) {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    });
}
// filterBoxes();

// ----- Event Listeners -----

// Nav3 buttons
nav3all.addEventListener("click", () => {
    nav3all.classList.add("activeAll");
    nav3imp.classList.remove("activeImp");
    nav3deadline.classList.remove("activeDeadline");
    nav3events.classList.remove("activeEvents");
});
nav3imp.addEventListener("click", () => {
    nav3imp.classList.add("activeImp");
    nav3all.classList.remove("activeAll");
    nav3deadline.classList.remove("activeDeadline");
    nav3events.classList.remove("activeEvents");
});
nav3deadline.addEventListener("click", () => {
    nav3deadline.classList.add("activeDeadline");
    nav3all.classList.remove("activeAll");
    nav3imp.classList.remove("activeImp");
    nav3events.classList.remove("activeEvents");
});
nav3events.addEventListener("click", () => {
    nav3events.classList.add("activeEvents");
    nav3all.classList.remove("activeAll");
    nav3imp.classList.remove("activeImp");
    nav3deadline.classList.remove("activeDeadline");
});


// New & All buttons
newBtn.addEventListener("click", () => {
    allBtn.classList.remove("active-all");
    newBtn.style.backgroundColor = "#3980ed";
    newBtn.style.color = "#ffffff";
});
allBtn.addEventListener("click", () => {
    allBtn.classList.add("active-all");
    newBtn.style.backgroundColor = "#ffffff";
    newBtn.style.color = "#020817";
});
// searchBox.addEventListener("input", filterBoxes);