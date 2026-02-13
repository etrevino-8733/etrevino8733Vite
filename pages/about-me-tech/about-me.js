document.addEventListener('DOMContentLoaded', () => {
    let stackItems = document.querySelectorAll('.stack-element');
    let stackItemsCoor = new Object();
    setItems(stackItems, stackItemsCoor);
    let stackCards = document.querySelector('.stack-card');
    let stackItemTop = stackCards.getBoundingClientRect().top;
    document.querySelector('.scroll-icon').style.opacity = '1';

    function trickleStackEventListener(event, callback){
        const wrapper = e => {
                callback(e, () => document.removeEventListener(event, wrapper));
            }
        document.addEventListener(event, wrapper);
    }

    document.querySelector('.danger-button').addEventListener('mouseover', (e) => {
        console.log('hover');
        e.target.innerHTML = "DON'T DO IT!";
    });
    document.querySelector('.danger-button').addEventListener('mouseout', (e) => {
        e.target.innerHTML = "DO NOT CLICK!";
    });

    
    trickleStackEventListener('scroll', (e, closeListener) => {
        let stackItemTop = stackItems[0].getBoundingClientRect().top;
        let windowBottom = window.innerHeight;

        if(window.scrollY > 20) {
            let scrollIcon = document.querySelector('.scroll-icon');
            scrollIcon.style.opacity = '0';
        };

        if(windowBottom > stackItemTop){
            for(let key in stackItemsCoor){
                moveItems(stackItemsCoor[key]);
            }
            let stackContainer = document.querySelector('.stack-container');
            stackContainer.style.height = 'auto';
            closeListener();
        }

        if(windowBottom < stackItemTop){
            setItems(stackItems, stackItemsCoor);
        }
    });
});

function moveItems(item){
    let transitionSeconds = Math.floor(1 + Math.random() * 0.5);
    item.element.style.transition = 'transform '+ transitionSeconds + 's';
    item.element.style.transitionTimingFunction = 'ease-out';
    item.element.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';            
}

async function setItems(stackItems, stackItemsCoor){
    let bodyRect = document.body.getBoundingClientRect();
    let stackContainer = document.querySelector('.stack-container');
    stackContainer.style.height = stackContainer.getBoundingClientRect().height + 'px';

    for(let i = 0; i < stackItems.length; i++){
        let item = stackItems[i];
        let xtrans = Math.floor(Math.random() * (-5000 - -window.innerWidth) +  -window.innerWidth);

        stackItemsCoor[item.textContent] = {
            element: item,
        }
        stackItemsCoor[item.textContent].element.style.transition = 'transform 0s';
        stackItemsCoor[item.textContent].element.style.transform = 'translate(' + xtrans + 'px, ' + 0 + 'px)';
    }
}

function flipCard(cardId){
    const card = document.getElementById(cardId);
    card.classList.toggle('is-flipped');
  }