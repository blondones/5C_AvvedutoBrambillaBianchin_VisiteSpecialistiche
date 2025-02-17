export function navBarComponent(parentElement) {
    let config;
    let bool;
    let callback;

    function activeNavBar(element) {
        deactiveAllNavBar(config);
        document.getElementById(element).classList.remove("text-gray-300", "hover:bg-gray-700", "hover:text-white");
        document.getElementById(element).classList.add("text-white");
    }

    function deactiveAllNavBar() {
        config.forEach((element) => {
            document.getElementById(element).classList.remove("text-white");
            document.getElementById(element).classList.add("text-gray-300", "hover:bg-gray-700", "hover:text-white");
        })
    }

    return {
        build: (conf) => {
           config = conf;
        },
        render: () => {
            let newNavBar = `<div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                                <div class="relative flex h-16 items-center justify-between">
                                
                                <div class="flex items-center">
                                    <div class="flex space-x-4">`

            config.forEach((element) => {
                newNavBar += `<button class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white" id=${element.name}>${element.name}</button>`
            })
            newNavBar += `</div>
                                </div>
                                <div class="flex items-center">
                                    <button type="button" id="open" class="rounded-full bg-gray-700 p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                        Prenota
                                    </button>
                                </div>
                                </div>
                            </div>`;

            parentElement.innerHTML = newNavBar;

            document.querySelector("#open").onclick = () => document.querySelector("#result").innerText = "";

            if (bool === false) {
                activeNavBar(config[0], config);
                bool = true;
                callback(config[0]);
            }

            config.forEach(element => document.getElementById(element.name).onclick = () => {
                activeNavBar(element, config);
                callback(element);
            })
        },
        callback(value){
            callback = value;
        }
    }
}