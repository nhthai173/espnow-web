var isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    applyDarkMode(e.matches)
})

const applyDarkMode = (dark = false) => {
    document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', dark ? 'dark' : 'light')
}
applyDarkMode(isDarkMode)


const enurl = encodeURIComponent

const goTo = (url) => location.href = location.href.split('/').slice(0, -1).join('/') + url


const isMobile = window.innerWidth < 768

const { Loading, Confirm } = Notiflix

Confirm.init({ width: '400px', titleColor: 'rgb(var(--bs-primary-rgb))', okButtonBackground: 'rgb(var(--bs-primary-rgb))', titleFontSize: '1.3em', messageColor: 'var(--bs-body-color)', messageFontSize: '1em', buttonFontSize: '1em' })
Loading.init({ svgColor: 'var(--bs-body-color)' })
Notiflix.Notify.init({ useFontAwesome: true, position: isMobile ? 'center-bottom' : 'right-top', timeout: isMobile ? 3000 : 10000, width: '350px', fontSize: '1.1em' })

const $main = document.getElementById('main')

const GET = (url) => fetch(url).then(response => response.json())
const POST = (url, data) => fetch(url, { method: 'POST', body: data }).then(response => response.json())

const emptyNode = () => {
    $main.querySelector('.col-node-empty').classList.remove('d-none')
}

const notify = (type, ...message) => {
    Notiflix.Notify[type](message.join(' '))
}

const alertReload = (title = "Error", message = "") => {
    Confirm.show(title, message, 'Reload', 'Close', () => { location.reload() });
}

const json2query = (json) => {
    return Object.keys(json).map(key => enurl(key) + '=' + enurl(json[key])).join('&')
}

const isPlainObject = (obj) => obj?.constructor === Object

/**
 * Returns true if the data is not null, undefined, empty string, empty array or empty object
 * @param {*} d 
 * @returns {boolean}
 */
const isValid = (d) => {
    if (d === null || d === undefined || d === '') return false
    if (Array.isArray(d) && d.length === 0) return false
    if (isPlainObject(d) && Object.keys(d).length === 0) return false
    return true
}

/**
 * Compare 2 invalid values
 * @param {*} a 
 * @param {*} b 
 * @return {boolean} true if both are the same
 */
const compareInvalid = (a, b) => {
    if (isValid(a) || isValid(b)) return false
    if (typeof a !== typeof b) return false
    if (Array.isArray(a)) return Array.isArray(b) && b.length === 0
    if (isPlainObject(a)) return isPlainObject(b) && Object.keys(b).length === 0
    if (a === null) return b === null
    if (a === undefined) return b === undefined
}

const duplicateObject = (obj) => {
    let nObj = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
        if (typeof obj[key] == 'function')
            continue
        if (typeof obj[key] === 'object' && (isPlainObject(obj[key]) || Array.isArray(obj[key]))) {
            nObj[key] = duplicateObject(obj[key])
        } else {
            nObj[key] = obj[key]
        }
    }
    return nObj
}





let baseURI = ""
baseURI = "http://localhost:3000"



const GetDevices = async () => {
    Loading.circle()
    return GET(baseURI + '/devices')
    .then(data => {
        Loading.remove()
        console.log(data)
        return data
    })
    .catch(error => {
        Loading.remove()
        alertReload("Error fetch devices", error.message)
        emptyNode()
        return null
    })
}