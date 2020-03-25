const style = document.createElement('style');

style.innerHTML = `
.tooltip {
    position: relative;
}

.tooltip .tooltiptext {    
    visibility: hidden;
    bottom: 60%;
    background-color: black;
    color: #fff;
    padding: 5px;
    border-radius: 6px;
    text-align: center;
    
    position: absolute;
    z-index: 1;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
}
  `;

document.head.appendChild(style);

const steps = [
    {
        parentSelector: '#lga',
        selector: '#hplogo',
        content: '<p>Welcome to <em><strong>Google</strong></em>!</p>\n'
    },
    {
        parentSelector: '.gb_h.gb_i',
        parentSelectorNumber: 1,
        selector: '.gb_g[data-pid="2"]',
        content: '<p>Click <strong>Images</strong> to go to images section</p>\n',
        tooltipTextStyles: `
            bottom: unset;
            left: -100px;
            top: 26px;
        `
    },
    {
        parentSelector: '.SDkEP',
        selector: '.a4bIc',
        content: '<p>Enter a search query here and click ENTER!</p>\n'
    },
    {
        parentSelector: '.SDkEP',
        selector: '.iblpc',
        content: '<p>Click here to search</p>\n',
    }
];



const createTooltip = (step = 0) => {
    if(step > 3){
        return;
    }

    const { parentSelector, parentSelectorNumber = 0, selector, content, tooltipTextStyles } = steps[step];

    const container = document.querySelectorAll(parentSelector)[parentSelectorNumber];
    const element = document.querySelector(selector);

    steps[step].parentHTML = container;

    if(step > 0){
        removeTooltip(step - 1)
    }

    container.removeChild(element);
    container.innerHTML += `
            <div id="tooltipdiv" class="tooltip">
                <span class="tooltiptext" onclick="createTooltip(${step} + 1)" style="${tooltipTextStyles}">
                    ${content}
                </span>   
            </div> 
    `;

    const tooltipDiv = document.querySelector('#tooltipdiv');
    tooltipDiv.appendChild(element);
};

const removeTooltip = (step) => {
    const { parentSelector, parentSelectorNumber = 0, selector } = steps[step];

    const prevContainer = document.querySelectorAll(parentSelector)[parentSelectorNumber];
    const tooltipDiv = document.querySelector('#tooltipdiv');
    const prevElement = document.querySelector(selector);

    prevContainer.removeChild(tooltipDiv);
    prevContainer.appendChild(prevElement);
};

createTooltip();
