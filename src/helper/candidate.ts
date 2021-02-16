import * as helper from "../helper"
const handleString = (input: any): string | null => {
    if (input && typeof input === "string") {
        const result = input.trim()
        return result ? result : null
    }
    return null
}

const handleDate = (input: any): string | undefined | null => {
    if (input && typeof input === "string") {
        const result = input.trim()
        return helper.parseDate(result)?.format("YYYY-MM-DD")
    }
    return null
}

const handleNumber = (input: any): number | null => {
    if (input && typeof input === "number") {
        return input
    }
    return null
}

const handleEmail = (input: any): string | null => {
    if (input && typeof input === "string") {
        const result = input.trim()
        return result ? result : null
    } else if (
        input &&
        typeof input === "object" &&
        Object.keys(input).length
    ) {
        const result = input.text.trim()
        return result ? result : null
    }
    return null
}

const handleAadhar = (input: any): string | undefined | null => {
    if (input && typeof input === "string") {
        const result = input.trim().replace(/\s/g, "").replace(/-/g, "")
        return result ? result : null
    } else if (input && typeof input === "number") {
        const result = input.toString().length === 12 ? input : null
        return result?.toString()
    }
    return null
}

export default {
    handleString,
    handleDate,
    handleNumber,
    handleEmail,
    handleAadhar,
}
