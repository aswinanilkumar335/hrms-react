import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

interface User {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    department: string;
    employeeId: string;
    phone: string;
    location: string;
    status: string;
    joinDate: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user on refresh
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Login
    const login = (userData: User) => {
        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};