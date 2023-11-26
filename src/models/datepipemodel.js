const monthArray = [
    { value: 'Jan', id: 0 },
    { value: 'Feb', id: 1 },
    { value: 'Mar', id: 2 },
    { value: 'Apr', id: 3 },
    { value: 'May', id: 4 },
    { value: 'Jun', id: 5 },
    { value: 'Jul', id: 6 },
    { value: 'Aug', id: 7 },
    { value: 'Sep', id: 8 },
    { value: 'Oct', id: 9 },
    { value: 'Nov', id: 10 },
    { value: 'Dec', id: 11 }
]


const monthfind = (id) => {
    let value = 0
    let ext = monthArray.find(itm => itm.id === id)
    if (ext) value = ext.value
    return value
}

const date = (p) => {
    let d = new Date(p)
    return `${d.getDate()} ${monthfind(d.getMonth())} ${d.getFullYear()}`
}

const daysArray = [
    { value: 'Monday', id: 1 },
    { value: 'Tuesday', id: 2 },
    { value: 'Wednesday', id: 3 },
    { value: 'Thursday', id: 4 },
    { value: 'Friday', id: 5 },
    { value: 'Saturday', id: 6 },
    { value: 'Sunday', id: 0 },
]

const getDayName = (id) => {
    let value = daysArray.find((itm) => itm.id === id).value
    return value;
}

const day = (p) => {
    if (!p) return ''
    let day = new Date(p).getDay()
    day = getDayName(day)
    return day
}

const time = (p) => {
    if (!p) return ''
    let v = p.split('T')
    if (v.length === 2) {
        return new Date(p).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    } else {
        return new Date(`2020-07-19 ${p}`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }
}

const datetime = (p) => {
    return `${date(p)}, ${time(p)}`
}

const timeString = (p) => {
    let date = new Date(p)
    let hr = String(date.getHours())
    let minutes = String(date.getMinutes())
    if (hr.length === 1) hr = `0${hr}`
    if (minutes.length === 1) minutes = `0${minutes}`
    return `${hr}:${minutes}:00`
}

const datetostring = (p) => {
    if (!p) return ''
    let date = new Date(p)
    let month = String(date.getMonth() + 1)
    let d = String(date.getDate())
    if (month.length === 1) month = `0${month}`
    if (d.length === 1) d = `0${d}`
    return `${date.getFullYear()}-${month}-${d}`
}

const datetoIso = (p) => {
    if (!p) return ''
    let date = datetostring(p)

    let value = `${date}T09:00:00.000Z`
    return value
}

const datetoIsotime = (p) => {
    let date = datetostring(p)
    let time = timeString(p)
    let value = `${date}T${time}.000Z`
    return value
}

const isototime = (p) => {
    if (!p) return ''
    let value = p.split('T')[1].split('.000Z')
    if (value.length === 2) {
    } else {
        value = p.split('T')[1].split('+')
    }
    return value[0]
}

const isotime = (p) => {
    return time(isototime(p))
}

const isotodate = (p) => {
    let d = new Date(`${datetostring(p)} ${isototime(p)}`)
    return d
}

const DaysNo = (s, e) => {
    // JavaScript program to illustrate 
    // calculation of no. of days between two date 

    // To set two dates to two variables
    var date1 = new Date(s);
    var date2 = new Date(e);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days
}

const datepipeModel = {
    DaysNo,
    date,
    day,
    datetostring,
    datetoIso,
    isototime,
    isotodate,
    isotime,
    datetoIsotime,
    time,
    timeString,
    datetime
}

export default datepipeModel;
