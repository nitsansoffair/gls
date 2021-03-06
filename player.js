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
            left: -100px;
            top: 25px;
        `
    },
    {
        parentSelector: '.A8SBwf',
        selector: '.RNNXgb',
        content: '<p>Enter a search query here and click ENTER!</p>\n',
        tooltipTextStyles: `      
            right: 450px;  
            top: 47px;
        `
    },
    {
        parentSelector: '.FPdoLc.tfB0Bf',
        selector: '.gNO89b',
        isNested: true,
        content: '<p>Click here to search</p>\n',
        tooltipTextStyles: `
            bottom: -27px;
            right: -113px;
            width: 100px;
        `,
        tooltipStyles: `
            width: 130px;
            height: 30px;
            margin-left: 5px;
        `,
        containerStyles: `
            ;
            display: flex;
            justify-content: center;
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

    const { parentSelector, parentSelectorNumber = 0, selector, isNested = false, content, tooltipTextStyles, tooltipStyles, containerStyles } = steps[step];

    const container = document.querySelectorAll(parentSelector)[parentSelectorNumber];
    const element = container.querySelector(selector);

    steps[step].parentHTML = container;

    if(isNested){
        container.children[0].removeChild(element);
    } else {
        container.removeChild(element);
    }

    container.innerHTML += `
            <div id="tooltipdiv" class="tooltip" style="${tooltipStyles}">
                <span class="tooltiptext" onclick="createTooltip(${step} + 1)" style="${tooltipTextStyles}">
                    ${content}
                </span>   
            </div>
    `;

    if(containerStyles){
        steps[step].containerStylesOriginal = container.style.cssText;
        container.style.cssText += containerStyles;
    }

    const tooltipDiv = container.querySelector('#tooltipdiv');
    tooltipDiv.appendChild(element);
};

const removeTooltip = (step) => {
    const { parentSelector, parentSelectorNumber = 0, selector, isNested = false, containerStylesOriginal } = steps[step];

    const prevContainer = document.querySelectorAll(parentSelector)[parentSelectorNumber];
    const tooltipDiv = prevContainer.querySelector('#tooltipdiv');
    const prevElement = tooltipDiv.querySelector(selector);

    prevContainer.removeChild(tooltipDiv);

    if(isNested){
        prevContainer.children[0].appendChild(prevElement);
        prevContainer.style.cssText = containerStylesOriginal;
    } else {
        prevContainer.appendChild(prevElement);
    }
};

const testStyle = () => {
    appendStyle();

    let style = document.head.querySelector('#glsStyle');

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
        const { parentSelector, parentSelectorNumber = 0, isNested = false, selector, content, tooltipTextStyles, containerStyles } = steps[step];

        const container = document.querySelectorAll(parentSelector)[parentSelectorNumber];
        if(!container){
            throw new Error(`Container with selector: ${parentSelector} should exists!`);
        }

        const element = container.querySelector(selector);
        if(!element){
            throw new Error(`Element with selector: ${selector} should exists!`);
        }

        steps[step].parentHTML = container;

        if(isNested){
            container.children[0].removeChild(element);
        } else {
            container.removeChild(element);
        }

        container.innerHTML += `
            <div id="tooltipdiv" class="tooltip">
                <span class="tooltiptext" onclick="createTooltip(${step} + 1)" style="${tooltipTextStyles}">
                    ${content}
                </span>   
            </div> 
    `;

        if(containerStyles){
            steps[step].containerStylesOriginal = container.style.cssText;
            container.style.cssText += containerStyles;
        }

        if(container.style.cssText === steps[step].containerStylesOriginal){
            throw new Error(`Container with selector: ${parentSelector} style should change!`);
        }

        let tooltipDiv = container.querySelector('#tooltipdiv');
        if(!tooltipDiv){
            throw new Error(`Tooltip div at step: ${step} should exists!`);
        }

        tooltipDiv.appendChild(element);
        if(!tooltipDiv.querySelector(selector)){
            throw new Error(`Element with selector: ${selector} should be inside tooltip div!`);
        }

        removeTooltip(step);

        if(isNested){
            const prevContainer = document.querySelectorAll(parentSelector)[parentSelectorNumber];

            if(prevContainer.style.cssText !== steps[step].containerStylesOriginal){
                throw new Error(`Container with selector: ${parentSelector} style should return to ${steps[step].containerStylesOriginal}!`);
            }
        }

        tooltipDiv = container.querySelector('#tooltipdiv');
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
