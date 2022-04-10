import "./assets/css/main.scss";

/**
 * Adds header tags transform depending on mouse position
 * @param {MouseEvent} e - mouse move event upon document
 */
const translateHeaderTags = (e) => {
    const {clientX: x, clientY: y} = e;
    const {innerWidth: width, innerHeight: height} = window;

    const tags = Array.from(document.querySelectorAll(".header-photo-block p"));

    const k = 0.2;

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

document.addEventListener("mousemove", translateHeaderTags);