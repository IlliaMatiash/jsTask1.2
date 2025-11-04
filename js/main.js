//
function makeCityEnricher(csvText) {
  const cityData = csvText
    .split("\n")
    .filter((str) => str !== "" && str[0] !== "#")
    .map((line) => {
      const [x, y, name, population] = line.split(",");
      return {
        x: parseFloat(x),
        y: parseFloat(y),
        name: name?.trim(),
        population: parseInt(population, 10),
      };
    })
    .sort((a, b) => b.population - a.population)
    .slice(0, 10)
    .reduce((acc, city, index) => {
      acc[city.name] = {
        population: city.population,
        rating: index + 1,
      };
      return acc;
    }, {});

  const regex = new RegExp(Object.keys(cityData).join("|"), "g");

  return function enrichText(text) {
    return text.replace(regex, (city) => {
      const { population, rating } = cityData[city];
      const popStr = population.toLocaleString("uk-UA");
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

const fileInput = document.getElementById("csvFile");
let csvFile = undefined;

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      csvFile = e.target.result;
    };
    reader.readAsText(file);
  }
});

const uploadArea = document.getElementById("uploadArea");
const fileName = document.getElementById("fileName");

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    showFileName(fileInput.files);
  }
});

// drag over
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("dragover");
});

// drag leave
uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("dragover");
});

// drop
uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("dragover");

  if (e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    fileInput.files = e.dataTransfer.files;
    showFileName(file.name);
  }
});

function showFileName() {
  for (let i = 0; i < fileInput.files.length; i++) {
    const p = document.createElement("p");
    p.innerHTML = "" + fileInput.files[i].name;
    fileName.appendChild(p);
  }
  uploadArea.style.borderColor = "#4CAF50";
  uploadArea.style.backgroundColor = "#f0fff0";
}

const btnEnrichText = document.getElementById("enrichText");
const btnDeleteText = document.getElementById("deleteText");
const outputText = document.getElementById("outputText");

btnEnrichText.addEventListener("click", () => {
  const inputText = document.getElementById("inputText").textContent;
  if (inputText !== "" && csvFile != undefined) {
    const enrichText = makeCityEnricher(csvFile);
    const result = enrichText(inputText);
    outputText.innerHTML = result;
  }
});

btnDeleteText.addEventListener("click", () => {
  outputText.innerHTML = "";
});
