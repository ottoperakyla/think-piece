export const getDocumentData = document => ({
    id: document.id,
    ...document.data()
})
