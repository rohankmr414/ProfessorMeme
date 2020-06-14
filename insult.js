const axios = require("axios");

module.exports = function () {
  this.insult = async function () {
    const trash = await axios.get(
      "https://evilinsult.com/generate_insult.php?lang=en&type=json"
    );
    const slang = trash.data.insult;
    return slang
  };
};
