const urlParams = new URLSearchParams(window.location.search);
const announcementId = urlParams.get('announcementId');

const baseURL = "https://sgh-api.onrender.com/api/announcements";

const fetchData = async () => {
    try {
        const response = await fetch(`${baseURL}/${announcementId}`);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        displayDetails(data);
    } catch (error) {
        document.querySelector("main").innerHTML = `<p>Failed to load Data...Please try again later.</p>`;
        console.error("Error fetching data: ", error);
    }
}
fetchData();

const displayDetails = (data) => {
    const container = document.querySelector(".container");
    container.innerHTML = "";

    const heading = document.createElement("div");
    heading.classList.add("heading");
    container.appendChild(heading);

    const announcementTitle = document.createElement("div");
    announcementTitle.classList.add("heading-title");
    announcementTitle.textContent = data.title;
    heading.appendChild(announcementTitle);
        
    const upperBox = document.createElement("div");
    upperBox.classList.add("upper-box");
    container.appendChild(upperBox);

    const upperBox1 = document.createElement("div");
    upperBox1.classList.add("upper-box1");
    upperBox.appendChild(upperBox1);

    const title1 = document.createElement("div");
    title1.classList.add("title");
    title1.textContent = "Announcement Details";
    upperBox1.appendChild(title1);

    const publishedDate = document.createElement("div");
    publishedDate.classList.add("published-date");
    if(data.published_date === null) {
        publishedDate.style.display = "none";
    } else {
        publishedDate.innerHTML = `<i class='bx bx-calendar'></i> Published Date: ${data.published_date}`;
    }
    upperBox1.appendChild(publishedDate);

    const announcementInfo = document.createElement("div");
    announcementInfo.classList.add("announcement-info");
    announcementInfo.textContent = data.content;
    upperBox1.appendChild(announcementInfo);

    const tagsTitle = document.createElement("div");
    tagsTitle.classList.add("tags-title");
    tagsTitle.textContent = "Tags";
    upperBox1.appendChild(tagsTitle);

    const tagsContainer = document.createElement("div");
    tagsContainer.classList.add("tags-container");
    upperBox1.appendChild(tagsContainer);

    data.tags.forEach((tag) => {
        const tagName = document.createElement("div");
        tagName.classList.add("tags");
        tagName.textContent = tag.name;
        tagName.style.backgroundColor = getTagsColor(tag.name);
        tagsContainer.appendChild(tagName);
    });

    const clgAnnouncementWebsite = document.createElement("button");
    clgAnnouncementWebsite.classList.add("clg-announcement-website")
    clgAnnouncementWebsite.innerHTML = `<i class='bx bx-link'></i>   Visit Announcement Page`;
    clgAnnouncementWebsite.addEventListener("click", () => {
        window.location.href = data.url;
    });
    upperBox1.appendChild(clgAnnouncementWebsite);

    const upperBox2 = document.createElement("div");
    upperBox2.classList.add("upper-box2");
    upperBox.appendChild(upperBox2);

    const title2 = document.createElement("div");
    title2.classList.add("title");
    title2.textContent = "Important Information";
    upperBox2.appendChild(title2);

    const institutionHeading = document.createElement("div");
    institutionHeading.classList.add("info-title");
    institutionHeading.textContent = "Institution";
    upperBox2.appendChild(institutionHeading);

    const institutionName = document.createElement("div");
    institutionName.classList.add("info-content");
    institutionName.innerHTML = `<i class='bx bx-info-circle'></i> ${data.institution.name}`;
    upperBox2.appendChild(institutionName);

    const clgWebsite = document.createElement("a");
    clgWebsite.classList.add("clg-website");
    clgWebsite.innerHTML = `<i class='bx bx-link'></i> Institution Website`;
    clgWebsite.href = data.institution.website;
    upperBox2.appendChild(clgWebsite);

    const locationTitle = document.createElement("div");
    locationTitle.classList.add("info-title");
    locationTitle.textContent = "Location";
    upperBox2.appendChild(locationTitle);

    const stateName = document.createElement("div");
    stateName.classList.add("info-content");
    stateName.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="1rem" viewBox="0 -960 960 960" width="1rem" fill="#4b5563"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg> ${data.state.name} (${data.state.abbreviation})`;
    upperBox2.appendChild(stateName);

    const applicationOpenTitle = document.createElement("div");
    applicationOpenTitle.classList.add("info-title");
    applicationOpenTitle.textContent = "Application Opens";
    upperBox2.appendChild(applicationOpenTitle);

    const applicationOpenDate = document.createElement("div");
    applicationOpenDate.classList.add("info-content");
    if(data.application_open_date === null) {
        applicationOpenTitle.style.display = "none";
        applicationOpenDate.style.display = "none";
    } else {
        applicationOpenDate.innerHTML = `<i class='bx bx-calendar-alt'></i> ${data.application_open_date}`;
    }
    upperBox2.appendChild(applicationOpenDate);

    const applicationDeadlineTitle = document.createElement("div");
    applicationDeadlineTitle.classList.add("info-title");
    applicationDeadlineTitle.textContent = "Application Deadline";
    upperBox2.appendChild(applicationDeadlineTitle);

    const applicationDeadlineDate = document.createElement("div");
    applicationDeadlineDate.classList.add("info-content");
    if(data.application_deadline === null) {
        applicationDeadlineTitle.style.display = "none";
        applicationDeadlineDate.style.display = "none";
    } else {
        applicationDeadlineDate.innerHTML = `<i class='bx bx-calendar-alt'></i> ${data.application_deadline}`;
        applicationDeadlineDate.style.color = "#dc2626";
        applicationDeadlineDate.style.fontWeight = "500";
    }
    upperBox2.appendChild(applicationDeadlineDate);

    const termTitle = document.createElement("div");
    termTitle.classList.add("info-title");
    termTitle.textContent = "Term";
    upperBox2.appendChild(termTitle);

    const termContent = document.createElement("div");
    termContent.classList.add("info-content");
    if(data.term === null) {
        termTitle.style.display = "none";
        termContent.style.display = "none";
    } else {
        termContent.textContent = data.term;
    }
    upperBox2.appendChild(termContent);

    const lowerBox = document.createElement("div");
    lowerBox.classList.add("lower-box");
    container.appendChild(lowerBox);

    if(data.programs.length === 0) {
        lowerBox.style.display = "none";
    } else {
        const lowerHeading = document.createElement("div");
        lowerHeading.classList.add("lower-heading");
        lowerHeading.textContent = "Programs Related to Announcement";
        lowerBox.appendChild(lowerHeading);

        const programsContainer = document.createElement("div");
        programsContainer.classList.add("programs-container");
        lowerBox.appendChild(programsContainer);

        data.programs.forEach((program) => {
            const clgBox = document.createElement("div");
            clgBox.classList.add("clg-box");
            programsContainer.appendChild(clgBox);

            const programName = document.createElement("div");
            programName.classList.add("program-name");
            programName.textContent = program.name;
            clgBox.appendChild(programName);

            const degreeLevel = document.createElement("div");
            degreeLevel.classList.add("degree-level");
            degreeLevel.textContent = program.degree_level;
            degreeLevel.style.backgroundColor = getDegreeColor(program.degree_level);
            clgBox.appendChild(degreeLevel);

            const programInfo = document.createElement("div");
            programInfo.classList.add("program-info");
            programInfo.textContent = program.description;
            clgBox.appendChild(programInfo);

            const durationMonths = document.createElement("div");
            durationMonths.classList.add("duration-months");
            durationMonths.textContent = `Duration: ${program.duration_months} months`;
            clgBox.appendChild(durationMonths);
        });
    }
}

const getTagsColor = (value) => {
    switch (value.toLowerCase()) {
        case "important":
            return " #ef4444";
        case "deadline":
            return " #f97316";
        case "event":
            return " #8b5cf6";
        case "update":
            return " #d946ef";
        case "general":
            return " #10b981";
        case "admission":
            return " #ec4899";
        case "results":
            return " #f59e0b";
        case "registration":
            return "rgb(31, 119, 108)";
        case "international":
            return " #64748b";
        case "exam":
            return " #84cc16";
        case "undergraduate":
            return " #38bdf8";
        case "postgraduate":
            return " #4f46e5";
        case "payment":
            return " #C266A2";
        case "scholarship":
            return " #01afb9";
        default:
            break;
    }
}

const getDegreeColor = (value) => {
    switch (value.toLowerCase()) {
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
            return " #cc5c83";
    }
}