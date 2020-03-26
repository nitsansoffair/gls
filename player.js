const steps = [
    {
        parentSelector: '#lga',
        selector: '#hplogo',
        content: '<p>Welcome to <em><strong>Google</strong></em>!</p>\n',
        tooltipTextStyles: `
            bottom: 120px;
        `,
        tooltipStyles: `
            width: 272px;
        `
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
            bottom: unset;
            right: 450px;  
            top: 47px;
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

const styleHTML = `
        .tooltip {
            position: relative;
        }
        
        .tooltip .tooltiptext {    
            visibility: hidden;
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

const appendStyle = () => {
    const style = document.createElement('style');

    style.id = 'glsStyle';
    style.innerHTML = styleHTML;
    document.head.appendChild(style);
};

const createTooltip = (step = 0) => {
    if(step > 0){
        removeTooltip(step - 1)
    }

    if(step === steps.length){
        return;
    }

    const { parentSelector, parentSelectorNumber = 0, selector, content, tooltipTextStyles, tooltipStyles } = steps[step];

    const container = document.querySelectorAll(parentSelector)[parentSelectorNumber];
    const element = document.querySelector(selector);

    steps[step].parentHTML = container;

    container.removeChild(element);
    container.innerHTML += `
            <div id="tooltipdiv" class="tooltip" style="${tooltipStyles}">
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

const testStyle = () => {
    appendStyle();

    let style = document.querySelector('#glsStyle');

    if(!style){
        throw new Error('Style should exists!');
    }

    if(style.innerHTML !== styleHTML){
        throw new Error(`Expected style HTML: ${styleHTML}, but got style HTML: ${style.innerHTML}!`);
    }

    document.head.removeChild(style);
    style = document.querySelector('#glsStyle');

    if(style){
        throw new Error('Style should not exists!');
    }
};

const testTooltip = () => {
    for(let step = 0; step < steps.length; step++){
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

        container.removeChild(element);
        container.innerHTML += `
            <div id="tooltipdiv" class="tooltip">
                <span class="tooltiptext" onclick="createTooltip(${step} + 1)" style="${tooltipTextStyles}">
                    ${content}
                </span>   
            </div> 
    `;

        let tooltipDiv = document.querySelector('#tooltipdiv');
        if(!tooltipDiv){
            throw new Error(`Tooltip div at step: ${step} should exists!`);
        }

        tooltipDiv.appendChild(element);
        if(!tooltipDiv.querySelector(selector)){
            throw new Error(`Element with selector: ${selector} should be inside tooltip div!`);
        }

        removeTooltip(step);

        tooltipDiv = document.querySelector('#tooltipdiv');
        if(tooltipDiv){
            throw new Error(`Tooltip div at step: ${step} should not exists!`);
        }
    }
};

const tests = () => {
    testStyle();

    testTooltip();

    console.log('Tests passed!');
};

const start = () => {
    appendStyle();

    createTooltip();
};

try {
    tests();
} catch (e) {
    console.log(`A test has been failed: ${e.stack}`);
}

start();
