# jsTask1.2

City Text Enricher

This project allows you to automatically enrich any text containing city names of Ukraine
by adding population and ranking information (TOP-10 biggest cities).

You can upload a .csv file with city data and paste or type text that mentions Ukrainian cities —
the script will detect those names and replace them with detailed descriptions.

Project Structure
project-folder/
│
├── index.html # Main HTML page
├── css/
│ ├── reset.css # CSS reset file
│ ├── normalize.css # Normalize styles for browsers
│ └── style.css # Main styling for the web app
├── js/
│ └── main.js # Core application logic
└── README.md # Project documentation

Example CSV Format

# City coordinates and population

30.5238,50.4547,Київ,2950000
24.0315,49.8429,Львів,720000
36.2304,49.9935,Харків,1400000

Example Output

Input text:

Я був у Києві, Львові та Одесі.

Output text:

Я поїду у "Київ" (1 місце в ТОП-10 найбільших міст України, населення 3 000 000 людей), "Харків" (2 місце в ТОП-10 найбільших міст України, населення 1 400 000 людей) та "Одеса" (3 місце в ТОП-10 найбільших міст України, населення 1 000 000 людей).
