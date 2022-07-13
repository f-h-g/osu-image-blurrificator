# osu-image-blurrificator
will blur osu! backgrounds and store backups of the originals for reverting if wanted

![Hi tie](https://osu.ppy.sh/ss/17970126/d69a)


### Steps to use:
Install [Node](https://nodejs.org/en/download/) and npm (included in node)

Download this package and unzip to wherever you want to store the image backups

IMPORTANT: MAKE SURE THE IMAGE BACKUP FOLDER HAS AT LEAST AS MUCH SPACE AVAILABLE AS YOUR ENTIRE OSU INSTALLATION TO BE SAFE

Open main.js in an editor and set the filepath on line 6 of the file to wherever your osu songs folder is. You can also change the
blur level here. If you ever want to revert the blur effect, move the // at the start of line 9 to line 10. Do the reverse to blur
the images again. Make sure to save any edits before closing.

WARNING: DON'T BLUR TWICE IN A ROW AS IT MIGHT DELETE THE ORIGINAL BACKUPS!!!

Open the command line within the blurrificator's folder and type this and hit enter:
```
npm i
```
This will install the dependency of this project, [Sharp](https://www.npmjs.com/package/sharp)

Then type this and hit enter:

```
node main.js
```
Wait awhile, from a few seconds to 5+ minutes, depending on how many beatmaps you have. 
