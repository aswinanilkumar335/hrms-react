const BASE_URL = "http://localhost:3001/users";

// ✅ Get all users
export const getUsers = async () => {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }

    return res.json();
};

// ✅ Login user
export const loginUser = async (
    email: string,
    password: string
) => {
    const users = await getUsers();

    return users.find(
        (u: any) =>
            u.email === email &&
            u.password === password
    );
};

// ✅ Signup user
export const signupUser = async (data: any) => {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to signup");
    }

    return res.json();
};