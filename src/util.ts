export const STATUS_CODE_OK = 200
export const STATUS_CODE_NOT_FOUND = 404
export const STATUS_CODE_NOT_ALLOWED = 405
export const STATUS_CODE_BAD_REQUEST = 422
export const STATUS_CODE_SERVER_ERROR = 500

export const validStatusCodes = new Set([STATUS_CODE_OK, STATUS_CODE_NOT_ALLOWED, STATUS_CODE_BAD_REQUEST])

export const parseBody = (body: string) => {
    try {
        return JSON.parse(body)
    } catch (e) {
        throw {
            code: STATUS_CODE_BAD_REQUEST,
            message: "Unable to parse request body"
        }
    }
}

export const veirfyParsedBody = (body: any) => {
    if (body.url === undefined) {
        throw {
            code: STATUS_CODE_BAD_REQUEST,
            message: "Missing url"
        }
    }
    if (typeof body.url !== "string") {
        throw {
            code: STATUS_CODE_BAD_REQUEST,
            message: "URL should be a string"
        }
    }
}