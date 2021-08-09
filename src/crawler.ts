import puppeteer from "puppeteer"
import { STATUS_CODE_NOT_FOUND, STATUS_CODE_SERVER_ERROR } from "./util"

const HEADLESS_LAUNCH_CONFIG = {
    headless: true,
} as puppeteer.BrowserLaunchArgumentOptions

const openPageBody = async (url: string) => {
    try {
        const browser = await puppeteer.launch(HEADLESS_LAUNCH_CONFIG)
        const page = await browser.newPage()
        await page.goto(url)
        // await page.waitForSelector('body')
        return page
    } catch (e) {
        throw {
            code: STATUS_CODE_NOT_FOUND,
            message: `Cannot open page ${url}\n${e.message}`
        }
    }
}

const traceReviews = async (page: puppeteer.Page) => {
    try {
    return await page.evaluate(() => {
        // get text from elements with class "review"
        const customerReviews = document.querySelector('#customerReviews')
        if (!customerReviews) return null
        const reviews = customerReviews.querySelectorAll('.review')
        if (!reviews) return null
        var reviewDatas: { header: string | null, para: string | null }[] = []
        reviews.forEach(review => {
            const reviewHeaderElement = review.querySelector('h6')
            const reviewHeader = reviewHeaderElement ? reviewHeaderElement.innerText : null
            const reviewParaElement = review.querySelector('p')
            const reviewPara = reviewParaElement ? reviewParaElement.innerText : null
            reviewDatas.push({ header: reviewHeader, para: reviewPara })
        })

        return reviewDatas
    })
    } catch (e) {
        throw {
            code: STATUS_CODE_SERVER_ERROR,
            message: `Cannot trace reviews\n${e.message}`
        }
    }
}

export const crawl = async (url: string) => {
    const page = await openPageBody(url)
    const res = await traceReviews(page)
    page.close()
    return res
}

// unit tests
// ts-node src/crawler.ts
// openPageBody('https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=640254&CatId=3')
//     .then(page => console.log(page))
//     .catch(e => console.log(e))

// crawl('https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=640254&CatId=3')
//     .then(res => console.log(res))
//     .catch(e => console.log(e))

// crawl('https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=6247485&Sku=8099910')
//     .then(res => console.log(res))
//     .catch(e => console.log(e))