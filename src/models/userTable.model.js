const list = [
    { key: 'fullName', value: 'Name' },
    { key: 'firstName', value: 'firstName' },
    { key: 'lastName', value: 'lastName' },
    { key: 'ic_number', value: 'IC No. or Passport No.' },
]

const find = (key) => {
    let value = list.find(itm => itm.id == key)
    return value
}

const userTableModel = { list, find }
export default userTableModel