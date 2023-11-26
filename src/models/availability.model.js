import preferredTimeModel from "./preferredTime.model"

const checkAvailability = (availablity, time) => {

    let value = false
    if (availablity) {
        if (availablity.schedule && availablity.schedule.start) {
            if (preferredTimeModel.lesserCheck(availablity.schedule.start, time) && preferredTimeModel.greaterCheck(availablity.schedule.end, time)) {
                value = true
            }
        }
        else if (preferredTimeModel.lesserCheck(availablity.weeklyAvailablity.start, time, 'time') && preferredTimeModel.greaterCheck(availablity.weeklyAvailablity.end, time, 'time')) {
            value = true
        }
    }
    return value
}

const availabilityModel = { checkAvailability }
export default availabilityModel