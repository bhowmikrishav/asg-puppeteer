import { createServer } from "http"
import { crawl } from "./crawler"
import {
    STATUS_CODE_NOT_ALLOWED,
    STATUS_CODE_BAD_REQUEST,
    STATUS_CODE_OK,
    validStatusCodes,
    veirfyParsedBody,
    parseBody,
    STATUS_CODE_SERVER_ERROR,
    STATUS_CODE_NOT_FOUND
} from "./util"


export default (port: number) => {
    createServer((req, res) => {
        const { method } = req

        if (method !== "POST") {
            res.statusCode = STATUS_CODE_NOT_ALLOWED
            return res.end("This server only accepts POST request")
        }

        const bodyChunks: Buffer[] = []
        req.on("data", chunk => bodyChunks.push(chunk))
        req.on("end", () => {
            try {
                const body = Buffer.concat(bodyChunks).toString()
                crawlTigerRoute(body)
                    .then(({ statusCode, responseString }) => {
                        res.writeHead(statusCode, {
                            "Content-Type": "application/json"
                        })
                        res.end(responseString)
                    })
                    .catch(({ code, message }) => {
                        res.writeHead(code, {
                            "Content-Type": "application/json"
                        })
                        res.end(message)
                    })
            } catch (e) {
                res.writeHead(STATUS_CODE_SERVER_ERROR, {
                    "Content-Type": "application/json"
                })
                res.end(e.message)
            }
        })
    }).listen(port)
}


async function crawlTigerRoute(body: string): Promise<{ statusCode: number, responseString: string }> {
    try {
        const bodyParams = parseBody(body)
        veirfyParsedBody(bodyParams)
        const { url } = bodyParams
        const result = await crawl(url)
        if (result === null) return {
            statusCode: STATUS_CODE_NOT_FOUND,
            responseString: `No result found for ${url}`
        }
        return {
            statusCode: STATUS_CODE_OK,
            responseString: JSON.stringify(result)
        }
    } catch (e) {
        if (validStatusCodes.has(e.code)) {
            return {
                statusCode: e.code,
                responseString: JSON.stringify(e)
            }
        }
        return {
            statusCode: STATUS_CODE_BAD_REQUEST,
            responseString: e.message
        }
    }
}