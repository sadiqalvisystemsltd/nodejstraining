const http = require("http");
const fs = require("fs");
const os = require("os");

const READ_FILE_PATH = "./TestFile.txt";
const READ_FILE_PATH_1 = "./TestFile1.txt";
const READ_FILE_PATH_2 = "./TestFile2.txt";
const PORT = 3000;
const READ_FILE_ROUTE = "/read-file";
const READ_FILE_ROUTE_1 = "/read-file-1";
const READ_FILE_ROUTE_2 = "/read-file-2";
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
    } else if(request.url == READ_FILE_ROUTE_1){
        try {
            const fileData = fs.readFileSync(READ_FILE_PATH_1, "utf8");
            response.write(`File Contents:${os.EOL}`);
            response.write(fileData);
        } catch (error) {
            console.log(`Unable to read file: ${READ_FILE_PATH_1}, Exception: ${error}`);
        }
    }  else if(request.url == READ_FILE_ROUTE_2){
        try {
            const fileData = fs.readFileSync(READ_FILE_PATH_2, "utf8");
            response.write(`File Contents:${os.EOL}`);
            response.write(fileData);
        } catch (error) {
            console.log(`Unable to read file: ${READ_FILE_PATH_2}, Exception: ${error}`);
        }
    } else {
        response.write(`Client Requested for route: ${request.url}`);
    }
    
    response.end(`${os.EOL}Request served`);
});
server.listen(PORT, () => {
    console.log(`Node js server started at port ${PORT}`);
});