function injectedFunction(title, content) {
    if(document.querySelector(".wikipdf-container")){
        return
    }
    let container = document.createElement("div")
    container.classList.add("wikipdf-container")

    let button1 = document.createElement("a")
    button1.innerText = "Download txt file"
    button1.classList.add("wikipdf-download")
    button1.href = URL.createObjectURL(new Blob([title, content]))
    button1.download = "wikipdf.md"

    let button2 = document.createElement("a")
    button2.classList.add("wikipdf-sponsor")
    button2.onclick = (e) => {
        e.preventDefault()
        window.location.href = "https://buy.stripe.com/aFacN43YSbxZ5Wgfg86kg04"
    }
    button2.innerText = "Buy me a coffee"

    container.appendChild(button1)
    container.appendChild(button2)

    document.getElementById("left-navigation").appendChild(container)
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tabInfo) => {
    const id = await chrome.tabs.get(tabId)
    const link = new URL(id["url"])

    if(link.hostname != "en.wikipedia.org"){
        return
    }

    const paths = (link.pathname.split("/"))[2]
    if(paths != "Main_Page"){
        const target = "https://en.wikipedia.org/w/rest.php/v1/page/" + paths
        const items = new Promise(async (resolve) => {
            const webby = (await fetch(target)).json()
            resolve(webby)
        })
        
        const page = await items

        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: injectedFunction,
          args: [page["title"], page["source"]],
        });
    }
})