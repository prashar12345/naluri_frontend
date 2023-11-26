const list = [
    { id: 30, name: '30 min' },
    { id: 60, name: '1 hr' },
    { id: 90, name: '1 hr 30 min' },
    { id: 120, name: '2 hrs' },
    { id: 150, name: '2 hrs 30 min' },
]

const name = (id) => {
    return list.find(itm => itm.id === id).name
}

const divideSlot = (p = { start: new Date().toISOString(), end: new Date().toISOString(), minutes: 60 }) => {
    let value = { ...p, minutes: Number(p.minutes) }
    const getTime = (p) => {
        let date = new Date(p)
        return date.getTime()
    }
    let slot = value.start
    let slots = []
    while (getTime(slot) < getTime(value.end)) {
        slots.push(slot)
        let newDate = new Date(slot)
        let min = newDate.getMinutes()
        newDate.setMinutes(min + value.minutes)
        slot = newDate.toISOString()
    }

    let seSlotes = []
    slots.map((itm) => {
        let end = new Date(itm)
        end = end.setMinutes(end.getMinutes() + value.minutes)
        let obj = {
            start: itm,
            end: new Date(end).toISOString()
        }
        seSlotes.push(obj)
    })


    let seEnd = seSlotes[seSlotes.length - 1].end

    if (getTime(seEnd) > getTime(value.end)) {
        seSlotes.pop()
    }

    return seSlotes
}

const slotTimeModel = { list, name, divideSlot }
export default slotTimeModel