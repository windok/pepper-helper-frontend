import path from 'path';
import Express from 'express';

const app = new Express();
const port = 3000;

app.use('/static', Express.static('public/static'));
app.use('/images', Express.static('public/images'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, error => {
    if (error) {
        console.error(error);
    } else {
        console.info(
            '🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.',
            port,
            port
        );
    }
});
