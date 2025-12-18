import config from "./config";
import app from "./app";

const port = config.port;

app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
});
