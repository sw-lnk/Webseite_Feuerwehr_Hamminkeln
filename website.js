// Mini-Verbesserung ohne JS-Framework (optionale progressive Enhancement) -->
// Jahreszahl automatisch
document.getElementById('year').textContent = new Date().getFullYear();

// Kontaktformular mit formbee.dev
// Key: 10ceba0d-a920-448e-8de1-686bfd1c576e
document.getElementById('contactForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();

    if (document.getElementById('usecase').value) {
        /* Hidde element filled; Spam? */
    } else {

    const formData = new FormData(ev.target);
    
    // Adding all form data to an object
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });      

    try {
        const response = await fetch('https://api.formbee.dev/formbee/10ceba0d-a920-448e-8de1-686bfd1c576e', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
        });

        if (response.ok) {
        alert('Nachricht wurde erfolgreich gesendet.');
        } else {
        alert('Nachricht konnte nicht gesendet werden.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error - Kontaktformular');
    }
    }
});


// Lese Pressemitteilungen aus dem Presseportan / News Aktuell -->
async function fetchRSS() {
    // RSS2JSON Proxy, um Feeds in JS nutzen zu können (Alternativen: eigenes PHP-Proxy-Script)
    const feedUrl = encodeURIComponent('https://www.presseportal.de/rss/dienststelle_165122.rss2');
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const newsarea = document.getElementById('ffh-news');
    let parser = new DOMParser();
    
    data.items.slice(0, 4).forEach(item => {
    const card = document.createElement('articel');
    card.className = "card";

    const content = item.content;        
    let doc = parser.parseFromString(content, 'text/html');
    let firstImg = doc.querySelector('img');
    let imgSrc = firstImg ? firstImg.getAttribute('src') : null;

    const feedImage = document.createElement('img');
    feedImage.src = imgSrc;
    feedImage.style.maxWidth = "200px";
    feedImage.style.maxHeight = "250px";
    feedImage.border = "0";
    
    const feedTitle = document.createElement('h3');
    feedTitle.textContent = item.title.replace('FW Hamminkeln: ', "");

    const feedContent = document.createElement('p');
    feedContent.className = "muted";
    feedContent.textContent = item.description.replace('Hamminkeln (ots) - ', "");
    
    const feedLink = document.createElement('a');
    feedLink.href = item.link;
    feedLink.textContent = "Gesamte Mitteilung";
            
    card.appendChild(feedTitle);        
    card.appendChild(feedImage);
    card.appendChild(feedContent);
    card.appendChild(feedLink);        
    
    newsarea.appendChild(card);
    });
}
fetchRSS();