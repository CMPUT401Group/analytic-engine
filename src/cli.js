import config from 'config';
const commandLineArgs = require('command-line-args')

let graphiteURL = config.get('graphiteURL');
 
const optionDefinitions = [
  { name: 'function', type: String, multiple: false, defaultOption: true }, // this is the type of analysis
  { name: 'metric1',  type: String },
  { name: 'metric2', type: String },
  { name: 'm1_start',  type: Number },
  { name: 'm1_end',  type: Number },
  { name: 'm2_start',  type: Number },
  { name: 'm2_end', type: Number },
  { name: 'help', alias: 'h', type: Boolean }
]

const options = commandLineArgs(optionDefinitions)

console.log(options);

function helpMsg(){
	console.log("this is the help message");
}

if (options.help == true){
	//output the help message
	helpMsg();
}

switch(options.function.toLowerCase()) {
    case 'correlation':


      //resolve the metrics into their respective datapoints
      var render = new RenderAPIAdapter(graphiteURL);
      var renderRes1 = render.render({
        target: options.metric1,
        format: 'json',
        from: start,
        until: end,
      });
      var renderRes2 = render.render({
        target: options.metric2,
       format: 'json',
       from: start,
        until: end,
      });

      //apply the requested function and return the result
      var cov = new Covariance(renderRes1);

        break;
    case 'covariance'::
        //do something
        break;

    
    case 'deviation'::
        //do something
        break;

    case 'search'::
        //do something
        break;

    case 'entailment_search'::
        //do something
        break;

    default:
        helpMsg();
} 