import * as helper from "../helper"

export interface IRejected {
    value: unknown
    error:
        | "CONSENT_DECLINED"
        | "LENGTH_EXCEEDED"
        | "MANDATORY"
        | "DUPLICATE"
        | "WRONG_INPUT"
}

const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

const handleNotNullString = (
    input: any,
    maxLength?: number
): string | IRejected => {
    if (input && typeof input === "string") {
        const result = input.trim()
        if (maxLength) {
            if (result) {
                return result.length > maxLength
                    ? { value: input, error: "LENGTH_EXCEEDED" }
                    : result
            }
            return { value: input, error: "MANDATORY" }
        }
        return result ? result : { value: input, error: "MANDATORY" }
    } else if (
        input &&
        typeof input === "object" &&
        Object.keys(input).length
    ) {
        if (input.richText) {
            const result = (input as {
                richText: Array<{ text: string }>
            }).richText
                .map((x) => x.text)
                .join("")
                .trim()
            if (maxLength) {
                if (result) {
                    return result.length > maxLength
                        ? { value: input, error: "LENGTH_EXCEEDED" }
                        : result
                }
                return { value: input, error: "MANDATORY" }
            }
            return result ? result : { value: input, error: "MANDATORY" }
        } else {
            const result = input.text.trim()
            if (maxLength) {
                if (result) {
                    return result.length > maxLength
                        ? { value: input, error: "LENGTH_EXCEEDED" }
                        : result
                }
                return { value: input, error: "MANDATORY" }
            }
            return result ? result : { value: input, error: "MANDATORY" }
        }
    }
    return { value: input, error: "MANDATORY" }
}

const handleString = (
    input: any,
    maxLength?: number
): string | null | IRejected => {
    // check if given input is string
    if (input && typeof input === "string") {
        // trim string and check if it has any character in it
        const result = input.trim()
        if (result.length === 0) {
            return null
        } else {
            // check if string length is within max_length limit
            if (maxLength) {
                return result.length > maxLength
                    ? { value: input, error: "LENGTH_EXCEEDED" }
                    : result
            }
            return result
        }
    } else if (
        input &&
        typeof input === "object" &&
        Object.keys(input).length
    ) {
        if (input.richText) {
            const result = input.richText
                .map((x: any) => x.text)
                .join("")
                .trim()
            if (result.length === 0) {
                return null
            } else {
                if (maxLength) {
                    return result.length > maxLength
                        ? { value: input, error: "LENGTH_EXCEEDED" }
                        : result
                }
                return result
            }
        } else {
            const result = input.text.trim()
            if (result.length === 0) {
                return null
            } else {
                if (maxLength) {
                    return result.length > maxLength
                        ? { value: input, error: "LENGTH_EXCEEDED" }
                        : result
                }
                return result
            }
        }
    }
    return input
}

const handleGender = (input: any): string | null | IRejected => {
    if (input && typeof input === "string") {
        const result = input.trim().toLowerCase()
        if (result.length === 0) {
            return null
        } else {
            if (input === "male" || input === "female" || input === "other") {
                return input.toUpperCase()
            }
            return { value: input, error: "WRONG_INPUT" }
        }
    }
    return null
}

const handleDate = (input: any): string | null | IRejected => {
    if (input && typeof input === "string") {
        const result = input.trim()
        if (result.length) {
            const _parsedDate = helper.parseDate(result)
            if (_parsedDate) {
                return _parsedDate.format("YYYY-MM-DD")
            }
            return { value: input, error: "WRONG_INPUT" }
        }
        return null
    }
    return null
}

const handleNotNullNumber = (
    input: any,
    maxLength?: number
): number | IRejected => {
    if (input) {
        if (typeof input === "number") {
            if (maxLength) {
                return input.toString().length <= maxLength
                    ? input
                    : { value: input, error: "LENGTH_EXCEEDED" }
            }
            return input
        } else if (typeof input === "string") {
            if (maxLength) {
                return input.length <= maxLength
                    ? parseInt(input)
                    : { value: input, error: "LENGTH_EXCEEDED" }
            }
            return parseInt(input)
        }
        return { value: input, error: "WRONG_INPUT" }
    }
    return { value: input, error: "MANDATORY" }
}

const handleNumber = (
    input: any,
    maxLength?: number
): number | null | IRejected => {
    if (input) {
        if (typeof input === "number") {
            if (maxLength) {
                return input.toString().length <= maxLength
                    ? input
                    : { value: input, error: "LENGTH_EXCEEDED" }
            }
            return input
        } else if (typeof input === "string") {
            if (maxLength) {
                return input.length <= maxLength
                    ? parseInt(input)
                    : { value: input, error: "LENGTH_EXCEEDED" }
            }
            return parseInt(input)
        }
        return { value: input, error: "WRONG_INPUT" }
    }
    return null
}

