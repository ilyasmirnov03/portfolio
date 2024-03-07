import { dom } from "@fortawesome/fontawesome-svg-core";
import { DetailedProject } from "./DetailedProject";

class PortfolioProjects extends HTMLElement {
  constructor() {
    super();
    this.projectsData = [];

    // Fetch data on initialization
    this.fetchData();
    this.classList.add('projects');
  }

  async fetchData() {
    try {
      const response = await fetch('/store/projects.json');
      this.projectsData = await response.json();
      this.render();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  createDetailedView(project) {

    const $holder = document.querySelector('.projects-detailed-holder');
    const $detailed = new DetailedProject(project);

    $detailed.classList.add('project-detailed');

    $holder.appendChild($detailed);
  }

  render() {
    this.projectsData.forEach((project) => {
      const $project = document.createElement('article');
      $project.classList.add('project-card');

      $project.innerHTML = `
          <h3>
            ${project.title}
            <a target="_blank" href="${project.github}">
              <i class="fa-brands fa-github"></i>
            </a>
          </h3>
          <p>${project.summary}</p>
          <button class="btn">Savoir plus</button>
        `;
      $project.querySelector('.btn').addEventListener('click', () => {
        this.detailedProjectOpen(project);
      });
      this.appendChild($project);
    });
    dom.i2svg();
  }

  // open the detailed project description
  detailedProjectOpen(project) {
    this.createDetailedView(project);
    document.querySelector('.projects-detailed-holder').classList.add("opened");
    document.querySelector("#blackened").style.opacity = "1";
  }
}

customElements.define('portfolio-projects', PortfolioProjects);