import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

interface BreadcrumbItem {
    label: string;
    isLast: boolean;
    to?: string;
}

export default function Breadcrumb() {
    const router = useRouterState();
    const pathname = router.location.pathname;

    const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
        const segments = pathname.split("/").filter(Boolean);
        const crumbs: BreadcrumbItem[] = [
            { label: "Home", isLast: segments.length === 0, to: "/dashboard" }
        ];

        let currentPath = "";
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;
            
            // Format nama: 'cetak' -> 'Cetak'
            const label = segment.charAt(0).toUpperCase() + segment.slice(1);
            
            crumbs.push({
                label,
                isLast,
                to: isLast ? undefined : currentPath
            });
        });

        return crumbs;
    }, [pathname]);

    return (
        <div className="py-5 border-b border-text-green px-3 bg-transparent">
            <nav className="flex items-center text-sm font-medium">
                {breadcrumbs.map((item, index) => (
                    <div key={index} className="flex items-center">
                        {item.isLast ? (
                            <span className="text-text-green font-bold tracking-tight">
                                {item.label}
                            </span>
                        ) : (
                            <>
                                <Link
                                    to={item.to || "/"}
                                    className="text-text-green hover:text-secondary transition-colors"
                                >
                                    {item.label}
                                </Link>
                                <span className="mx-2 text-text-green font-light">/</span>
                            </>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}
