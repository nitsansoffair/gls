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
            top: 25px;
        `
    },
    {
        parentSelector: '.A8SBwf',
        selector: '.RNNXgb',
        content: '<p>Enter a search query here and click ENTER!</p>\n',
        tooltipTextStyles: `
            top: 47px;
            right: 450px;      
            bottom: unset;  
        `
    },
    {
        parentSelector: '.iblpc',
        selector: '.hsuHs',
        content: '<p>Click here to search</p>\n',
        tooltipTextStyles: `
            bottom: 22px;
            right: 12px;
            width: 100px;
        `
    }
];

const appendStyle = () => {
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
};

const createTooltip = (step = 0) => {
    if(step === steps.length){
        removeTooltip(step - 1);

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

const tests = () => {
    for(let step = 0; step < steps.length; step++){
        if(step === steps.length){
            removeTooltip(step - 1);

            let tooltipDiv = document.querySelector('#tooltipdiv');
            if(tooltipDiv){
                throw new Error(`Tooltip div at step: ${step} should not exists!`);
            }

            return;
        }

        const { parentSelector, parentSelectorNumber = 0, selector, content, tooltipTextStyles } = steps[step];

        const container = document.querySelectorAll(parentSelector)[parentSelectorNumber];
        if(!container){
            throw new Error(`Container with selector: ${parentSelector} should exists!`);
        }

        const element = document.querySelector(selector);
        if(!element){
            throw new Error(`Element with selector: ${selector} should exists!`);
        }

        steps[step].parentHTML = container;

        if(step > 0){
            removeTooltip(step - 1)
        }

        let tooltipDiv = document.querySelector('#tooltipdiv');
        if(tooltipDiv){
            throw new Error(`Tooltip div at step: ${step} should not exists!`);
        }

        container.removeChild(element);
        container.innerHTML += `
            <div id="tooltipdiv" class="tooltip">
                <span class="tooltiptext" onclick="createTooltip(${step} + 1)" style="${tooltipTextStyles}">
                    ${content}
                </span>   
            </div> 
    `;

        tooltipDiv = document.querySelector('#tooltipdiv');
        if(!tooltipDiv){
            throw new Error(`Tooltip div at step: ${step} should exists!`);
        }

        tooltipDiv.appendChild(element);
        if(!tooltipDiv.querySelector(selector)){
            throw new Error(`Element with selector: ${selector} should be inside tooltip div!`);
        }
    }

    removeTooltip(steps.length - 1);

    console.log('Tests passed!');
};

tests();

appendStyle();

createTooltip();
