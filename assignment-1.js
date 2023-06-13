const http = require("http");
const fs = require("fs");
const os = require("os");

const READ_FILE_PATH = "./TestFile.txt";
const PORT = 3000;
const READ_FILE_ROUTE = "/read-file";
const server = http.createServer((request, response) => {   
    console.log(`Request url: ${request.url}`);
    console.log(`Reading File: ${READ_FILE_PATH}`);
    if(request.url == READ_FILE_ROUTE) {
        try {
            const fileData = fs.readFileSync(READ_FILE_PATH, "utf8");
            response.write(`File Contents:${os.EOL}`);
            response.write(fileData);
        } catch (error) {
            console.log(`Unable to read file: ${READ_FILE_PATH}, Exception: ${error}`);
        }
    } else {
        response.write(`Client Requested for route: ${request.url}`);
    }
    
    response.end(`${os.EOL}Request served`);
});
server.listen(PORT, () => {
    console.log(`Node js server started at port ${PORT}`);
});