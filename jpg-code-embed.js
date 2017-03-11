var fs = require("fs");
var piexif = require("piexifjs");
var commandLineArgs = require("command-line-args");

var appName = 'JPG Code Embedder v1.0';

var validTags = ['ProcessingSoftware', 'DocumentName', 'ImageDescription', 'Make', 'Model', 'Software', 'DateTime', 'Artist', 'HostComputer', 'InkNames', 'TargetPrinter', 'ImageID', 'Copyright', 'SecurityClassification', 'ImageHistory', 'UniqueCameraModel', 'CameraSerialNumber', 'PreviewDateTime'];

var optionDefinitions = [
  { name: 'jpg',    alias: 'j',   type: String },
  { name: 'php',    alias: 'p',   type: String },
  { name: 'out',    alias: 'o',   type: String },

  // { name: 'name',   alias: 'n',   type: String },
  { name: 'tag',    alias: 't',   type: String },
  { name: 'noHalt', alias: 'x',   type: Boolean },

  { name: 'help',   alias: 'h',   type: Boolean },
];

var options = commandLineArgs(optionDefinitions);

function help() {
  console.log("Usage: node jpg-code-embed.js [options]\n");

  console.log('Required:');
  console.log('  --jpg <image.jpg>    : the JPG file to embed in to');
  console.log('  --php <code.php>     : the PHP file to be embeded');
  console.log('  --out <evil.jpg>     : the output file');
  console.log('');

  console.log('Optional:');
  // console.log('  --name <string>      : a string value, visible when "file" is run on the output image');
  console.log('  --tag <exif_tag>     : the exif tag to embed the data in (a random tag will be used if none is specified)');
  console.log('  --noHalt             : do not append "__halt_compiler();" (using this flag may cause PHP errors to occur as JPG data could be parsed)');

  console.log('  --help               : shows this help');
  console.log('');

  console.log('Exif tags allowed, for use with "--tag <exif_tag>":');
  console.log('');
  console.log(validTags.join(', '));
  console.log('');
  // console.log('NOTE: Some tags might expose your PHP code to common tools, such as the "DocumentName" tag being output by the "file" command.');
  // console.log('');
}

function checkFiles(options) {
  if (!options.jpg) {
    console.log("No input JPG file specified (--jpg option), exiting.\r\n");
    process.exit();
  }

  if (!options.php) {
    console.log("No input PHP file specified (--php option), exiting.\r\n");
    process.exit();
  }

  if (!options.out) {
    console.log("No output file specified (--out option), exiting.\r\n");
    process.exit();
  }
}

function readPhpFile(options) {
  var phpfile = options.php;
  var php = fs.readFileSync(phpfile);
  var phpData = php.toString("binary");

  if (!options.noHalt) {
    phpData += '<?php __halt_compiler(); ?>';
  }

  return phpData;
}

function writeFile(exifData, jpgData, outFile) {
  var exifObj = {'0th':exifData, 'Exif': {}, 'GPS': {}};
  var exifBytes = piexif.dump(exifObj);

  var outData = piexif.insert(exifBytes, jpgData);
  var newJpeg = new Buffer(outData, "binary");
  fs.writeFileSync(outFile, newJpeg);

}

console.log('');
console.log(appName);
console.log("----------------------\r\n");

if (options.help) {
  help();

} else if ((options.jpg || options.php || options.out)) {
  checkFiles(options);

  var jpgFile = options.jpg;
  var jpg = fs.readFileSync(jpgFile);

  var jpgData = jpg.toString("binary");
  var phpData = readPhpFile(options);
  var exifTags = {};

  // if (options.name) {
  //   validTags.splice(validTags.indexOf('DocumentName'), 1); // remove "DocumentName" so it can't be randomly chosen
  //   exifTags[piexif.ImageIFD.DocumentName] = options.name;
  // }

  // pick a random tag if one isn't given
  if (!options.tag) {
    options.tag = validTags[Math.floor(Math.random() * validTags.length)];
  }

  // set the php data to the exif tag's value
  var key = piexif.ImageIFD[options.tag];
  exifTags[key] = phpData;

  var outFile = options.out;
  console.log('Writing exif tags to ' + outFile);
  writeFile(exifTags, jpgData, outFile);
  console.log("Done!");

} else {
  console.log('No options provided, use "--help" for more info.');
  console.log('');
}

console.log('');
console.log('NOTE: This tool is for educational, and testing, purposes only!');
console.log('');
