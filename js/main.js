/**
 * Creates a text enricher function that finds city names in text
 * and appends population and ranking info based on CSV data.
 *
 * @param {string} csvText - The content of the CSV file as plain text.
 * @returns {function(string): string} A function that enriches input text with city information.
 */

function makeCityEnricher(csvText) {
  // Parse CSV text into structured city objects
  const cityData = csvText
    .split("\n")
    .filter((str) => str !== "" && str[0] !== "#") // Skip empty or commented lines
    .map((line) => {
      const [x, y, name, population] = line.split(",");
      return {
        x: parseFloat(x),
        y: parseFloat(y),
        name: name?.trim(),
        population: parseInt(population, 10),
      };
    })
    .sort((a, b) => b.population - a.population) // Sort cities by descending population
    .slice(0, 10) // Keep only top 10
    .reduce((acc, city, index) => {
      acc[city.name] = {
        population: city.population,
        rating: index + 1,
      };
      return acc;
    }, {});

  // Create regex to match any of the top 10 city names
  const regex = new RegExp(Object.keys(cityData).join("|"), "g");

  /**
   * Enriches a text by inserting population and ranking info
   * for each detected city name.
   *
   * @param {string} text - The text to be enriched.
   * @returns {string} The enriched text with city data.
   */

  return function enrichText(text) {
    return text.replace(regex, (city) => {
      const { population, rating } = cityData[city];
      const popStr = population.toLocaleString("uk-UA");
      // Determine correct grammatical form of "людина"
      let form = "людей";
      if (population % 10 === 1 && population % 100 !== 11) form = "людина";
      else if (
        population % 10 >= 2 &&
        population % 10 <= 4 &&
        (population % 100 < 10 || population % 100 >= 20)
      )
        form = "людини";
      return `"${city}" (${rating} місце в ТОП-10 найбільших міст України, населення ${popStr} ${form})`;
    });
  };
}

/** @type {HTMLInputElement} File input element used to upload CSV file */
const fileInput = document.getElementById("csvFile");
let csvFile = undefined;

/**
 * Handles the file selection event.
 *
 * @param {Event} event - The file input change event.
 */
fileInput.addEventListener("change", function (event) {
  readCsvFile(event.target.files[0]);
});

/**
 * Reads the content of a CSV file using FileReader.
 *
 * @param {File} file - The selected CSV file.
 */
function readCsvFile(file) {
  // const file = event.target.files[0];
  if (file) {
    showFileName(fileInput.files);
    const reader = new FileReader();
    /**
     * Triggered when the file has been fully read.
     * @param {ProgressEvent<FileReader>} e
     */
    reader.onload = function (e) {
      csvFile = e.target.result;
    };
    reader.readAsText(file);
  }
}

/** @type {HTMLElement} Upload area used for drag & drop functionality */
const uploadArea = document.getElementById("uploadArea");

/** @type {HTMLElement} Container where file names will be displayed */
const fileName = document.getElementById("fileName");

/**
 * Highlights upload area when a file is being dragged over it.
 * @param {DragEvent} e
 */
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

/**
 * Removes highlight when drag leaves the upload area.
 */
uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

/**
 * Handles dropping of a file into the upload area.
 * @param {DragEvent} e
 */
uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragover");
  readCsvFile(e.dataTransfer.files[0]);
  if (e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    fileInput.files = e.dataTransfer.files;
    showFileName(file.name);
  }
});

/**
 * Displays uploaded file names inside the file name container.
 */
function showFileName() {
  for (let i = 0; i < fileInput.files.length; i++) {
    const p = document.createElement("p");
    p.innerHTML = "" + fileInput.files[i].name;
    fileName.appendChild(p);
  }
  uploadArea.style.borderColor = "#4CAF50";
  uploadArea.style.backgroundColor = "#f0fff0";
}

/** @type {HTMLButtonElement} Button to enrich the text */
const btnEnrichText = document.getElementById("enrichText");
/** @type {HTMLButtonElement} Button to clear the output text */
const btnDeleteText = document.getElementById("deleteText");
/** @type {HTMLElement} Output area for enriched text */
const outputText = document.getElementById("outputText");

/**
 * Handles click on "Enrich Text" button:
 * - Reads the input text
 * - Applies the enrichment function
 * - Displays the enriched result
 */
btnEnrichText.addEventListener("click", () => {
  const inputText = document.getElementById("inputText").textContent;

  if (csvFile == undefined) {
    alert("Missing csv file, please upload a csv file with data!");
    return;
  }

  if (inputText == "") {
    alert(
      "Missing text. Please enter text that contains the name of the city."
    );
  }

  const enrichText = makeCityEnricher(csvFile);
  const result = enrichText(inputText);
  outputText.innerHTML = result;
});

/**
 * Handles click on "Clear Text" button:
 * - Clears the output area
 */
btnDeleteText.addEventListener("click", () => {
  outputText.innerHTML = "";
});
