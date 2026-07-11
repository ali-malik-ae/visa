/**
 * Staff/user management data — UI-first sample. There is exactly one
 * Administrator who manages staff (approve / ban / view activity). Regular
 * consultants cannot access the Users page.
 */

export type UserStatus = "active" | "pending" | "banned";
export type UserRole = "Administrator" | "Senior Consultant" | "Visa Consultant" | "Team Lead";

export interface StaffActivity {
  time: string;
  text: string;
}

export interface StaffUser {
  id: string;
  name: string;
  initials: string;
  color: string;
  photo?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  appsHandled: number;
  joined: string;
  activity: StaffActivity[];
}

/** The single administrator account (manages everyone else). */
export const ADMINISTRATOR: StaffUser = {
  id: "u-admin",
  name: "Mariam Khalid",
  initials: "MK",
  color: "bg-navy",
  photo: "https://i.pravatar.cc/150?img=43",
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "mariam@visati.ae",
  role: "Administrator",
  status: "active",
  lastActive: "Online now",
  appsHandled: 0,
  joined: "Jan 2024",
  activity: [
    { time: "2m ago", text: "Approved new user · Hana Said" },
    { time: "1h ago", text: "Banned user · test@visati.ae" },
    { time: "Yesterday", text: "Updated visa pricing" },
  ],
};

export const STAFF_USERS: StaffUser[] = [
  {
    id: "u-aisha",
    name: "Aisha Bahar",
    initials: "AB",
    color: "bg-blue",
    photo: "https://i.pravatar.cc/150?img=44",
    email: "aisha@visati.ae",
    role: "Senior Consultant",
    status: "active",
    lastActive: "5m ago",
    appsHandled: 482,
    joined: "Mar 2024",
    activity: [
      { time: "5m ago", text: "Approved application · Sophie Laurent" },
      { time: "1h ago", text: "Replied to inquiry · Maria Santos" },
      { time: "3h ago", text: "Requested documents · Priya Sharma" },
    ],
  },
  {
    id: "u-omar",
    name: "Omar Farouk",
    initials: "O",
    color: "bg-purple-500",
    photo: "https://i.pravatar.cc/150?img=53",
    email: "omar@visati.ae",
    role: "Visa Consultant",
    status: "active",
    lastActive: "22m ago",
    appsHandled: 311,
    joined: "Jun 2024",
    activity: [
      { time: "22m ago", text: "Moved application to Processing · Marcus Hahn" },
      { time: "2h ago", text: "Cross-checked GDRFA portal · James Whitfield" },
    ],
  },
  {
    id: "u-layla",
    name: "Layla Hassan",
    initials: "L",
    color: "bg-emerald-500",
    photo: "https://i.pravatar.cc/150?img=47",
    email: "layla@visati.ae",
    role: "Visa Consultant",
    status: "active",
    lastActive: "1h ago",
    appsHandled: 268,
    joined: "Aug 2024",
    activity: [
      { time: "1h ago", text: "Rejected application · Chen Wei" },
      { time: "Yesterday", text: "Processed 12 applications" },
    ],
  },
  {
    id: "u-hana",
    name: "Hana Said",
    initials: "H",
    color: "bg-amber-500",
    photo: "https://i.pravatar.cc/150?img=45",
    email: "hana@visati.ae",
    role: "Visa Consultant",
    status: "pending",
    lastActive: "Never",
    appsHandled: 0,
    joined: "Today",
    activity: [{ time: "Today", text: "Requested access — awaiting approval" }],
  },
  {
    id: "u-yusuf",
    name: "Yusuf Demir",
    initials: "Y",
    color: "bg-rose-500",
    photo: "https://i.pravatar.cc/150?img=51",
    email: "yusuf@visati.ae",
    role: "Visa Consultant",
    status: "pending",
    lastActive: "Never",
    appsHandled: 0,
    joined: "Yesterday",
    activity: [{ time: "Yesterday", text: "Requested access — awaiting approval" }],
  },
  {
    id: "u-banned",
    name: "Karl Meyer",
    initials: "KM",
    color: "bg-slate-400",
    photo: "https://i.pravatar.cc/150?img=52",
    email: "karl@visati.ae",
    role: "Visa Consultant",
    status: "banned",
    lastActive: "2 weeks ago",
    appsHandled: 54,
    joined: "Feb 2024",
    activity: [
      { time: "2 weeks ago", text: "Account banned — policy violation" },
      { time: "3 weeks ago", text: "Processed 4 applications" },
    ],
  },
];

export const USER_STATUS_LABEL: Record<UserStatus, string> = {
  active: "Active",
  pending: "Pending",
  banned: "Banned",
};
