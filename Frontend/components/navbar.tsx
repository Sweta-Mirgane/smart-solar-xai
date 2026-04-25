"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Sun, AlertTriangle, Activity, TrendingUp, LogOut } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Sun },
  { href: "/fault-detection", label: "Fault Detection", icon: AlertTriangle },
  { href: "/anomaly-detection", label: "Anomaly Detection", icon: Activity },
  { href: "/prediction", label: "Prediction", icon: TrendingUp },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sun className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        
        <nav className="ml-10 flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                "bg-status-normal animate-pulse"
              )}
            />
            <span>System Online</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
