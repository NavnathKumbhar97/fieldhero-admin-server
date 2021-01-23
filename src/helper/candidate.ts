const handleString = (input: any): string | null => {
    if (typeof input === "string") {
        const result = input.trim()
        return result ? result : null
    }
    return null
}

const handleNumber = (input: any): number | null => {
    if (typeof input === "number") {
        return input
    }
    return null
}

const handleEmail = (input: any): string | null => {
    if (typeof input === "string") {
        const result = input.trim()
        return result ? result : null
    } else if (typeof input === "object") {
        const result = input.text.trim()
        return result ? result : null
    }
    return null
}

const handleAadhar = (input: any): string | null => {
    if (typeof input === "string") {
        const result = input.trim().replace(/\s/g, "")
        return result ? result : null
    }
    return null
}

export default { handleString, handleNumber, handleEmail, handleAadhar }
