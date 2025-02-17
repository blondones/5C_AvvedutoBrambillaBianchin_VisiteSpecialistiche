export const generateFetchComponent = () => {
    return {
        uploadImage: async(data) => {
            const response = await fetch("/insert", {
                method: "POST",
                body: data
            }).catch(console.error);
            return response.json();
        },
        getImages: async() => {
            const response = await fetch("/visits").catch(console.error);
            const json = await response.json();
            return json.visits;
        }
    };
}