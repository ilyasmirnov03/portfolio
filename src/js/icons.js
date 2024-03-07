import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faChevronLeft, faChevronRight, faCircleHalfStroke, faCode, faEnvelope, faMusic, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";

const icons = [
    faCode,
    faPen,
    faMusic,
    faEnvelope,
    faLinkedin,
    faGithub,
    faCircleHalfStroke,
    faXmark,
    faChevronLeft,
    faChevronRight,
];

library.add(icons);

window.addEventListener('DOMContentLoaded', dom.i2svg);
