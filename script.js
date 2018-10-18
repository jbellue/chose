const start = () => {
    FastClick.attach(document.body);
    let timerTrigger = -1;
    let resetAllTimeout = -1;
    let vibrate = false;
    const triggerTimeout = 2500;
    const displayTimeout = 1500;
    const defaultColours = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
    let colour = [];
    const mainContainer = document.getElementById("mainContainer");
    const helpContainer = document.getElementById("helpContainerWrapper");
    const menuContainer = document.getElementById("menuContainer");
    const footerContainer = document.getElementById("footerContainer");
    const labelNumber1 = document.getElementById("label-number1");
    const radioSelectNumber = document.getElementById("radio-selectNumber");
    const optionSelect = document.getElementById("option-select");
    const optionSelectIcon = document.getElementById("option-select-icon");
    const optionGroupIcon = document.getElementById("option-group-icon");
    const helpIcon = document.getElementById("toggle-help");
    const optionOrdinateIcon = document.getElementById("option-ordinate-icon");
    const touches = document.getElementsByClassName("touchWrapper");
    
    const showSelect = () => {
        labelNumber1.style.display = "";
        labelNumber1.style.visibility = "";
        radioSelectNumber.style.display = "";
        radioSelectNumber.style.visibility = "";
        optionSelectIcon.classList.remove("md-inactive");
        optionGroupIcon.classList.add("md-inactive");
        optionOrdinateIcon.classList.add("md-inactive");
    };
    
    const showGroup = () => {
        labelNumber1.style.display = "none";
        labelNumber1.style.visibility = "hidden";
        radioSelectNumber.style.display = "";
        radioSelectNumber.style.visibility = "";
        if (document.getElementById("number-1").checked) {
            document.getElementById("number-2").checked = true;
        }
        optionSelectIcon.classList.add("md-inactive");
        optionGroupIcon.classList.remove("md-inactive");
        optionOrdinateIcon.classList.add("md-inactive");
    };
    
    const showOrdinate = () => {
        radioSelectNumber.style.display = "none";
        radioSelectNumber.style.visibility = "hidden";
    
        optionSelectIcon.classList.add("md-inactive");
        optionGroupIcon.classList.add("md-inactive");
        optionOrdinateIcon.classList.remove("md-inactive");
    };
    // Properly initialise the radio buttons
    if (optionSelect.checked) {
        showSelect();
    }
    else if (document.getElementById("option-group").checked) {
        showGroup();
    }
    else { //option-ordinate
        showOrdinate();
    }
    
    if (screenfull.isFullScreen) {
        document.getElementById("toggle-vibration").classList.remove("md-inactive");
    }
    
    // set the events on the radio buttons
    optionSelect.addEventListener("change", () => showSelect());
    document.getElementById("option-group").addEventListener("change", () => showGroup());
    document.getElementById("option-ordinate").addEventListener("change", () => showOrdinate());
    
    // toggling the vibration
    document.getElementById("toggle-vibration").addEventListener("click", (e) => {
        e.target.classList.toggle("md-inactive");
        vibrate = !vibrate;
        if(vibrate) {
            window.navigator.vibrate(50);
        }
    });
    
    // toggling fullscreen
    document.getElementById("toggle-fullscreen").addEventListener("click", (e) => {
        e.target.classList.toggle("md-inactive");
        screenfull.toggle();
    });
    
    // showing the help
    helpIcon.addEventListener("click", e => {
            helpContainer.style.display = "block"; 
            helpIcon.classList.remove("md-inactive");
    });
    
    helpContainer.addEventListener("click", e => {
        hideHelp();
    });
    
    const hideHelp = () => {
        helpContainer.style.display = "none";
        helpIcon.classList.add("md-inactive");
    };
    screenfull.on('change', () => {
        document.getElementById("toggle-fullscreen").classList.toggle("md-inactive");
    });
    
    const getRandomColour = () => colour.splice(Math.floor(Math.random() * colour.length), 1)[0];
    
    const getNoTeamColour = () => '#C0C0C0'; // you go Glen
    
    const getRadioValue = id => Number(document.querySelector(`input[name="${id}"]:checked`).value);
    
    const shuffleArray = array => {
        let currentIndex = array.length;
    
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex--);
    
            // And swap it with the current element.
            let temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };
    
    const selectPlayers = (numberToSelect) => {
        const playerList = [...touches].map(t => t.id);
        const shuffledList = shuffleArray(playerList);
    
        let i;
        for (i=0; i < shuffledList.length; ++i) {
            const element = document.getElementById(shuffledList[i]);
            if (element) {
                if (i < numberToSelect) {
                    const spinner = element.getElementsByTagName("div")[1];
                    spinner.style.borderColor = spinner.style.borderTopColor;
                    if (numberToSelect == 1) {
                        document.body.style.background = spinner.style.borderTopColor;
                        const eyeCandy = document.createElement("div");
                        element.insertBefore(eyeCandy, element.firstChild);
                        eyeCandy.classList.add("shrinkToSize");
                    }
                }
                else {
                    element.parentNode.removeChild(element);
                }
            }
        }
    };
    
    const selectTeams = (numberOfTeams) => {
        const splitIntoTeams = (randomisedTouches, numberOfTeams) => {
            const touchCount = randomisedTouches.length;
            const teamArray = [];
            let i = 0;
            if (touchCount % numberOfTeams === 0) {
                const size = Math.floor(touchCount / numberOfTeams);
                while (i < touchCount) {
                    teamArray.push(randomisedTouches.slice(i, i += size));
                }
            }
            else {
                while (i < touchCount) {
                    const size = Math.ceil((touchCount - i) / numberOfTeams--);
                    teamArray.push(randomisedTouches.slice(i, i += size));
                }
            }
            return teamArray;
        };
        const playerList = [...touches].map(t => t.id);
        if (numberOfTeams > playerList.length) {
            throw new RangeError("selectTeams: more elements taken than available");
        }
        const splitTeams = splitIntoTeams(shuffleArray(playerList), numberOfTeams);
        for (let i=0; i < splitTeams.length; ++i) {
            const teamColour = getRandomColour();
            for (let j=0; j < splitTeams[i].length; ++j) {
                const e = document.getElementById(splitTeams[i][j]);
                if (e) {
                    e.firstChild.style.background = teamColour;
                    const spinner = e.getElementsByTagName("div")[1];
                    spinner.style.borderColor = teamColour;
                }
            }
        }
    };
    
    const selectNumbers = () => {
        const playerList = [...touches].map(t => t.id);
        const randomisedTouches = shuffleArray(playerList);
        for (let i = 0; i < randomisedTouches.length; ++i) {
            const e = document.getElementById(randomisedTouches[i]);
            if (e) {
                const spinner = e.getElementsByTagName("div")[1];
                spinner.style.borderColor = spinner.style.borderTopColor;
                const s = e.getElementsByTagName("span")[0];
                if (s) {
                    s.textContent = i + 1;
                }
            }
        }
    };
    
    const resetAll = () => {
        colour = defaultColours.slice();
        document.body.style.background = "#332f35";
        showMenu();
        [...touches].forEach(t => {
            t.parentNode.removeChild(t);
        });
        clearTimeout(timerTrigger);
        clearTimeout(resetAllTimeout);
    
        mainContainer.removeEventListener("touchstart", ignoreEvent);
        mainContainer.removeEventListener("touchmove", ignoreEvent);
        mainContainer.removeEventListener("touchend", ignoreEvent);
        mainContainer.removeEventListener("touchend", handleFinishTouchEnd);
    
        mainContainer.addEventListener("touchstart", handleNewTouch);
        mainContainer.addEventListener("touchmove", handleTouchMove);
        mainContainer.addEventListener("touchend", handleTouchEnd);
    };
    
    const triggerSelection = () => {
        clearTimeout(timerTrigger);
    
        const numbersSelected = getRadioValue("number");
        switch (getFeatureType()) {
            case featureTypes.select :
                selectPlayers(numbersSelected);
                break;
            case featureTypes.teams :
                selectTeams(numbersSelected);
                break;
            case featureTypes.ordinate :
                selectNumbers();
                break;
            default:
                throw new Error("Unrecognised feature type.");
        }
    
        if (vibrate) {
            window.navigator.vibrate([50, 10, 50]);
        }
    
        mainContainer.removeEventListener("touchstart", handleNewTouch);
        mainContainer.addEventListener("touchstart", ignoreEvent);
        mainContainer.removeEventListener("touchend", handleTouchEnd);
        mainContainer.addEventListener("touchend", handleFinishTouchEnd);
    };
    
    const hideMenu = () => {
        menuContainer.classList.add("transformUp");
        menuContainer.classList.remove("transformBackIn");
        footerContainer.classList.add("transformDown");
        footerContainer.classList.remove("transformBackIn");
    };
    const showMenu = () => {
        menuContainer.classList.remove("transformUp");
        menuContainer.classList.add("transformBackIn");
        footerContainer.classList.remove("transformDown");
        footerContainer.classList.add("transformBackIn");
    };
    
    const handleNewTouch = ev => {
        hideMenu();
        const changedTouches = ev.changedTouches;
        for (let i=0; i < changedTouches.length; ++i) {
            const newTouch = document.createElement("div");
            const circle = document.createElement("div");
            const span = document.createElement("span");
            const spinner = document.createElement("div");
            spinner.classList.add("spinner");
            circle.classList.add("touch");
            newTouch.id = `touch-${changedTouches[i].identifier}`;
            newTouch.classList.add("touchWrapper");
            const touchColour = getFeatureType() == featureTypes.teams ? getNoTeamColour() : getRandomColour();
            spinner.style.borderTopColor = touchColour;
            circle.style.background = touchColour;
            newTouch.style.color = touchColour;
            newTouch.style.top = `${changedTouches[i].pageY}px`;
            newTouch.style.left = `${changedTouches[i].pageX}px`;
            newTouch.appendChild(circle);
            newTouch.appendChild(spinner);
            newTouch.appendChild(span);
            mainContainer.appendChild(newTouch);
        }
        resetTimerTrigger();
    };
    
    const resetTimerTrigger = () => {
        const feature = getFeatureType();
        clearTimeout(timerTrigger);
        if (
            (feature == featureTypes.select && touches.length > getRadioValue("number")) ||
            (feature == featureTypes.teams && touches.length >= getRadioValue("number")) ||
             feature == featureTypes.ordinate
        ) {
            timerTrigger = setTimeout(triggerSelection, triggerTimeout);
        }
    };
    
    const featureTypes = Object.freeze({
        select: 1,
        teams: 2,
        ordinate: 3
    });
    
    const getFeatureType = () => {
        switch (document.querySelector('input[name="selector"]:checked').value) {
            case 'select':
                return featureTypes.select;
            case 'teams':
                return featureTypes.teams;
            case 'ordinate':
                return featureTypes.ordinate;
            default:
                throw new Error("Unrecognised feature type.");
        }
    };
    
    const handleTouchMove = ev => {
        eventHandler(ev);
    };
    
    const ignoreEvent = ev => {
        ev.preventDefault();
    };
    
    const handleTouchEnd = ev => {
        eventHandler(ev);
    };
    
    const handleFinishTouchEnd = ev => {
        eventHandler(ev, true);
    };
    
    const eventHandler = (ev, finish = false) => {
        ev.preventDefault();
        const changedTouches = ev.changedTouches;
        for (let i=0; i < changedTouches.length; ++i) {
            const element = document.getElementById(`touch-${changedTouches[i].identifier}`);
            if (element) {
                switch (ev.type) {
                    case "touchmove":
                        if (!element.classList.contains("locked")) {
                            element.style.top = `${changedTouches[i].pageY}px`;
                            element.style.left = `${changedTouches[i].pageX}px`;
                        }
                        break;
                    case "touchend":
                        if (!finish) {
                            if (getFeatureType() != featureTypes.teams) {
                                colour.push(element.firstChild.style.backgroundColor);
                            }
                            element.parentNode.removeChild(element);
                            resetTimerTrigger();
                        }
                        else {
                            element.classList.add("locked");
                            if (document.querySelectorAll(".touchWrapper:not(.locked)").length == 0) {
                                resetAllTimeout = setTimeout(resetAll, displayTimeout);
                            }
                        }
                        break;
                    default:
                        throw new Error("Unrecognised event type.");
                }
            }
        }
    
        if (ev.type == "touchend" && touches.length == 0) {
            showMenu();
        }
    };
    
    resetAll();
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}