const BASE_URL = "http://localhost:3001/attendance";

// ✅ Get all attendance
export const getAttendance = async () => {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
        throw new Error("Failed to fetch attendance");
    }

    return res.json();
};

// ✅ Create attendance record
export const createAttendance = async (data: any) => {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to create attendance");
    }

    return res.json();
};

// ✅ Update attendance
export const updateAttendance = async (
    id: number,
    data: any
) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to update attendance");
    }

    return res.json();
};