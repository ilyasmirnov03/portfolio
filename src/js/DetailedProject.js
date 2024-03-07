import { dom } from "@fortawesome/fontawesome-svg-core";

export class DetailedProject extends HTMLElement {
    project;

    constructor(project) {
        super();
        this.project = project;
        this.render();
    }

    connectedCallback() {
        dom.i2svg();
    }

    render() {
        const $project = document.createElement('article');

        $project.innerHTML = `
            <button class="close empty-btn">
                <i class="fa-solid fa-xmark"></i>          
            </button>
            <h3 class="projects-detailed-title">
                ${this.project.title} - ${this.generateLink(this.project.link)}
                <a target="_blank" href="${this.project.github}">
                    <i class="fa-brands fa-github"></i>
                </a>
            </h3>
            <div class="tech__holder">
                ${this.generateLanguages(this.project.technologies)}
            </div>
            <p>${this.project.detailed_description}</p>
            ${this.generateImages(this.project.images)}
            `;
        this.appendChild($project);
        this.querySelector('.close').addEventListener('click', () => {
            this.close();
        });
    }

    generateLink(link) {
        if (typeof link === 'undefined') {
            return '';
        }
        return `<a href="${link}" target="_blank">Lien</a>`;
    }

    generateImages(images) {
        let html = '';
        images.forEach(img => {
            html += `<img src='/images/${img}' alt='${img}' />`;
        });
        return html;
    }

    generateLanguages(technologies) {
        let html = '';
        technologies.forEach(tech => {
            html += `<span class="tech">${tech}</span>`;
        });
        return html;
    }

    close() {
        document.querySelector('.projects-detailed-holder').classList.remove('opened');
        document.querySelector("#blackened").style.opacity = "0";
        this.remove();
    }
}

customElements.define('detailed-project', DetailedProject);