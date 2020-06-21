async function register(email, password) {
    const url = "http://localhost:5000/user"
    const body = {
        email: email,
        password: password
    }
    const config = {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        method: "POST"
    }
    const response = await fetch(url, config)
    const statusCode = response.status
    const message = await response.text()
    console.log(statusCode)
    console.log(message)
    return {
        message: message,
        statusCode: statusCode
    }
}

export {
    register
}