import { FiGrid, FiUsers, FiSettings, FiLayers, FiUserPlus, FiCheckSquare } from "react-icons/fi";

export const menuOptionsAdmin = [
    {
        key: "admin-home",
        label: "Dashboard",
        icon: FiGrid,
        path: "/dashboard",
    },
    {
        key: "admin-users",
        label: "Data User",
        icon: FiUsers,
        path: "/users",
        disabled: false
    },
    // {
    //     key: "admin-cetak",
    //     label: "Cetak Kartu",
    //     icon: FiUsers,
    //     path: "/users/cetak",
    //     disabled: false
    // },
    {
        key: "admin-candidate",
        label: "Kandidat",
        icon: FiUserPlus,
        path: "/candidate",
        disabled: false
    },
    {
        key: "admin-votes",
        label: "Data Voting",
        icon: FiCheckSquare,
        path: "/votes",
        disabled: false
    },
    {
        key: "admin-profile",
        label: "Profile",
        icon: FiUserPlus,
        path: "/profile",
        disabled: false
    },
    {
        key: "admin-settings",
        label: "Settings",
        icon: FiSettings,
        path: "/settings",
    },
];

export const menuOptionsClient = [
    {
        key: "client-home",
        label: "Dashboard",
        icon: FiGrid,
        path: "/dashboard",
    },
    {
        key: "client-layers",
        label: "Layers",
        icon: FiLayers,
        path: "/layers",
        disabled: false
    }
];
