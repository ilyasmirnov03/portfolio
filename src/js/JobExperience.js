class JobExperience extends HTMLElement {
    connectedCallback() {
        this.fetchData();
    }

    async fetchData() {
        try {
            const response = await fetch('/store/experience.json');
            const data = await response.json();
            this.renderCarousel(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    renderCarousel(experiences) {
        experiences.forEach(experience => {
            const card = document.createElement('article');
            card.innerHTML = `
                <p>${new Date(experience.from).toDateString()} - À: ${experience.to ? new Date(experience.to).toDateString() : 'Aujourd\'hui'}</p>
                <div class="experience">
                    <div>
                        <h3 class="title">${experience.company} - ${experience.type}</h3>
                    </div>
                    <div class="description">
                        <p>${experience.description}</p>
                    </div>
                </div>
            `;
            this.appendChild(card);
        });
    }
}

customElements.define('job-experience', JobExperience);
