console.log("Extension activated on SomToday page!");

function replaceText() {
    const elements = document.getElementsByTagName('*');
    
    for (let element of elements) {
        for (let node of element.childNodes) {
            if (node.nodeType === 3) { // Text node
                const text = node.nodeValue;
                const replacedText = text.replace(/Cijfers/gi, 'grades');
                
                if (text !== replacedText) {
                    node.nodeValue = replacedText;
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes('https://leerling.somtoday.nl/cijfers/')) {
        console.log("On the SomToday page!");
        replaceText();
        
        // Handle dynamic content updates
        const observer = new MutationObserver(replaceText);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});