const base_url = "http://localhost:3001/tasks";

export const getTasks = async () => {
    const res = await fetch(base_url);
    if (!res.ok) {
        throw new Error("Failed to fetch tasks");
    }
    return res.json();
};

export const getTaskById = async (id: number) => {
    const res = await fetch(`${base_url}/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch tasks");
    }
    return res.json();



};