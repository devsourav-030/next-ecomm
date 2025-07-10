// Admin Sidebar icons.
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag, MdOutlineStar } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { ADMIN_DASHBOARD } from "@/routes/adminPanelRoute";

export const adminAppSidebarMenu = [
    {
        title: "Dashboard",
        url: ADMIN_DASHBOARD,
        icon: AiOutlineDashboard
    },
    {
        title: "Category",
        url: "#",
        icon: BiCategory,
        submenu: [
            {
                title: "Add Category",
                url: "#"
            },
            {
                title: "All Category",
                url: "#"
            }
        ]
    },
    {
        title: "Products",
        url: "#",
        icon: IoShirtOutline,
        submenu: [
            {
                title: "Add Products",
                url: "#"
            },
            {
                title: "Add Variants",
                url: "#"
            },
            {
                title: "All Products",
                url: "#"
            },
            {
                title: "Product Variants",
                url: "#"
            }
        ]
    },
    {
        title: "Coupons",
        url: "#",
        icon: RiCoupon2Line,
        submenu: [
            {
                title: "Add Coupons",
                url: "#"
            },
            {
                title: "All Coupons",
                url: "#"
            }
        ]
    },
    {
        title: "Orders",
        url: "#",
        icon: MdOutlineShoppingBag
    },
    {
        title: "Customers",
        url: "#",
        icon: LuUserRound
    },
    {
        title: "Rating & Review",
        url: "#",
        icon: IoMdStarOutline
    },
    {
        title: "Media",
        url: "#",
        icon: MdOutlinePermMedia
    },
]