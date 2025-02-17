export const generateFetchComponent = () => {
    return {
        book: async(data) => {
            const response = await fetch("/insert", {
                method: "POST",
                body: JSON.stringify({
                    value: JSON.stringify(data)
                })
            }).catch(console.error);
            return response.json();
        },
        getBooks: async() => {
            const response = await fetch("/visits").catch(console.error);
            const json = await response.json();
            return json.visits;
        },
        getTypes: async() => {
            const response = await fetch("/types").catch(console.error);
            const json = await response.json();
            return json.types;
        }
    };
}