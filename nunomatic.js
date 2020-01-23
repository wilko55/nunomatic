const htmlParser = require('node-html-parser');
const needle = require('needle');
const cron = require('node-cron');

function Nunomatic(description, url, selector, debugging) {
  if (!description || !url || !selector) {
    this.status = 'Error: requires description, url and selector';
  }


  this.description = description;
  this.currentVal = '';
  this.previousVal = '';
  this.status = 'starting';
  this.debugging = debugging || false;

  updateVal = () => {
    needle.get(url, (err, res) => {
      if (err) {
        this.status = 'Error: fetching url';
      }
      this.status = 'updating';
      const html = htmlParser.parse(res.body);
      if (!html) {
        this.status = 'Error: fetching html';
      }
      const newVal = html.querySelector(selector).rawText;
      if (!newVal) {
        this.status = 'Error: selector not valid';
      }
      // streak = previousRank === currentRank ? streak + 1 : 0;
      this.previousVal = this.currentVal;
      this.currentVal = newVal;
      this.status = 'running';
    });
  }
  // get initial value
  updateVal();

  cron.schedule('0 8 * * *', () => {
    updateVal();
  });
};

module.exports = Nunomatic;