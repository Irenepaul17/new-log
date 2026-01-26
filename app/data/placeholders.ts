export const WORK_REPORTS = [
    {
        id: 1,
        date: "2026-01-21",
        author: "Deepak Gupta",
        section: "MAS",
        station: "KVN",
        classification: "maintenance",
        subType: "Point Maintenance",
        status: "Submitted",
        description: "Routine maintenance of point 101A."
    },
    {
        id: 2,
        date: "2026-01-21",
        author: "Vikram Singh",
        section: "TRL",
        station: "MPI",
        classification: "replacement",
        subType: "Relay Shelf",
        status: "Submitted",
        description: "Replaced damaged relay shelf in relay room."
    },
    // Add more to cover hierarchy visibility
    {
        id: 3,
        date: "2026-01-20",
        author: "Ravi Krishnan", // SSE
        section: "MAS",
        station: "BBQ",
        classification: "failure",
        subType: "Signal Failure",
        status: "Submitted",
        description: "Signal S-12 failing to clear."
    },
    {
        id: 4,
        date: "2026-01-22",
        author: "Kavita Joshi", // JE
        section: "MAS",
        station: "MS",
        classification: "maintenance",
        subType: "Track Circuit",
        status: "Submitted",
        description: "Adjusted track circuit parameters."
    },
];

export const COMPLAINTS = [
    {
        id: "#C001",
        date: "2026-01-21",
        author: "Deepak Gupta",
        category: "Equipment",
        description: "Signal unit flickering at North end",
        status: "Open",
        supervisor: "Sunita Sharma",
    },
    {
        id: "#C002",
        date: "2026-01-21",
        author: "Vikram Singh",
        category: "Safety",
        description: "Broken barrier at Gate 14",
        status: "Open",
        supervisor: "Rajesh Kumar",
    },
    {
        id: "#C003",
        date: "2026-01-19",
        author: "Kavita Joshi",
        category: "Infrastructure",
        description: "Water leakage in relay room roof",
        status: "Closed",
        supervisor: "Sunita Sharma",
        resolvedBy: "Sunita Sharma",
        resolvedDate: "2026-01-20"
    }
];
