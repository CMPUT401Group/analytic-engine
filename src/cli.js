import config from 'config';
const commandLineArgs = require('command-line-args')
 
const optionDefinitions = [
  { name: 'function', type: String, multiple: false, defaultOption: true }, // this is the type of analysis
  { name: 'metric1',  type: String },
  { name: 'metric2', type: String },
  { name: 'm1_start',  type: Number },
  { name: 'm1_end',  type: Number },
  { name: 'm2_start',  type: Number },
  { name: 'm2_end',  type: Number }
]

const options = commandLineArgs(optionDefinitions)

console.log(options);