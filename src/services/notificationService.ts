const base_url = "http://localhost:3001/notifications";

export const getNotification = async () => {
    const res = await fetch(base_url);
    if (!res.ok) {
        throw new Error("Failed to fetch notifications");
    }
    return res.json();
};

export const getNotificationById = async (id: number) => {
    const res = await fetch(`${base_url}/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch notification");
    }
    return res.json();
};