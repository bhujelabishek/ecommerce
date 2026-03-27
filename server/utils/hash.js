import bycrpt from 'bcrypt'

export const hashPassword= ((password) => {
    return bycrpt.hash(password, 10);
})

export const comparePassword= ((password, hash) => {
    return bycrpt.compare(password, hash);
})