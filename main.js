(function () {
    const PFAPP = {
        allSections: document.querySelectorAll(".page"),
        currentSection: 0,

        init: function (e) {
            console.log("init");
            PFAPP.handlers();
        },

        // On mouse move apply effect
        enableMouseMove: true,
        mouseMoveEffect: function (e) {
            if (!PFAPP.enableMouseMove) return;

            PFAPP.enableMouseMove = false;
            let div = document.createElement("div");
            div.textContent = "+";
            div.classList.add("falling-x");
            div.style.left = e.x + "px";
            div.style.top = e.y + "px";
            document.querySelector("body").appendChild(div);
            div.addEventListener("animationend", () => { div.remove(); });
            setTimeout(() => { PFAPP.enableMouseMove = true }, 333);
        },

        // Scroll effect
        enableScroll: true,
        scroll: function (e) {
            // Easier to read
            let as = PFAPP.allSections;
            let cs = PFAPP.currentSection;

            if (!PFAPP.enableScroll) return;

            // DOWN SCROLL
            if (e.deltaY === 100) {
                if (cs === as.length - 1) return;

                PFAPP.enableScroll = false;

                // goes forward hiding itself
                as[cs].classList.add("go-forward");
                // next section goes forward taking its place
                as[cs + 1].classList.add("return-init-forward")
                as[cs + 1].style.display = "flex";

                as[cs].addEventListener("animationend", () => {
                    as[cs].style.display = "none";

                    // remove no more needed classes
                    as[cs].classList.remove("go-forward");
                    as[cs + 1]?.classList.remove("return-init-forward");
                    cs += 1;
                    PFAPP.currentSection = cs;
                });
                setTimeout(() => { PFAPP.enableScroll = true }, 1000);
            }

            // UP SCROLL
            if (e.deltaY === -100) {
                if (cs === 0) return;

                PFAPP.enableScroll = false;

                // current section goes back
                as[cs].classList.add("go-backward");
                // prev section goes to its place
                as[cs - 1].classList.add("return-init-backward");
                as[cs - 1].style.display = "flex"


                // when transition ends -> init current section
                as[cs].addEventListener("animationend", () => {
                    cs -= 1;
                    PFAPP.currentSection = cs;
                    as[cs].classList.remove("return-init-backward");
                    as[cs].classList.remove("go-forward");
                });
                setTimeout(() => { PFAPP.enableScroll = true }, 1000);
            }
            // timeout with animation time
        },

        //Event listeners
        handlers: function (e) {
            document.addEventListener("mousemove", PFAPP.mouseMoveEffect);

            document.addEventListener("wheel", PFAPP.scroll);
        }
    }
    window.addEventListener("DOMContentLoaded", PFAPP.init);
})();
