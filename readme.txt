What should we do?

1) Rename main ".scss" (main, header, footer) files in the "Full" folder;
2) Change paths in the "gulpfile.js" to the required;
3) Change names for the gulp-scripts in the index-file;
4) During operation all files should be imported to the "main__yourPage.scss";
5) For the production version styles of the first screen should be imported to the "header__yourPage.scss";
6) Other styles should be imported to the "footer__yourPage.scss";
7) In the process of work remember that you are working with gulp-uncss (it is better to read the manuals of this plugin);
8) If you want convert to ".php format" you should skip the desired line in the gulpfile;
9) If you need to optimize a large quantity
 of images, you can connect the tinyPNG API to the imaging task;
10) There are commented out lines in the "gulpfile", they can  partially be used in work with WordPress, Joomla, OpenCart, but you need to add tracking settings based on the used platform;
11) There is an ".htaccess" file that is created only for page caching in the browser, other functions of this file you can adjust based on your tasks;
77) Now you can test and work.

I'we done this configurator according to my needs for a significant optimization of the site loading speed. I will be glad to read interesting proposals, wishes and comments. Email: ArtyomVSvinin@gmail.com