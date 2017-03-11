# JPG Code Embedder

This NodeJS tool embeds a PHP file inside an exif tag of a JPG file, for use in bypassing file-uploaders that only check the mimetype of a file. While being a valid (and viewable) JPG file, if run with the PHP command (ie: with a .php extension) the PHP payload will be executed. See [this blog post](http://php.webtutor.pl/en/2011/05/13/php-code-injection-a-simple-virus-written-in-php-and-carried-in-a-jpeg-image/) for more information.

***NOTE: This tool is for educational, and testing, purposes only!***

### Installation/setup:
Clone the repo, run "npm install" in the directory, then follow "Usage" below:

### Usage:

	node jpg-code-embed.js --jpg troll.jpg --php phpinfo.php --out evil.php

Or for more information / help:

	node jpg-code-embed.js --help

### Future plans:
Will be adding support for ASPX (and related) scripts, and PNG files... and possibly porting it to Python.
