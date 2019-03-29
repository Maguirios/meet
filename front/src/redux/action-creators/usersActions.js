export const createUser = (user) => (dispatch, getState, {getFirebase, getFirestore }) => {
    dispatch({ type: 'CREATE_USER', user })
}