(function () {
    const PTF = {

        allSections: document.querySelectorAll(".page"),
        sectionURL: document.URL.split("#")[1],
        colors: ['#0e0e0e', '#fafafa'],
        mobileWidth: 810,
        mobileMode: window.outerWidth < 810,

        init: function () {
            console.log("Hello World!");
            console.log(`Mobile mode: ${PTF.mobileMode}`);
            // setting sensible global variables
            PTF.currentSection = (PTF.sectionURL) ? Array.from(PTF.allSections).indexOf(document.querySelector(`#${PTF.sectionURL}`)) : 0;
            PTF.animationTime = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--animation-time").trim().split("ms")[0]);
            // CSS variables init
            PTF.setProjectsAmount();
            // Dom manipulations
            if (window.outerWidth > PTF.mobileWidth) {
                PTF.dNone();
                PTF.zIndex();
            }
            // Ev listeners
            PTF.handlers();
        },

        // dark/light theme switcher
        themeSwitcher: function () {
            PTF.colors = PTF.colors.reverse();
            document.querySelector(':root').style.setProperty('--dark-theme', PTF.colors[0]);
            document.querySelector(':root').style.setProperty('--light-theme', PTF.colors[1]);
        },

        // applies z-index to every page in descendent order
        zIndex: function () {
            [...PTF.allSections].reverse().map((section, index) => {
                section.style.zIndex = index + 1;
                return section;
            });
        },

        /**
         * Applies display:none to all pages but the visible one and sets current section in header
         */
        dNone: function () {
            PTF.allSections.forEach((el) => {
                if (el === PTF.allSections[PTF.currentSection]) {
                    document.querySelectorAll("#navigation>li")[PTF.currentSection].classList.add("active-section");
                    return;
                }
                el.style.display = "none";
            });
        },

        // On mouse move apply effect
        enableMouseMove: true,
        mouseMoveEffect: function (e) {
            if (!PTF.enableMouseMove) return;

            PTF.enableMouseMove = false;
            let div = document.createElement("div");
            div.textContent = "+";
            div.classList.add("falling-x");
            div.style.left = e.x + "px";
            div.style.top = e.y + "px";
            document.querySelector("body").appendChild(div);
            div.addEventListener("animationend", () => { div.remove(); });
            setTimeout(() => { PTF.enableMouseMove = true }, 333);
        },

        /**
         * 
         * - @param {NodeList} as - all section elements
         * - @param {int} cs - number that represents current section
         * - @param {int} t - multiplier that determines how many sections should be scrolled, default = 1
         */
        scrollUp: function (as, cs, t = 1) {
            PTF.enableScroll = false;

            // current section goes back
            as[cs].classList.add("go-backward");
            // change navbar state
            document.querySelectorAll("#navigation>li")[cs].classList.remove("active-section");
            // prev section goes to its place
            as[cs - 1 * t].classList.add("return-init-backward");
            as[cs - 1 * t].style.display = "block";

            cs -= 1 * t;
            // change navbar state
            document.querySelectorAll("#navigation>li")[cs].classList.add("active-section");

            // actions on prev section 
            setTimeout(() => {
                as[cs + 1 * t].style.display = "none";
                //remove no more needed classes in prev section
                as[cs + 1 * t].classList.remove("return-init-backward");
                as[cs + 1 * t].classList.remove("go-forward");
                as[cs + 1 * t].classList.remove("go-backward");

                // remove in the current
                as[cs].classList.remove("return-init-backward");

                PTF.currentSection = cs;
                PTF.enableScroll = true;

                history.pushState(PTF.currentSection, "", `#${PTF.allSections[PTF.currentSection].id}`);
            }, PTF.animationTime);
        },

        /**
         * 
         * - @param {NodeList} as - all section elements
         * - @param {int} cs - number that represents current section
         * - @param {int} t - how much should a section be moved, default = 1
         * - @param {int} n - negator, default = 0 for normal scroll, is equal to current section when need to scroll more than 1 section
         */
        scrollDown: function (as, cs, t = 1, n = 0) {
            PTF.enableScroll = false;

            // goes forward hiding itself
            as[cs].classList.add("go-forward");
            // change navbar state
            document.querySelectorAll("#navigation>li")[cs].classList.remove("active-section");
            // next section goes forward taking its place
            as[cs + t - n].classList.add("return-init-forward");
            as[cs + t - n].style.display = "block";

            cs += t - n;
            // change navbar state
            document.querySelectorAll("#navigation>li")[cs].classList.add("active-section");

            // actions on prev section 
            setTimeout(() => {
                as[cs - t + n].style.display = "none";
                // remove no more needed classes in previous section
                as[cs - t + n].classList.remove("go-forward");
                //remove in the current
                as[cs].classList.remove("return-init-forward");
                as[cs].classList.remove("go-backward");

                PTF.currentSection = cs;
                PTF.enableScroll = true

                history.pushState(PTF.currentSection, "", `#${PTF.allSections[PTF.currentSection].id}`);
            }, PTF.animationTime);
        },

        // Scroll effect
        enableScroll: true,
        scroll: function (e) {
            // Easier to read
            let as = PTF.allSections;
            let cs = PTF.currentSection;

            // If can't perform scroll -> return
            if (!PTF.enableScroll) return;

            // DOWN SCROLL
            if (e.deltaY > 0 && cs !== as.length - 1) {
                PTF.scrollDown(as, cs);
            }

            // UP SCROLL
            if (e.deltaY < 0 && cs !== 0) {
                PTF.scrollUp(as, cs);
            }
        },

        // Click in header
        scrollTo: function (e) {
            e.preventDefault();
            if (e.target.tagName === "A" || e.target.tagName === "SPAN") {
                let t = (e.target.nextElementSibling !== null) ? parseInt(e.target.nextElementSibling.dataset.section) : parseInt(e.target.dataset.section);

                if (t > PTF.currentSection) {
                    PTF.scrollDown(PTF.allSections, PTF.currentSection, t, PTF.currentSection);
                } else {
                    PTF.scrollUp(PTF.allSections, PTF.currentSection, PTF.currentSection - t);
                }
                PTF.currentSection = t;
            };
        },

        // Desktop projects horizontal scroll functions
        currentProject: 0,
        leftScroll: function () {
            let selector = document.querySelectorAll(".projects-nav-dot");
            selector[PTF.currentProject].classList.remove("active-project");
            PTF.currentProject = (PTF.currentProject === 0) ? document.querySelectorAll(".projects-holder>div").length - 1 : PTF.currentProject - 1;
            document.querySelector(".projects-holder").style.transform = `translateX(${PTF.currentProject * -100}%)`;
            selector[PTF.currentProject].classList.add("active-project");
        },
        rightScroll: function () {
            let selector = document.querySelectorAll(".projects-nav-dot");
            selector[PTF.currentProject].classList.remove("active-project");
            PTF.currentProject = (PTF.currentProject + 1 <= document.querySelectorAll(".projects-holder>div").length - 1) ? PTF.currentProject + 1 : 0;
            document.querySelector(".projects-holder").style.transform = `translateX(${PTF.currentProject * -100}%)`;
            selector[PTF.currentProject].classList.add("active-project");
        },

        // projects navigation setup
        setProjectsAmount: function () {
            document.documentElement.style.setProperty("--grid-projects", document.querySelectorAll(".projects-holder>div").length.toString());
            document.querySelectorAll(".projects-holder>div").forEach((project, index) => {
                let el = document.createElement("li");
                let p = document.createElement("p");
                el.insertAdjacentElement("beforeend", p);
                el.classList.add("projects-nav-dot");
                p.textContent = project.children[1].children[0].textContent;
                document.querySelector(".projects-all-nav>ul").insertAdjacentElement("beforeend", el);
                (index === 0) ? el.classList.add("active-project") : false;
            });
        },

        // projects navigation click
        projectsDotNavigation: function (e) {
            if (e.target.tagName === "LI") {
                let i = Array.from(document.querySelectorAll('.projects-nav-dot')).indexOf(e.target);

                if (PTF.mobileMode) {
                    document.querySelector('.projects-holder').scrollLeft = `${window.innerWidth * i}`;
                    return;
                }

                document.querySelector(".projects-holder").style.transform = `translateX(${i * -100}%)`;
                document.querySelector('.projects-nav-dot.active-project').classList.remove('active-project');
                PTF.currentProject = i;
                document.querySelectorAll('.projects-nav-dot')[i].classList.add('active-project');
            }
        },

        // Mobile Header (Menu) functions
        closeHeader: function () {
            document.querySelector("#header").style.transform = "";
            document.querySelector("#blackened").style.opacity = "0";
        },

        menuHandler: function (e) {
            let h = document.querySelector("#header");
            let b = document.querySelector("#blackened");
            if (h.style.transform === "") {
                h.style.transform = "translateX(0%)";
                b.style.opacity = "1";
            } else if (h.style.transform !== "") {
                PTF.closeHeader();
            }
        },

        // Mobile horizontal scroll
        horizontalScroll: function (e) {
            let clientRect = e.target.children[0].getBoundingClientRect();
            document.querySelector(".projects-nav-dot.active-project").classList.remove("active-project");
            PTF.currentProject = ((clientRect.left * -1 / clientRect.width) % 1 === 0) ? clientRect.left * -1 / clientRect.width : PTF.currentProject;
            document.querySelectorAll(".projects-nav-dot")[PTF.currentProject].classList.add("active-project");
        },

        // navigation between sections in about page
        aboutNavigation: function (e) {
            if (e.target.tagName === "LI") {
                document.querySelector('.active-about-nav').classList.remove('active-about-nav');
                e.target.classList.add("active-about-nav");
                document.querySelector('.active-about').classList.remove('active-about');
                document.querySelectorAll('.about-content')[parseInt(e.target.dataset.about)].classList.add('active-about');
            }
        },

        // copies pdf link to resume in the clipboard
        copyToClipboard: function (e) {
            e.target.textContent = "Lien copié avec succès!";
            e.target.style.backgroundColor = "var(--complimentary)";
            navigator.clipboard.writeText(document.URL.split("#")[0] + "assets/download/cv-ilya-smirnov.pdf");
        },

        // open the detailed project description
        detailedProjectOpen: function (e) {
            document.querySelector(`.projects-detailed[data-project="${e.target.closest(".projects-card").dataset.project}"]`).style.display = "block";
            document.querySelector('.projects-detailed-holder').classList.add("opened");
            document.querySelector("#blackened").style.opacity = "1";
        },

        // close the detailed project description
        detailedProjectClose: function () {
            document.querySelector('.projects-detailed-holder').classList.remove("opened");
            document.querySelector("#blackened").style.opacity = "0";
            document.querySelector('.projects-detailed[style]').removeAttribute("style");
        },

        // open zoom on image in detailed project
        imageZoomOpen: function (e) {
            document.querySelector('.projects-detailed-img').style.display = "grid";
            document.querySelector('.projects-detailed-img>img').src = e.target.src;
        },

        // close zoom on image in detailed project
        imageZoomClose: function () {
            document.querySelector('.projects-detailed-img').style.display = "none";
        },

        handleContactForm: function (e) {
            e.preventDefault();
            let formData = new FormData(document.querySelector('form'));
            let url = "https://ilyasmirnov.alwaysdata.net/mail-send";
            let options = {
                method: "post",
                body: formData,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            fetch(url, options)
                .then(res => { res.json() })
                .then(server => console.log(server));
        },

        // Event listeners
        handlers: function () {

            // cross-platform ev listeners
            document.querySelector("#about-nav>ul").addEventListener("click", PTF.aboutNavigation);

            document.querySelector('#resume-share').addEventListener("click", PTF.copyToClipboard);

            document.querySelector('#socials svg:first-child').addEventListener("click", PTF.themeSwitcher);

            document.querySelectorAll('.projects-detailed-holder img').forEach(img => img.addEventListener("click", PTF.imageZoomOpen));

            document.querySelector('.projects-detailed-img>span').addEventListener("click", PTF.imageZoomClose);

            document.querySelectorAll('.projects-btn').forEach(btn => {
                btn.addEventListener("click", PTF.detailedProjectOpen);
            });

            document.querySelector('.projects-all-nav>ul').addEventListener("click", PTF.projectsDotNavigation);

            document.querySelector('.projects-detailed-holder>span').addEventListener("click", PTF.detailedProjectClose);

            document.querySelector('form').addEventListener("submit", PTF.handleContactForm);

            //mobile ev listeners
            if (window.outerWidth <= PTF.mobileWidth) {
                document.querySelector("body").addEventListener("click", function (e) {
                    if (e.target === document.querySelector("#menu-bar")) {
                        PTF.menuHandler(e);
                    }
                    if (e.target.closest("a") === e.target) {
                        PTF.closeHeader();
                    }
                });
                document.querySelector(".projects-holder").addEventListener("scroll", PTF.horizontalScroll)
                return;
            }
            /* uncomment when done */
            // document.addEventListener("mousemove", PTF.mouseMoveEffect);

            document.querySelector("#cr").addEventListener("click", PTF.rightScroll);
            document.querySelector("#cl").addEventListener("click", PTF.leftScroll);

            document.querySelector("main").addEventListener("wheel", PTF.scroll);

            document.querySelector("#navigation").addEventListener("click", PTF.scrollTo);
        },
    }
    window.addEventListener("DOMContentLoaded", PTF.init);
})();
