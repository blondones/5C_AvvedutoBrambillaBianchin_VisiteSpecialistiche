export const generateFetchComponent = () => {
    return {
        book: async(data) => {
            const response = await fetch("/insert", {
                method: "POST",
                headers : {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).catch(console.error);
            return response.json();
        },
        getBooks: async() => {
            const response = await fetch("/visits").catch(console.error);
            const json = await response.json();
            console.error(json.visits);
          
            return json.visits;
        },
        getTypes: async() => {
            const response = await fetch("/types").catch(console.error);
            const json = await response.json();
            return json.types;
        }
    };
}