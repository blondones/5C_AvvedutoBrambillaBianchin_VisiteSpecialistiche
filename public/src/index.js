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
    console.log(element)
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
        if (date.calendar("DD/MM/YYYY") < moment().calendar("DD/MM/YYYY") || closed.includes(date.format("dddd")) || isNaN(values[1])) validateInput = false;
        for(let i = 0; i < values.length; i++) {
            if(!values[i]) {
                validateInput = false;
                break;
            }
        }
        const json = await fetchComp.getBooks().catch(() => {
            validateInput = false;
            document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
            return false;
        });
        const list = json.filter((e) => e.Category.toLowerCase() === element.name.toLowerCase());
        for(let i = 0; i < list.length; i++) {
            if(list[i].date.split("T")[0] === date["_i"] && list[i].hour == values[1]) {
                validateInput = false;
                break;
            }
        };
        if (validateInput === undefined) {
            const book = {
                idType: element.name,
                date: date.format("YYYY-MM-DD"),
                hour:values[1],
                name: values[2]
            };
            await fetchComp.book(book).catch((error) => {
                validateInput = false;
                document.getElementById("result").innerHTML = validateInput === true ? "Ok" : "Ko";
                return false;
            });
            const newData = await fetchComp.getBooks();
            table.buildTable(newData);
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