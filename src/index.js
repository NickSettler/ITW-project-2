import "./assets/css/main.scss";

const headerMenuButton = document.getElementsByClassName("header-menu-button")[0];
headerMenuButton.addEventListener("click", () => {
    const menu = document.getElementsByClassName("header-menu-list")[0];
    menu.classList.toggle("active");
});

const handleMenuItemClick = (e) => {
    e.preventDefault();

    try {
        const menuItem = e.composedPath().find(el => el.tagName === "A");
        const link = menuItem.getAttribute("href");

        const section = document.getElementById(link.substring(1));
        const sectionTop = section.offsetTop;

        const menu = document.getElementsByClassName("header-menu")[0];
        const menuHeight = menu.offsetHeight;

        window.scrollTo({
            top: sectionTop - menuHeight,
            behavior: "smooth"
        });
    } finally {
        const menu = document.getElementsByClassName("header-menu-list")[0];
        menu.classList.remove("active");
    }
}

const menuItems = document.querySelectorAll(".header-menu-list a");
for (const menuItem of menuItems) {
    menuItem.addEventListener("click", handleMenuItemClick);
}

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

/**
 * Move cards background depending on mouse position
 * @param {MouseEvent} e
 */
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

let formLoading = false;

/**
 *
 * @param {boolean | string} error - true if error, false if success, string if error message
 */
const setFormError = (error) => {
    const errorMessage = document.getElementsByClassName("contact-form__error")[0];

    if(error)
        errorMessage.classList.add("visible");
    else
        errorMessage.classList.remove("visible");

    if (error)
        errorMessage.textContent = error;
}

/**
 * Set form state (default/loading)
 * @param {boolean} loading is form loading or not
 */
const setFormLoading = (loading) => {
    formLoading = loading;

    const form = document.getElementById("contact-form");
    form.querySelectorAll(".contact-form__field, input, textarea, button").forEach(el => {
        if (loading)
            el.classList.add("disabled");
        else
            el.classList.remove("disabled");

        if (el.tagName === "BUTTON" || el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.disabled = loading;
    });
}

/**
 * Handle contact form submission
 * @param {SubmitEvent} e
 */
const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formLoading) return;

    const data = new FormData(e.target);

    setFormLoading(true);

    fetch("https://formspree.io/f/xvolwepo", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if(!data.ok) throw new Error();
            setFormLoading(false);
        })
        .catch(() => {
            setFormError("Something went wrong. Please try again later.");
            setFormLoading(false);
        })
}

const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", handleFormSubmit);