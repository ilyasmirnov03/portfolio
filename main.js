(function () {
    const PTF = {

        allSections: document.querySelectorAll(".page"),
        currentSection: 0,
        animationTime: parseInt(getComputedStyle(document.documentElement).getPropertyValue("--animation-time").charAt(1)) * 1000,

        init: function () {
            console.log("init");
            PTF.zIndex();
            PTF.dNone();
            PTF.handlers();
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

        // Scroll effect
        enableScroll: true,
        scroll: function (e) {
            // Easier to read
            let as = PTF.allSections;
            let cs = PTF.currentSection;

            if (!PTF.enableScroll) return;

            // DOWN SCROLL
            if (e.deltaY === 100) {
                if (cs === as.length - 1) return;

                PTF.enableScroll = false;

                // goes forward hiding itself
                as[cs].classList.add("go-forward");
                // next section goes forward taking its place
                as[cs + 1].classList.add("return-init-forward")
                as[cs + 1].style.display = "flex";

                cs += 1;

                // actions on prev section 
                setTimeout(() => {
                    as[cs - 1].style.display = "none";
                    // remove no more needed classes in previous section
                    as[cs - 1].classList.remove("go-forward");
                    //remove in the current
                    as[cs].classList.remove("return-init-forward");
                    as[cs].classList.remove("go-backward");

                    PTF.currentSection = cs;
                    PTF.enableScroll = true
                }, PTF.animationTime);
            }

            // UP SCROLL
            if (e.deltaY === -100) {
                if (cs === 0) return;

                PTF.enableScroll = false;

                // current section goes back
                as[cs].classList.add("go-backward");
                // prev section goes to its place
                as[cs - 1].classList.add("return-init-backward");
                as[cs - 1].style.display = "flex";

                cs -= 1;

                // actions on prev section 
                setTimeout(() => {
                    as[cs + 1].style.display = "none";
                    //remove no more needed classes in prev section
                    as[cs + 1].classList.remove("return-init-backward");
                    as[cs + 1].classList.remove("go-forward");

                    // remove in the current
                    as[cs].classList.remove("return-init-backward");

                    PTF.currentSection = cs;
                    PTF.enableScroll = true;
                }, PTF.animationTime);
            }
            // timeout with animation time
        },

        //Event listeners
        handlers: function (e) {
            document.addEventListener("mousemove", PTF.mouseMoveEffect);

            document.addEventListener("wheel", PTF.scroll);
        }
    }
    window.addEventListener("DOMContentLoaded", PTF.init);
})();
