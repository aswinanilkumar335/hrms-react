import { useEffect, useState } from "react";

import { getAttendance } from "../services/attendanceService";

import type { AttendanceRecord } from "../types/attendance";

function useAttendance() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAttendance = async () => {
        try {
            setLoading(true);

            const data = await getAttendance();

            setRecords(data);

            setError("");
        } catch (err) {
            setError("Failed to fetch attendance");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    return {
        records,
        loading,
        error,
        refreshAttendance: fetchAttendance,
    };
}

export default useAttendance;