const handleEmail = (
    input: any,
    maxLength?: number
): string | null | IRejected => {
    if (input && typeof input === "string") {
        const result = input.trim()
        if (maxLength) {
            return result.length > maxLength
                ? { value: input, error: "LENGTH_EXCEEDED" }
                : validateEmail(result)
                ? result
                : { value: input, error: "WRONG_INPUT" }
        }
        return validateEmail(result)
            ? result
            : { value: input, error: "WRONG_INPUT" }
    } else if (
        input &&
        typeof input === "object" &&
        Object.keys(input).length
    ) {
        if (input.richText) {
            const result = input.richText
                .map((x: any) => x.text)
                .join("")
                .trim()
            if (maxLength) {
                return result.length > maxLength
                    ? { value: input, error: "LENGTH_EXCEEDED" }
                    : validateEmail(result)
                    ? result
                    : { value: input, error: "WRONG_INPUT" }
            }
            return validateEmail(result)
                ? result
                : { value: input, error: "WRONG_INPUT" }
        } else {
            const result = input.text.trim()
            if (maxLength) {
                return result.length > maxLength
                    ? { value: input, error: "LENGTH_EXCEEDED" }
                    : validateEmail(result)
                    ? result
                    : { value: input, error: "WRONG_INPUT" }
            }
            return validateEmail(result)
                ? result
                : { value: input, error: "WRONG_INPUT" }
        }
    }
    return null
}

const handleAadhar = (input: any): string | null | IRejected => {
    if (input && typeof input === "string") {
        const result = input.trim().replace(/\s/g, "").replace(/-/g, "")
        if (result) {
            if (result.length > 12) {
                return { value: input, error: "LENGTH_EXCEEDED" }
            }
            return result.length === 12
                ? result
                : { value: input, error: "WRONG_INPUT" }
        }
        return null
    } else if (input && typeof input === "number") {
        const result = input.toString()
        if (result.length > 12) {
            return { value: input, error: "LENGTH_EXCEEDED" }
        }
        return result.length === 12
            ? result
            : { value: input, error: "WRONG_INPUT" }
    }
    return null
}

const findDuplicateFromExcel = (
    arr: Array<any>,
    field: string,
    excelField: string,
    isMandatory = false
) => {
    const arrIgnored: Array<{ column: string; value: any; rawId: number }> = []
    // get array of field only
    const _items = arr.map((item: any) => item[field])
    // get all unique fields
    const _uniqueItems = new Set([..._items])
    // find duplicate fields from array of field only
    _uniqueItems.forEach((item) => {
        const i = _items.indexOf(item)
        _items.splice(i, 1)
    })
    // remove null and blank
    const duplicateItems = _items.filter((item: any) => item)
    // set duplicate field to null and add into array of ignored
    arr = arr.map((item: any) => {
        const isDuplicate = duplicateItems.includes(item[field])
        if (isDuplicate) {
            arrIgnored.push({
                column: excelField,
                value: item[field],
                rawId: item.id,
            })
            item[field] = null
        }
        return item
    })
    if (isMandatory) {
        arr = arr.filter((item: any) => item[field])
    }
    return { arr, arrIgnored }
}

const findDuplicateFromDB = (
    arr: Array<any>,
    dbArr: Array<any>,
    field: string,
    excelField: string,
    isMandatory = false
) => {
    const arrIgnored: Array<{ column: string; value: any; rawId: number }> = []
    // get array of field only
    const _items = dbArr.map((item: any) => item[field])
    // set duplicate field to null and add into array of ignored
    arr = arr.map((item: any) => {
        const isDuplicate = _items.includes(
            field === "contactNo1" ? item[field].toString() : item[field]
        )
        if (item[field] && isDuplicate) {
            arrIgnored.push({
                column: excelField,
                value: "DUPLICATE",
                rawId: item.id,
            })
            item[field] = null
        }
        return item
    })
    if (isMandatory) {
        arr = arr.filter((item: any) => item[field])
    }
    return { arr, arrIgnored }
}

export default {
    findDuplicateFromExcel,
    findDuplicateFromDB,
    handleNotNullString,
    handleString,
    handleGender,
    handleDate,
    handleNotNullNumber,
    handleNumber,
    handleEmail,
    handleAadhar,
}
