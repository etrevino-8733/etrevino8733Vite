
const template = document.createElement('template');

template.innerHTML = `
        <style>
            .bar1, .bar2, .bar3 {
                width: 35px;
                height: 5px;
                background-color: var(--color);
                margin: 6px 0;
                transition: 0.4s;
                border-radius: 6px;
            }
            .active .bar1 {
                transform: translate(0, 11px) rotate(-45deg);
              }
              
            .active .bar2 {opacity: 0;}
            
            .active .bar3 {
            transform: translate(0, -11px) rotate(45deg);
            }

            .main-nav-container{
                position: relative;
                display: flex;
                padding: 4px 12px;
                height: 25px;
                align-items: center;
                z-index: 999;
                gap: 10px;
            }
            .main-nav{
                margin-left: auto;
                font-weight: 600;
                color: inherit;
            }
            .main-nav ul{
                list-style-type: none;
            }
            .main-nav ul li{
                display: inline;
                padding: 10px;
            }

            .nav-button{
                background-color: inherit;
                color: inherit;
                padding: 10px;
                cursor: pointer;
                border-radius: 6px;
                border: none;
                flex: 1;
                transition: all 0.3s ease-in-out;
                text-decoration: none;
            }

            .collapsible-nav{
                display: none;
            }
            .collapsible-nav-btn{
                padding: 6px;
                border-radius: 6px;
            }
            .collapsible-nav-content{
                display: none;
            }
            .collapsible-nav-content.active{
                display: block;
                position: absolute;
                backdrop-filter: blur(4px);
                background-color: rgba(255, 255, 255, 0.93);
                -webkit-backdrop-filter: blur(4px);
                max-width: 200px;
                z-index: 99999;
                padding: 10px;
                border-radius: 6px;
                box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
            }
            .collapsible-nav-content ul{
                list-style-type: none;
                margin: 0;
                padding: 0;
                text-align: left;
            }
            .collapsible-nav-content ul li{
                padding: 10px;
            }
            .collapsible-nav-content ul li a{
                width: 100%;
            }

            .et-button:hover{
                // background: var(--highlight-background);
                // backdrop-filter: saturate(180%) blur(10px);
                color: var(--highlight-primary)
            }

            #logoSmallBox {
                background: linear-gradient(139deg, rgba(7, 77, 217, 1) 0%, rgba(87, 199, 173, 1) 0%, rgba(7, 77, 217, 1) 100%);
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
                -webkit-text-fill-color: transparent;
                font-weight: 700;
            }


            @media only screen and (max-width: 1200px) {
                .collapsible-nav{
                    display: block !important;
                }
                .main-nav{
                    display: none;
                }
            }
        </style>
        <div class="main-nav-container">
            <div class="collapsible-nav">
                <div role="button" class="collapsible-nav-btn et-button">
                    <div class="bar1"></div>
                    <div class="bar2"></div>
                    <div class="bar3"></div>
                </div>
                <nav class="collapsible-nav-content">
                    <ul id="col-nav-item-list">
                    </ul>
                </nav>
            </div>
            <div id="logoSmallBox">
                <span>Emmanuel Trevino</span>
            </div>
            <nav class="main-nav">
                <ul id="nav-item-list">
                </ul>
            </nav>
        </div>
        `;
class TopNav extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });        
        shadow.append(template.content.cloneNode(true));

        shadow.querySelector('.collapsible-nav').classList.add('collapsible-nav');



        const colBtn = shadow.querySelector('.collapsible-nav');
        const colBtnContent = shadow.querySelector('.collapsible-nav-content');
        colBtn.addEventListener("click", function () {
            colBtnContent.classList.toggle("active");
            colBtn.classList.toggle("active");
        });
    }

    connectedCallback() {
        this._navItems = this.getAttribute('nav-items');
        this._navItems = JSON.parse(this._navItems);

        for (let i = 0; i < this._navItems.length; i++) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.setAttribute('href', this._navItems[i].link);
            a.textContent = this._navItems[i].name;
            a.classList.add('nav-button', 'et-button');
            li.appendChild(a);
            this.shadowRoot.querySelector('#nav-item-list').appendChild(li);
            this.shadowRoot.querySelector('#col-nav-item-list').appendChild(li.cloneNode(true));
        }
    }

    static get observedAttributes() {
        return ['nav-items'];
    }
}

customElements.define('et-top-nav', TopNav);