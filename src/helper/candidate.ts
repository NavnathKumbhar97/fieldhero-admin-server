import * as helper from "../helper"

export interface IRejected {
    value: any
    error: "length_exceed" | "mandatory" | "duplicate" | "wrong_input"
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
                    ? { value: input, error: "length_exceed" }
                    : result
            }
            return { value: input, error: "mandatory" }
        }
        return result ? result : { value: input, error: "mandatory" }
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
                if (result) {
                    return result.length > maxLength
                        ? { value: input, error: "length_exceed" }
                        : result
                }
                return { value: input, error: "mandatory" }
            }
            return result ? result : { value: input, error: "mandatory" }
        } else {
            const result = input.text.trim()
            if (maxLength) {
                if (result) {
                    return result.length > maxLength
                        ? { value: input, error: "length_exceed" }
                        : result
                }
                return { value: input, error: "mandatory" }
            }
            return result ? result : { value: input, error: "mandatory" }
        }
    }
    return { value: input, error: "mandatory" }
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
                    ? { value: input, error: "length_exceed" }
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
                        ? { value: input, error: "length_exceed" }
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
                        ? { value: input, error: "length_exceed" }
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
                return input
            }
            return { value: input, error: "wrong_input" }
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
            return { value: input, error: "wrong_input" }
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
                    : { value: input, error: "length_exceed" }
            }
            return input
        } else if (typeof input === "string") {
            if (maxLength) {
                return input.length <= maxLength
                    ? parseInt(input)
                    : { value: input, error: "length_exceed" }
            }
            return parseInt(input)
        }
        return { value: input, error: "wrong_input" }
    }
    return { value: input, error: "mandatory" }
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
                    : { value: input, error: "length_exceed" }
            }
            return input
        } else if (typeof input === "string") {
            if (maxLength) {
                return input.length <= maxLength
                    ? parseInt(input)
                    : { value: input, error: "length_exceed" }
            }
            return parseInt(input)
        }
        return { value: input, error: "wrong_input" }
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
                ? { value: input, error: "length_exceed" }
                : validateEmail(result)
                ? result
                : { value: input, error: "wrong_input" }
        }
        return validateEmail(result)
            ? result
            : { value: input, error: "wrong_input" }
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
                    ? { value: input, error: "length_exceed" }
                    : validateEmail(result)
                    ? result
                    : { value: input, error: "wrong_input" }
            }
            return validateEmail(result)
                ? result
                : { value: input, error: "wrong_input" }
        } else {
            const result = input.text.trim()
            if (maxLength) {
                return result.length > maxLength
                    ? { value: input, error: "length_exceed" }
                    : validateEmail(result)
                    ? result
                    : { value: input, error: "wrong_input" }
            }
            return validateEmail(result)
                ? result
                : { value: input, error: "wrong_input" }
        }
    }
    return null
}

const handleAadhar = (input: any): string | null | IRejected => {
    if (input && typeof input === "string") {
        const result = input.trim().replace(/\s/g, "").replace(/-/g, "")
        if (result) {
            if (result.length > 12) {
                return { value: input, error: "length_exceed" }
            }
            return result.length === 12
                ? result
                : { value: input, error: "wrong_input" }
        }
        return null
    } else if (input && typeof input === "number") {
        const result = input.toString()
        if (result.length > 12) {
            return { value: input, error: "length_exceed" }
        }
        return result.length === 12
            ? result
            : { value: input, error: "wrong_input" }
    }
    return null
}

const findDuplicateFromExcel = (
    arr: Array<any>,
    field: string,
    excelField: string,
    isMandatory = false
) => {
    const arrIgnored: Array<any> = []
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
    arr = arr.map((item: any, ind: number) => {
        const rowNum = ind + 2
        const isDuplicate = duplicateItems.includes(item[field])
        if (isDuplicate) {
            arrIgnored.push({ [excelField]: item[field], rowNum })
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
    const arrIgnored: Array<any> = []
    // get array of field only
    const _items = dbArr.map((item: any) => item[field])
    // set duplicate field to null and add into array of ignored
    arr = arr.map((item: any, ind: number) => {
        const rowNum = ind + 2
        const isDuplicate = _items.includes(
            field === "contactNo1" ? item[field].toString() : item[field]
        )
        if (item[field] && isDuplicate) {
            arrIgnored.push({ [excelField]: "duplicate", rowNum })
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
