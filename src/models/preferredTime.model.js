import datepipeModel from "./datepipemodel"

const list = [
    { id: 1, name: "09:00:00" },
    { id: 2, name: "09:30:00" },
    { id: 3, name: "10:00:00" },
    { id: 4, name: "10:30:00" },
    { id: 5, name: "11:00:00" },
    { id: 6, name: "11:30:00" },
    { id: 7, name: "12:00:00" },
    { id: 8, name: "12:30:00" },
    { id: 9, name: "13:00:00" },
    { id: 10, name: "13:30:00" },
    { id: 11, name: "14:00:00" },
    { id: 12, name: "14:30:00" },
    { id: 13, name: "15:00:00" },
    { id: 14, name: "15:30:00" },
    { id: 15, name: "16:00:00" },
    { id: 16, name: "16:30:00" },
    { id: 17, name: "17:00:00" },
    { id: 18, name: "17:30:00" },
    { id: 19, name: "18:00:00" },
    // { id: 19, name: "18:30:00" },
    // { id: 19, name: "19:00:00" },
    // { id: 19, name: "19:30:00" },
    // { id: 19, name: "20:00:00" },
]

const find = (name) => {
    return list.find(itm => itm.name == name)
}

const existsCheck = (name, arr = []) => {
    if (!arr) return false
    let ext = arr.find(itm => itm == name)
    return ext ? true : false
}

const greaterCheck = (start, time, formate = '') => {
    let stime = formate == 'time' ? start : datepipeModel.isototime(start)
    let value = false

    const getDate = (p) => {
        let d = new Date(p)
        return d
    }

    let starttime = getDate(`2022-06-23 ${stime}`)
    let timetime = getDate(`2022-06-23 ${time}`)

    if (starttime >= timetime) value = true
    return value
}

const lesserCheck = (start, time, formate = '') => {
    let stime = formate == 'time' ? start : datepipeModel.isototime(start)
    let value = false
    const getDate = (p) => {
        let d = new Date(p)
        return d
    }

    let starttime = getDate(`2022-06-23 ${stime}`)
    let timetime = getDate(`2022-06-23 ${time}`)

    if (starttime <= timetime) value = true
    return value
}


const getSlots = (start, end) => {
    let stime = datepipeModel.isototime(start)
    let etime = datepipeModel.isototime(end)
    const getDate = (p) => {
        let d = new Date(p)
        return d
    }

    let starttime = getDate(`2022-06-23 ${stime}`)
    let endtime = getDate(`2022-06-23 ${etime}`)

    let slotes = []
    while (starttime <= endtime) {
        slotes.push(datepipeModel.timeString(starttime))
        let min = starttime.getMinutes()
        starttime = new Date(starttime.setMinutes(min + 30))
    }

    slotes.push(datepipeModel.timeString(starttime))
    return slotes
}

const timelist = (start) => {
    let curent = new Date().getTime()

    let arr = []
    list.map(itm => {
        let timeDate = start ? new Date(start) : new Date()
        let split = itm.name.split(':')
        timeDate.setHours(split[0])
        timeDate.setMinutes(split[1])
        if (new Date(timeDate).getTime() >= curent) {
            arr.push(itm)
        }
    })

    return arr
}

const preferredTimeModel = { list, find, getSlots, existsCheck, greaterCheck, lesserCheck, timelist }
export default preferredTimeModel