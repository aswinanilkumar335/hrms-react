export interface Session {
    in: string;
    out: string | null;
}

export interface AttendanceRecord {
    id?: number;
    date: string;
    sessions: Session[];
}