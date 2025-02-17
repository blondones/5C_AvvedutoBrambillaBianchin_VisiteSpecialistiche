import moment from "../../node_modules/moment/dist/moment.js"
import { generateFetchComponent } from "./fetchCache.js"
import { parseConfiguration } from "./jsonParser.js";

export const createTable = (parentElement) => {
  let availabilities = {};
  let config = {};
  let currentWeekOffset = 0;
  let fetchComp;
  moment.locale("it");


  const getWeekDates = (offset) => {
    const startOfWeek = offset < 0 ? moment().startOf('week').subtract(Math.abs(offset), 'weeks') : moment().startOf('week').add(offset, 'weeks');
    const weekDates = [];
    for (let day = 1; day < 6; day++) {
      const date = startOfWeek.clone().add(day, 'days').format('DDMMYYYY');
      weekDates.push(date);
    }
    return weekDates;
  };


  return {
    render: (selectedCategory, offset) => {
      parentElement.innerHTML = null;
      document.querySelector("#loading").classList.remove("hidden");
      document.querySelector("#loading").classList.remove("showable");
      currentWeekOffset = offset ?? 0;
      fetchComp.getData().then((resp) => {
        console.log(resp);
        availabilities = JSON.parse(resp);
        const weekDates = getWeekDates(currentWeekOffset);

        let headerRow = `<tr><th class="px-6 py-3">Ora</th>`;
        weekDates.forEach(date => {
          headerRow += `<th class="px-6 py-3">` + moment(date, `DDMMYYYY`).format("dddd DD/MM/YYYY") + `</th>`;
        });
        headerRow += `</tr>`;

        const hours = config.hours;
        let rows = ``;
        hours.forEach(hour => {
          rows += `<tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"><th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">` + hour + `:00</th>`;
          weekDates.forEach(date => {
            const key = selectedCategory + `-` + date + `-` + hour;
            const booking = availabilities[key] || ``;
            rows += `<td class="px-6 py-4"">` + (booking ? booking : ``) + `</td>`;
          });
          rows += `</tr>`;
        });

        const tableHTML =
          `<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"><thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">` + headerRow + `</thead>` +
          `<tbody>` + rows + `</tbody></table>`;

        parentElement.innerHTML = tableHTML;
        document.querySelector("#loading").classList.add("hidden");
      });
      document.querySelector("#loading").innerHTML =
        `<div class="flex-col gap-4 w-full flex items-center justify-center">
  <div class="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" class="animate-ping">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
    </svg>
  </div>
</div>`;
    },

    buildTable: () => {
      return new Promise((resolve, reject) => {
        fetchComp = generateFetchComponent();
        fetchComp.build("../../config.json").then(() => {
          return parseConfiguration("../../config.json")
            .then((parsedConfig) => {
              config = parsedConfig;
              resolve("ok")
            });
        }).catch(reject)
      });

    }
  };
};