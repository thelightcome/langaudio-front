const data = require("./data.json");

function getPostgresCommandForCountries(countries) {
  const curDate = "2023-04-07 15:16:51.073+06";
  const data = countries.reduce((acc, country) => {
    acc += `${acc.length ? "," : ""}('${country.name
      .toLowerCase()
      .replace("'", "''")}', '${curDate}', '${curDate}')`;
    return acc;
  }, "");

  const str = `INSERT INTO "Countries"("name", "createdAt", "updatedAt") VALUES ${data}`;
  console.log(str);
  return str;
}

function getPostgresCommandForLanguages(languages) {
  const curDate = "2023-04-07 15:16:51.073+06";
  const data = languages.reduce((acc, language) => {
    acc += `${acc.length ? "," : ""}('${language.name.toLowerCase()}', '${
      language.code
    }', '${curDate}', '${curDate}')`;
    return acc;
  }, "");

  const str = `INSERT INTO "Langs"("name", "codeiso", "createdAt", "updatedAt") VALUES ${data}`;
  console.log(str);
  return str;
}

getPostgresCommandForCountries(data.countries);
// getPostgresCommandForLanguages(data.langs);
