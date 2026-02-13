const TopNavStyle = document.createElement('style');
TopNavStyle.textContent = `

.main-nav-container{
    display: flex;
    padding: 4px 12px;
    height: 60px;
    align-items: center;
    z-index: 999;
}
.main-nav{
    margin-left: auto;
    font-weight: 600;
    color: var(--color);
}
.main-nav ul{
    list-style-type: none;
}
.main-nav ul li{
    display: inline;
    padding: 10px;
}
.main-nav ul li a{
    text-decoration: none !important;
    color: white;
    background-color: transparent;
}

.collapsible-nav{
    display: none;
    padding: 4px;
    height: 100%;
}
.collapsible-nav-btn{
    height: 100%;
    aspect-ratio: 1/1;
}
.collapsible-nav-content{
    display: none;
}
.collapsible-nav-content.active{
    display: block;
    position: absolute;
    top: 60px;
    left: 20px;
    background-color: var(--bg-card);
    max-width: 200px;
    z-index: 999;
    padding: 10px;
    border: solid 2px var(--border-color);
    border-radius: 6px;
}
.collapsible-nav-content ul{
    list-style-type: none;
    margin: 0;
    padding: 0;
}
.collapsible-nav-content ul li{
    padding: 10px;
}


@media only screen and (max-width: 1200px) {
    .collapsible-nav{
        display: block !important;
    }
    .main-nav{
        display: none;
    }
}`;