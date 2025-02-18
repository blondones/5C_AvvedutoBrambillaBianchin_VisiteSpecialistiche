import { navBarComponent } from "./scripts/navbar.js";
import { createForm } from "./scripts/createForm.js";
import { createTable } from "./scripts/createTable.js";
import { generateFetchComponent } from "./scripts/fetchCache.js";
import moment from "/moment/dist/moment.js";

const forwardButton = document.getElementById("ahead");
const backButton = document.getElementById("back");
let offset = 0;

const fetchComp = generateFetchComponent();
const types = await fetchComp.getTypes();
const booking = await fetchComp.getBooks();

const table = createTable(document.getElementById("avabTable"));
table.buildTable(booking);

const f = createForm(document.querySelector(".content"));
const navbar = navBarComponent(document.getElementById("navbar"));

await navbar.callback(async(element) => {
    forwardButton.onclick = () => {
        offset++;
        table.render(element, offset);
    };

    backButton.onclick = () => {
        offset--;
        table.render(element, offset);
    };
    table.render(element, offset);

    f.setLabels(["Data", "Ora", "Nominativo"]);
    f.oncancel(() => { table.render(element, offset); });
    f.render();
    f.onsubmit(async (values) => {
        let validateInput;
        const date = moment(values[0], "YYYY/MM/DD");
        const closed = ["Saturday", "Sunday"];
        if (date.calendar() < moment().calendar("MM/DD/YYYY") || closed.includes(date.format("dddd")) || isNaN(values[1])) validateInput = false;
        const key = [element.name, date.format("DDMMYYYY"), values[1]].join("-");
        const json = await fetchComp.getBooks().catch(() => {
            validateInput = false;
            document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
            return false;
        });
        console.log(json)
        if (!json[key] && validateInput === undefined) {
            json[key] = values[2];
            const book = {
                idType: element.name,
                date: date.format("DD/MM/YYYY"),
                hour:values[1],
                name: values[2]
            };
            await fetchComp.book(book).catch((error) => {
                validateInput = false;
                document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
                return false;
            });
            table.render(element, offset);
            validateInput = true;
            document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
            return true;
        } else {
            validateInput = false;
            document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
            return false;
        }
    });
});
setInterval(() => {
    table.render(element, offset);
}, 300000);

navbar.build(types);
navbar.render();