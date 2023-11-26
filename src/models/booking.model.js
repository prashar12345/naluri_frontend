import datepipeModel from "./datepipemodel"

const twenty4hrCheck = (startdata, hr = 24) => {
    const getTime = (p) => {
        return new Date(p).getTime()
    }

    let current = new Date()
    let start = datepipeModel.isotodate(startdata)
    let twenty4hr = new Date(start).setHours(start.getHours() - hr)
    twenty4hr = new Date(twenty4hr)

    let error = false
    if (getTime(current) > getTime(twenty4hr)) error = true

    console.log("twenty4hr", twenty4hr);
    console.log("current", current);
    console.log("error", error);
    return error
}

const relationships = [
    { id: 'Parent', name: 'Parent' },
    { id: 'Spouse', name: 'Spouse' },
    { id: 'Partner', name: 'Partner' },
    { id: 'Sibling', name: 'Sibling' },
    { id: 'Friend', name: 'Friend' },
    { id: 'Relative', name: 'Relative' },
    { id: 'Others', name: 'Others' },
]

const bookingModel = { twenty4hrCheck, relationships }
export default bookingModel