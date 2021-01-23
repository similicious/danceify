// Node imports
const fs = require('fs')
const { exec } = require('child_process');
const { join } = require('path');
const { promisify } = require('util')
const { EOL } = require('os')

// Promisified functions
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

// Other imports
const ffmpegPath = require('ffmpeg-static');
const cuid = require('cuid')

// Express import
const express = require('express');
const morgan = require('morgan')

// App
const app = express();

// Allow only a-z and A-Z
const nameExp = /^[a-zA-Z]+$/;

app.use(morgan('dev'));

app.post('/dance/:name', async (req, res) => {
    
    const name = req.params['name'];
     
    // Validate user input against regex
    if(!name.match(nameExp)) {
        res.sendStatus(400);
        return;
    }

    // Transform individual letters into video list for ffmpeg
    const videoList = name
        .split('')
        .map(letter => `file '${join(__dirname, '..', 'assets', 'videos', `${letter}.m4v`)}'${EOL}`)
        .join('');

    // Generate a random id for this video
    const videoId = cuid();
    const videoPath = join(__dirname, '..', 'tmp', `${videoId}.m4v`)
    const videoListPath = join(__dirname, '..', 'tmp', `${videoId}.txt`)

    // Write video list into tmp folder
    writeFile(videoListPath, videoList, { encoding: 'utf-8' });

    // Assemble command
    const command = `${ffmpegPath} -safe 0 -f concat -i ${videoListPath} -c copy ${videoPath}`

    // Execute command
    exec(command, async (err, std, stderr) => {

        if(err) {
            res.sendStatus(500);
            return;
        }
        
        // Set file name
        res.attachment(`${name}.m4v`)

        // Send file
        res.sendFile(videoPath, async (err) => {

            // Delete temporary files
            await Promise.all([
                unlink(videoPath),
                unlink(videoListPath)
            ]);
        })
    })

})

app.listen(8080, () => console.log('Backend listening on port 8080'))