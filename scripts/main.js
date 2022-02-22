const URL = `https://api.shrtco.de/v2/shorten?url=`;
const shortedContainer = document.querySelector('.shorted-container');
const shortenBtn = document.querySelector('.shorten-btn');
const shortenInput = document.querySelector('.shorten-input');
const cleanBtn = document.querySelector('#shorted-clear');
const shortenError = document.querySelector('.shorten-error');
const menuMobile = document.querySelector('.menu-mobile');
const menuIcon = document.querySelector('.menu')

let links = JSON.parse(localStorage['link'] || "[]");

if (links) renderLinks();

function renderLinks() {
          const linksHTML = links.reduce( (a, link) => {
                    if (link!=null) {
                              a = a + ` <div class="shorted">
                              <a target="_blank" class="shorted-web" href="${link.original_link}">${link.original_link}</a>
                              <a target="_blank" class="shorted-link" href="${link.full_short_link}">${link.full_short_link}</a>
                              <button class="shorted-btn">Copy</button>
                              </div>`;
                    }
                    return a;
          }, "");
          shortedContainer.innerHTML = linksHTML;
          document.querySelectorAll('.shorted-btn:not(#shorted-clear)').forEach( btn => btn.addEventListener('click', copyLink));
          
}

async function getShorten(value) {

          const response = await fetch(URL+value);
          if (response.status == 400) {
                    shortenInput.classList.add("error");
                    shortenError.classList.add("active");
          } else {
                    const data = await response.json();
                    links.push(data.result);
                    renderLinks();
          }
}

function getValue() {
          if (shortenInput.value) {
                    getShorten(shortenInput.value);
                    shortenInput.value = "";
          } else {
                    shortenInput.classList.add("error");
                    shortenError.classList.add("active");
          }
}

function saveLinks() {
          if(links != [null]) localStorage['link'] = JSON.stringify(links);
}

function cleanList() {
          links = [];
          renderLinks();
}

function cleanError() {
          shortenInput.classList.remove('error');
          shortenError.classList.remove("active");
}

async function copyLink(e) {
          const LINK  = e.path[1].querySelector('.shorted-link').textContent;
          try {
                    const COPY = document.querySelector('.shorted-btn.copied');
                    COPY.classList.remove('copied');
                    COPY.textContent = "Copy"
          } catch{}
          await navigator.clipboard.writeText(LINK);
          e.target.classList.add("copied");
          e.target.textContent = "Copied!";
}

function toogleMenu() {
          menuMobile.classList.toggle("active");
}

function closeMenu() {
          menuMobile.classList.remove("active");
}

shortenBtn.addEventListener('click', getValue);
shortenInput.addEventListener('click', cleanError);
cleanBtn.addEventListener('click', cleanList);
window.addEventListener('beforeunload', saveLinks);
document.querySelectorAll('.shorted-btn:not(#shorted-clear)').forEach( btn => btn.addEventListener('click', copyLink));
menuIcon.addEventListener('click', toogleMenu);
window.addEventListener('click', closeMenu, true);
menuMobile.addEventListener('click', toogleMenu);

