const base_url = "http://localhost:3001/employees";

export const getemployees = async () => {
    const res = await fetch(base_url);
    if (!res.ok) {
        throw new Error("Failed to fetch employees");
    }
    return res.json();
};

export const getemployee = async (id: number) => {
    const res = await fetch(`${base_url}/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch employee");
    }
    return res.json();
};