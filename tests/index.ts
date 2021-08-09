import { describe, it } from "mocha"
import Axios from "axios"
import { crawl } from "../src/crawler"
import server from "../src/server"
const { strictEqual } = require("assert")

describe("crawler", function () {
    this.timeout(10000)
    it("crawl", async () => {
        const result = await crawl("https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=6247485&Sku=8099910")
        strictEqual(Array.isArray(result), true)
        if (!result) throw new Error("no result")
        for (const item of result) {
            strictEqual(typeof item.header, "string")
            strictEqual(typeof item.para, "string")
        }
    })
    it("crawl bad url", async () => {
        const result = await crawl("https://www.tigerdirect.com/invalidurl")
        strictEqual(result, null)
    })
})

describe("crawler server", function () {
    this.timeout(10000)
    const PORT = 3123
    it("startServer", async () => {
        server(PORT)
    })
    it("crawl - 200", async () => {
        const result = await Axios.post(`http://localhost:${PORT}/`, {
            url: "https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=6247485&Sku=8099910",
        })
        strictEqual(result.status, 200)
        const resultData = result.data
        strictEqual(Array.isArray(resultData), true)
        if (!resultData) throw new Error("no result")
        for (const item of resultData) {
            strictEqual(typeof item.header, "string")
            strictEqual(typeof item.para, "string")
        }
    })
})