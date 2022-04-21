import "./assets/css/main.scss";

/**
 * Adds header tags transform depending on mouse position
 * @param {MouseEvent} e - mouse move event upon document
 */
const translateHeaderTags = (e) => {
    const {clientX: x, clientY: y} = e;
    const {innerWidth: width, innerHeight: height} = window;

    const tags = Array.from(document.querySelectorAll(".header-photo-block p"));

    const k = 0.4;

    tags.map((tag, i) => {
        const box = tag.getBoundingClientRect();
        const tagCenterX = box.left + box.width / 2;
        const tagCenterY = box.top + box.height / 2;

        const xDiff = tagCenterX - x;
        const yDiff = tagCenterY - y;

        const xPercent = (xDiff / width) * 100 * k + i * 10;
        const yPercent = (yDiff / height) * 100 * k + i * 10;

        tag.style.transform = `translate(${xPercent}%, ${yPercent}%)`;
    })
}

const translateProjectCardsBackground = (e) => {
    const {clientX: x, clientY: y} = e;
    const {innerWidth: width, innerHeight: height} = window;

    const images = Array.from(document.querySelectorAll(".project-card > figure > div > img"));

    const k = 0.05;

    images.map((image) => {
        const box = image.getBoundingClientRect();
        const tagCenterX = box.left + box.width / 2;
        const tagCenterY = box.top + box.height / 2;

        const xDiff = tagCenterX - x;
        const yDiff = tagCenterY - y;

        let xPercent = (xDiff / width) * 100 * k;
        let yPercent = (yDiff / height) * 100 * k;

        image.style.transform = `scale(1.2) translate(${xPercent}%, ${yPercent}%)`;
    })
}

const handleMouseMove = (e) => {
    translateHeaderTags(e);
    translateProjectCardsBackground(e);
}

document.addEventListener("mousemove", handleMouseMove);

const processProjectsFilter = () => {
    const activeFilters = Array.from(document.getElementsByClassName("projects-filter-button"))
        .filter(button => button.classList.contains("active"))
        .map(button => button.dataset.filter.toLowerCase().trim());

    Array.from(document.getElementsByClassName("project-card"))
        .filter(project => {
            project.classList.remove("inactive");

            if (!activeFilters.length) return false;

            if (project?.dataset?.filters) {
                const projectFilters = Array.from(project.dataset.filters.split(","))
                    .map(filter => filter.toLowerCase().trim());
                return !activeFilters.every(filter => projectFilters.includes(filter));
            } else {
                return true;
            }
        })
        .forEach((project) => {
            project.classList.add("inactive");
        })

}

const filterButtons = document.getElementsByClassName("projects-filter-button");
for (const filterButton of filterButtons) {
    filterButton.addEventListener("click", (e) => {
        const button = e.composedPath().find(el => el.classList.contains("projects-filter-button"));

        for (const _button of filterButtons) {
            if (_button !== button)
                _button.classList.remove("active");
        }

        button.classList.toggle("active");

        processProjectsFilter();
    })
}

const card = document.getElementsByClassName("project-card")[0];
const cardsWrapper = document.getElementsByClassName("projects-cards__wrapper")[0];
const arrowButtons = document.getElementsByClassName("projects-cards__arrow");
for (const arrowButton of arrowButtons) {
    arrowButton.addEventListener("click", (e) => {
        const button = e.composedPath().find(el => el.classList.contains("projects-cards__arrow"));
        const direction = button.classList.contains("arrow_left") ? -1 : 1;
        const cardWidth = card.getBoundingClientRect().width;
        const cardMargin = parseInt(getComputedStyle(card).marginRight);

        const scrollValue = (cardWidth + cardMargin) * direction;

        cardsWrapper.scrollBy({
            left: scrollValue,
            behavior: "smooth"
        })
    })
}