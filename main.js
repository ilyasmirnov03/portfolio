(function () {
    const PTF = {

        allSections: document.querySelectorAll(".page"),
        currentSection: 0,
        mobileWidth: 810,

        init: function () {
            console.log("Hello World!");
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

        // Applies z-index to every page in descendent order
        zIndex: function () {
            [...PTF.allSections].reverse().map((section, index) => {
                section.style.zIndex = index + 1;
                return section;
            });
        },

        // Applies display:none to all pages but the first
        dNone: function () {
            for (let i = 1; i < PTF.allSections.length; i++) {
                PTF.allSections[i].style.display = "none";
            }
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

        // t -> target, initially is one step
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
            }, PTF.animationTime);
        },

        /* as -> all sections, cs -> current section, 
        t -> target, if need to go through multiple sections,
        n -> nullifier, to avoid getting out of number of sections */
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

        // Click in menu
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

        // Desktop horizontal scroll functions
        currentView: 0,
        leftScroll: function () {
            document.querySelectorAll(".projects-nav-dot")[PTF.currentView].classList.remove("active-project");
            PTF.currentView = (PTF.currentView === 0) ? document.querySelectorAll(".projects-holder>div").length - 1 : PTF.currentView - 1;
            document.querySelector(".projects-holder").style.transform = `translateX(${PTF.currentView * -100}%)`;
            document.querySelectorAll(".projects-nav-dot")[PTF.currentView].classList.add("active-project");
        },
        rightScroll: function () {
            document.querySelectorAll(".projects-nav-dot")[PTF.currentView].classList.remove("active-project");
            PTF.currentView = (PTF.currentView + 1 <= document.querySelectorAll(".projects-holder>div").length - 1) ? PTF.currentView + 1 : 0;
            document.querySelector(".projects-holder").style.transform = `translateX(${PTF.currentView * -100}%)`;
            document.querySelectorAll(".projects-nav-dot")[PTF.currentView].classList.add("active-project");
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
            PTF.currentView = ((clientRect.left * -1 / clientRect.width) % 1 === 0) ? clientRect.left * -1 / clientRect.width : PTF.currentView;
            document.querySelectorAll(".projects-nav-dot")[PTF.currentView].classList.add("active-project");
        },

        aboutNavigation: function (e) {
            if (e.target.tagName = "LI") {
                console.log(e.target.dataset.about);
            }
        },

        // Event listeners
        handlers: function () {

            //mobile
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

            document.addEventListener("wheel", PTF.scroll);

            document.querySelector("#navigation").addEventListener("click", PTF.scrollTo);

            document.querySelector("#about-nav>ul").addEventListener("click", PTF.aboutNavigation);

        },
    }
    window.addEventListener("DOMContentLoaded", PTF.init);
})();
