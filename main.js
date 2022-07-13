const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// ------------ IMPORTANT STUFF HERE ---------------
const songsDir = 'your\\osu!\\songs\\filepath\\here';
let blurLevel = 1.75; //this is what the sample image on github is, feel free to play with this number, but much higher might just be a blob of colors
// Only run one at a time. By running both at once, you accept any and all risk :)
// revertBGs();
blurBGs();
// ------------ IMPORTANT STUFF HERE ---------------

const deleteFolderRecursive = function (directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
          const curPath = path.join(directoryPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
           // recurse
            deleteFolderRecursive(curPath);
          } else {
            // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(directoryPath);
    }
};

const findFilesRecursive = function (directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
          const curPath = path.join(directoryPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
           // recurse
            findFilesRecursive(curPath);
          } else {
            // delete file
            let imageBuffer = fs.readFileSync(curPath);
            let targetPath = path.join(songsDir, curPath.replace('original',''));
            if(fs.existsSync(targetPath)){
                fs.writeFileSync(targetPath, imageBuffer);
            }
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(directoryPath);
    }
};

async function revertBGs(){
    try{
        let songs = fs.readdirSync('original');
        songs.forEach(song => {
            let songPath = path.join('original', song)
            findFilesRecursive(songPath);
            deleteFolderRecursive(songPath);
        });
    }
    catch(e){
        console.log(e);
    }
}

//should always revert at top of this function in production program to avoid losing originals
async function blurBGs(){
    if(!fs.existsSync('original')) fs.mkdirSync('original');
    if(fs.readdirSync("original").length > 0){
        console.log("You shouldn't try to modify files without first reverting them. You'll lose the originals if you do!");
        return;
    }

    let songs = fs.readdirSync(songsDir);
    // console.log(songs.length);
    // let randomSong = songs[Math.floor(Math.random()*songs.length)];
    // console.log(randomSong);
    let o = 0;
    let op = 0;
    songs.forEach(song => {
        let songDir = fs.readdirSync(path.join(songsDir, song));
        let bgs = [];
        songDir.forEach(file => {
            if(file.includes('.osu')){
                let osuFile = fs.readFileSync(path.join(songsDir, song, file), 'utf-8');
                osuFile = osuFile.split(/\r?\n/);
                for(let i = 0; i < osuFile.length; i++){
                    if(
                        osuFile[i].startsWith('0,0,') && (
                        osuFile[i].toLowerCase().includes('.jpg') ||
                        osuFile[i].toLowerCase().includes('.png') ||
                        osuFile[i].toLowerCase().includes('.jpeg')
                        )
                    ){
                        // console.log(osuFile[i]);
                        let bgData = osuFile[i].split(',')[2];
                        let bgFileName = bgData.slice(1,bgData.length-1);
                        if(!bgs.includes(bgFileName)) bgs.push(bgFileName);
                    }
                }
            }
        });
        // console.log(bgs);
        bgs.forEach((image) => {
            o++;
            let imageFile = path.join(songsDir, song, image);
            if(!fs.existsSync(imageFile)) return;
            op++;
            let localPath = path.join('original', song);
            let localFile = path.join(localPath, image);
            let imageBuffer = fs.readFileSync(imageFile);
            if(!fs.existsSync(localPath)){
                fs.mkdirSync(localPath);
                fs.mkdirSync(path.join(localPath, 'sb'));
                fs.mkdirSync(path.join(localPath, 'sb', 'bg'));
            }
            fs.writeFileSync(localFile, imageBuffer);
            sharp(localFile)
            .blur(15)
            .modulate({
                saturation: blurLevel,
              })
            .toFile(imageFile, (err, info) => {
                if(err){
                    console.log(imageFile);
                }
                // console.log(info);
            });
        });
    });
    //console.log("Total image filepaths found: " + o);
    console.log("Number of images to convert: " + op);
}
