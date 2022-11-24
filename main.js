(function () {
    const PTF = {

        allSections: document.querySelectorAll(".page"),
        currentSection: 0,
        animationTime: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--animation-time").split("s")[0]),

        init: function () {
            console.log("Hello World!");
            // CSS variables init
            PTF.setProjectsAmount();
            PTF.showWindowWidth();
            // If not on mobile
            if (window.innerWidth > 620) {
                // Dom manipulations
                PTF.dNone();
                PTF.zIndex();
                // Ev listeners
                PTF.handlers();
            } else {
                PTF.mobileHandlers();
            }
        },

        setProjectsAmount: function () {
            document.documentElement.style.setProperty("--grid-projects", document.querySelectorAll(".projects-holder>div").length.toString());

            document.querySelectorAll(".projects-holder>div").forEach((project) => {
                let el = document.createElement("li");
                el.classList.add("projects-nav-dot");
                el.textContent = project.children[1].children[0].textContent;
                document.querySelector(".projects-all-nav>ul").insertAdjacentElement("beforeend", el);
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
        enableScrollUp: true,
        enableScrollDown: true,
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

        scrollTo: function (e) {
            e.preventDefault();
            if (e.target.tagName === "A") {
                let t = parseInt(e.target.closest("a").dataset.section);
                PTF.enableScrollDown = true;
                PTF.enableScrollUp = true;

                if (t > PTF.currentSection) {
                    PTF.scrollDown(PTF.allSections, PTF.currentSection, t, PTF.currentSection);
                } else {
                    PTF.scrollUp(PTF.allSections, PTF.currentSection, PTF.currentSection - t);
                }
                PTF.currentSection = parseInt(e.target.closest("a").dataset.section);
            };
        },

        // Horizontal scroll functions
        currentView: 0,
        leftScroll: function () {
            document.querySelectorAll(".projects-nav-dot")[PTF.currentView].classList.remove("active-view");
            PTF.currentView = (PTF.currentView === 0) ? document.querySelectorAll(".projects-holder>div").length - 1 : PTF.currentView - 1;
            document.querySelector(".projects-holder").style.transform = `translateX(${PTF.currentView * -100}%)`;
            document.querySelectorAll(".projects-nav-dot")[PTF.currentView].classList.add("active-view");
        },
        rightScroll: function () {
            document.querySelectorAll(".projects-nav-dot")[PTF.currentView].classList.remove("active-view");
            PTF.currentView = (PTF.currentView + 1 <= document.querySelectorAll(".projects-holder>div").length - 1) ? PTF.currentView + 1 : 0;
            document.querySelector(".projects-holder").style.transform = `translateX(${PTF.currentView * -100}%)`;
            document.querySelectorAll(".projects-nav-dot")[PTF.currentView].classList.add("active-view");
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

        /* TESTING */
        showWindowWidth: function() {
            alert(`innerWidth:${window.innerWidth},
            outerWidth:${window.outerWidth}`)
        },

        // Event listeners
        handlers: function () {
            /* uncomment when done */
            // document.addEventListener("mousemove", PTF.mouseMoveEffect);

            document.addEventListener("scroll", PTF.customScrollEnabler)

            document.addEventListener("wheel", PTF.scroll);

            document.querySelector("#navigation").addEventListener("click", PTF.scrollTo);

            document.querySelector("#cr").addEventListener("click", PTF.rightScroll);
            document.querySelector("#cl").addEventListener("click", PTF.leftScroll);

            document.querySelectorAll(".projects-all-nav>ul>li").forEach((li) => { li.addEventListener("mouseleave", PTF.stopShowingText) });
        },

        // Mobile event listeners
        mobileHandlers: function () {
            document.querySelector("body").addEventListener("click", function (e) {
                if (e.target === document.querySelector("#menu-bar")) {
                    PTF.menuHandler(e);
                }
                if (e.target.closest("a") === e.target) {
                    PTF.closeHeader();
                }
            });
        }
    }
    window.addEventListener("DOMContentLoaded", PTF.init);
})();
